import { expect, type Locator, type Page } from '@playwright/test';

import { BasePage } from './basePage';

export class HomePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  //SELECTORS

  private readonly paragraphTestID = 'paragraph';

  // LOCATORS

  /**
   * Returns the locator for the main paragraph element.
   * @returns {Locator} The locator for the paragraph.
   */
  private paragraphLocator(): Locator {
    return this.page.getByTestId(this.paragraphTestID);
  }

  // ACTIONS

  /**
   * Navigates the browser to the home page URL.
   */
  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  /**
   * Asserts that the main paragraph content matches the expected text.
   * @param expectedText - The exact text content expected in the paragraph.
   */
  async assertParagraphContent(expectedText: string): Promise<void> {
    await expect(this.paragraphLocator()).toHaveText(expectedText);
  }
}
