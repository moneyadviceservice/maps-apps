import { BasePage } from '@pages/Base.page';

export class ResultsComponent extends BasePage {
  get resultsTitle() {
    return this.page.getByTestId('urgent-callout').locator('h3').first();
  }
  get monthlyPayment() {
    return this.page.locator('#monthlyPayment');
  }
  get repayCost() {
    return this.page.locator('#totalAmount');
  }
  get capitalAmount() {
    return this.page.locator('#capitalAmount');
  }
  get interestAmount() {
    return this.page.locator('#interestAmount');
  }
  get intrestRiseCost() {
    return this.page
      .getByTestId('notification-box-information')
      .locator('p')
      .nth(1);
  }
  get breakdownDropdownButton() {
    return this.page.getByTestId('summary-block-title').locator('..').first();
  }
  get breakdownDropdown() {
    return this.page.getByTestId('expandable-section').first();
  }

  async yearRow(row: number) {
    return this.page
      .getByTestId('expandable-section')
      .locator('tbody tr')
      .nth(row)
      .locator('td')
      .first();
  }

  async remainingDebtRow(row: number) {
    return this.page
      .getByTestId('expandable-section')
      .locator('tbody tr')
      .nth(row)
      .locator('td')
      .nth(1);
  }
}
