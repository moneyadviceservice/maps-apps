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
  private readonly toolFeedbackEmbedId = 'informizely-embed-fjguluwfj';
  private readonly toolFeedbackYesName = 'Yes';
  private readonly toolFeedbackNoName = 'No';
  private readonly toolFeedbackReportName = 'Report a problem';
  private readonly toolFeedbackSubmitName = 'Submit feedback';

  constructor(page: Page) {
    super(page);
  }

  //#region LOCATORS

  // LOCATORS

  /**
   * Returns the locator for the results summary text area.
   * @returns {Locator} The locator for the results summary.
   */
  resultsSummaryText(): Locator {
    return this.page.getByTestId(this.resultsSummaryTestId);
  }

  /**
   * Returns the locator for the information callout containing firm details.
   * @returns {Locator} The locator for the information callout.
   */
  displayedResults(): Locator {
    return this.page.getByTestId(this.informationCalloutTestId).filter({
      has: this.page.locator(':visible'),
    });
  }

  /**
   * Returns the locator for the pagination navigation element.
   * @returns {Locator} The locator for the pagination navigation.
   */
  pagination(): Locator {
    return this.page.getByRole('navigation', { name: this.paginationName });
  }

  /**
   * Returns the locator for the container holding all travel insurance filters.
   * @returns {Locator} The locator for the filters container.
   */
  filters(): Locator {
    return this.page.getByTestId(this.filtersTestId);
  }

  /**
   * Returns the locator for the "Download all firms" button.
   * @returns {Locator} The locator for the download button.
   */
  downloadButton(): Locator {
    return this.page.getByTestId(this.downloadButtonTestId);
  }

  /**
   * Returns the locator for the "Items per page" dropdown selector.
   * @returns {Locator} The locator for the view-per-page dropdown.
   */
  viewPerPageSelect(): Locator {
    return this.page.getByLabel(this.viewPerPageLabel);
  }

  /**
   * Returns the locator for the tool feedback widget container.
   * @returns {Locator} The locator for the feedback widget wrapper.
   */
  toolFeedbackWidget(): Locator {
    return this.page.locator(`#${this.toolFeedbackEmbedId}`);
  }

  /**
   * Returns the locator for the "Yes" helpfulness button inside the feedback widget.
   * @private
   * @returns {Locator} The locator for the "Yes" response button.
   */
  private toolFeedbackYesButton(): Locator {
    return this.toolFeedbackWidget().getByRole('button', {
      name: this.toolFeedbackYesName,
    });
  }

  /**
   * Returns the locator for the "No" helpfulness button inside the feedback widget.
   * @private
   * @returns {Locator} The locator for the "No" response button.
   */
  private toolFeedbackNoButton(): Locator {
    return this.toolFeedbackWidget().getByRole('button', {
      name: this.toolFeedbackNoName,
    });
  }

  /**
   * Returns the locator for the button used to report an issue inside the feedback widget.
   * @private
   * @returns {Locator} The locator for the report problem button.
   */
  private toolFeedbackReportButton(): Locator {
    return this.toolFeedbackWidget().getByRole('button', {
      name: this.toolFeedbackReportName,
    });
  }

  /**
   * Returns the locator for the final submit button within the feedback widget workflow.
   * @private
   * @returns {Locator} The locator for the feedback submission button.
   */
  private toolFeedbackSubmitButton(): Locator {
    return this.toolFeedbackWidget().getByRole('button', {
      name: this.toolFeedbackSubmitName,
    });
  }

  //#endregion

  //#region ACTIONS

  /**
   * Navigates to the Travel Insurance listings page.
   */
  async goto(): Promise<void> {
    await this.page.goto('/en/listings');
  }

  /**
   * Clicks the "Download All Firms" button and waits for the download to initiate.
   * @returns {Promise<Download>} A promise that resolves to the Playwright Download object.
   */
  async clickDownloadAllFirms(): Promise<Download> {
    const [download] = await Promise.all([
      this.page.waitForEvent('download'),
      this.downloadButton().click(),
    ]);
    return download;
  }

  /**
   * Changes the number of items displayed per page using the dropdown,
   * waits for the listings URL to update, and for loading skeletons to clear.
   * @param {number} num - The number of items to display (value must match dropdown option).
   */
  async selectViewPerPage(num: number): Promise<void> {
    const numToString = num.toString();
    await Promise.all([
      this.page.waitForURL((url) => {
        const limit = new URL(url).searchParams.get('limit');
        return limit === numToString;
      }),
      this.viewPerPageSelect().selectOption(numToString),
    ]);
    await expect(this.page.getByTestId('firm-summary-skeleton')).toHaveCount(0);
  }

  /**
   * Clicks the 'Yes' button within the feedback widget to provide positive feedback.
   * @returns {Promise<void>}
   */
  async clickFeedbackYesButton(): Promise<void> {
    await this.toolFeedbackYesButton().click();
  }

  /**
   * Clicks the 'No' button within the feedback widget to provide negative feedback.
   * @returns {Promise<void>}
   */
  async clickFeedbackNoButton(): Promise<void> {
    await this.toolFeedbackNoButton().click();
  }

  /**
   * Clicks the 'Report' button within the feedback widget to report an issue.
   * @returns {Promise<void>}
   */
  async clickFeedbackReportButton(): Promise<void> {
    await this.toolFeedbackReportButton().click();
  }

  /**
   * Dynamically fills the visible feedback text areas based on the current widget state.
   * If one box is visible (e.g., after 'Yes' or 'No'), it fills it with firstBoxText.
   * If two boxes are visible (e.g., after 'Report'), it fills them with firstBoxText
   * and secondBoxText respectively.
   *
   * @param {string} firstBoxText - Text for the primary (or only) visible text area.
   * @param {string} [secondBoxText] - Text for the second visible text area (required for the 'Report' flow).
   * @returns {Promise<void>}
   */
  async fillFeedback(
    firstBoxText: string,
    secondBoxText?: string,
  ): Promise<void> {
    const textAreas = this.toolFeedbackWidget().locator(
      'textarea >> visible=true',
    );
    const amountVisible = await textAreas.count();

    if (amountVisible === 1) {
      await textAreas.fill(firstBoxText);
    } else if (amountVisible === 2 && secondBoxText) {
      await textAreas.nth(0).fill(firstBoxText);
      await textAreas.nth(1).fill(secondBoxText);
    }
  }

  /**
   * Clicks the 'Submit' button within the tool feedback widget to send the completed form.
   * @returns {Promise<void>}
   */
  async clickSubmitFeedbackButton(): Promise<void> {
    await this.toolFeedbackSubmitButton().click();
  }

  /**
   * Internal helper to verify that interacting with filters triggers the correct API network requests.
   * @param {string[]} values - Array of filter values to test.
   * @param {string} urlParam - The expected query parameter name in the API URL.
   */
  private async triggerFilter(
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

  /**
   * Iterates through all Age filter options and asserts each triggers a valid API call.
   */
  async triggerAgeFilter(): Promise<void> {
    const ageValues = ['0-16', '17-69', '70-74', '75-85', '86+'];
    await this.triggerFilter(ageValues, 'age');
  }

  /**
   * Iterates through Insurance Type filters and asserts each triggers a valid API call.
   */
  async triggerInsuranceTypeFilter(): Promise<void> {
    const insuranceTypeValues = ['single_trip', 'annual_multi_trip'];
    await this.triggerFilter(insuranceTypeValues, 'trip_type');
  }

  /**
   * Iterates through Trip Length filters and asserts each triggers a valid API call.
   */
  async triggerLengthOfTripFilter(): Promise<void> {
    const lengthOfTripValues = [
      'up_to_30_days',
      'up_to_90_days',
      '90_days_plus',
    ];
    await this.triggerFilter(lengthOfTripValues, 'trip_length');
  }

  /**
   * Iterates through Land vs Cruise filters and asserts each triggers a valid API call.
   */
  async triggerLandOrCruiseFilter(): Promise<void> {
    const landCruiseValues = ['false', 'true'];
    await this.triggerFilter(landCruiseValues, 'is_cruise');
  }

  /**
   * Iterates through Destination filters and asserts each triggers a valid API call.
   */
  async triggerDestinationFilter(): Promise<void> {
    const destinationValues = [
      'uk_and_europe',
      'worldwide_including_us_canada',
      'worldwide_excluding_us_canada',
    ];
    await this.triggerFilter(destinationValues, 'cover_area');
  }

  //#endregion
}
