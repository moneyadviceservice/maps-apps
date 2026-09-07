import { expect, type Locator, type Page } from '@lib/test.lib';

export class PaginationPage {
  readonly page: Page;

  readonly pageLinks: Locator;
  readonly previousLink: Locator;
  readonly backToTopLink: Locator;

  constructor(page: Page) {
    this.page = page;

    // Desktop page controls only (mobile uses id="mobile-page-N")
    this.pageLinks = page.locator('[id^="page-"]');
    this.previousLink = page.locator('a.t-previous');
    this.backToTopLink = page.locator('a.order-4');
  }

  async clickPageByIndex(index: number) {
    await this.pageLinks.nth(index).click();
  }

  async clickLastPage() {
    const count = await this.pageLinks.count();
    let maxPage = 0;

    for (let i = 0; i < count; i++) {
      const id = await this.pageLinks.nth(i).getAttribute('id');
      const pageNumber = Number(id?.replace('page-', ''));
      if (Number.isFinite(pageNumber) && pageNumber > maxPage) {
        maxPage = pageNumber;
      }
    }

    expect(maxPage).toBeGreaterThan(0);

    await this.page.locator(`#page-${maxPage}`).click();
    await expect(this.page).toHaveURL(
      (url) => url.searchParams.get('p') === String(maxPage),
    );
    await expect(
      this.page.getByTestId(`desktop-active-page-${maxPage}`),
    ).toBeVisible();
  }

  async getPageCount() {
    return this.pageLinks.count();
  }

  getPageByNumber(pageNumber: number) {
    return this.page.locator(`#page-${pageNumber}`);
  }
}
