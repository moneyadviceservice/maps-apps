import { expect, type ExtendedPage, type Locator } from '@lib/test.lib';

/**
 * Page Object Model representing the results view options panel.
 *
 * Provides utilities to:
 * - Change number of results displayed per page
 * - Change sorting order of results
 *
 * Handles wait logic for dynamic updates triggered by dropdown changes.
 */
export class ResultsViewOptionsPage {
  /** Playwright extended page instance */
  readonly page: ExtendedPage;

  /** Dropdown for selecting number of results per page */
  readonly perPageSelect: Locator;

  /** Dropdown for selecting sort order of results */
  readonly sortBySelect: Locator;

  /**
   * Creates an instance of ResultsViewOptionsPage.
   *
   * @param {ExtendedPage} page - The Playwright page instance
   */
  constructor(page: ExtendedPage) {
    this.page = page;

    // ✅ Stable selectors (attribute-based)
    this.perPageSelect = page.locator('select[name="perPage"]');
    this.sortBySelect = page.locator('select[name="sort"]');
  }

  /**
   * Waits for the view options controls to be ready.
   *
   * Ensures both dropdowns are visible before interaction.
   */
  async waitForReady() {
    await expect(this.perPageSelect).toBeVisible();
    await expect(this.sortBySelect).toBeVisible();
  }

  /**
   * Selects the number of results to display per page.
   *
   * Behaviour:
   * - Selects a new value from the dropdown
   * - Waits for the page URL to update (indicating results refresh)
   *
   * @param {string} value - Number of results per page (e.g. "10", "20", "50")
   */
  async selectPerPage(value: string) {
    const previousUrl = this.page.url();

    await this.perPageSelect.selectOption(value);

    // ✅ Wait for navigation or query parameter change
    await expect(this.page).not.toHaveURL(previousUrl);
  }

  /**
   * Selects the sorting order of results.
   *
   * Behaviour:
   * - Selects a sorting option
   * - Waits for page update via URL change
   *
   * @param {string} value - Sort option value (e.g. "price", "distance")
   */
  async selectSortBy(value: string) {
    const previousUrl = this.page.url();

    await this.sortBySelect.selectOption(value);

    // ✅ Wait for navigation or query parameter change
    await expect(this.page).not.toHaveURL(previousUrl);
  }
}
