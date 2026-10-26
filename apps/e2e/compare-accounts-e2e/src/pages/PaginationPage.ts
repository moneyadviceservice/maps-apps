import { expect, type Locator, type Page, type TestInfo } from '@lib/test.lib';

export class PaginationPage {
  readonly page: Page;
  readonly isMobile: boolean | undefined;

  readonly pageLinks: Locator;
  readonly previousLink: Locator;
  readonly backToTopLink: Locator;

  constructor(page: Page, testInfo: TestInfo) {
    this.page = page;
    this.isMobile = testInfo.project.use.isMobile;

    // Desktop page controls only (mobile uses id="mobile-page-N")
    this.pageLinks = page.locator('[id^="page-"]');
    this.previousLink = page.locator('a.t-previous');
    this.backToTopLink = page.locator('a.order-4');
  }

  // Depending on if you're on mobile or not, different selectors are shown.
  activePageSelector(pageNumber: number) {
    const mobileSelector = `mobile-active-page-${pageNumber}`;
    const desktopSelector = `desktop-active-page-${pageNumber}`;
    return this.page.getByTestId(
      this.isMobile ? mobileSelector : desktopSelector,
    );
  }

  // Depending on if you're on mobile or not, different selectors are shown.
  getPageByNumber(pageNumber: number) {
    const mobileSelector = `#mobile-page-${pageNumber}`;
    const desktopSelector = `#page-${pageNumber}`;
    return this.page.locator(this.isMobile ? mobileSelector : desktopSelector);
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
    await this.getPageByNumber(maxPage).click();
    await expect(this.page).toHaveURL(
      (url) => url.searchParams.get('p') === String(maxPage),
    );
    await expect(this.activePageSelector(maxPage)).toBeVisible();
  }

  async getPageCount() {
    return this.pageLinks.count();
  }
}
