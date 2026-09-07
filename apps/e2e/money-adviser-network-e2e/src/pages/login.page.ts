import { Page } from '@lib/test.lib';

export class LoginPage {
  constructor(protected readonly page: Page) {}

  get referralPartnerIdField() {
    return this.page.locator('input[name="referrerId"]');
  }

  get confirmationCheckbox() {
    return this.page.getByTestId('confirmOrganisation-label');
  }

  get confirmButton() {
    return this.page.getByTestId('sign-in');
  }

  get backButton() {
    return this.page.getByTestId('sign-out-button');
  }

  get header() {
    return this.page.locator('h1');
  }

  get subHeader() {
    return this.page.locator('h2');
  }

  get errorLabel() {
    return this.page.locator('[aria-describedby="referrerId"]');
  }

  get errorMessage() {
    return this.page.getByTestId('list-element');
  }

  get sections() {
    return {
      parnterAccountAccessAndProblems: this.page.locator(
        'main > div >div > div:nth-child(2)',
      ),
      helpWithDebtAdviceAndBusinessDebt: this.page.locator(
        'main > div >div > div:nth-child(1)',
      ),
    };
  }

  async goto() {
    await this.page.goto('/en/login');
  }

  async loginWithId(id: string) {
    await this.referralPartnerIdField.fill(id);
    await this.confirmButton.click();
    await this.confirmationCheckbox.click();
    await this.confirmButton.click();
  }
}
