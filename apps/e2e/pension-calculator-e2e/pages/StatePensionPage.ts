import {
  aboutYouData,
  incomePensionsData,
  potsOfMoneyData,
  yourIncomeData,
} from 'data';
import { type Locator, type Page } from '@playwright/test';

import { BasePage } from './basePage';

export class StatePensionPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  //LOCATERS

  forecastLink(): Locator {
    return this.page.getByRole('link', {
      name: 'check your State Pension forecast',
    });
  }

  //inputs

  statePensionWeeklyAmount(): Locator {
    return this.page.locator('#statePensionWeeklyAmount');
  }

  statePensionWeeklyAmountError(): Locator {
    return this.page.locator('#statePensionWeeklyAmount-error');
  }

  //errors

  errorSummary(): Locator {
    return this.page.getByTestId('error-summary-container');
  }

  //ACTIONS
  async goto(): Promise<void> {
    const sessionId = await this.postPageData('about-you', aboutYouData);
    await this.postPageData('your-income', yourIncomeData, sessionId);
    await this.postPageData('pensions', potsOfMoneyData, sessionId, {
      step: 'screening',
      action: 'continue',
    });
    await this.postPageData('pensions', incomePensionsData, sessionId, {
      step: 'screening',
      action: 'continue',
    });
    await this.page.goto('/en/state-pension?sessionId=' + sessionId);
  }

  async fillStatePensionWeeklyAmount(amount: string): Promise<void> {
    await this.statePensionWeeklyAmount().fill(amount);
  }
}
