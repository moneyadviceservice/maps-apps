import { Page } from '@lib/test.lib';

/**
 * Provides access to the header component of the application, including the language switcher and search toggle.
 */
export class HeaderComponent {
  constructor(protected readonly page: Page) {}

  get header() {
    return this.page.getByTestId('header');
  }

  get languageSwitchButton() {
    return this.page.getByTestId('language-switcher');
  }
  /**
   * The button that toggles the search bar on or off
   */
  get searchToggleButton() {
    return this.header.getByTestId('search-toggle');
  }

  get searchDetailsBlock() {
    return this.header.locator('details:has([data-testid="search-toggle"])');
  }
}
