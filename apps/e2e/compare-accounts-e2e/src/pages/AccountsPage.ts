import { expect, type Locator, type Page } from '@lib/test.lib';

export class AccountsPage {
  readonly page: Page;
  readonly accountsPerPageSelect: Locator;
  readonly sortSelect: Locator;
  readonly selectedAccounts: Locator;
  readonly resultsRange: Locator;

  constructor(page: Page) {
    this.page = page;

    this.accountsPerPageSelect = page.locator('#accountsPerPage');
    this.sortSelect = page.locator('select#order');
    this.selectedAccounts = page.locator(
      'div[data-testid="selected-accounts"]',
    );
    this.resultsRange = page.locator(
      String.raw`div.hidden.lg\:flex.items-center.justify-center.lg\:justify-start`,
    );
  }

  get stdCurrentOption() {
    return this.page.locator('#standardcurrent');
  }

  get noMonthlyFeeOption() {
    return this.page.locator('#nomonthlyfee');
  }

  get branchBankingOption() {
    return this.page.locator('#branchbanking');
  }

  getFilterContainerByText(text: string) {
    return this.page.getByTestId('filter-container').getByText(text);
  }

  get backButton() {
    return this.page.getByRole('link', { name: 'Back', exact: true }).first();
  }

  async goto(endpoint = '/') {
    await this.page.goto('/en' + endpoint);
  }

  async sortBy(value: string) {
    await this.sortSelect.selectOption(value);
    await expect(this.page).toHaveURL(new RegExp(`order=${value}`));
    await this.selectedAccounts.first().waitFor({ state: 'visible' });
  }

  getFirstAccountHeader() {
    return this.selectedAccounts.first().locator('h3');
  }

  getFirstTableValue(columnIndex: number) {
    return this.selectedAccounts
      .nth(0)
      .locator(`[data-testid="table-data-value-${columnIndex}"]`);
  }

  getLastTableValue(columnIndex: number) {
    return this.selectedAccounts
      .last()
      .locator(`[data-testid="table-data-value-${columnIndex}"]`);
  }
}
