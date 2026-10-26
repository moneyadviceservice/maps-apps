import { Page } from '@lib/test.lib';

export class BasePage {
  constructor(protected readonly page: Page) {}

  get title() {
    return this.page.getByTestId('toolpage-span-title');
  }

  get subHeader() {
    return this.page.locator('main h1');
  }

  get backButton() {
    return this.page.getByTestId('tool-nav-prev');
  }

  get errorLabel() {
    return this.page.locator('[data-testid^="errorMessage"]');
  }

  get errorSummary() {
    return this.page.locator('[data-testid^="error-link"]');
  }

  get continueButton() {
    return this.page.getByTestId('step-container-submit-button');
  }
}
