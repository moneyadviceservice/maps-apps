import { renderHook } from '@testing-library/react';

import {
  PensionsAnalytics,
  PensionsAnalyticsArrangement,
} from '../api/pension-data-service';
import { useMHPDAnalytics } from './useMHPDAnalytics';

// Mock dependencies
jest.mock('next/router', () => ({
  useRouter: () => ({
    asPath: '/en/test-page',
  }),
}));

const mockAddEvent = jest.fn();
const mockSetUserSessionId = jest.fn();
const mockUseAnalyticsProvider = jest.fn(() => ({
  userSessionId: 'test-session-id-123',
  setUserSessionId: mockSetUserSessionId,
}));

jest.mock('../contexts/AnalyticsContext', () => ({
  useAnalyticsProvider: () => mockUseAnalyticsProvider(),
}));

jest.mock('@maps-react/hooks/useAnalytics', () => ({
  useAnalytics: () => ({
    addEvent: mockAddEvent,
    addPage: jest.fn(),
    addStepPage: jest.fn(),
    analyticsList: { current: [] },
  }),
}));

jest.mock('@maps-react/hooks/useTranslation', () => ({
  useTranslation: () => ({
    locale: 'en',
    t: (key: string) => key,
    z: jest.fn(),
  }),
}));

describe('useMHPDAnalytics', () => {
  // Helper function to expect basic analytics event
  const expectBasicAnalyticsEvent = (
    overrides: Record<string, unknown> = {},
  ) => {
    expect(mockAddEvent).toHaveBeenCalledWith({
      event: 'pageLoadReact',
      page: {
        pageName: 'moneyhelper-pensions-dashboard',
        pageTitle: 'Moneyhelper Pensions Dashboard',
        categoryLevels: ['MHPD', 'Dashboard post Finder'],
        lang: 'en',
        site: 'Moneyhelper Pensions Dashboard',
        pageType: 'MHPD Journey',
        source: 'direct',
        url: '/en/test-page',
      },
      tool: {
        toolName: 'Moneyhelper Pensions Dashboard',
        toolCategory: '',
        toolStep: 1,
        stepName: '',
      },
      user: {
        loggedIn: true,
        userId: '',
        sessionId: 'test-session-id-123',
      },
      ...overrides,
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAnalyticsProvider.mockReturnValue({
      userSessionId: 'test-session-id-123',
      setUserSessionId: mockSetUserSessionId,
    });
    // Set production mode by default so addEvent gets called
    (process.env as any).NODE_ENV = 'production';
  });

  describe('page load events', () => {
    it('should send default page load event with minimal props', () => {
      renderHook(() => useMHPDAnalytics());

      expectBasicAnalyticsEvent();
    });

    it('should handle custom page title and name', () => {
      renderHook(() =>
        useMHPDAnalytics({
          pageTitle: 'Custom Page Title',
          pageName: 'Custom Page Name',
        }),
      );

      expect(mockAddEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          page: expect.objectContaining({
            pageTitle: 'Custom Page Title',
            pageName: 'moneyhelper-pensions-dashboard--custom-page-name',
          }),
        }),
      );
    });

    it('should handle custom event name', () => {
      renderHook(() =>
        useMHPDAnalytics({
          eventName: 'customEvent',
        }),
      );

      expect(mockAddEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          event: 'customEvent',
        }),
      );
    });

    it('should set correct category for entry pages', () => {
      renderHook(() =>
        useMHPDAnalytics({
          isDashboard: false,
        }),
      );

      expect(mockAddEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          page: expect.objectContaining({
            categoryLevels: ['MHPD', 'Entry pre Finder'],
          }),
        }),
      );
    });

    it('should handle missing user session', () => {
      mockUseAnalyticsProvider.mockReturnValueOnce({
        userSessionId: '',
        setUserSessionId: mockSetUserSessionId,
      });

      renderHook(() => useMHPDAnalytics());

      expect(mockAddEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          user: {
            loggedIn: false,
            userId: '',
            sessionId: '',
          },
        }),
      );
    });

    it('should include searchResults when provided', () => {
      const mockSearchResults: PensionsAnalytics = {
        totalPensions: 5,
        totalErrorPensions: 0,
        totalUnsupportedPensions: 0,
        confirmedPensions: [
          {
            externalAssetId: '123',
            schemeName: 'Test Pension',
            matchType: 'DEFN',
            pensionAdministratorName: 'Test Admin',
            pensionCategory: 'CONFIRMED',
            pensionType: 'DC',
          } as PensionsAnalyticsArrangement,
        ],
        incompletePensions: [],
        unconfirmedPensions: [],
        unsupportedPensions: [],
        erroredPensions: [],
      };

      renderHook(() =>
        useMHPDAnalytics({
          searchResults: mockSearchResults,
        }),
      );

      expect(mockAddEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          searchResults: mockSearchResults,
        }),
      );
    });

    it('should not include searchResults when not provided', () => {
      renderHook(() => useMHPDAnalytics());

      expect(mockAddEvent).toHaveBeenCalledWith(
        expect.not.objectContaining({
          searchResults: expect.anything(),
        }),
      );
    });
  });

  describe('page name formatting', () => {
    it('should format page names with spaces correctly', () => {
      renderHook(() =>
        useMHPDAnalytics({
          pageName: 'Page With Spaces',
        }),
      );

      expect(mockAddEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          page: expect.objectContaining({
            pageName: 'moneyhelper-pensions-dashboard--page-with-spaces',
          }),
        }),
      );
    });

    it('should handle special characters in page names', () => {
      renderHook(() =>
        useMHPDAnalytics({
          pageName: 'Page With Special-Characters & Symbols',
        }),
      );

      expect(mockAddEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          page: expect.objectContaining({
            pageName:
              'moneyhelper-pensions-dashboard--page-with-special-characters-&-symbols',
          }),
        }),
      );
    });
  });

  describe('hook dependency updates', () => {
    it('should re-run when eventName changes', () => {
      const { rerender } = renderHook(
        ({ eventName }: { eventName?: string }) =>
          useMHPDAnalytics({ eventName }),
        {
          initialProps: { eventName: 'pageLoadReact' as string | undefined },
        },
      );

      expect(mockAddEvent).toHaveBeenCalledTimes(1);

      rerender({ eventName: 'customEvent' });

      expect(mockAddEvent).toHaveBeenCalledTimes(2);
    });
  });

  it('should log and NOT send analytics when running locally', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    // Set as local development
    (process.env as any).NODE_ENV = 'development';

    renderHook(() => useMHPDAnalytics());

    expect(consoleSpy).toHaveBeenCalledWith(
      'MHPD Analytics Event (local - not sent):',
      expect.objectContaining({
        event: 'pageLoadReact',
        page: expect.objectContaining({
          pageName: 'moneyhelper-pensions-dashboard',
        }),
      }),
    );
    expect(mockAddEvent).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  describe('console logging', () => {
    let originalEnvVars: Record<string, string | undefined>;
    let consoleSpy: jest.SpyInstance;

    // Helper function to set environment variables
    const setEnvironmentVars = (envVars: Record<string, string>) => {
      Object.entries(envVars).forEach(([key, value]) => {
        (process.env as Record<string, string | undefined>)[key] = value;
      });
    };

    // Helper function to restore environment variables
    const restoreEnvironmentVars = () => {
      Object.entries(originalEnvVars).forEach(([key, value]) => {
        if (value === undefined) {
          delete (process.env as Record<string, string | undefined>)[key];
        } else {
          (process.env as Record<string, string | undefined>)[key] = value;
        }
      });
    };

    beforeEach(() => {
      // Store original env vars
      originalEnvVars = {
        NODE_ENV: process.env.NODE_ENV,
      };

      // Set production mode for console logging tests
      setEnvironmentVars({
        NODE_ENV: 'production',
      });

      // Spy on console.log
      consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    });

    afterEach(() => {
      // Restore original env vars
      restoreEnvironmentVars();
      // Restore console.log
      consoleSpy.mockRestore();
    });

    it('should log with "local - not sent" when running locally', () => {
      // Set development NODE_ENV to ensure it's detected as local
      setEnvironmentVars({
        NODE_ENV: 'development',
      });

      renderHook(() => useMHPDAnalytics());

      expect(consoleSpy).toHaveBeenCalledWith(
        'MHPD Analytics Event (local - not sent):',
        expect.objectContaining({
          event: 'pageLoadReact',
          page: expect.objectContaining({
            pageName: 'moneyhelper-pensions-dashboard',
          }),
        }),
      );
      expect(mockAddEvent).not.toHaveBeenCalled();
    });

    it('should log and send event when deployed', () => {
      setEnvironmentVars({
        NODE_ENV: 'production', // Deployed
      });

      renderHook(() => useMHPDAnalytics());

      // Should log when deployed
      expect(consoleSpy).toHaveBeenCalledWith(
        'MHPD Analytics Event:',
        expect.objectContaining({
          event: 'pageLoadReact',
          page: expect.objectContaining({
            pageName: 'moneyhelper-pensions-dashboard',
          }),
        }),
      );
      // Should send the event
      expect(mockAddEvent).toHaveBeenCalled();
    });
  });
});
