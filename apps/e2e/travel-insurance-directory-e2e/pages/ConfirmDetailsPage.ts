import { expect, type Locator, type Page } from '@playwright/test';

import { BasePage } from './basePage';

export class ConfirmDetailsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  //LOCATORS
  private readonly summaryRowRegionTestId = 'summary-row-region';
  private readonly summaryRowEuropeTestId = 'summary-row-uk_and_europe';
  private readonly summaryRowWorldwideExcUsaTestId =
    'summary-row-worldwide_excluding_us_canada';
  private readonly summaryRowWorldwideTestId =
    'summary-row-worldwide_including_us_canada';
  private readonly summaryRowServiceDetailsTestId =
    'summary-row-service-details';
  private readonly summaryRowChangeButtonTestId = 'change-question';
  private readonly summaryRowRegionEuChangeButtonTestId =
    'change-question-region-uk_and_europe';
  private readonly summaryRowEu30ChangeButtonTestId =
    'change-question-uk_and_europe-single_trip-up_to_30_days';
  private readonly summaryRowEu30Value =
    'summary-answer-uk_and_europe-single_trip-up_to_30_days';
  private readonly summarySectionAgeLimitsTestId = 'summary-section-Age limits';

  private readonly summarySectionSetAgeEuropeSingleTestId =
    'summary-section-Set age for Europe single trip';
  private readonly summarySectionSetAgeEuropeMultiTestId =
    'summary-section-Set age for Europe annual multi-trip';

  private readonly summarySectionSetAgeWorldewideExUsaSingleTestId =
    'summary-section-Set age for Worldwide excluding USA single trip';
  private readonly summarySectionSetAgeWorldewideExUsaMultiTestId =
    'summary-section-Set age for Worldwide excluding USA annual multi-trip';

  private readonly summarySectionSetAgeWorldwideSingleTestId =
    'summary-section-Set age for Worldwide single trip';
  private readonly summarySectionSetAgeWorldwideMultiTestId =
    'summary-section-Set age for Worldwide annual multi-trip';

  private readonly summarySectionServiceDetailsTestId =
    'summary-section-Service details';

  summaryRowRegion(): Locator {
    return this.page.locator(`[data-testid^=${this.summaryRowRegionTestId}]`);
  }

  summaryRowEurope(): Locator {
    return this.page.locator(`[data-testid^=${this.summaryRowEuropeTestId}]`);
  }

  summarySectionAgeLimits(): Locator {
    return this.page.getByTestId(this.summarySectionAgeLimitsTestId);
  }

  summarySectionSetAgeEuropeSingle(): Locator {
    return this.page.getByTestId(this.summarySectionSetAgeEuropeSingleTestId);
  }

  summarySectionSetAgeEuropeMulti(): Locator {
    return this.page.getByTestId(this.summarySectionSetAgeEuropeMultiTestId);
  }

  summarySectionSetAgeWorldewideExUsaSingle(): Locator {
    return this.page.getByTestId(
      this.summarySectionSetAgeWorldewideExUsaSingleTestId,
    );
  }

  summarySectionSetAgeWorldewideExUsaMulti(): Locator {
    return this.page.getByTestId(
      this.summarySectionSetAgeWorldewideExUsaMultiTestId,
    );
  }

  summarySectionSetAgeWorldwideSingle(): Locator {
    return this.page.getByTestId(
      this.summarySectionSetAgeWorldwideSingleTestId,
    );
  }

  summarySectionSetAgeWorldwideMulti(): Locator {
    return this.page.getByTestId(this.summarySectionSetAgeWorldwideMultiTestId);
  }

  summarySectionServiceDetails(): Locator {
    return this.page.getByTestId(this.summarySectionServiceDetailsTestId);
  }

  summaryRowWorldwideExcUsa(): Locator {
    return this.page.locator(
      `[data-testid^=${this.summaryRowWorldwideExcUsaTestId}]`,
    );
  }

  summaryRowWorldwide(): Locator {
    return this.page.locator(
      `[data-testid^=${this.summaryRowWorldwideTestId}]`,
    );
  }

  summaryRowEu30ValueText(): Locator {
    return this.page.getByTestId(this.summaryRowEu30Value);
  }

  summaryRowEu30ChangeButton(): Locator {
    return this.page.getByTestId(this.summaryRowEu30ChangeButtonTestId);
  }

  summaryRowServiceDetails(): Locator {
    return this.page.locator(
      `[data-testid^=${this.summaryRowServiceDetailsTestId}]`,
    );
  }

  summaryRowChangeButton(): Locator {
    return this.page.locator(
      `[data-testid^=${this.summaryRowChangeButtonTestId}]`,
    );
  }

  summaryValue(key: string): Locator {
    return this.page.getByTestId(`dd-${key}`);
  }

  async summaryRowValue(rowHeader: string): Promise<string | null> {
    const row = this.page.locator('div[role="row"]').filter({
      has: this.page.locator('div[role="cell"]', { hasText: rowHeader }),
    });
    const valueCell = row.locator('div[role="cell"]').nth(1);

    return await valueCell.innerText();
  }

  summaryRowEuRegionChangeButton(): Locator {
    return this.page.getByTestId(this.summaryRowRegionEuChangeButtonTestId);
  }

  //ASSERTIONS
  async assertPageHeading(): Promise<void> {
    await expect(this.headingLocator('Confirm details')).toBeVisible();
  }

  async getSummaryText(key: string): Promise<string> {
    return (await this.summaryValue(key).innerText()).trim();
  }

  async assertSummaryValue(key: string, value: string): Promise<void> {
    const text = await this.getSummaryText(key);
    if (value === '') {
      expect(text === '' || text.toLowerCase() === 'n/a').toBeTruthy();
      return;
    }
    expect(text).toContain(value);
  }

  async assertContactDetailsSummary(values: {
    website: string;
    telephone: string;
    email: string;
  }): Promise<void> {
    await this.assertSummaryValue('website', values.website);
    await this.assertSummaryValue('telephone_number', values.telephone);
    await this.assertSummaryValue('email_address', values.email);
  }

  async assertAddressSummary(values: {
    line1: string;
    line2: string;
    town: string;
    country: string;
    postcode: string;
  }): Promise<void> {
    await this.assertSummaryValue('line_one', values.line1);
    if (values.line2) {
      await this.assertSummaryValue('line_two', values.line2);
    } else {
      const lineTwoText = await this.getSummaryText('line_two');
      expect(
        lineTwoText === '' || lineTwoText.toLowerCase() === 'n/a',
      ).toBeTruthy();
    }
    await this.assertSummaryValue('town', values.town);
    await this.assertSummaryValue('country', values.country);
    await this.assertSummaryValue('postcode', values.postcode);
  }

  async assertOpeningHoursSummary(values: {
    openingTime: string;
    closingTime: string;
    saturdayOpening: string;
    sundayOpening: string;
  }): Promise<void> {
    await this.assertSummaryValue('opening_time', values.openingTime);
    await this.assertSummaryValue('closing_time', values.closingTime);

    const saturdayText = await this.getSummaryText('saturday_opening');
    expect(saturdayText.toLowerCase()).toBe(
      values.saturdayOpening.toLowerCase(),
    );

    const sundayText = await this.getSummaryText('sunday_opening');
    expect(sundayText.toLowerCase()).toBe(values.sundayOpening.toLowerCase());
  }

  async assertTripCoverSummary(): Promise<void> {
    await this.assertPageHeading();
    await expect(
      this.page.getByRole('table').getByText('Europe', { exact: true }),
    ).toBeVisible();
  }

  //ACTIONS

  /**
   * Clicks the back button and verifies that the "Opening hours" heading is visible.
   * @returns A promise that resolves when the navigation and assertion are completed.
   */
  async clickBackToOpeningHours(): Promise<void> {
    await this.backButton().click();
    await expect(
      this.page.getByRole('heading', { name: 'Opening hours', exact: true }),
    ).toBeVisible();
  }

  /**
   * Clicks the change button for the EU region summary row.
   * @returns A promise that resolves when the click action is completed.
   */
  async clickSummaryRowEuRegionChangeButton(): Promise<void> {
    await this.summaryRowEuRegionChangeButton().click();
  }

  /**
   * Clicks the "Change" button located on the summary row for Europe 30 days.
   * @returns A promise that resolves when the click action is completed.
   */
  async clickSummaryRowEu30ChangeButton(): Promise<void> {
    await this.summaryRowEu30ChangeButton().click();
  }

  /**
   * Clicks the change button in a specific row identified by the row header within a CCD layout.
   * @param rowHeader - The text header of the row to locate and interact with.
   * @returns A promise that resolves when the click action is completed.
   */
  async clickChangeButtonCCD(rowHeader: string): Promise<void> {
    const row = this.page.locator('div[role="row"]').filter({
      has: this.page.locator('div[role="cell"]', { hasText: rowHeader }),
    });
    const change = row.locator('div[role="cell"]').last();

    await change.click();
  }

  /**
   * Locates a summary row cell based on the provided row header for the CS layout.
   * @param rowHeader - The text header of the table row to filter by.
   * @returns The Playwright Locator for the target cell.
   */
  summaryRowLocatorCS(rowHeader: string): Locator {
    return this.page
      .locator('tr')
      .filter({
        has: this.page.locator('th', { hasText: rowHeader }),
      })
      .locator('td')
      .first();
  }

  /**
   * Clicks the change button for a specific row identified by the row header in the CS layout.
   * @param rowHeader - The text header of the row containing the change button.
   * @returns A promise that resolves when the click action is completed.
   */
  async clickChangeButtonCS(rowHeader: string): Promise<void> {
    const row = this.page.locator('tr').filter({
      has: this.page.locator('th', { hasText: rowHeader }),
    });

    await row
      .locator('button[data-testid^="change-question-"]')
      .click({ force: true });
  }
}
