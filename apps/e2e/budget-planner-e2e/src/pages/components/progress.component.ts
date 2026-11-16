import { BasePage } from '@pages/Base.page';

export enum SummaryRows {
  householdBills = 0,
  livingCosts = 1,
  finance = 2,
  familyFriends = 3,
  travel = 4,
  leisure = 5,
}

export class ProgressComponent extends BasePage {
  get progressTitle() {
    return this.page.locator('h3').first();
  }

  async balanceRow() {
    return (await this.balanceRowPrice()).locator('..');
  }
  async incomeRowPrice() {
    return this.progressRow(0);
  }
  async spendingRowPrice() {
    return this.progressRow(1);
  }
  async balanceRowPrice() {
    return this.progressRow(2);
  }

  get balanceTitle() {
    return this.page.locator('h3').first().locator('..');
  }

  private async progressRow(nth: number) {
    return this.page
      .getByTestId('summary-total-item-value')
      .nth(nth)
      .getByTestId('item-value');
  }

  get factorDropdown() {
    return this.page.locator('#select');
  }
}
