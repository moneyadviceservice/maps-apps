import { ENV } from '@env';
import { Page } from '@maps/playwright';

/**
 * Cookie consent utility for setting cookie preferences before tests.
 * This mirrors the CookieControl structure used throughout the application.
 */

export interface CookieConsentOptions {
  /**
   * Whether to accept analytics cookies. Defaults to true to match real UX.
   * This is the only optional cookie type - necessary cookies are always accepted.
   */
  acceptAnalytics?: boolean;

  /**
   * Custom user ID. Defaults to a generic test user ID.
   */
  userId?: string;
}

/**
 * Sets the CookieControl cookie to accept/reject cookie categories.
 * This prevents the cookie banner from appearing during tests.
 *
 * @param page - The Playwright page instance
 * @param options - Cookie consent options
 * @param url - Optional URL to set the cookie for. If not provided, attempts to get from page.
 *
 * @example
 * ```typescript
 * // Accept analytics cookies (default behavior)
 * await setCookieConsent(page, {
 *   acceptAnalytics: true
 * });
 *
 * // Accept analytics cookies with default options
 * await setCookieConsent(page);
 *
 * // Reject analytics cookies
 * await setCookieConsent(page, { acceptAnalytics: false });
 *
 * // Set for specific URL
 * await setCookieConsent(page, { acceptAnalytics: true }, 'https://example.com');
 *
 * // Set with custom user ID
 * await setCookieConsent(page, {
 *   acceptAnalytics: true,
 *   userId: 'custom-test-user'
 * });
 * ```
 */
export async function setCookieConsent(
  page: Page,
  options: CookieConsentOptions = {},
  url?: string,
): Promise<void> {
  const {
    acceptAnalytics = true, // Default to true since users typically "Accept" cookies
    userId = 'E2E-TEST-USER-ID',
  } = options;

  // Create the cookie value structure that matches the application's expectations
  const cookieValue = {
    necessaryCookies: [
      'mhpdSessionConfig',
      'beaconId',
      'codeVerifier',
      '_iz_sd_ss_',
      '_iz_uh_ps_',
      'iPlanetDirectoryPro',
      'amlbcookie',
      'route',
      'reentry',
      'OAUTH_REQUEST_ATTRIBUTES',
    ],
    optionalCookies: {
      analytics: acceptAnalytics ? 'accepted' : 'revoked',
    },
    statement: {},
    consentDate: Date.now(),
    consentExpiry: 90,
    interactedWith: true,
    user: userId,
  };

  // Determine the URL for the cookie
  const targetUrl = url || page.url() || ENV.BASE_URL;

  // Set the cookie in the browser context
  await page.context().addCookies([
    {
      name: 'CookieControl',
      value: JSON.stringify(cookieValue),
      url: targetUrl,
      httpOnly: false,
      secure: false,
      sameSite: 'Lax',
    },
  ]);
}

/**
 * Clears all cookies from the current page context.
 * Useful for tests that need a clean state.
 *
 * @param page - The Playwright page instance
 */
export async function clearAllCookies(page: Page): Promise<void> {
  await page.context().clearCookies();
}

/**
 * Convenience function to set cookie consent with analytics accepted.
 * This is useful for tests that need to verify analytics functionality.
 *
 * @param page - The Playwright page instance
 * @param url - Optional URL to set the cookie for
 */
export async function setCookieConsentWithAnalytics(
  page: Page,
  url?: string,
): Promise<void> {
  await setCookieConsent(page, { acceptAnalytics: true }, url);
}

/**
 * Convenience function to set cookie consent accepting analytics cookies.
 * This matches the real user behavior since there's no "reject all" option.
 *
 * @param page - The Playwright page instance
 * @param url - Optional URL to set the cookie for
 */
export async function setCookieConsentAccepted(
  page: Page,
  url?: string,
): Promise<void> {
  await setCookieConsent(
    page,
    {
      acceptAnalytics: true, // Accept analytics, matching session files
    },
    url,
  );
}
