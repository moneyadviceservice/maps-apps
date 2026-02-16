import { Locator, Page } from '@playwright/test';

type ErrorOption = {
  fieldName: string;
  message: string;
  fieldLevelMessage: string;
};

type ApplyToUsePage = {
  assertHeading(page: Page, text: string): Promise<boolean>;
  checkValidationErrors(page: Page, options: ErrorOption[]): Promise<void>;
  clickButton(page: Page, selector: string): Promise<void>;
  fillInput(page: Page, name: string, value: string): Promise<void>;
  getConfirmationLocator(page: Page): Promise<Locator>;
  selectCheckbox(page: Page, name: string, value: string): Promise<void>;
  selectMultipleCheckbox(
    page: Page,
    name: string,
    values: string[],
  ): Promise<void>;
  selectOption(page: Page, name: string, value: string): Promise<void>;
  selectRadioButton(page: Page, labelFor: string): Promise<void>;
};

const fieldNames = ['confirmPassword', 'codeOfConduct', 'tel'];

export const applyToUsePage: ApplyToUsePage = {
  async selectRadioButton(page: Page, labelFor: string) {
    const locator: Locator = page.locator(`label[for="${labelFor}"]`);
    await locator.waitFor();
    await locator.click();
  },

  async assertHeading(page: Page, text: string): Promise<boolean> {
    const locator: Locator = page.getByRole('heading', {
      name: text,
    });
    await locator.waitFor();
    return await locator.isVisible();
  },

  async fillInput(page: Page, name: string, value: string) {
    const locator: Locator = page.locator(`input[name="${name}"]`);
    await locator.waitFor();
    await locator.fill(value);
  },

  async selectOption(page: Page, name: string, value: string) {
    const locator: Locator = page.locator(`select[name="${name}"]`);
    await locator.waitFor();
    await locator.selectOption(value);
  },

  async selectCheckbox(page: Page, name: string, value: string) {
    const locator: Locator = page.locator(
      `input[name="${name}"][value="${value}"] ~ p`,
    );
    await locator.waitFor();
    await locator.click({ position: { x: 5, y: 5 } });
  },

  async selectMultipleCheckbox(page: Page, name: string, values: string[]) {
    for (const value of values) {
      await this.selectCheckbox(page, name, value);
    }
  },

  async clickButton(page: Page, selector: string) {
    const locator: Locator = page.locator(selector);
    await locator.waitFor();
    await locator.click();
  },

  async checkValidationErrors(page: Page, options: ErrorOption[]) {
    const locator: Locator = page.getByTestId('error-summary-container');
    await locator.waitFor();
    await locator.isVisible();

    const errorRecords = page.locator('[data-testid=error-records] li a');
    for (const option of options) {
      const matchingErrors = errorRecords
        .filter({ hasText: option.message })
        .first();
      await matchingErrors.waitFor();
      if (fieldNames.includes(option.fieldName)) {
        const fieldError = await page
          .locator(`#${option.fieldName}-error`)
          .filter({ hasText: option.fieldLevelMessage });
        await fieldError.waitFor();
      } else {
        const fieldError = await page
          .locator(`label[for="${option.fieldName}"] ~ .text-red-700`)
          .filter({ hasText: option.fieldLevelMessage });
        await fieldError.waitFor();
      }
    }
  },

  async getConfirmationLocator(page: Page): Promise<Locator> {
    const headingLocator = page.locator('h2', {
      hasText: 'Thank you for your application',
    });
    await headingLocator.waitFor();
    await headingLocator.isVisible();

    const locator = page.getByTestId('callout-information-blue');
    await locator.waitFor();
    return locator;
  },
};
