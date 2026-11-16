export type MpsCookieConsent = {
  analytics: boolean;
  marketing: boolean;
  consentDays: number;
  consentDateTimeUTC: string;
};

export const COOKIE_CONTROL_NAME = 'CookieControl';

export const DEFAULT_ANALYTICS_COOKIES = [
  'AMCV_*',
  'AMCVS_*',
  '_ga',
  '_ga_*',
  '_gid',
  '_gat_*',
  '__utma',
  '__utmt',
  '__utmb',
  '__utmc',
  '__utmz',
  '__utmv',
];

export const DEFAULT_MARKETING_COOKIES = [
  '_adal_ca',
  '_adal_cw',
  '_adal_id',
  '_adal_ses',
  'ev_sync_dd',
  '_dc_gtm_UA-4205932-25',
  'everest_g_v2',
  'fr',
  '_fbp',
  '_gcl_au',
  'MUID',
  '_uetvid',
  '_uetsid',
];

export type CookieBannerTechnicalConfig = {
  consentDays: number;
  analyticsCookies: string[];
  marketingCookies: string[];
  analyticsStorageGranted: string;
  analyticsStorageDenied: string;
  adStorageGranted: string;
  adStorageDenied: string;
};

export const DEFAULT_COOKIE_BANNER_TECHNICAL_CONFIG: CookieBannerTechnicalConfig =
  {
    consentDays: 90,
    analyticsCookies: DEFAULT_ANALYTICS_COOKIES,
    marketingCookies: DEFAULT_MARKETING_COOKIES,
    analyticsStorageGranted: 'civicConsent_anaAccept',
    analyticsStorageDenied: 'civicConsent_anaReject',
    adStorageGranted: 'civicConsent_mktAccept',
    adStorageDenied: 'civicConsent_mktReject',
  };

export type ParsedCookies = Record<string, unknown>;

export const MPS_SHARED_COOKIE_DOMAIN = '.maps.org.uk';

const isMapsProductionHost = (hostname: string): boolean =>
  hostname === 'maps.org.uk' || hostname.endsWith('.maps.org.uk');

/**
 * Returns the shared cookie domain for MaPS production subdomains.
 * Local, preview, and non-maps hosts omit domain so cookies default to the current host.
 */
export const getMpsCookieDomain = (hostname?: string): string | undefined => {
  if (hostname === undefined && globalThis.window === undefined) {
    return undefined;
  }

  const host = hostname ?? globalThis.location.hostname;

  if (process.env.NODE_ENV === 'production' && isMapsProductionHost(host)) {
    return MPS_SHARED_COOKIE_DOMAIN;
  }

  return undefined;
};

export const setMpsCookie = (
  name: string,
  value: string,
  daysToExpire: number,
  path = '/',
  theDomain?: string,
  secure?: boolean,
): void => {
  if (typeof document === 'undefined') {
    return;
  }

  let expires = '';
  if (daysToExpire !== 0) {
    const date = new Date();
    date.setTime(date.getTime() + daysToExpire * 24 * 60 * 60 * 1000);
    expires = date.toUTCString();
  }

  let newCookie = `${name}=${encodeURIComponent(value)}`;
  if (expires) {
    newCookie += `; expires=${expires}`;
  }
  if (path) {
    newCookie += `; path=${path}`;
  }
  newCookie += '; SameSite=Lax';
  const domain = theDomain ?? getMpsCookieDomain();
  if (domain) {
    newCookie += `; domain=${domain}`;
  }
  if (secure) {
    newCookie += '; secure';
  }

  document.cookie = newCookie;
};

export const parseMpsCookies = (cookieString?: string): ParsedCookies => {
  if (!cookieString) {
    return {};
  }

  return cookieString
    .split(';')
    .map((cookie) => cookie.trim().split('=').map(decodeURIComponent))
    .reduce<ParsedCookies>((accumulator, parts) => {
      const [key, ...valueParts] = parts;
      const rawValue = valueParts.join('=');

      try {
        accumulator[key] = JSON.parse(rawValue);
      } catch {
        accumulator[key] = rawValue;
      }

      return accumulator;
    }, {});
};

const patternToRegExp = (pattern: string): RegExp => {
  if (pattern.endsWith('*')) {
    const prefix = pattern.replaceAll('*', '');
    return new RegExp(`^${prefix}.*`);
  }

  return new RegExp(`^${pattern}$`);
};

const deleteMatchingCookies = (
  allCookies: ParsedCookies,
  patterns: string[],
): void => {
  patterns.forEach((pattern) => {
    const regexp = patternToRegExp(pattern);

    Object.keys(allCookies).forEach((key) => {
      if (regexp.test(key)) {
        setMpsCookie(key, JSON.stringify(allCookies[key]), -1, '/');
      }
    });
  });
};

