import type { Locator, Page, TestInfo } from '@lib/test.lib';

export class FiltersPage {
  readonly page: Page;
  readonly isMobile: boolean | undefined;

  readonly standardCurrentFilter: Locator;
  readonly studentFilter: Locator;
  readonly searchInput: Locator;
  readonly applyButton: Locator;
  readonly clearAllLink: Locator;

  constructor(page: Page, testInfo: TestInfo) {
    this.page = page;
    this.isMobile = testInfo.project.use.isMobile;
    this.standardCurrentFilter = page.locator(
      'label:has(p:has-text("Standard current"))',
    );
    this.studentFilter = page.locator('label:has(p:has-text("Student"))');
    this.searchInput = page.locator('input[type="search"]');
    this.applyButton = page.getByRole('button', { name: 'Apply filters' });
    this.clearAllLink = page.getByRole('link', { name: 'Clear all' });
  }

  get filterButton() {
    return this.page.getByTestId('button-filters');
  }

  async openFiltersOnMobile() {
    if (this.isMobile) {
      await this.filterButton.click();
    }
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
