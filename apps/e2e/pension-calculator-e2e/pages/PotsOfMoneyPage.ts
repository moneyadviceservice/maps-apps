import { aboutYouData, yourIncomeData } from 'data';
import { Locator, type Page } from '@playwright/test';

import { BasePage } from './basePage';

export class PotsOfMoneyPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  //LOCATORS

  //inputs

  yesRadioButton(): Locator {
    return this.page.getByRole('radio', { name: 'Yes' });
  }

  yesRadioLabel(): Locator {
    return this.page.locator('label[for="hasPotOfMoneyPension"]');
  }

  noRadioButton(): Locator {
    return this.page.getByRole('radio', { name: 'No' });
  }

  noRadioLabel(): Locator {
    return this.page.locator('label[for="hasPotOfMoneyPension-1"]');
  }

  notSureAccordion(): Locator {
    return this.page.getByTestId('expandable-section').locator('summary');
  }

  //errors

  errorSummary(): Locator {
    return this.page.getByTestId('error-summary-container');
  }

  potOfMoneyError(): Locator {
    return this.page.locator('#question-radio-error');
  }

  //ACTIONS

  async goto(): Promise<void> {
    const sessionId = await this.postPageData('about-you', aboutYouData);
    await this.postPageData('your-income', yourIncomeData, sessionId);
    await this.page.goto('/en/pots-of-money?sessionId=' + sessionId);
  }

  async clickNotSureAccordion(): Promise<void> {
    await this.notSureAccordion().click();
  }

  async checkYesRadio(): Promise<void> {
    await this.yesRadioLabel().click();
  }

  async checkNoRadio(): Promise<void> {
    await this.noRadioLabel().click();
  }
}
