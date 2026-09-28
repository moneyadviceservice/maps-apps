import { BaseTabComponent } from '@pages/BaseTab.component';

export enum SAVING_FREQUENCY {
  PER_DAY = '1',
  PER_WEEK = '7',
  PER_2_WEEKS = '14',
  PER_4_WEEKS = '28',
  PER_MONTH = '30',
}
export type SavingFrequencyKey = keyof typeof SAVING_FREQUENCY;

export class YourBudgetComponent extends BaseTabComponent {
  get budgetTitle() {
    return this.page.locator('h1').first();
  }

  get budgetDescription() {
    return this.page.locator('[data-testid="paragraph"]').first();
  }

  get budgetSubheading() {
    return this.page.locator('h2').first();
  }

  get moneyInBankTitle() {
    return this.page.locator('label[for="q-in-bank"]');
  }

  get moneyInBankDescription() {
    return this.page.locator('#q-in-bank-description').first();
  }

  get moneyInBankInput() {
    return this.page.locator('#q-in-bank');
  }

  get expandMoreAboutBudgetInfo() {
    return this.page.locator('[data-testid="summary-block-title"]').nth(0);
  }

  get moreAboutBudgetInfo() {
    return this.page.locator('#q-in-bank-expandable-description > *').nth(1);
  }

  get beforeBabyTitle() {
    return this.page.locator('label[for="q-can-save-i"]');
  }

  get beforeBabyPriceInput() {
    return this.page.locator('#q-can-save-i');
  }

  get beforeBabyWeekDropdown() {
    return this.page.locator('[data-testid="can-save-s"]');
  }

  get expandBabyPriceInfo() {
    return this.page.locator('[data-testid="summary-block-title"]').nth(1);
  }

  get babyPriceInfo() {
    return this.page.locator('#q-can-save-expandable-description > *').nth(1);
  }

  async setBabyWeekDropdown(key: SAVING_FREQUENCY) {
    await this.page.locator('[data-testid="can-save-s"]').selectOption(key);
  }

  get expandMoreAboutBeforeBabyInfo() {
    return this.page.locator('#q-can-save-expandable-description');
  }

  get moreAboutBeforeBabyInfo() {
    return this.page.locator('#q-can-save-expandable-description > div');
  }
}
