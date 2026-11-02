import { ENV } from '@env';
import { Page } from '@maps/playwright';

/**
 * Cookie consent utility for setting cookie preferences before tests.
 * This mirrors the CookieControl structure used throughout the application.
 */

export interface CookieConsentOptions {
  /**
   * Whether to accept analytics cookies. Defaults to true to match real UX.
   */
  acceptAnalytics?: boolean;

  /**
   * Whether to accept marketing cookies. Defaults to true so the shared
   * banner stays dismissed.
   */
  acceptMarketing?: boolean;

  /**
   * Custom user ID. Defaults to a generic test user ID.
   */
  userId?: string;
}

class CookieConsent {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Sets the CookieControl cookie to accept/reject cookie categories.
   * This prevents the cookie banner from appearing during tests.
   *
   * @param options - Cookie consent options
   * @param url - Optional URL to set the cookie for. If not provided, attempts to get from page.
   *
   * @example
   * ```typescript
   * const cookieConsent = new CookieConsent(page);
   *
   * // Accept analytics cookies (default behavior)
   * await cookieConsent.setCookieConsent({
   *   acceptAnalytics: true
   * });
   *
   * // Accept analytics cookies with default options
   * await cookieConsent.setCookieConsent();
   *
   * // Reject analytics cookies
   * await cookieConsent.setCookieConsent({ acceptAnalytics: false });
   *
   * // Set for specific URL
   * await cookieConsent.setCookieConsent({ acceptAnalytics: true }, '[https://example.com](https://example.com)');
   *
   * // Set with custom user ID
   * await cookieConsent.setCookieConsent({
   *   acceptAnalytics: true,
   *   userId: 'custom-test-user'
   * });
   * ```
   */
  async setCookieConsent(
    options: CookieConsentOptions = {},
    url?: string,
  ): Promise<void> {
    const {
      acceptAnalytics = true, // Default to true since users typically "Accept" cookies
      acceptMarketing = true,
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
        marketing: acceptMarketing ? 'accepted' : 'revoked',
      },
      statement: {},
      consentDate: Date.now(),
      consentExpiry: 90,
      interactedWith: true,
      user: userId,
    };

    // Determine the URL for the cookie
    const targetUrl = url || this.page.url() || ENV.BASE_URL;

    // Set the cookie in the browser context
    await this.page.context().addCookies([
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
   */
  async clearAllCookies(): Promise<void> {
    await this.page.context().clearCookies();
  }

  /**
   * Convenience function to set cookie consent with analytics accepted.
   * This is useful for tests that need to verify analytics functionality.
   *
   * @param url - Optional URL to set the cookie for
   */
  async setCookieConsentWithAnalytics(url?: string): Promise<void> {
    await this.setCookieConsent({ acceptAnalytics: true }, url);
  }

  /**
   * Convenience function to set cookie consent accepting analytics and marketing.
   *
   * @param url - Optional URL to set the cookie for
   */
  async setCookieConsentAccepted(url?: string): Promise<void> {
    await this.setCookieConsent(
      {
        acceptAnalytics: true, // Accept analytics, matching session files
        acceptMarketing: true,
      },
      url,
    );
  }
}

export default CookieConsent;
