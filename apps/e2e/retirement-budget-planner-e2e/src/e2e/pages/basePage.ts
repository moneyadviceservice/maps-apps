import { Locator, Page } from '@playwright/test';

type ErrorOption = {
  fieldName: string;
  message: string;
  fieldLevelMessage: string;
  at: string;
};

type BasePage = {
  waitForPageHeading(page: Page, text: string): Promise<void>;
  waitForErrorHeading(page: Page, text: string): Promise<void>;
  checkValidationErrors(page: Page, options: ErrorOption[]): Promise<boolean>;
  getErrorSummaryHeading(page: Page): Locator;
  getErrorSummaryRecords(page: Page): Locator;
  fillInput(page: Page, name: string, value: string): Promise<void>;
  fillInputByTestId(page: Page, testId: string, value: string): Promise<void>;
  selectRadioButton(page: Page, labelFor: string): Promise<void>;
  selectOption(page: Page, name: string, value: string): Promise<void>;
  clickButton(page: Page, name: string): Promise<void>;
  clickBackLink(page: Page): Promise<void>;
  rbpTitleLocator(page: Page): Locator;
  pageHeading(page: Page, headingText: string): Locator;
  getPageTitle(page: Page): Promise<Locator>;
  clickTab(page: Page, tabText: string): Promise<void>;
};

export const basePage: BasePage = {
  pageHeading(page, headingText) {
    return page.locator('h1', { hasText: headingText });
  },

  async waitForPageHeading(page: Page, text: string): Promise<void> {
    await page.locator('h1', { hasText: text }).waitFor();
  },

  async waitForErrorHeading(
    page: Page,
    errorHeadingText: string,
  ): Promise<void> {
    await page.locator('h2', { hasText: errorHeadingText }).waitFor();
  },

  rbpTitleLocator: (page: Page) => {
    return page.getByTestId('toolpage-h1-title');
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

  getErrorSummaryHeading(page) {
    return page.getByTestId('error-summary-heading');
  },

  getErrorSummaryRecords(page) {
    return page.locator('[data-testid=error-records] li a');
  },

  async fillInput(page: Page, name: string, value: string) {
    await page.waitForLoadState('load');
    const inputLocator: Locator = page.locator(`input[name="${name}"]`);
    await inputLocator.waitFor();
    await inputLocator.click();
    await inputLocator.clear();
    await inputLocator.fill(value);
  },

  async selectRadioButton(page: Page, labelFor: string) {
    const locator: Locator = page.locator(`label[for="${labelFor}"]`);
    await locator.waitFor();
    await locator.click();
  },

  async selectOption(page: Page, name: string, value: string) {
    const locator: Locator = page.locator(`select[name="${name}"]`);
    await locator.waitFor();
    await locator.selectOption(value);
  },

  async clickButton(page: Page, buttonText: string) {
    await page.getByRole('button', { name: `${buttonText}` }).click();
  },

  async clickBackLink(page) {
    await page.getByTestId('main').getByRole('link', { name: 'Back' }).click();
  },
  async getPageTitle(page: Page) {
    return page.getByTestId('title');
  },
  async fillInputByTestId(page: Page, testId: string, value: string) {
    await page.waitForLoadState('load');
    const inputLocator: Locator = page.getByTestId(testId);
    await inputLocator.waitFor();
    await inputLocator.click();
    await inputLocator.clear();
    await inputLocator.fill(value);
  },
  async clickTab(page: Page, tabText: string) {
    const tab = page.getByRole('tab', { name: `${tabText}` });
    await tab.scrollIntoViewIfNeeded();
    await tab.waitFor();
    await tab.click();
  },
};
