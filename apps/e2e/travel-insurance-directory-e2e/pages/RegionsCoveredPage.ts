import { expect, type Locator } from '@playwright/test';

import { BasePage } from './basePage';

export class RegionsCoveredPage extends BasePage {
  //selectors
  private readonly submitButtonTestId = 'submit-button';
  private readonly europeCheckboxTestId = 'checkbox-group-uk_and_europe';
  private readonly worldwideExUsaCheckboxTestId =
    'checkbox-group-worldwide_excluding_us_canada';
  private readonly worldwideCheckBoxTestId =
    'checkbox-group-worldwide_including_us_canada';
  private readonly errorSummaryHeadingTestId = 'error-summary-heading';
  private readonly errorSummaryListElementTestId = 'list-element';
  private readonly errorInlineTestId = 'cover_area-error';

  //locators
  europeCheckbox(): Locator {
    return this.page.getByTestId(this.europeCheckboxTestId).locator('input');
  }

  worldwideExUsaCheckbox(): Locator {
    return this.page
      .getByTestId(this.worldwideExUsaCheckboxTestId)
      .locator('input');
  }

  worldwideCheckbox(): Locator {
    return this.page.getByTestId(this.worldwideCheckBoxTestId).locator('input');
  }

  errorSummary(): Locator {
    return this.page.getByTestId(this.errorSummaryHeadingTestId);
  }

  errorSummaryListElement(): Locator {
    return this.page
      .getByTestId(this.errorSummaryListElementTestId)
      .locator('li');
  }

  errorInline(): Locator {
    return this.page.getByTestId(this.errorInlineTestId);
  }

  //actions
  /**
   * Navigates to the Regions Covered page for the E2E account.
   * @returns A promise that resolves when navigation is complete.
   */
  async gotoRegionsCovered(): Promise<void> {
    const firmId = await this.resolveFirmId();
    await this.page.goto(`/account/trip-cover/regions/${firmId}`);
  }

  private async checkRegionCheckbox(testId: string): Promise<void> {
    const input = this.page.getByTestId(testId).locator('input');
    if (await input.isChecked()) {
      return;
    }
    await this.page.getByTestId(testId).click();
    await expect(input).toBeChecked();
  }

  private async uncheckRegionCheckbox(testId: string): Promise<void> {
    const input = this.page.getByTestId(testId).locator('input');
    if (!(await input.isChecked())) {
      return;
    }
    await this.page.getByTestId(testId).click();
    await expect(input).not.toBeChecked();
  }

  /**
   * Forces the selection of the Europe region checkbox.
   * @returns A promise that resolves when the checkbox is checked.
   */
  async checkEuropeCheckbox(): Promise<void> {
    await this.checkRegionCheckbox(this.europeCheckboxTestId);
  }

  /**
   * Forces the unchecking of the Europe region checkbox.
   * @returns A promise that resolves when the checkbox is unchecked.
   */
  async uncheckEuropeCheckbox(): Promise<void> {
    await this.uncheckRegionCheckbox(this.europeCheckboxTestId);
  }

  /**
   * Forces the selection of the Worldwide Excluding USA checkbox.
   * @returns A promise that resolves when the checkbox is checked.
   */
  async checkWorldwideExUsaCheckbox(): Promise<void> {
    await this.checkRegionCheckbox(this.worldwideExUsaCheckboxTestId);
  }

  /**
   * Forces the selection of the Worldwide (Including USA) checkbox.
   * @returns A promise that resolves when the checkbox is checked.
   */
  async checkWorldwideCheckbox(): Promise<void> {
    await this.checkRegionCheckbox(this.worldwideCheckBoxTestId);
  }
}
