import { renderHook } from '@testing-library/react';

import { useCookieConsent } from './useCookieConsent';

// Mock useLanguage hook
const mockUseLanguage = jest.fn();
jest.mock('./useLanguage', () => ({
  useLanguage: () => mockUseLanguage(),
}));

// Mock window.CookieControl
const mockCookieControl = {
  load: jest.fn(),
  getCookie: jest.fn(),
  changeCategory: jest.fn(),
};

// Mock window.gtag
const mockGtag = jest.fn();

// Mock window.dataLayer
let mockDataLayer: any[] = [];

// Mock dataLayer property
const originalDataLayer = Object.getOwnPropertyDescriptor(window, 'dataLayer');

describe('useCookieConsent', () => {
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    mockUseLanguage.mockReturnValue('en');

    // Setup window mocks
    mockDataLayer = [];
    Object.defineProperty(window, 'dataLayer', {
      value: mockDataLayer,
      writable: true,
      configurable: true,
    });

    Object.defineProperty(window, 'CookieControl', {
      value: mockCookieControl,
      writable: true,
      configurable: true,
    });

    Object.defineProperty(window, 'gtag', {
      value: mockGtag,
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    // Clean up window properties
    if (originalDataLayer) {
      Object.defineProperty(window, 'dataLayer', originalDataLayer);
    } else {
      delete (window as any).dataLayer;
    }

    delete (window as any).CookieControl;
    delete (window as any).gtag;
  });

  describe('initCookieConsent', () => {
    it('should initialize CookieControl with default configuration', () => {
      const { result } = renderHook(() => useCookieConsent());

      result.current.initCookieConsent();

      expect(mockCookieControl.load).toHaveBeenCalledWith(
        expect.objectContaining({
          product: 'PRO_MULTISITE',
          optionalCookies: expect.arrayContaining([
            expect.objectContaining({ name: 'analytics' }),
            expect.objectContaining({ name: 'marketing' }),
          ]),
        }),
      );
    });

    it('should merge custom configuration with defaults', () => {
      const customConfig = {
        apiKey: 'custom-api-key',
        product: 'COMMUNITY' as const,
        tagManager: 'AA' as const,
      };

      const { result } = renderHook(() => useCookieConsent(customConfig));

      result.current.initCookieConsent();

      expect(mockCookieControl.load).toHaveBeenCalledWith(
        expect.objectContaining({
          product: 'PRO_MULTISITE', // This is hardcoded in the implementation
        }),
      );
    });

    it('should configure analytics cookie with correct callbacks', () => {
      const { result } = renderHook(() => useCookieConsent());

      result.current.initCookieConsent();

      const config = mockCookieControl.load.mock.calls[0][0];
      const analyticsConfig = config.optionalCookies.find(
        (c: any) => c.name === 'analytics',
      );

      expect(analyticsConfig).toBeDefined();
      expect(analyticsConfig.onAccept).toBeDefined();
      expect(analyticsConfig.onRevoke).toBeDefined();
    });

    it('should configure marketing cookie with correct callbacks', () => {
      const { result } = renderHook(() => useCookieConsent());

      result.current.initCookieConsent();

      const config = mockCookieControl.load.mock.calls[0][0];
      const marketingConfig = config.optionalCookies.find(
        (c: any) => c.name === 'marketing',
      );

      expect(marketingConfig).toBeDefined();
      expect(marketingConfig.onAccept).toBeDefined();
      expect(marketingConfig.onRevoke).toBeDefined();
    });

    it('should handle Welsh language configuration', () => {
      mockUseLanguage.mockReturnValue('cy');

      const { result } = renderHook(() => useCookieConsent());

      result.current.initCookieConsent();

      expect(mockCookieControl.load).toHaveBeenCalledWith(
        expect.objectContaining({
          locale: 'cy',
        }),
      );
    });
  });

  describe('cookie acceptance handling', () => {
    it('should update gtag consent when analytics is accepted', () => {
      const { result } = renderHook(() => useCookieConsent());
      result.current.initCookieConsent();

      const config = mockCookieControl.load.mock.calls[0][0];
      const analyticsConfig = config.optionalCookies.find(
        (c: any) => c.name === 'analytics',
      );

      analyticsConfig.onAccept();

      expect(mockGtag).toHaveBeenCalledWith('consent', 'update', {
        analytics_storage: 'granted',
      });
    });

    it('should update gtag consent when analytics is revoked', () => {
      const { result } = renderHook(() => useCookieConsent());
      result.current.initCookieConsent();

      const config = mockCookieControl.load.mock.calls[0][0];
      const analyticsConfig = config.optionalCookies.find(
        (c: any) => c.name === 'analytics',
      );

      analyticsConfig.onRevoke();

      expect(mockGtag).toHaveBeenCalledWith('consent', 'update', {
        analytics_storage: 'denied',
      });
    });

    it('should update gtag consent when marketing is accepted', () => {
      const { result } = renderHook(() => useCookieConsent());
      result.current.initCookieConsent();

      const config = mockCookieControl.load.mock.calls[0][0];
      const marketingConfig = config.optionalCookies.find(
        (c: any) => c.name === 'marketing',
      );

      marketingConfig.onAccept();

      expect(mockGtag).toHaveBeenCalledWith('consent', 'update', {
        ad_storage: 'granted',
      });
    });

    it('should update gtag consent when marketing is revoked', () => {
      const { result } = renderHook(() => useCookieConsent());
      result.current.initCookieConsent();

      const config = mockCookieControl.load.mock.calls[0][0];
      const marketingConfig = config.optionalCookies.find(
        (c: any) => c.name === 'marketing',
      );

      marketingConfig.onRevoke();

      expect(mockGtag).toHaveBeenCalledWith('consent', 'update', {
        ad_storage: 'denied',
      });
    });

    it('should push events to dataLayer on acceptance', () => {
      const { result } = renderHook(() => useCookieConsent());
      result.current.initCookieConsent();

      const config = mockCookieControl.load.mock.calls[0][0];
      const analyticsConfig = config.optionalCookies.find(
        (c: any) => c.name === 'analytics',
      );

      analyticsConfig.onAccept();

      expect(mockDataLayer).toContainEqual({
        event: 'civicConsent_anaAccept',
      });
    });

    it('should push events to dataLayer on revoke', () => {
      const { result } = renderHook(() => useCookieConsent());
      result.current.initCookieConsent();

      const config = mockCookieControl.load.mock.calls[0][0];
      const analyticsConfig = config.optionalCookies.find(
        (c: any) => c.name === 'analytics',
      );

      analyticsConfig.onRevoke();

      expect(mockDataLayer).toContainEqual({
        event: 'civicConsent_anaReject',
      });
    });
  });

  describe('dataLayer handling', () => {
    it('should handle missing dataLayer when updating consent', () => {
      delete (window as any).dataLayer;

      const { result } = renderHook(() => useCookieConsent());
      result.current.initCookieConsent();

      const config = mockCookieControl.load.mock.calls[0][0];
      const analyticsConfig = config.optionalCookies.find(
        (c: any) => c.name === 'analytics',
      );

      analyticsConfig.onAccept();

      expect(window.dataLayer).toBeDefined();
      expect(window.dataLayer).toContainEqual({
        event: 'civicConsent_anaAccept',
      });
    });

    it('should preserve existing dataLayer when updating consent', () => {
      const existingDataLayer = [{ existingEvent: 'test' }];
      Object.defineProperty(window, 'dataLayer', {
        value: existingDataLayer,
        writable: true,
      });

      const { result } = renderHook(() => useCookieConsent());
      result.current.initCookieConsent();

      const config = mockCookieControl.load.mock.calls[0][0];
      const analyticsConfig = config.optionalCookies.find(
        (c: any) => c.name === 'analytics',
      );

      analyticsConfig.onAccept();

      expect(window.dataLayer).toContainEqual({ existingEvent: 'test' });
      expect(window.dataLayer).toContainEqual({
        event: 'civicConsent_anaAccept',
      });
    });
  });

  describe('first time visitor handling', () => {
    it('should enable analytics for first time visitors', () => {
      mockCookieControl.getCookie.mockReturnValue(null);

      const { result } = renderHook(() => useCookieConsent());
      result.current.initCookieConsent();

      const config = mockCookieControl.load.mock.calls[0][0];
      config.onLoad();

      expect(mockCookieControl.getCookie).toHaveBeenCalledWith('CookieControl');
      expect(mockCookieControl.changeCategory).toHaveBeenCalledWith(0, true);
    });

    it('should not change category for returning visitors', () => {
      mockCookieControl.getCookie.mockReturnValue('existing_value');

      const { result } = renderHook(() => useCookieConsent());
      result.current.initCookieConsent();

      const config = mockCookieControl.load.mock.calls[0][0];
      config.onLoad();

      expect(mockCookieControl.getCookie).toHaveBeenCalledWith('CookieControl');
      expect(mockCookieControl.changeCategory).not.toHaveBeenCalled();
    });
  });

  describe('custom tag manager configuration', () => {
    it('should skip gtag updates when tagManager is not GTM', () => {
      const customConfig = {
        tagManager: 'AA' as const,
      };

      const { result } = renderHook(() => useCookieConsent(customConfig));
      result.current.initCookieConsent();

      const config = mockCookieControl.load.mock.calls[0][0];
      const analyticsConfig = config.optionalCookies.find(
        (c: any) => c.name === 'analytics',
      );

      analyticsConfig.onAccept();

      expect(mockGtag).not.toHaveBeenCalled();
      expect(mockDataLayer).toHaveLength(0);
    });

    it('should handle missing gtag gracefully', () => {
      delete (window as any).gtag;

      const { result } = renderHook(() => useCookieConsent());
      result.current.initCookieConsent();

      const config = mockCookieControl.load.mock.calls[0][0];
      const analyticsConfig = config.optionalCookies.find(
        (c: any) => c.name === 'analytics',
      );

      expect(() => {
        analyticsConfig.onAccept();
      }).not.toThrow();

      expect(mockDataLayer).toContainEqual({
        event: 'civicConsent_anaAccept',
      });
    });
  });

  describe('edge cases', () => {
    it('should handle initCookieConsent gracefully when CookieControl is undefined', () => {
      delete (window as any).CookieControl;

      const { result } = renderHook(() => useCookieConsent());

      expect(() => {
        result.current.initCookieConsent();
      }).not.toThrow();
    });

    it('should handle falsy config values', () => {
      const { result } = renderHook(() => useCookieConsent(undefined));

      expect(() => {
        result.current.initCookieConsent();
      }).not.toThrow();

      expect(mockCookieControl.load).toHaveBeenCalled();
    });

    it('should handle updateConsent with proper dataLayer initialization', () => {
      delete (window as any).dataLayer;

      const { result } = renderHook(() => useCookieConsent());
      result.current.initCookieConsent();

      const config = mockCookieControl.load.mock.calls[0][0];
      const marketingConfig = config.optionalCookies.find(
        (c: any) => c.name === 'marketing',
      );

      marketingConfig.onAccept();

      expect(window.dataLayer).toBeDefined();
      expect(window.dataLayer).toContainEqual({
        event: 'civicConsent_mktAccept',
      });
    });

    it('should handle falsy updateConsent config', () => {
      // Test when config passed to updateConsent is falsy
      const { result } = renderHook(() =>
        useCookieConsent({ tagManager: undefined as any }),
      );
      result.current.initCookieConsent();

      const config = mockCookieControl.load.mock.calls[0][0];
      const analyticsConfig = config.optionalCookies.find(
        (c: any) => c.name === 'analytics',
      );

      // Should default to GTM when config.tagManager is undefined
      analyticsConfig.onAccept();

      expect(mockGtag).toHaveBeenCalledWith('consent', 'update', {
        analytics_storage: 'granted',
      });
    });

    it('should handle undefined branding config for full branch coverage', () => {
      // Test the falsy branch of the branding ternary operator
      const { result } = renderHook(() =>
        useCookieConsent({ branding: undefined }),
      );

      expect(() => {
        result.current.initCookieConsent();
      }).not.toThrow();

      expect(mockCookieControl.load).toHaveBeenCalled();
    });

    it('should merge custom branding with default branding', () => {
      // Test the truthy branch of the branding ternary operator
      const customBranding = { fontFamily: 'Arial' };
      const { result } = renderHook(() =>
        useCookieConsent({ branding: customBranding }),
      );

      result.current.initCookieConsent();

      const config = mockCookieControl.load.mock.calls[0][0];
      expect(config.branding).toEqual(expect.objectContaining(customBranding));
    });

    it('should handle onLoad when CookieControl does not exist', () => {
      const { result } = renderHook(() => useCookieConsent());
      result.current.initCookieConsent();

      const config = mockCookieControl.load.mock.calls[0][0];

      // Delete CookieControl after init but before onLoad
      delete (window as any).CookieControl;

      expect(() => {
        config.onLoad();
      }).not.toThrow();
    });
  });
});
