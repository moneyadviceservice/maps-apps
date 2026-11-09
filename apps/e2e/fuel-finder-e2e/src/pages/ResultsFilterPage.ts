import { expect, type ExtendedPage, type Locator } from '@lib/test.lib';

/**
 * Page Object Model representing the results filter panel.
 *
 * Provides utilities to:
 * - Select distance and fuel type filters
 * - Apply service-based filters
 * - Trigger filter updates and wait for results refresh
 *
 * Designed to support dynamic filtering scenarios on the results page.
 */
export class ResultsFilterPage {
  /** Playwright extended page instance */
  readonly page: ExtendedPage;

  /** Dropdown selector for distance (search radius) */
  readonly distanceSelect: Locator;

  /** Button used to apply selected filters */
  readonly applyButton: Locator;

  /**
   * Creates an instance of ResultsFilterPage.
   *
   * @param {ExtendedPage} page - The Playwright page instance
   */
  constructor(page: ExtendedPage) {
    this.page = page;

    // ✅ Stable selector for distance dropdown
    this.distanceSelect = page.locator('#radius');

    // ✅ Test ID ensures stability across languages
    this.applyButton = page.getByTestId('apply-filters-button');
  }

  /**
   * Waits for the filter panel to be fully visible and ready.
   *
   * Ensures both:
   * - distance selector is visible
   * - apply button is visible
   */
  async waitForReady() {
    await expect(this.distanceSelect).toBeVisible();
    await expect(this.applyButton).toBeVisible();
  }

  /**
   * Selects a distance (radius) from the dropdown.
   *
   * @param {string} value - Distance value (e.g. "5", "10", "25", "50")
   */
  async selectDistance(value: string) {
    await this.distanceSelect.selectOption(value);
  }

  /**
   * Selects a fuel type using predefined mappings.
   *
   * Maps user-facing fuel labels to internal element IDs.
   *
   * @param {string} value - Fuel type label
   *
   * @throws {Error} If an unknown fuel type is provided
   */
  async selectFuelType(value: string) {
    const fuelMap: Record<string, string> = {
      'Unleaded (E10)': 'fuelType-E10',
      'Super unleaded (E5)': 'fuelType-E5',
      Diesel: 'fuelType-B7_STANDARD',
      'Premium diesel': 'fuelType-B7_PREMIUM',
    };

    const id = fuelMap[value];
    if (!id) throw new Error(`Unknown fuel: ${value}`);

    await this.page.locator(`label[for="${id}"]`).click();
  }

  /**
   * Locator for a fuel type radio input in the filter panel.
   *
   * @param {string} value - Fuel type value (e.g. "E10", "B7_STANDARD")
   */
  fuelRadio(value: string): Locator {
    return this.page.locator(`input#fuelType-${value}`);
  }

  /**
   * Applies station service filters.
   *
   * Only enables services set to `true`. Ignores false values.
   *
   * Example:
   * ```
   * { open24h: true, motorway: true }
   * ```
   *
   * @param {Record<string, boolean>} services - Map of service flags
   */
  async setStationServices(services: Record<string, boolean>) {
    for (const [key, enabled] of Object.entries(services)) {
      if (!enabled) continue;

      await this.page.locator(`label:has(input#${key})`).click();
    }
  }

  /**
   * Applies selected filters and waits for results to update.
   *
   * Behaviour:
   * - Clicks the apply button
   * - Waits for the URL to change (query params updated)
   * - Waits for DOM content to stabilise
   *
   * This prevents flakiness caused by:
   * - delayed navigation
   * - async UI updates
   */
  async applyFiltersAndWaitForResults() {
    const previousUrl = this.page.url();

    await this.applyButton.click();

    // ✅ Wait for URL change (query params updated)
    await expect(this.page).not.toHaveURL(previousUrl);

    // ✅ Ensure DOM stabilised before further actions
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Verifies that the expected distance value is selected.
   *
   * @param {string} value - Expected distance value
   */
  async assertDistanceSelected(value: string) {
    await expect(this.distanceSelect).toHaveValue(value);
  }
}
