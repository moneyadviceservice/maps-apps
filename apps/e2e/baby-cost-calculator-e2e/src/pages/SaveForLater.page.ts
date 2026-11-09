import { BasePage } from './Base.page';

export class SaveForLaterPage extends BasePage {
  get saveTitle() {
    return this.page.locator('h1').first();
  }

  get saveDescription() {
    return this.page.locator('p.mb-8');
  }

  get saveEmailTitle() {
    return this.page.locator('label[for="email"]').first();
  }

  get saveEmailDescription() {
    return this.page.locator('#email-hint');
  }

  get saveEmailInput() {
    return this.page.locator('#email');
  }

  get saveEmailButton() {
    return this.page.locator('[data-testid="save-and-return"]');
  }

  get headerErrorArea() {
    return this.page.getByTestId('error-summary-container');
  }

  get headerErrorTitle() {
    return this.headerErrorArea.locator('> div > h2');
  }

  get headerErrorMessage() {
    return this.page.getByTestId('error-link-0');
  }

  get inputAreaError() {
    return this.page.getByTestId('errors');
  }

  get inputErrorText() {
    return this.page.locator('#email-error');
  }
}
