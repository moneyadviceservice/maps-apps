import { expect, type ExtendedPage, type Locator } from '@lib/test.lib';

/**
 * Page Object Model representing the search results page.
 *
 * Provides utilities to:
 * - Wait for the results page to fully load
 * - Verify that the main content area is visible
 *
 * Used after submitting a postcode or applying filters.
 */
export class ResultsPage {
  /** Playwright extended page instance */
  readonly page: ExtendedPage;

  /** Main content region of the results page */
  readonly mainRegion: Locator;

  /**
   * Creates an instance of ResultsPage.
   *
   * @param {ExtendedPage} page - The Playwright page instance
   */
  constructor(page: ExtendedPage) {
    this.page = page;

    // ✅ Uses ARIA role for semantic, stable targeting
    this.mainRegion = page.getByRole('main');
  }

  /**
   * Waits for the results page to be fully loaded and ready.
   *
   * Ensures:
   * - DOM content has loaded
   * - Main content region is visible
   *
   * Note:
   * - Does NOT assert URL to allow flexible usage in different flows
   *   (tests should handle URL expectations)
   */
  async waitForReady() {
    // ✅ Wait for DOM readiness
    await this.page.waitForLoadState('domcontentloaded');

    // ✅ Ensure main results content is visible
    await expect(this.mainRegion).toBeVisible();
  }
}
