import { Page } from '@mhbf-e2e/lib/test.lib';

/**
 * BasePage: For reusable, page-level actions that are part of the POM and should be available to all page objects via inheritance.
 * https://playwright.dev/docs/pom
 */
export class BasePage<TAnswer extends string = string> {
  constructor(public page: Page) {}

  // --- Locators --- //

  pageTitle(stepName: string, accessibleName?: string) {
    if (accessibleName) {
      return this.page.getByRole('heading', {
        name: accessibleName,
        exact: true,
      });
    }

    return this.page.getByTestId(`${stepName}-title`);
  }

  sidebar(sidebarType: string) {
    return this.page.getByTestId(`${sidebarType}-sidebar`);
  }

  get submitButton() {
    return this.page.getByTestId('form-button');
  }

  get errorSummary() {
    return this.page.getByTestId('error-summary-container');
  }

  inlineError(fieldName: string) {
    return this.page.getByTestId(`${fieldName}-error`);
  }

  // --- Navigation methods --- //

  async gotoHome(param = '') {
    await this.page.goto(`/en${param}`);
  }

  // --- Form interaction methods --- //
  // Language agnostic functions to interact with form elements, using attributes and test ids rather than visible text to avoid issues with translations

  async submitForm() {
    await this.submitButton.click();
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
