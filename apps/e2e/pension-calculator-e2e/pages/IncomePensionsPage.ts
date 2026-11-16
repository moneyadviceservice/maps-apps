import { aboutYouData, potsOfMoneyData, yourIncomeData } from 'data';
import { type Locator, type Page } from '@playwright/test';

import { BasePage } from './basePage';

export class IncomePensionsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  ///LOCATORS

  yesRadioButton(): Locator {
    return this.page.getByRole('radio', { name: 'Yes' });
  }

  noRadioButton(): Locator {
    return this.page.getByRole('radio', { name: 'No' });
  }

  //ACTIONS
  async goto(): Promise<void> {
    const sessionId = await this.postPageData('about-you', aboutYouData);
    await this.postPageData('your-income', yourIncomeData, sessionId);
    await this.postPageData('pots-of-money', potsOfMoneyData, sessionId);
    await this.page.goto('/en/income-pensions?sessionId=' + sessionId);
  }
}
