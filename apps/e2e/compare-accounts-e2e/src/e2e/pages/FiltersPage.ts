import type { Locator, Page } from '@lib/test.lib';

export class FiltersPage {
  readonly page: Page;

  readonly standardCurrentFilter: Locator;
  readonly studentFilter: Locator;
  readonly searchInput: Locator;
  readonly applyButton: Locator;
  readonly clearAllLink: Locator;

  constructor(page: Page) {
    this.page = page;

    this.standardCurrentFilter = page.locator('p.self-center.ml-4', {
      hasText: 'Standard current',
    });
    this.studentFilter = page.locator('p.self-center.ml-4', {
      hasText: 'Student',
    });
    this.searchInput = page.locator('input[type="search"]');
    this.applyButton = page.getByRole('button', { name: 'Apply filters' });
    this.clearAllLink = page.getByRole('link', { name: 'Clear all' });
  }

  async toggleStandardCurrent() {
    await this.standardCurrentFilter.click();
  }

  async toggleStudent() {
    await this.studentFilter.click();
  }

  async search(term: string) {
    await this.searchInput.fill(term);
  }

  async applyFilters() {
    await this.applyButton.click();
  }

  async clearFilters() {
    await this.clearAllLink.click();
  }
}
