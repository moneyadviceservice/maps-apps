import { Page } from '@lib/test.lib';

export class CheckAnswersPage {
  constructor(private readonly page: Page) {}

  get continueButton() {
    return this.page.getByTestId('next-page-button');
  }

  get header() {
    return this.page.locator('main h1');
  }
}
