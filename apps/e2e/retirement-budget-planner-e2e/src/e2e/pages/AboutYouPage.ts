import { Locator, Page, type Response } from '@playwright/test';

import {
  aboutYouTitle,
  dobDay as defaultDobDay,
  dobMonth as defaultDobMonth,
  dobYear as defaultDobYear,
  retirementAge as defaultRetirementAge,
  sex as defaultSex,
} from '../data/about-you';
import { basePage } from './basePage';

interface AboutYouPage {
  waitForPageToBeReady(page: Page): Promise<void>;
  waitForNetworkToSettle(page: Page): Promise<Response>;
  fillValuesAndContinue(
    page: Page,
    dobDay?: string,
    dobMonth?: string,
    dobYear?: string,
    retirementAge?: string,
    sex?: string,
    options?: {
      continueWithKeyboard?: boolean;
    },
  ): Promise<void>;
  getInputValue(page: Page, selectorId: string): Promise<string>;
  getErrorMessage(page: Page, selectorId: string): Promise<string>;
  fillRetirementAgeAndContinue(
    page: Page,
    retirementAge: string,
  ): Promise<void>;
  retireAgeInput(page: Page): Locator;
}

const aboutYouPage: AboutYouPage = {
  /**
   * Wait for the page to be ready by waiting for the main heading to be visible
   *
   * @param page - Playwright page object
   * @returns Promise that resolves when the page is ready
   */
  async waitForPageToBeReady(page) {
    return await basePage.waitForPageHeading(page, aboutYouTitle);
  },

  /**
   * The /about-you page triggers a /api/get-partner-details call asynchronously on load.
   *
   * Upon this requests completion, the input fields are set to the values of any session found.
   *
   * If a value isn't found, it will clear these input fields, sometimes leading to a race condition
   * that can cause flaky tests. Use this upon navigating to the /about-you page to wait until the
   * network traffic has settled and finished.
   */
  async waitForNetworkToSettle(page: Page) {
    return page.waitForResponse(
      (response) =>
        response.url().includes('/api/get-partner-details') &&
        response.status() === 200,
    );
  },

  /**
   * Fills in the 'about you' form and continues to the next page.
   * If no values are provided, a set of valid defaults will be used.
   *
   * @param page The Playwright page object
   * @param dobDay Birth day of month – e.g. '18'
   * @param dobMonth Birth month – e.g. '1' for January
   * @param dobYear Birth year – e.g. '1970'
   * @param retirementAge Retirement age – e.g. '75'
   * @param sex Sex/gender – e.g. 'female'
   * @param options Options object (optional)
   * @param options.continueWithKeyboard Use keyboard to submit form instead of button click (optional)
   */
  async fillValuesAndContinue(
    page,
    dobDay = defaultDobDay,
    dobMonth = defaultDobMonth,
    dobYear = defaultDobYear,
    retirementAge = defaultRetirementAge,
    sex = defaultSex,
    options = undefined,
  ) {
    const { continueWithKeyboard = false } = { ...options };

    await basePage.waitForPageHeading(page, aboutYouTitle);

    await basePage.fillInput(page, 'day', dobDay);
    await basePage.fillInput(page, 'month', dobMonth);
    await basePage.fillInput(page, 'year', dobYear);
    await basePage.selectRadioButton(page, `gender-${sex}`);
    await basePage.fillInput(page, 'retireAge', retirementAge);

    if (continueWithKeyboard) {
      await aboutYouPage.retireAgeInput(page).press('Enter');
    } else {
      await basePage.continueButton(page).click();
    }
  },

  async getInputValue(page, selectorId) {
    const input = page.locator(`input#${selectorId}`);
    return await input.inputValue();
  },

  async getErrorMessage(page, selectorId) {
    const errorMessage = page.locator(`[data-testid="${selectorId}-error"]`);
    return (await errorMessage.textContent()) || '';
  },

  async fillRetirementAgeAndContinue(page, retirementAge) {
    await basePage.fillInput(page, 'retireAge', retirementAge);
    await basePage.continueButton(page).click();
  },

  /**
   * Get the retire age input of the about you page
   *
   * @param page - Playwright page object
   * @returns Locator for retire age input
   */
  retireAgeInput(page) {
    return page.getByTestId('retireAge-input');
  },
};

export default aboutYouPage;
