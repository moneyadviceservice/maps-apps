import { expect, type Locator, type Page } from '@playwright/test';

import { BasePage } from './basePage';

export class HomePage extends BasePage {
  //SELECTORS

  private readonly paragraphTestID = 'paragraph';
  private readonly registerLinkName = 'Register';
  private readonly viewFirmsName = 'View firms';

  constructor(page: Page) {
    super(page);
  }

  // LOCATORS

  /**
   * Returns the locator for the main paragraph element.
   * @returns {Locator} The locator for the paragraph.
   */
  private paragraphLocator(): Locator {
    return this.page.getByTestId(this.paragraphTestID);
  }

  /**
   * Returns the locator for the registration link.
   * @returns {Locator} The locator for the register link.
   */
  private registerLink(): Locator {
    return this.page.getByRole('link', { name: this.registerLinkName });
  }

  /**
   * Returns the locator for the view firms navigation button/link.
   * @returns {Locator} The locator for the view firms button.
   */
  private viewFirmsButton(): Locator {
    return this.page.getByRole('link', { name: this.viewFirmsName });
  }

  // ACTIONS

  /**
   * Navigates the browser to the home page URL.
   */
  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  /**
   * Clicks the register link and waits for the registration page to load.
   */
  async clickRegisterLink(): Promise<void> {
    await this.registerLink().click();
    await this.page.waitForURL('/register');
  }

  /**
   * Clicks the view firms button and waits for the listings page to load.
   */
  async clickViewFirmsButton(): Promise<void> {
    await this.viewFirmsButton().click();
    await this.page.waitForURL('/en/listings');
  }

  // ASSERTIONS

  /**
   * Asserts that the main paragraph content matches the expected text.
   * @param expectedText - The exact text content expected in the paragraph.
   */
  async assertParagraphContent(expectedText: string): Promise<void> {
    await expect(this.paragraphLocator()).toHaveText(expectedText);
  }
}
