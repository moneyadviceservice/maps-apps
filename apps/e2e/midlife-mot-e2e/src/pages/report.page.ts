import { Page } from '@lib/test.lib';

export class ReportPage {
  constructor(private readonly page: Page) {}

  get continueButton() {
    return this.page.getByTestId('step-container-submit-button');
  }

  get header() {
    return this.page.locator('main h1');
  }

  get informationCalloutCards() {
    return this.page.getByTestId('information-callout');
  }

  get footerText() {
    return this.page.locator('main h4');
  }

  get downloadPdfButton() {
    return this.page.locator('button[formaction*="pdf"]');
  }

  get allPrimaryButtons() {
    return this.page.locator('button.t-primary-button');
  }

  get startAgainButton() {
    return this.page.locator('a[href*="restart"]');
  }
}
