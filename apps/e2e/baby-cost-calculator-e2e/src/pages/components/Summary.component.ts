import { BasePage } from '@pages/Base.page';

export class SummaryComponent extends BasePage {
  get summaryTitle() {
    return this.page.getByTestId('summary-heading');
  }

  get summaryTable() {
    return this.page.locator(
      'div:has(> [data-testid="summary-heading"]) + table',
    );
  }

  get summaryRows() {
    return this.summaryTable.locator('tbody tr');
  }

  async getSummaryRowValue(str: string): Promise<string> {
    const rowValue = this.summaryRows
      .filter({
        has: this.page.getByText(str, { exact: true }),
      })
      .locator('td')
      .nth(1);

    return ((await rowValue.textContent()) ?? '').trim();
  }
}
