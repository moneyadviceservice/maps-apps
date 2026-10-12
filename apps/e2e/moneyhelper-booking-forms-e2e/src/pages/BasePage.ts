import { Page } from '@playwright/test';

/**
 * BasePage: For reusable, page-level actions that are part of the POM and should be available to all page objects via inheritance.
 * https://playwright.dev/docs/pom
 */
export class BasePage<TAnswer extends string = string> {
  constructor(public page: Page) {}

  // --- Navigation methods --- //

  async gotoHome(param = '') {
    await this.page.goto(`/en${param}`);
  }

  // --- Form interaction methods --- //
  // Language agnostic functions to interact with form elements, using attributes and test ids rather than visible text to avoid issues with translations

  async submitForm() {
    await this.page.getByTestId('form-button').click();
  }

  async selectAnswerAndContinue(answer: TAnswer) {
    await this.clickRadio(answer);
    await this.submitForm();
  }

  async fillTextField(fieldName: string, value: string) {
    await this.page.locator(`[name="${fieldName}"]`).fill(value);
  }

  async clickRadio(label: string) {
    await this.page
      .getByRole('radio', {
        name: label,
      })
      // add force option as the shared radios buttons have opacity 0 but are still interactable
      // eslint-disable-next-line playwright/no-force-option
      .check({ force: true });
  }

  async clickBack() {
    await this.page
      .getByTestId('back-link')
      .getByRole('link', { name: 'Back' })
      .click();
  }
}
