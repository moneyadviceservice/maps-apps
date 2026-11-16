import { BasePage } from '@pages/Base.page';

export class ResultsComponent extends BasePage {
  get resultsTitle() {
    return this.page.locator('h1').first();
  }

  get babyCostsPrice() {
    return this.page.locator('[data-testid="paragraph"]').nth(2);
  }

  get resetCalculatorButton() {
    return this.page
      .locator('button[type="submit"]')
      .filter({ hasText: /reset calculator/i });
  }

  get saveButton() {
    return this.page.locator('a[type="button"]').filter({ hasText: /Save/i });
  }

  get calloutTitle() {
    return this.page.getByTestId('paragraph').first();
  }

  get calloutMessage() {
    return this.page.getByTestId('paragraph').nth(2);
  }

  private getBreakdownRow(row: string) {
    return this.getBreakdownRowTitle(row).locator('..');
  }

  private getBreakdownRowTitle(row: string) {
    return this.page.getByText(row, { exact: true });
  }

  getBreakdownRowEditButton(row: string) {
    return this.getBreakdownRow(row).getByRole('button', { name: 'Edit' });
  }
}
