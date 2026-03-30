import type { Locator, Page } from '@lib/test.lib';

export class PaginationPage {
  readonly page: Page;

  readonly pageLinks: Locator;
  readonly previousLink: Locator;
  readonly backToTopLink: Locator;

  constructor(page: Page) {
    this.page = page;

    this.pageLinks = page.locator('[id^="page-"]');
    this.previousLink = page.locator('a.t-previous');
    this.backToTopLink = page.locator('a.order-4');
  }

  async clickPageByIndex(index: number) {
    await this.pageLinks.nth(index).click();
  }

  async clickLastPage() {
    await this.pageLinks.last().click();
  }

  async getPageCount() {
    return this.pageLinks.count();
  }

  getPageByNumber(pageNumber: number) {
    return this.page.locator(`#page-${pageNumber}`);
  }
}
