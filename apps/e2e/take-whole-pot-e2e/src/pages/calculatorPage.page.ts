import { Page } from '@lib/test.lib';

export class CalculatorPage {
  constructor(private readonly page: Page) {} // Elements

  private readonly TEST_IDS = {
    FIRST_ERROR_MESSAGE: 'error-link-0',
    SECOND_ERROR_MESSAGE: 'error-link-1',
  };

  async goto(endpoint = '') {
    await this.page.goto('/en/take-whole-pot' + endpoint);
  }

  get incomeField() {
    return this.page.locator('input#income');
  }

  get potField() {
    return this.page.locator('input#pot');
  }

  get submitButton() {
    return this.page.locator('button#submit');
  }

  get resultsContainer() {
    return this.page.locator('div#results');
  }

  get resultsData() {
    return {
      potValue: this.page.locator('#results dd').nth(0).innerText(),
      taxValue: this.page.locator('#results dd').nth(1).innerText(),
    };
  }

  get errorHeader() {
    return this.page.getByRole('heading', {
      name: 'Unable to submit the form',
    });
  }

  get errorMessageLinks() {
    return {
      errorMessage1: this.page.getByTestId(this.TEST_IDS.FIRST_ERROR_MESSAGE),
      errorMessage2: this.page.getByTestId(this.TEST_IDS.SECOND_ERROR_MESSAGE),
    };
  }

  get incomeErrorLabel() {
    return this.page.locator('#income-error');
  }

  get potErrorLabel() {
    return this.page.locator('#pot-error');
  }

  get pageHeading() {
    return this.page.getByRole('heading', { level: 1 });
  }

  get pageDescription() {
    return this.page.locator('p').first();
  }

  async getHeadingText() {
    return await this.pageHeading.textContent();
  }

  async getDescriptionText() {
    return await this.pageDescription.textContent();
  }

  async getResultsText() {
    // Get both dt and dd elements for complete results content
    const dls = await this.page.locator('#results dl').textContent();
    return dls;
  }
}
