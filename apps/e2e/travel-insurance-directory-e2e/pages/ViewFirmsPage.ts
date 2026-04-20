import { Download, expect, type Locator, type Page } from '@playwright/test';

import { BasePage } from './basePage';

export class ViewFirmsPage extends BasePage {
  //SELECTORS
  private readonly resultsSummaryTestId = 'results-summary';
  private readonly informationCalloutTestId = 'information-callout';
  private readonly paginationName = 'pagination';
  private readonly filtersTestId = 'travel-insurance-filters';
  private readonly downloadButtonTestId = 'download-all-firms';
  private readonly viewPerPageLabel = 'Items per page';

  constructor(page: Page) {
    super(page);
  }

  //LOCATORS

  private resultsSummaryText(): Locator {
    return this.page.getByTestId(this.resultsSummaryTestId);
  }

  private displayedResults(): Locator {
    return this.page.getByTestId(this.informationCalloutTestId);
  }

  private pagination(): Locator {
    return this.page.getByRole('navigation', { name: this.paginationName });
  }

  private filters(): Locator {
    return this.page.getByTestId(this.filtersTestId);
  }

  private downloadButton(): Locator {
    return this.page.getByTestId(this.downloadButtonTestId);
  }

  private viewPerPageSelect(): Locator {
    return this.page.getByLabel(this.viewPerPageLabel);
  }

  //ACTIONS

  async goTo(): Promise<void> {
    await this.page.goto('/en/listings');
  }

  async clickDownloadAllFirms(): Promise<Download> {
    const [download] = await Promise.all([
      this.page.waitForEvent('download'),
      this.downloadButton().click(),
    ]);
    return download;
  }

  async selectViewPerPage(num: string): Promise<void> {
    await this.viewPerPageSelect().selectOption(num);
  }

  //ASSERTIONS

  async assertResultsSummaryText(expectedText: string): Promise<void> {
    await expect(this.resultsSummaryText()).toContainText(expectedText);
  }

  async assertNumberOfDisplayedResults(expectedNum: number): Promise<void> {
    const result = this.displayedResults().filter({
      has: this.page.locator(':visible'),
    });

    await expect(result).toHaveCount(expectedNum);
  }

  async assertPaginationIsVisibile(): Promise<void> {
    await expect(this.pagination()).toBeVisible();
  }

  /**
   * Asserts that clicking a filter option triggers the expected API call.
   * @param values - Array of filter values to iterate through (e.g. [0-16, 17-69])
   * @param urlParam - The query param key in the URL (e.g. 'age' or 'trip_type')
   */
  private async assertFilterTriggers(
    values: string[],
    urlParam: string,
  ): Promise<void> {
    for (const value of values) {
      // Setup listener
      const responsePromise = this.page.waitForResponse((response) => {
        const decodedUrl = decodeURIComponent(response.url());
        return (
          response.url().includes('listings.json') &&
          decodedUrl.includes(`${urlParam}=${value}`) &&
          response.status() === 200
        );
      });

      // Click filter option
      await this.filters()
        .locator('label')
        .filter({ has: this.page.locator(`input[value="${value}"]`) })
        .click();

      // Confirm API response
      await responsePromise;
    }
  }

  async assertAgeFilterTriggers(): Promise<void> {
    const ageValues = ['0-16', '17-69', '70-74', '75-85', '86+'];
    await this.assertFilterTriggers(ageValues, 'age');
  }

  async assertInsuranceTypeFilterTriggers(): Promise<void> {
    const insuranceTypeValues = ['single_trip', 'annual_multi_trip'];
    await this.assertFilterTriggers(insuranceTypeValues, 'trip_type');
  }

  async assertLengthOfTripFilterTriggers(): Promise<void> {
    const lengthOfTripValues = [
      'up_to_30_days',
      'up_to_90_days',
      '90_days_plus',
    ];
    await this.assertFilterTriggers(lengthOfTripValues, 'trip_length');
  }

  async assertLandOrCruiseFilterTriggers(): Promise<void> {
    const landCruiseValues = [
      'false', //land based
      'true', //cruise
    ];
    await this.assertFilterTriggers(landCruiseValues, 'is_cruise');
  }

  async assertDestinationFilterTriggers(): Promise<void> {
    const destinationValues = [
      'uk_and_europe',
      'worldwide_including_us_canada',
      'worldwide_excluding_us_canada',
    ];
    await this.assertFilterTriggers(destinationValues, 'cover_area');
  }

  async assertSuggestedFileName(
    download: Download,
    expectedName: string,
  ): Promise<void> {
    const suggestedFilename = download.suggestedFilename();
    expect(suggestedFilename).toBe(expectedName);
  }
}
