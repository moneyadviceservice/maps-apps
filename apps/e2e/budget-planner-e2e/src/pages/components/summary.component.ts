import { BasePage } from '@pages/Base.page';

export enum SummaryRows {
  householdBills = 0,
  livingCosts = 1,
  finance = 2,
  familyFriends = 3,
  travel = 4,
  leisure = 5,
}
export type SummaryRowsKey = keyof typeof SummaryRows;

export class SummaryComponent extends BasePage {
  get summaryTitle() {
    return this.page.locator('h1').first();
  }

  get summarySubtitle() {
    return this.page.locator('h2').first();
  }

  get positiveText() {
    return this.page.getByTestId('callout-positive');
  }

  get negativeText() {
    return this.page.getByTestId('callout-negative');
  }

  private get tableRow() {
    return this.page
      .locator('table')
      .first()
      .locator('tbody > tr')
      .filter({ has: this.page.locator('td.align-middle') });
  }

  async tableRowTitle(key: SummaryRowsKey) {
    return this.tableRow.nth(SummaryRows[key]).locator('td').first();
  }

  async tableRowPrice(key: SummaryRowsKey) {
    return this.tableRow
      .nth(SummaryRows[key])
      .locator('[class*="items-top"][class*="lg:table-cell"]')
      .first();
  }

  async tableRowEditButton(key: SummaryRowsKey) {
    return this.tableRow.nth(SummaryRows[key]).locator('button');
  }

  get saveResults() {
    return this.page.locator('.tool-save');
  }

  get startAgain() {
    return this.page.locator('button[formaction="/api/reset-calculator"]');
  }
}
