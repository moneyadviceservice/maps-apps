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

  //LOCATORS

  private paragraphLocator(): Locator {
    return this.page.getByTestId(this.paragraphTestID);
  }

  private registerLink(): Locator {
    return this.page.getByRole('link', { name: this.registerLinkName });
  }

  private viewFirmsButton(): Locator {
    return this.page.getByRole('link', { name: this.viewFirmsName });
  }

  //ACTIONS

  async goTo(): Promise<void> {
    await this.page.goto('/');
  }

  async clickRegisterLink(): Promise<void> {
    await this.registerLink().click();
    await this.page.waitForURL('/register');
  }

  async clickViewFirmsButton(): Promise<void> {
    await this.viewFirmsButton().click();
    await this.page.waitForURL('/en/listings');
  }

  //ASSERTIONS

  async assertParagraphContent(expectedText: string): Promise<void> {
    await expect(this.paragraphLocator()).toHaveText(expectedText);
  }
}
