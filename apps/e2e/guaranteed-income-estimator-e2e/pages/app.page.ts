import { Page } from '@lib/test.lib';

type GotoOptions = {
  ignoreCookiesBanner?: boolean;
};

export class App {
  constructor(private readonly page: Page) {}

  private readonly TEST_IDS = {
    FIRST_ERROR_MESSAGE: 'error-link-0',
    SECOND_ERROR_MESSAGE: 'error-link-1',
  };

  /**
   * Navigate to the Leave Pot Untouched calculator page.
   *
   * @param endpoint - Optional path suffix to navigate to a specific route under the page.
   * @param options - Navigation options.
   * @param options.ignoreCookiesBanner - If true, skips accepting the cookies banner after navigation.
   */
  async goto(endpoint = '', options: GotoOptions = {}) {
    const { ignoreCookiesBanner = false } = options;
    await this.page.goto('/en/guaranteed-income-estimator' + endpoint);
    if (!ignoreCookiesBanner) {
      await this.acceptAllCookiesButton.click();
    }
  }

  get acceptAllCookiesButton() {
    return this.page.locator('#ccc-notify-accept');
  }

  get potField() {
    return this.page.locator('input#pot');
  }

  get ageField() {
    return this.page.locator('input#age');
  }

  get submitButton() {
    return this.page.locator('button#submit');
  }

  get taxFreeText() {
    return this.page.locator('#results dd').nth(0);
  }

  get resultsSection() {
    return this.page.locator('#results');
  }

  get resultsHeading() {
    return this.page.locator('#results dl dt').first();
  }

  async getResultsText() {
    return (await this.resultsSection.innerText()) ?? '';
  }

  get tableData() {
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

  get ageErrorLabel() {
    return this.page.locator('[data-testid="errors"]').locator('#age-error');
  }

  get potErrorLabel() {
    return this.page.locator('[data-testid="errors"]').locator('#pot-error');
  }
}
