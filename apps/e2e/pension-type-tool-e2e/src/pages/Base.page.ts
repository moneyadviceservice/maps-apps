import { Page } from '@lib/test.lib';

export class BasePage {
  constructor(protected readonly page: Page) {}

  async goto(url: string) {
    // If URL is relative, construct absolute URL with baseURL
    if (url.startsWith('/')) {
      const baseURL = 'http://localhost:4303';
      await this.page.goto(`${baseURL}${url}`);
    } else {
      await this.page.goto(url);
    }
  }
}
