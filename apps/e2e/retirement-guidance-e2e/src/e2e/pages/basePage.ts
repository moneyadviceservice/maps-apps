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
  getErrorSummaryBody(page: Page): Locator;
  fillInput(page: Page, name: string, value: string): Promise<void>;
  fillInputByTestId(page: Page, testId: string, value: string): Promise<void>;
  selectRadioButton(page: Page, labelFor: string): Promise<void>;
  selectOption(page: Page, name: string, value: string): Promise<void>;
  clickButton(page: Page, name: string): Promise<void>;
  getBackLink(page: Page): Locator;
  clickBackLink(page: Page): Promise<void>;
  getContinueButton(page: Page): Locator;
  clickContinue(page: Page): Promise<void>;
  getQuestionOptions(page: Page, type: 'radio' | 'checkbox'): Locator;
  getOptionByLabel(page: Page, optionText: string): Locator;
  clickRadioOption(page: Page, optionText: string): Promise<void>;
  isOptionSelected(page: Page, optionText: string): Promise<boolean>;
  clickCheckboxOption(page: Page, optionText: string): Promise<void>;
  isOptionChecked(page: Page, optionText: string): Promise<boolean>;
  grgTitleLocator(page: Page): Locator;
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

  grgTitleLocator: (page: Page) => {
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

  getBackLink(page: Page) {
    return page.getByRole('main').getByRole('link', { name: 'Back' });
  },

  getContinueButton(page: Page) {
    return page.getByRole('button', { name: 'Continue' });
  },

  async clickContinue(page: Page) {
    await this.getContinueButton(page).click();
  },

  getErrorSummaryBody(page: Page) {
    return page.locator('[data-testid="error-link-0"]');
  },

  getQuestionOptions(page: Page, type: 'radio' | 'checkbox') {
    return page.getByRole(type);
  },

  getOptionByLabel(page: Page, optionText: string) {
    return page.locator('label', { hasText: optionText }).first();
  },

  async clickRadioOption(page: Page, optionText: string) {
    const label = this.getOptionByLabel(page, optionText);
    await label.click();
  },

  async isOptionSelected(page: Page, optionText: string) {
    const option = this.getOptionByLabel(page, optionText);
    const count = await option.count();
    if (count > 0) {
      return option.first().isChecked();
    }

    const labelLocator = page.locator('label', { hasText: optionText });
    const radio = labelLocator.locator('input[type="radio"]');
    if ((await radio.count()) > 0) {
      return radio.first().isChecked();
    }

    const forValue = await labelLocator.getAttribute('for');
    if (forValue) {
      return page.locator(`input#${forValue}`).isChecked();
    }

    return false;
  },

  async clickCheckboxOption(page: Page, optionText: string) {
    const label = this.getOptionByLabel(page, optionText);
    await label.waitFor({ state: 'visible', timeout: 5000 });
    await label.click();
  },

  async isOptionChecked(page: Page, optionText: string) {
    const option = this.getOptionByLabel(page, optionText);
    const count = await option.count();
    if (count > 0) {
      return option.first().isChecked();
    }

    const labelLocator = page.locator('label', { hasText: optionText });
    const checkbox = labelLocator.locator('input[type="checkbox"]');
    if ((await checkbox.count()) > 0) {
      return checkbox.first().isChecked();
    }

    const forValue = await labelLocator.getAttribute('for');
    if (forValue) {
      return page.locator(`input#${forValue}`).isChecked();
    }

    return false;
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
