import { expect } from '@lib/test.lib';
import { BasePage } from '@pages/Base.page';

//Kept all possible inputs for scalability
export enum Finance {
  lifeInsurance = 'life-insurance',
  incomeProtection = 'protection-insurance',
  criticalIllness = 'critical-illness-insurance',
  healthInsurance = 'health-insurance',
  dentalInsurance = 'dental-insurance',

  overdraftCharges = 'overdraft-charges-interest',
  bankFees = 'bank-account-fees',
  penalties = 'penalties',

  loanPayment = 'loan-repayments',
  studentLoan = 'student-loan-repayments',
  creditCard = 'credit-card-repayments',
  carHire = 'car-hire-payments',
  payLater = 'buy-now-pay-later',
  otherCredit = 'other-credit-repayments',

  regularSavings = 'regular-saving',
  lumpSum = 'lump-sum-savings',
  isas = 'payments-isas',
  shares = 'buying-shares',
  privatePensions = 'private-pensions',

  longTermCare = 'long-term-care',
  funeral = 'funeral-plan',

  financialAdvice = 'financial-advice',
}
export type FinanceKey = keyof typeof Finance;

//Kept all possible inputs for scalability
export enum FinanceGroups {
  'Insurance' = 0,
  'Banking' = 1,
  'Credit' = 2,
  'Savings and investments' = 3,
  'Future plans' = 4,
  'Financial and legal advice' = 5,
  'Your additional items' = 6,
}
export type FinanceGroupsKey = keyof typeof FinanceGroups;

//Kept all possible inputs for scalability
const GroupByField: Record<FinanceKey, FinanceGroupsKey> = {
  lifeInsurance: 'Insurance',
  incomeProtection: 'Insurance',
  criticalIllness: 'Insurance',
  healthInsurance: 'Insurance',
  dentalInsurance: 'Insurance',

  overdraftCharges: 'Banking',
  bankFees: 'Banking',
  penalties: 'Banking',

  loanPayment: 'Credit',
  studentLoan: 'Credit',
  creditCard: 'Credit',
  carHire: 'Credit',
  payLater: 'Credit',
  otherCredit: 'Credit',

  regularSavings: 'Savings and investments',
  lumpSum: 'Savings and investments',
  isas: 'Savings and investments',
  shares: 'Savings and investments',
  privatePensions: 'Savings and investments',

  longTermCare: 'Future plans',
  funeral: 'Future plans',

  financialAdvice: 'Financial and legal advice',
};

export class FinanceComponent extends BasePage {
  get financeTitle() {
    return this.page.locator('h1').first();
  }

  async financeGroupDropdown(key: FinanceGroupsKey) {
    return this.page
      .locator('details[data-testid="expandable-section"].border-slate-400')
      .nth(FinanceGroups[key]);
  }

  async financeFieldInput(key: FinanceKey) {
    return this.page.locator(`#input-${Finance[key]}`);
  }

  async financeFieldFrequency(key: FinanceKey) {
    return this.page.locator(`[name="${Finance[key]}-factor"]`);
  }

  async financeItemTitle(key: FinanceKey) {
    return this.page.locator(`label[for="input-${Finance[key]}`);
  }

  async financeFieldMoreInfoButton(key: FinanceKey) {
    const inputId = `input-${Finance[key]}`;
    return this.page.locator(
      `div.flex.flex-col:has(#${inputId}) [data-testid="expandable-section"]`,
    );
  }

  async financeFieldMoreInfoContent(key: FinanceKey) {
    const inputId = `input-${Finance[key]}`;
    return this.page.locator(
      `div.flex.flex-col:has(#${inputId}) [data-testid="expandable-section"] > div`,
    );
  }

  async additonalItemText(rowNum: string) {
    return this.page.locator(
      `input[name="finance-insurance-additional-field-${rowNum}-title"]`,
    );
  }

  async additonalItemPrice(rowNum: string) {
    return this.page.locator(
      `#finance-insurance-income-additional-field-${rowNum}"]`,
    );
  }

  async additonalItemFrequency(rowNum: string) {
    return this.page.locator(
      `select[aria-description="finance-insurance-additional-field-${rowNum}"]`,
    );
  }

  private async expandSection(key: FinanceGroupsKey) {
    const section = await this.financeGroupDropdown(key);
    await expect(section).toBeVisible();
    const isOpen = await section.evaluate(
      (element) => (element as HTMLDetailsElement).open,
    );
    if (!isOpen) {
      await section.click();
    }
  }

  private async expandSectionForField(key: FinanceKey) {
    await this.expandSection(GroupByField[key]);
  }

  async fillInput(key: FinanceKey, value: string) {
    await this.expandSectionForField(key);
    const input = await this.financeFieldInput(key);
    await input.fill(value);
  }

  async fillFactorInput(key: FinanceKey, value: number) {
    await this.expandSectionForField(key);
    const input = await this.financeFieldFrequency(key);
    await input.selectOption({ index: value });
  }
}
