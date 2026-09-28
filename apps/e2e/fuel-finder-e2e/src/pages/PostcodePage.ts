/**
 * Page Object Model for the Fuel Finder postcode search page.
 *
 * Responsibilities:
 * - Interact with postcode input field
 * - Submit search requests via "Find Prices" button
 * - Handle validation error messages for invalid inputs
 *
 * Provides reusable methods to support both:
 * - ✅ Valid postcode navigation flows
 * - ❌ Invalid postcode validation scenarios
 *
 * Designed to keep tests clean, maintainable, and aligned with POM best practices.
 */

import type { ExtendedPage, Locator } from '@lib/test.lib';

export class PostcodePage {
  readonly page: ExtendedPage;
  readonly postcodeInput: Locator;
  readonly findPricesButton: Locator;
  readonly errorLink: Locator;

  constructor(page: ExtendedPage) {
    this.page = page;

    this.postcodeInput = page.locator('input[name="location"]');
    this.findPricesButton = page.locator(
      'button.tool-nav-submit.tool-nav-complete',
    );
    this.errorLink = page.locator('[data-testid="error-link-0"]');
  }

  async enterPostcode(code: string | number | null | undefined) {
    await this.postcodeInput.fill(String(code ?? ''));
  }

  async clickFindPrices() {
    await this.findPricesButton.click();
  }

  async submitPostcode(code: string | number) {
    await this.enterPostcode(code);
    await this.clickFindPrices();
  }

  async waitForErrorMessage() {
    await this.errorLink.waitFor({ state: 'visible' });
    await this.errorLink.scrollIntoViewIfNeeded();
    return this.errorLink;
  }

  async submitStaticPostcode() {
    await this.submitPostcode('SE1 1ES');
  }

  fuelRadio(value: string): Locator {
    return this.page.locator(`input#fuelType-${value}`);
  }

  fuelLabel(value: string): Locator {
    return this.page.locator(`label[for="fuelType-${value}"]`);
  }

  /** Selects a fuel type radio by value, e.g. 'B7_STANDARD'. */
  async selectFuelType(value: string) {
    await this.fuelLabel(value).click();
  }
}
