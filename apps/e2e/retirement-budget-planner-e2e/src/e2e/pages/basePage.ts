import { Locator, Page } from '@playwright/test';

type ErrorOption = {
  fieldName: string;
  message: string;
  fieldLevelMessage: string;
};

type BasePage = {
  assertHeading(page: Page, text: string): Promise<boolean>;
  checkValidationErrors(page: Page, options: ErrorOption[]): Promise<boolean>;
  fillInput(page: Page, name: string, value: string): Promise<void>;
  selectRadioButton(page: Page, labelFor: string): Promise<void>;
};

export const basePage: BasePage = {
  async assertHeading(page: Page, text: string): Promise<boolean> {
    const locator: Locator = page.getByRole('heading', {
      name: text,
      exact: true,
    });
    await locator.waitFor();
    return await locator.isVisible();
  },

  async checkValidationErrors(page: Page, options: ErrorOption[]) {
    const locator: Locator = page.getByTestId('error-summary-container');
    await locator.waitFor();
    await locator.isVisible();
    let isValid = true;

    const errorRecords = page.locator('[data-testid=error-records] li a');
    for (const option of options) {
      const matchingErrors = errorRecords
        .filter({ hasText: option.message })
        .first();
      await matchingErrors.waitFor();
      const fieldError = page
        .locator(`#${option.fieldName}-error`)
        .filter({ hasText: option.fieldLevelMessage });
      await fieldError.waitFor();
      isValid = Boolean(isValid && (await fieldError.isVisible()));
    }
    return isValid;
  },

  async fillInput(page: Page, name: string, value: string) {
    const locator: Locator = page.locator(`input[name="${name}"]`);
    await locator.waitFor();
    await locator.fill(value);
  },

  async selectRadioButton(page: Page, labelFor: string) {
    const locator: Locator = page.locator(`label[for="${labelFor}"]`);
    await locator.waitFor();
    await locator.click();
  },
};
