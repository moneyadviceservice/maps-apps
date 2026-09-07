import { type Locator, type Page } from '@playwright/test';

export type ErrorOption = {
  fieldName?: string;
  message: string;
  fieldLevelMessage?: string;
};

export class BasePage {
  readonly page: Page;
  protected firmId?: string;

  // #region SELECTORS
  private readonly acceptCookiesName = 'Accept all cookies';

  // #endregion

  constructor(page: Page) {
    this.page = page;
  }

  // LOCATORS

  /**
   * Returns the locator for the cookie acceptance button.
   * @returns {Locator} The locator for the accept cookies button.
   */
  protected acceptCookiesButton(): Locator {
    return this.page.getByRole('button', { name: this.acceptCookiesName });
  }

  /**
   * Returns a locator for a heading element by its exact text content.
   * @param text - The exact text of the heading to find.
   * @returns {Locator} The locator for the heading.
   */
  headingLocator(text: string): Locator {
    return this.page.getByRole('heading', { name: text, exact: true });
  }

  // ACTIONS

  /**
   * Attempts to accept cookies if the banner appears, otherwise logs and continues.
   * Useful for handling cookie banners that do not appear in every test run.
   */
  async acceptCookiesIfVisible(): Promise<void> {
    try {
      await this.acceptCookiesButton().click({ timeout: 5000 });
    } catch {
      console.log('Cookie banner not found, continuing...');
    }
  }
}