export const getStoredConsent = (
  cookieString?: string,
): MpsCookieConsent | null => {
  const cookies = parseMpsCookies(cookieString);
  const consent = cookies[COOKIE_CONTROL_NAME];

  if (!consent || typeof consent !== 'object') {
    return null;
  }

  const stored = consent as Partial<MpsCookieConsent>;

  if (
    typeof stored.analytics !== 'boolean' ||
    typeof stored.marketing !== 'boolean'
  ) {
    return null;
  }

  return {
    analytics: stored.analytics,
    marketing: stored.marketing,
    consentDays: stored.consentDays ?? 90,
    consentDateTimeUTC: stored.consentDateTimeUTC ?? '',
  };
};

export const saveConsent = (
  consent: MpsCookieConsent,
  config: Pick<CookieBannerTechnicalConfig, 'consentDays'>,
): void => {
  setMpsCookie(
    COOKIE_CONTROL_NAME,
    JSON.stringify(consent),
    config.consentDays ?? 90,
    '/',
  );
};

export const excludeConsentCookies = (
  config: Pick<
    CookieBannerTechnicalConfig,
    'analyticsCookies' | 'marketingCookies'
  >,
  consent: MpsCookieConsent,
  cookieString?: string,
): void => {
  const allCookies = parseMpsCookies(cookieString);
  const analyticsPatterns = config.analyticsCookies ?? [];
  const marketingPatterns = config.marketingCookies ?? [];

  if (!consent.analytics) {
    deleteMatchingCookies(allCookies, analyticsPatterns);
  }

  if (!consent.marketing) {
    deleteMatchingCookies(allCookies, marketingPatterns);
  }
};

export const pushConsentEvents = (
  consent: MpsCookieConsent,
  config: Pick<
    CookieBannerTechnicalConfig,
    | 'analyticsStorageGranted'
    | 'analyticsStorageDenied'
    | 'adStorageGranted'
    | 'adStorageDenied'
  >,
): void => {
  if (globalThis.window === undefined) {
    return;
  }

  const sendConsent = (
    consentArg: string,
    consentParams: Record<string, string>,
    event: { event: string },
  ) => {
    globalThis.gtag?.('consent', consentArg, consentParams);
    globalThis.dataLayer = globalThis.dataLayer ?? [];
    globalThis.dataLayer.push(event);
  };

  if (consent.analytics && config.analyticsStorageGranted) {
    sendConsent(
      'update',
      { analytics_storage: 'granted' },
      { event: config.analyticsStorageGranted },
    );
  } else if (config.analyticsStorageDenied) {
    sendConsent(
      'update',
      { analytics_storage: 'denied' },
      { event: config.analyticsStorageDenied },
    );
  }

  if (consent.marketing && config.adStorageGranted) {
    sendConsent(
      'update',
      { ad_storage: 'granted' },
      { event: config.adStorageGranted },
    );
  } else if (config.adStorageDenied) {
    sendConsent(
      'update',
      { ad_storage: 'denied' },
      { event: config.adStorageDenied },
    );
  }
};

export const applyConsent = (
  consent: MpsCookieConsent,
  config: CookieBannerTechnicalConfig,
): void => {
  if (typeof document === 'undefined') {
    return;
  }

  saveConsent(consent, config);
  excludeConsentCookies(config, consent, document.cookie);
  pushConsentEvents(consent, config);
};

/**
 * Restores GTM consent for returning visitors after default consent is applied.
 * Waits briefly for gtag (loaded by GTM) so consent updates run after default denied.
 */
export const syncStoredConsentWhenReady = (
  config: CookieBannerTechnicalConfig,
  cookieString?: string,
): (() => void) => {
  if (globalThis.window === undefined) {
    return () => undefined;
  }

  const consent = getStoredConsent(cookieString);
  if (!consent) {
    return () => undefined;
  }

  excludeConsentCookies(config, consent, cookieString);

  const syncEvents = () => pushConsentEvents(consent, config);

  if (globalThis.gtag) {
    syncEvents();
    return () => undefined;
  }

  const intervalId = globalThis.setInterval(() => {
    if (globalThis.gtag) {
      globalThis.clearInterval(intervalId);
      syncEvents();
    }
  }, 100);

  const timeoutId = globalThis.setTimeout(() => {
    globalThis.clearInterval(intervalId);
    syncEvents();
  }, 5000);

  return () => {
    globalThis.clearInterval(intervalId);
    globalThis.clearTimeout(timeoutId);
  };
};

export const createConsent = (
  analytics: boolean,
  marketing: boolean,
  consentDays: number,
): MpsCookieConsent => ({
  analytics,
  marketing,
  consentDays,
  consentDateTimeUTC: new Date().toISOString(),
});

declare global {
  // eslint-disable-next-line no-var
  var dataLayer: Record<string, unknown>[] | undefined;
  // eslint-disable-next-line no-var
  var gtag: ((...args: unknown[]) => void) | undefined;
}
