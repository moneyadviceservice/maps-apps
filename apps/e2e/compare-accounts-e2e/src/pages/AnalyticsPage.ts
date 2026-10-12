import type { Locator, Page } from '@lib/test.lib';

export class AnalyticsPage {
  readonly page: Page;
  readonly cookieButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cookieButton = page.locator('button', {
      hasText: 'Accept all cookies',
    });
  }

  async goto(path: string) {
    await this.page.goto(path);
  }

  async acceptCookies() {
    await this.cookieButton.click();
  }
}
