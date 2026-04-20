import { Page } from '@playwright/test';

import {
  dobDay as defaultDobDay,
  dobMonth as defaultDobMonth,
  dobYear as defaultDobYear,
  retirementAge as defaultRetirementAge,
  sex as defaultSex,
} from '../data/about-you';
import { basePage } from './basePage';

interface AboutYouPage {
  fillValuesAndContinue(
    page: Page,
    dobDay?: string,
    dobMonth?: string,
    dobYear?: string,
    retirementAge?: string,
    sex?: string,
  ): Promise<void>;
  getInputValue(page: Page, selectorId: string): Promise<string>;
  getErrorMessage(page: Page, selectorId: string): Promise<string>;
  fillRetirementAgeAndContinue(
    page: Page,
    retirementAge: string,
  ): Promise<void>;
}

const heading = 'About you';

const aboutYouPage: AboutYouPage = {
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
   */
  async fillValuesAndContinue(
    page,
    dobDay = defaultDobDay,
    dobMonth = defaultDobMonth,
    dobYear = defaultDobYear,
    retirementAge = defaultRetirementAge,
    sex = defaultSex,
  ) {
    await basePage.waitForPageHeading(page, heading);
    await basePage.fillInput(page, 'day', dobDay);
    await basePage.fillInput(page, 'month', dobMonth);
    await basePage.fillInput(page, 'year', dobYear);
    await basePage.selectRadioButton(page, `gender-${sex}`);
    await basePage.fillInput(page, 'retireAge', retirementAge);
    await basePage.clickButton(page, 'Continue');
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
    await basePage.clickButton(page, 'Continue');
  },
};

export default aboutYouPage;
