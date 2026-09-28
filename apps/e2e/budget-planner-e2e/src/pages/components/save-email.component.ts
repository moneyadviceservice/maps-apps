import { BasePage } from '@pages/Base.page';

export class SaveEmailComponent extends BasePage {
  get emailTitle() {
    return this.page.locator('h1').first();
  }

  get inputEmail() {
    return this.page.getByTestId('input-email');
  }

  get sendEmailButton() {
    return this.page.getByTestId('save-and-return');
  }

  get emailErrorMessage() {
    return this.page.locator('#email-error');
  }

  get emailHint() {
    return this.page.locator('#email-hint');
  }
}
