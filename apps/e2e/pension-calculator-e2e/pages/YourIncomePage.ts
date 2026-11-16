import { Locator, type Page } from '@playwright/test';

import { aboutYouData } from '../data';
import { BasePage } from './basePage';

export class YourIncomePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  //LOCATORS

  //inputs

  grossPay(): Locator {
    return this.page.locator('#grossPay');
  }

  grossPayFrequency(): Locator {
    return this.page.locator('#grossPayFrequency');
  }

  otherIncomeName(index: number): Locator {
    return this.page.locator(`#other-income-${index}-name`);
  }

  otherIncomeAmount(index: number): Locator {
    return this.page.locator(`#other-income-${index}-amount`);
  }

  otherIncomeFrequency(index: number): Locator {
    return this.page.locator(`#other-income-${index}-frequency`);
  }

  addAnotherIncomeButton(): Locator {
    return this.page.locator('#add-another-income');
  }

  removeOtherIncomeButton(index: number): Locator {
    return this.page.locator(`#other-income-${index}-remove`);
  }

  continueButton() {
    return this.page.getByRole('button', { name: 'Continue' });
  }

  //errors

  errorSummary() {
    return this.page.getByTestId('error-summary-container');
  }

  grossPayError() {
    return this.page.locator('#grossPay-error');
  }

  otherIncomeAmountError(index: number) {
    return this.page.locator(`#other-income-${index}-amount-error`);
  }

  otherIncomeNameError(index: number) {
    return this.page.locator(`#other-income-${index}-name-error`);
  }

  //ACTIONS
  async goto(): Promise<void> {
    const sessionId = await this.postPageData('about-you', aboutYouData);
    await this.page.goto('/en/your-income?sessionId=' + sessionId);
  }

  async clickAddAnotherIncomeButton(): Promise<void> {
    await this.addAnotherIncomeButton().click();
  }

  async clickRemoveOtherIncomeButton(index: number): Promise<void> {
    await this.removeOtherIncomeButton(index).click();
  }
}
