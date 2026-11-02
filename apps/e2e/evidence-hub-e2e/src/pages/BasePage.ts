import { expect, type Locator, type Page } from '@playwright/test';

import { dismissCookieBanner } from '../helpers';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(path: string): Promise<void> {
    await this.page.goto(path);
    await dismissCookieBanner(this.page);
  }

  protected headingLocator(text: string): Locator {
    return this.page.getByRole('heading', { name: text, exact: true });
  }

  async clickLink(text: string): Promise<void> {
    const link = this.page.getByRole('link', { name: text });
    await link.waitFor();
    await link.click();
    await this.page.waitForLoadState();
  }

  async assertHeadingContains(text: string): Promise<void> {
    await expect(this.page.locator('h1')).toContainText(text);
  }
}
