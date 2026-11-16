import { Page } from '@lib/test.lib';

export class SummaryPage {
  constructor(private readonly page: Page) {}

  get getYourReportButton() {
    return this.page.getByTestId('get-your-personalised-report');
  }

  get header() {
    return this.page.locator('main h2');
  }

  get teaserCards() {
    return this.page.locator('.t-teaser');
  }

  get leftCalloutHeader() {
    return this.page.locator('main h5').nth(0);
  }

  get middleCalloutHeader() {
    return this.page.locator('main h5').nth(1);
  }

  get rightCalloutHeader() {
    return this.page.locator('main h5').nth(2);
  }
}
