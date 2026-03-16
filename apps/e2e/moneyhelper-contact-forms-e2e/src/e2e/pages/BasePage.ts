import { Page } from '@playwright/test';

import { dismissCookieBanner } from '../helpers';

/**
 * BasePage: For reusable, page-level actions that are part of the POM and should be available to all page objects via inheritance.
 * https://playwright.dev/docs/pom
 */
export class BasePage {
  constructor(public page: Page) {}

  // --- Navigation methods --- //
  async gotoHome(param = '') {
    await this.page.goto(`/en${param}`);
    await dismissCookieBanner(this.page);
  }

  // --- Form interaction methods --- //
  // Language agnostic functions to interact with form elements, using attributes and test ids rather than visible text to avoid issues with translations

  async submitForm() {
    await this.page.getByTestId('form-button').click();
  }

  async fillTextField(fieldName: string, value: string) {
    await this.page.fill(`[name="${fieldName}"]`, value);
  }

  async clickRadio(value: string) {
    const input = this.page.locator(
      `[data-testid="radio-button-input"][value="${value}"]`,
    );
    const id = await input.getAttribute('id');
    // Find the label using the for attribute
    const label = this.page.locator(`label[for="${id}"]`);
    await label.click();
    return input;
  }
}
