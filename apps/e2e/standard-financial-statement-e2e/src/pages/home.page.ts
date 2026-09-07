import type { Locator, Page } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly introHeading: Locator;
  readonly heading: Locator;
  readonly footer: Locator;

  constructor(page: Page) {
    this.page = page;
    this.introHeading = page.getByTestId('homepage-heading');
    this.heading = page.getByTestId('page-heading');
    this.footer = page.getByTestId('footer');
  }

  /**
   * Locates the search bar toggle button in the header, which only shows in a mobile viewport.
   */
  get searchBarToggle() {
    return this.page.getByTestId('search-toggle');
  }

  /**
   * Clicks the search bar toggle button in the header, which only shows in a mobile viewport.
   */
  async clickSearchBar(): Promise<void> {
    await this.searchBarToggle.click();
  }

  /**
   * Opens a main navigation menu item from the site header.
   *
   * @param testId - `data-testid` on the header link
   */
  async clickMenuItem(testId: string): Promise<void> {
    await this.page
      .getByTestId('header-desktop-nav')
      .getByTestId(testId)
      .click();
  }

  /**
   * Clicks an in-page anchor link by hash.
   *
   * @param hash - URL hash including `#` (see `ANCHOR_LINK`)
   * @param force - Whether to force the click (e.g. obscured elements)
   */
  async clickAnchor(hash: string, force = false): Promise<void> {
    await this.page.locator(`a[href$="${hash}"]`).first().click({ force });
  }

  /**
   * Clicks a side navigation link by `data-testid`.
   *
   * @param testId - Navigation link `data-testid`
   */
  async clickNavLink(testId: string): Promise<void> {
    await this.page.getByTestId(testId).click();
  }

  /**
   * Clicks a footer link and waits for the destination page heading.
   *
   * @param testId - Footer link `data-testid`
   */
  async clickFooterLink(testId: string): Promise<void> {
    await this.footer.getByTestId(testId).click();
    await this.heading.waitFor();
  }
}
