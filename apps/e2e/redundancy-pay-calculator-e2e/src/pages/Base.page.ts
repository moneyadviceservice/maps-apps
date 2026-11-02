import { Page } from '@lib/test.lib';

export class BasePage {
  constructor(protected readonly page: Page) {}

  get pageTitle() {
    return this.page.locator('h1').first();
  }

  get continueButton() {
    return this.page.getByTestId('step-container-submit-button');
  }
}
