import type { Locator, Page } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly loginButton: Locator;
  readonly introHeading: Locator;
  readonly heading: Locator;
  readonly footer: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loginButton = page.getByRole('link', { name: 'Login' });
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
   * Locates the search bar in the header, which is a textbox with the accessible name "Search".
   */
  get searchInput() {
    return this.page.getByRole('textbox', { name: 'Search' });
  }

  /**
   * Locates the search button in the header, which is a button with the accessible name "Search".
   */
  get searchButton() {
    return this.page.getByRole('button', { name: 'Search' });
  }

  get sideNav() {
    return this.page.getByRole('navigation', {
      name: 'Standard Financial Statement section navigation',
    });
  }

  get paragraphs() {
    return this.page.getByTestId('paragraph');
  }

  get restrictedLoginMessage() {
    return this.page.getByTestId('notification-box-information-blue');
  }

  /**
   * Searches for specified text in the search bar and clicks the search button.
   * @param text - Text to search for
   * @returns Promise that resolves when the search is complete
   */
  async searchFor(text: string): Promise<void> {
    await this.searchInput.fill(text);
    await this.searchButton.click();
  }

  /**
   * Locates text content of the page
   * @param locator - Locator for the text content to check
   * @param text - Text to check for in the content
   * @returns 'found' if the text is found, 'not found' if the text is not found
   */
  async textContentCheck(locator: Locator, text: string): Promise<string> {
    for (const item of await locator.all()) {
      const textContent = await item.textContent();
      if (textContent?.includes(text)) {
        return 'found';
      }
    }
    return 'not found';
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
