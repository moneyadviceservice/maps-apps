import { Page } from '@playwright/test';

import { basePage } from './basePage';

interface AboutYouPage {
  fillValuesAndContinue(
    page: Page,
    dobDay: string,
    dobMonth: string,
    dobYear: string,
    retirementAge: string,
  ): Promise<void>;
  getInputValue(page: Page, selectorId: string): Promise<string>;
  getErrorMessage(page: Page, selectorId: string): Promise<string>;
}

const heading = 'About you';

const aboutYouPage: AboutYouPage = {
  async fillValuesAndContinue(
    page,
    dobDay,
    dobMonth,
    dobYear,
    retirementAge,
  ): Promise<void> {
    await basePage.waitForPageHeading(page, heading);
    await basePage.fillInput(page, 'day', dobDay);
    await basePage.fillInput(page, 'month', dobMonth);
    await basePage.fillInput(page, 'year', dobYear);
    await basePage.selectRadioButton(page, 'gender-female');
    await basePage.fillInput(page, 'retireAge', retirementAge);
    await basePage.clickButton(page, 'Continue');
  },
  async getInputValue(page: Page, selectorId: string): Promise<string> {
    const input = page.locator(`input#${selectorId}`);
    return await input.inputValue();
  },
  async getErrorMessage(page: Page, selectorId: string): Promise<string> {
    const errorMessage = page.locator(`[data-testid="${selectorId}-error"]`);
    return (await errorMessage.textContent()) || '';
  },
};

export default aboutYouPage;
