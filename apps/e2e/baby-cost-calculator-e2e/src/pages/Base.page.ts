import { Page } from '@lib/test.lib';

export class BasePage {
  constructor(protected readonly page: Page) {}

  get backButton() {
    return this.page.getByRole('button', { name: 'Back' });
  }

  get pageTitle() {
    return this.page.getByTestId('toolpage-span-title');
  }

  get url() {
    return this.page.url();
  }

  async goto(endpoint = '') {
    await this.page.goto(endpoint);
  }

  getTabByTitle(str: string) {
    return this.page
      .getByTestId('nav-tab-list')
      .getByRole('tab', { name: str, exact: true });
  }

  formatNegativeNumber(num: number): string {
    return Math.abs(num).toLocaleString('en-GB', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

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
}
