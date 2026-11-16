import {
  aboutYouData,
  incomePensionsData,
  potsOfMoneyData,
  statePensionData,
  yourIncomeData,
} from 'data';
import { type Locator, type Page } from '@playwright/test';

import { BasePage } from './basePage';

type frequencyOption = 'Per week' | 'Per month' | 'Per year';

export class RetirementIncomePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  //LOCATERS

  targetAmount(): Locator {
    return this.page.getByTestId('target-amount');
  }

  incomeCalculationAccordion(): Locator {
    return this.page
      .getByTestId('summary-block-title')
      .filter({ hasText: 'How your target retirement income is calculated' });
  }

  livingCostsAccordion(): Locator {
    return this.page
      .getByTestId('summary-block-title')
      .filter({ hasText: 'Why living costs often reduce in retirement' });
  }

  //inputs

  retirementIncomeFrequency(): Locator {
    return this.page.locator('#targetFrequency');
  }

  applyButton(): Locator {
    return this.page.getByRole('button', { name: 'Apply' }); // Only appears with JS disabled
  }

  //errors

  //ACTIONS
  async goto(amount: string): Promise<void> {
    const sessionId = await this.postPageData('about-you', aboutYouData);
    await this.postPageData(
      'your-income',
      { ...yourIncomeData, grossPay: amount },
      sessionId,
    );
    await this.postPageData('pensions', potsOfMoneyData, sessionId, {
      step: 'screening',
      action: 'continue',
    });
    await this.postPageData('pensions', incomePensionsData, sessionId, {
      step: 'screening',
      action: 'continue',
    });
    await this.postPageData('state-pension', statePensionData, sessionId);
    await this.page.goto('/en/retirement-income?sessionId=' + sessionId);
  }

  async selectRetirementIncomeFrequency(
    frequency: frequencyOption,
  ): Promise<void> {
    await this.retirementIncomeFrequency().selectOption(frequency);
  }

  async clickApplyButton(): Promise<void> {
    await this.applyButton().click();
  }

  async clickIncomeCalculationAccordion(): Promise<void> {
    await this.incomeCalculationAccordion().click();
  }

  async clickLivingCostsAccordion(): Promise<void> {
    await this.livingCostsAccordion().click();
  }
}
