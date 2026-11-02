import {
  applyConsent,
  COOKIE_CONTROL_NAME,
  createConsent,
  DEFAULT_ANALYTICS_COOKIES,
  DEFAULT_COOKIE_BANNER_TECHNICAL_CONFIG,
  DEFAULT_MARKETING_COOKIES,
  excludeConsentCookies,
  getMpsCookieDomain,
  getStoredConsent,
  MPS_SHARED_COOKIE_DOMAIN,
  parseMpsCookies,
  pushConsentEvents,
  saveConsent,
  setMpsCookie,
  syncStoredConsentWhenReady,
} from './mpsCookieUtils';

describe('mpsCookieUtils', () => {
  const originalNodeEnv = process.env.NODE_ENV;
  const testTechnicalConfig = DEFAULT_COOKIE_BANNER_TECHNICAL_CONFIG;

  beforeEach(() => {
    document.cookie = '';
    window.dataLayer = [];
    window.gtag = jest.fn();
    process.env.NODE_ENV = 'test';
  });

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
  });

  describe('parseMpsCookies', () => {
    it('parses plain and JSON cookie values', () => {
      const parsed = parseMpsCookies(
        'plain=value; json=' +
          encodeURIComponent(JSON.stringify({ analytics: true })),
      );

      expect(parsed.plain).toBe('value');
      expect(parsed.json).toEqual({ analytics: true });
    });

    it('returns empty object for missing cookie string', () => {
      expect(parseMpsCookies()).toEqual({});
    });
  });

  describe('setMpsCookie', () => {
    it('sets a cookie on document.cookie', () => {
      setMpsCookie('test', 'value', 90, '/');
      expect(document.cookie).toContain('test=value');
    });

    it('sets a cookie with domain and secure flags', () => {
      const originalCookie = document.cookie;
      let setCookieValue = '';

      Object.defineProperty(document, 'cookie', {
        set: jest.fn((value: string) => {
          setCookieValue = value;
        }),
        get: jest.fn(() => originalCookie),
        configurable: true,
      });

      setMpsCookie('secureCookie', 'value', 90, '/', '.maps.org.uk', true);

      const setter = Object.getOwnPropertyDescriptor(document, 'cookie')
        ?.set as jest.Mock;
      expect(setter).toHaveBeenCalledWith(
        expect.stringContaining('secureCookie=value'),
      );
      expect(setter).toHaveBeenCalledWith(
        expect.stringContaining('domain=.maps.org.uk'),
      );
      expect(setter).toHaveBeenCalledWith(expect.stringContaining('secure'));

      delete (document as any).cookie;
      document.cookie = originalCookie;
    });

    it('sets a session cookie when daysToExpire is 0', () => {
      setMpsCookie('sessionCookie', 'value', 0, '/');
      expect(document.cookie).toContain('sessionCookie=value');
      expect(document.cookie).not.toContain('expires=');
    });

    it('deletes a cookie when daysToExpire is -1', () => {
      setMpsCookie('deleteMe', 'value', 90, '/');
      setMpsCookie('deleteMe', 'value', -1, '/');
      expect(document.cookie).not.toContain('deleteMe=');
    });
  });

  describe('getMpsCookieDomain', () => {
    it('returns shared domain on production maps.org.uk hosts', () => {
      process.env.NODE_ENV = 'production';

      expect(getMpsCookieDomain('maps.org.uk')).toBe(MPS_SHARED_COOKIE_DOMAIN);
      expect(getMpsCookieDomain('evidence-hub.maps.org.uk')).toBe(
        MPS_SHARED_COOKIE_DOMAIN,
      );
    });

    it('returns undefined outside production', () => {
      process.env.NODE_ENV = 'development';

      expect(getMpsCookieDomain('evidence-hub.maps.org.uk')).toBeUndefined();
    });

    it('returns undefined for non-maps hosts in production', () => {
      process.env.NODE_ENV = 'production';

      expect(getMpsCookieDomain('localhost')).toBeUndefined();
      expect(
        getMpsCookieDomain('deploy-preview-123--evidence-hub.netlify.app'),
      ).toBeUndefined();
    });
    it('returns undefined when hostname is not provided in a non-browser environment', () => {
      const originalWindow = (globalThis as any).window;
      try {
        (globalThis as any).window = undefined;
        expect(getMpsCookieDomain()).toBeUndefined();
      } finally {
        (globalThis as any).window = originalWindow;
      }
    });
  });

  describe('SSR guards', () => {
    it('no-ops setMpsCookie when document is unavailable', () => {
      const originalDocument = (globalThis as any).document;
      try {
        (globalThis as any).document = undefined;
        expect(() => setMpsCookie('test', 'value', 90)).not.toThrow();
      } finally {
        (globalThis as any).document = originalDocument;
      }
    });

    it('no-ops applyConsent when document is unavailable', () => {
      const originalDocument = (globalThis as any).document;
      try {
        (globalThis as any).document = undefined;
        const consent = createConsent(false, false, 90);
        expect(() => applyConsent(consent, testTechnicalConfig)).not.toThrow();
      } finally {
        (globalThis as any).document = originalDocument;
      }
    });

    it('no-ops pushConsentEvents when window is unavailable', () => {
      const originalWindow = (globalThis as any).window;
      try {
        (globalThis as any).window = undefined;
        const consent = createConsent(false, false, 90);
        expect(() =>
          pushConsentEvents(consent, {
            analyticsStorageGranted: 'civicConsent_anaAccept',
            analyticsStorageDenied: 'civicConsent_anaReject',
            adStorageGranted: 'civicConsent_mktAccept',
            adStorageDenied: 'civicConsent_mktReject',
          }),
        ).not.toThrow();
      } finally {
        (globalThis as any).window = originalWindow;
      }
    });

    it('returns a no-op cleanup when window is unavailable', () => {
      const originalWindow = (globalThis as any).window;
      try {
        (globalThis as any).window = undefined;
        expect(syncStoredConsentWhenReady(testTechnicalConfig, '')).toEqual(
          expect.any(Function),
        );
      } finally {
        (globalThis as any).window = originalWindow;
      }
    });
  });

  describe('getStoredConsent', () => {
    it('returns null when CookieControl is missing', () => {
      expect(getStoredConsent('')).toBeNull();
    });

    it('returns consent when CookieControl is valid', () => {
      const consent = createConsent(true, false, 90);
      setMpsCookie(COOKIE_CONTROL_NAME, JSON.stringify(consent), 90, '/');

      expect(getStoredConsent(document.cookie)).toEqual(consent);
    });

    it('returns null when CookieControl has invalid analytics or marketing values', () => {
      setMpsCookie(
        COOKIE_CONTROL_NAME,
        JSON.stringify({
          analytics: 'yes',
          marketing: false,
          consentDays: 90,
          consentDateTimeUTC: new Date().toISOString(),
        }),
        90,
        '/',
      );

      expect(getStoredConsent(document.cookie)).toBeNull();
    });
  });

  describe('saveConsent', () => {
    it('stores consent using the configured expiry', () => {
      const consent = createConsent(false, true, 30);

      saveConsent(consent, { consentDays: 30 });

      expect(getStoredConsent(document.cookie)).toEqual(consent);
    });
  });

  describe('excludeConsentCookies', () => {
    it('deletes analytics cookies when analytics is rejected', () => {
      document.cookie = '_ga=123; _gid=456';
      const consent = createConsent(false, false, 90);

      excludeConsentCookies(
        { analyticsCookies: DEFAULT_ANALYTICS_COOKIES, marketingCookies: [] },
        consent,
        document.cookie,
      );

      expect(document.cookie).not.toContain('_ga=');
      expect(document.cookie).not.toContain('_gid=');
    });

    it('supports wildcard analytics cookie patterns', () => {
      document.cookie = '_ga_ABC=123';
      const consent = createConsent(false, false, 90);

      excludeConsentCookies(
        { analyticsCookies: ['_ga_*'], marketingCookies: [] },
        consent,
        document.cookie,
      );

      expect(document.cookie).not.toContain('_ga_ABC=');
    });

    it('deletes marketing cookies when marketing is rejected', () => {
      document.cookie = '_fbp=123; MUID=456';
      const consent = createConsent(true, false, 90);

      excludeConsentCookies(
        { analyticsCookies: [], marketingCookies: DEFAULT_MARKETING_COOKIES },
        consent,
        document.cookie,
      );

      expect(document.cookie).not.toContain('_fbp=');
      expect(document.cookie).not.toContain('MUID=');
    });

    it('supports exact cookie name patterns', () => {
      setMpsCookie('_gid', '456', 90, '/');
      setMpsCookie('_ga', '123', 90, '/');
      const consent = createConsent(false, false, 90);

      excludeConsentCookies(
        { analyticsCookies: ['_gid'], marketingCookies: [] },
        consent,
        document.cookie,
      );

      expect(document.cookie).not.toContain('_gid=');
      expect(document.cookie).toContain('_ga=');
    });
  });

  describe('pushConsentEvents', () => {
    it('pushes granted analytics consent events', () => {
      pushConsentEvents(createConsent(true, false, 90), {
        analyticsStorageGranted: 'civicConsent_anaAccept',
        analyticsStorageDenied: 'civicConsent_anaReject',
        adStorageGranted: 'civicConsent_mktAccept',
        adStorageDenied: 'civicConsent_mktReject',
      });

      expect(window.gtag).toHaveBeenCalledWith('consent', 'update', {
        analytics_storage: 'granted',
      });
      expect(window.dataLayer).toContainEqual({
        event: 'civicConsent_anaAccept',
      });
    });

    it('pushes denied analytics consent events', () => {
      pushConsentEvents(createConsent(false, false, 90), {
        analyticsStorageGranted: 'civicConsent_anaAccept',
        analyticsStorageDenied: 'civicConsent_anaReject',
        adStorageGranted: 'civicConsent_mktAccept',
        adStorageDenied: 'civicConsent_mktReject',
      });

      expect(window.gtag).toHaveBeenCalledWith('consent', 'update', {
        analytics_storage: 'denied',
      });
      expect(window.dataLayer).toContainEqual({
        event: 'civicConsent_anaReject',
      });
    });

    it('pushes granted marketing consent events', () => {
      pushConsentEvents(createConsent(false, true, 90), {
        analyticsStorageGranted: 'civicConsent_anaAccept',
        analyticsStorageDenied: 'civicConsent_anaReject',
        adStorageGranted: 'civicConsent_mktAccept',
        adStorageDenied: 'civicConsent_mktReject',
      });

      expect(window.gtag).toHaveBeenCalledWith('consent', 'update', {
        ad_storage: 'granted',
      });
      expect(window.dataLayer).toContainEqual({
        event: 'civicConsent_mktAccept',
      });
    });

    it('pushes denied marketing consent events', () => {
      pushConsentEvents(createConsent(false, false, 90), {
        analyticsStorageGranted: 'civicConsent_anaAccept',
        analyticsStorageDenied: 'civicConsent_anaReject',
        adStorageGranted: 'civicConsent_mktAccept',
        adStorageDenied: 'civicConsent_mktReject',
      });

      expect(window.gtag).toHaveBeenCalledWith('consent', 'update', {
        ad_storage: 'denied',
      });
      expect(window.dataLayer).toContainEqual({
        event: 'civicConsent_mktReject',
      });
    });
  });

  describe('applyConsent', () => {
    it('stores consent and pushes events', () => {
      const consent = createConsent(true, false, 90);

      applyConsent(consent, testTechnicalConfig);

      expect(getStoredConsent(document.cookie)).toEqual(consent);
      expect(window.dataLayer).toContainEqual({
        event: 'civicConsent_anaAccept',
      });
    });
  });

  describe('syncStoredConsentWhenReady', () => {
    it('syncs consent immediately when gtag is available', () => {
      const consent = createConsent(true, false, 90);
      setMpsCookie(COOKIE_CONTROL_NAME, JSON.stringify(consent), 90, '/');

      syncStoredConsentWhenReady(testTechnicalConfig, document.cookie);

      expect(window.gtag).toHaveBeenCalledWith('consent', 'update', {
        analytics_storage: 'granted',
      });
    });

    it('waits for gtag before syncing consent events', () => {
      jest.useFakeTimers();
      delete (window as { gtag?: (...args: unknown[]) => void }).gtag;

      const consent = createConsent(true, false, 90);
      setMpsCookie(COOKIE_CONTROL_NAME, JSON.stringify(consent), 90, '/');

      const cancel = syncStoredConsentWhenReady(
        testTechnicalConfig,
        document.cookie,
      );

      expect(window.dataLayer).toEqual([]);

      window.gtag = jest.fn();
      jest.advanceTimersByTime(100);

      expect(window.gtag).toHaveBeenCalledWith('consent', 'update', {
        analytics_storage: 'granted',
      });

      cancel();
      jest.useRealTimers();
    });

    it('returns a no-op cleanup when no consent is stored', () => {
      const cancel = syncStoredConsentWhenReady(testTechnicalConfig, '');

      expect(window.gtag).not.toHaveBeenCalled();
      expect(cancel()).toBeUndefined();
    });

    it('syncs consent after timeout when gtag never loads', () => {
      jest.useFakeTimers();
      delete (window as { gtag?: (...args: unknown[]) => void }).gtag;

      const consent = createConsent(true, false, 90);
      setMpsCookie(COOKIE_CONTROL_NAME, JSON.stringify(consent), 90, '/');

      syncStoredConsentWhenReady(testTechnicalConfig, document.cookie);

      window.gtag = jest.fn();
      jest.advanceTimersByTime(5000);

      expect(window.gtag).toHaveBeenCalledWith('consent', 'update', {
        analytics_storage: 'granted',
      });

      jest.useRealTimers();
    });
  });
});
