import { Page } from '@lib/test.lib';

import { BasePage } from './base.page';

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  get gtmCookieScript() {
    return this.page.locator('[data-testid="google-tag-manager"]').first();
  }

  get gtmCookieNoScript() {
    return this.page
      .locator('[data-testid="google-tag-manager-no-script"]')
      .first();
  }

  get referralPartnerIdField() {
    return this.page.locator('input[name="referrerId"]');
  }

  get confirmationCheckbox() {
    return this.page.getByTestId('confirmOrganisation-confirm');
  }

  get confirmButton() {
    return this.page.getByTestId('sign-in');
  }

  get backButton() {
    return this.page.getByTestId('sign-out-button');
  }

  get pageHeading() {
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
        'main > div > div > div > div:nth-child(2)',
      ),
      helpWithDebtAdviceAndBusinessDebt: this.page.locator(
        'main > div > div > div > div:nth-child(1)',
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
