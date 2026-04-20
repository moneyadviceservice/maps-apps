import type { Locator, Page } from '@lib/test.lib';

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

  async goto() {
    await this.page.goto('/en');
    await this.acceptCookies();
  }

  async acceptCookies() {
    await this.page
      .locator('button', { hasText: 'Accept all cookies' })
      .click();
  }

  async sortBy(value: string) {
    await this.sortSelect.selectOption(value);
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
    return this.page
      .locator(`[data-testid="table-data-value-${columnIndex}"]`)
      .last();
  }
}
