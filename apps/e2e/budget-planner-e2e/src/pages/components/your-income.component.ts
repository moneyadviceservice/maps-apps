import { BasePage } from '@pages/Base.page';

//Kept all possible inputs for scalability
export enum Income {
  pay = 'pay',
  incomeFromSelfEmployment = 'self-employment',
  sickPay = 'statutory-pay-sick',
  maternityPay = 'statutory-maternity-pay',
  universalCredit = 'universal-credit',
  childBenefit = 'child-benefit',
  jobseekers = 'jobseekers-allowance',
  esa = 'esa-or-incapacity-benefit',
  personalIndependance = 'independence-payment',
  pensionCredit = 'pension-credit',
  attendanceAllowance = 'attendance-allowance',
  carerAllowance = 'carers-allowance',
  housingBenefit = 'housing-benefit',
  statePension = 'state-pension',
  workplacePension = 'workplace-pension',
  selfInvestedPension = 'self-investment-pension',
  annuityIncome = 'annuity',
  incomeDrawdown = 'drawdown',
  other = 'pension-other',
  incomeFromSavings = 'savings-investments',
  rent = 'rent-or-board',
  childMaintenace = 'child-maintenance',
  studentLoads = 'student-loans-and-grants',
  otherFinancialSupport = 'other-financial-support',
  gifts = 'gifts',
}
export type IncomeKey = keyof typeof Income;

//Kept all possible inputs for scalability
export enum IncomeGroups {
  'Pay' = 0,
  'Benefits & Tax Credit' = 1,
  'Pension' = 2,
  'Other income' = 3,
  'Your additional items' = 4,
}
export type IncomeGroupsKey = keyof typeof IncomeGroups;

//Kept all possible inputs for scalability
const GroupByField: Record<IncomeKey, IncomeGroupsKey> = {
  pay: 'Pay',
  incomeFromSelfEmployment: 'Pay',
  sickPay: 'Pay',
  maternityPay: 'Pay',

  universalCredit: 'Benefits & Tax Credit',
  childBenefit: 'Benefits & Tax Credit',
  jobseekers: 'Benefits & Tax Credit',
  esa: 'Benefits & Tax Credit',
  personalIndependance: 'Benefits & Tax Credit',
  pensionCredit: 'Benefits & Tax Credit',
  attendanceAllowance: 'Benefits & Tax Credit',
  carerAllowance: 'Benefits & Tax Credit',
  housingBenefit: 'Benefits & Tax Credit',

  statePension: 'Pension',
  workplacePension: 'Pension',
  selfInvestedPension: 'Pension',
  annuityIncome: 'Pension',
  incomeDrawdown: 'Pension',
  other: 'Pension',

  incomeFromSavings: 'Other income',
  rent: 'Other income',
  childMaintenace: 'Other income',
  studentLoads: 'Other income',
  otherFinancialSupport: 'Other income',
  gifts: 'Other income',
};

export class IncomeComponent extends BasePage {
  get incomeTitle() {
    return this.page.locator('h1').first();
  }

  async inputGroupDropdown(key: IncomeGroupsKey) {
    return this.page
      .locator('details[data-testid="expandable-section"].border-slate-400')
      .nth(IncomeGroups[key]);
  }

  async incomeFieldInput(key: IncomeKey) {
    return this.page.locator(`#input-${Income[key]}`);
  }

  async incomeFieldFrequency(key: IncomeKey) {
    return this.page.locator(`[name="${Income[key]}-factor"]`);
  }

  async incomeItemTitle(key: IncomeKey) {
    return this.page.locator(`label[for="input-${Income[key]}`);
  }

  async additonalItemText(rowNum: string) {
    return this.page.locator(
      `input[name="income-additional-field-${rowNum}-title"]`,
    );
  }

  async incomeFieldMoreInfoButton(key: IncomeKey) {
    const inputId = `input-${Income[key]}`;
    return this.page.locator(
      `div.flex.flex-col:has(#${inputId}) [data-testid="expandable-section"]`,
    );
  }

  async incomeFieldMoreInfoContent(key: IncomeKey) {
    const inputId = `input-${Income[key]}`;
    return this.page.locator(
      `div.flex.flex-col:has(#${inputId}) [data-testid="expandable-section"] > div`,
    );
  }

  async additonalItemPrice(rowNum: string) {
    return this.page.locator(`#input-income-additional-field-${rowNum}"]`);
  }

  async additonalItemFrquency(rowNum: string) {
    return this.page.locator(
      `select[aria-description="income-additional-field-${rowNum}"]`,
    );
  }

  async expandSection(key: IncomeGroupsKey) {
    const section = await this.inputGroupDropdown(key);
    const isOpen = await section.evaluate(
      (element) => (element as HTMLDetailsElement).open,
    );
    if (!isOpen) {
      await section.click();
    }
  }

  private async expandSectionForField(key: IncomeKey) {
    await this.expandSection(GroupByField[key]);
  }

  async fillInput(key: IncomeKey, value: string) {
    await this.expandSectionForField(key);
    const input = await this.incomeFieldInput(key);
    await input.fill(value);
  }
}
