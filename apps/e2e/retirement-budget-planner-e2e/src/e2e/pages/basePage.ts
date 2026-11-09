import { Locator, Page } from '@playwright/test';

// Income and costs fields use the app's `form` name prefix and save to
// /api/cache-to-memory on blur (MoneyInputFrequencyGroup `onBlur`).
const SAVE_ON_BLUR_PREFIX = 'form';
const SAVE_ENDPOINT = '/api/cache-to-memory';

const isJavaScriptEnabled = async (page: Page): Promise<boolean> => {
  await page.waitForLoadState('load');
  return page.evaluate(() => 'next' in window).catch(() => false);
};

/**
 * Wait until React has hydrated the element. Interacting before hydration
 * lets React reset the value (e.g. a select falls back to its default).
 */
const waitForHydration = async (page: Page, locator: Locator) => {
  await locator.waitFor();
  if (!(await isJavaScriptEnabled(page))) return;

  const element = await locator.elementHandle();
  await page.waitForFunction(
    (el) =>
      !!el && Object.keys(el).some((key) => key.startsWith('__reactProps$')),
    element,
  );
  await element?.dispose();
};

/**
 * Fill a field once hydrated. For fields that save on blur, blur and wait for
 * the save so a following Continue click can't race it and drop the value.
 */
const fillField = async (
  page: Page,
  locator: Locator,
  value: string,
  savesOnBlur: boolean,
) => {
  await waitForHydration(page, locator);
  await locator.click();
  await locator.clear();
  await locator.fill(value);

  if (savesOnBlur && (await isJavaScriptEnabled(page))) {
    const saved = page.waitForResponse(
      (response) =>
        response.url().includes(SAVE_ENDPOINT) &&
        response.request().method() === 'POST',
    );
    await locator.blur();
    await saved;
  }
};

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
  continueButton(page: Page): Locator;
  getErrorSummaryLink(page: Page): Locator;
  isJavaScriptEnabled(page: Page): Promise<boolean>;
  waitForHydration(page: Page, locator: Locator): Promise<void>;
};

export const basePage: BasePage = {
  isJavaScriptEnabled,
  waitForHydration,
  pageHeading(page, headingText) {
    return page.getByRole('heading', { level: 1, name: headingText });
  },

  async waitForPageHeading(page: Page, text: string): Promise<void> {
    await page.getByRole('heading', { level: 1, name: text }).waitFor();
  },

  async waitForErrorHeading(
    page: Page,
    errorHeadingText: string,
  ): Promise<void> {
    await page
      .getByRole('heading', { level: 2, name: errorHeadingText })
      .waitFor();
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

  getErrorSummaryLink(page) {
    return page.getByTestId('error-link-0');
  },

  getErrorSummaryRecords(page) {
    return page.locator('[data-testid=error-records] li a');
  },

  async fillInput(page: Page, name: string, value: string) {
    const inputLocator: Locator = page.locator(`input[name="${name}"]`);
    await fillField(
      page,
      inputLocator,
      value,
      name.startsWith(SAVE_ON_BLUR_PREFIX),
    );
  },

  async selectRadioButton(page: Page, labelFor: string) {
    const locator: Locator = page.locator(`label[for="${labelFor}"]`);
    await waitForHydration(page, locator);
    await locator.click();
  },

  async selectOption(page: Page, name: string, value: string) {
    const locator: Locator = page.locator(`select[name="${name}"]`);
    await waitForHydration(page, locator);
    await locator.selectOption(value);
    await locator.blur();
  },

  async clickButton(page: Page, buttonText: string) {
    await page.getByRole('button', { name: `${buttonText}` }).click();
  },

  async clickBackLink(page) {
    await page
      .getByTestId('main')
      .getByRole('link', { name: 'Back', exact: true })
      .click();
  },
  async getPageTitle(page: Page) {
    return page.getByTestId('title');
  },
  async fillInputByTestId(page: Page, testId: string, value: string) {
    const inputLocator: Locator = page.getByTestId(testId);
    await fillField(
      page,
      inputLocator,
      value,
      testId.startsWith(SAVE_ON_BLUR_PREFIX),
    );
  },
  async clickTab(page: Page, tabText: string) {
    const tab = page
      .getByRole('navigation', { name: 'Progress' })
      .getByRole('button', { name: tabText });
    await tab.waitFor();
    await tab.click();
  },

  /**
   * Get the main layout continue button
   *
   * @param page - Playwright page object
   * @returns Locator for continue button
   */
  continueButton(page: Page) {
    return page.getByRole('button', { name: /^(Continue|Parhau)$/ });
  },
};
