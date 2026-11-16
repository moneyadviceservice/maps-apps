import { type Page } from '@playwright/test';

import { BasePage } from './basePage';

export class AboutYouPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // LOCATORS

  //inputs

  dobDay() {
    return this.page.getByLabel('Day');
  }

  dobMonth() {
    return this.page.getByLabel('Month');
  }

  dobYear() {
    return this.page.getByLabel('Year');
  }

  maleRadioButton() {
    return this.page.locator('label[for="sex"]');
  }

  femaleRadioButton() {
    return this.page.locator('label[for="sex-1"]');
  }

  retirementAge() {
    return this.page.getByTestId('number-input').nth(3);
  }

  whyWeNeedThisInfoAccordion() {
    return this.page.getByTestId('expandable-section');
  }

  continueButton() {
    return this.page.getByRole('button', { name: 'Continue' });
  }

  //errors

  errorSummary() {
    return this.page.getByTestId('error-summary-container');
  }

  dobError() {
    return this.page.getByTestId('day-error');
  }

  sexError() {
    return this.page.locator('#sex-0-error');
  }

  retirementAgeError() {
    return this.page.locator('#retireAge-error');
  }

  // ACTIONS

  async goto(): Promise<void> {
    await this.page.goto('/en/about-you');
  }

  async fillDateOfBirth(
    day: string,
    month: string,
    year: string,
  ): Promise<void> {
    await this.dobDay().fill(day);
    await this.dobMonth().fill(month);
    await this.dobYear().fill(year);
  }

  async checkMaleRadioButton(): Promise<void> {
    await this.maleRadioButton().click();
  }

  async checkFemaleRadioButton(): Promise<void> {
    await this.femaleRadioButton().click();
  }

  async fillRetirementAge(age: string): Promise<void> {
    await this.retirementAge().fill(age);
  }

  async clickWhyWeNeedThisInfoAccordion(): Promise<void> {
    await this.whyWeNeedThisInfoAccordion().click();
  }

  async clickContinueButton(): Promise<void> {
    await this.continueButton().click();
  }
}
