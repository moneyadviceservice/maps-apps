import { Page } from 'src/lib/test.lib';

export class BasePage {
  constructor(protected readonly page: Page) {}

  async goto(url: string) {
    await this.page.goto(url);
  }
}
