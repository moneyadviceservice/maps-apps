import { Page } from '@lib/test.lib';

export class BasePage {
  constructor(protected readonly page: Page) {}

  get pageTitle() {
    return this.page.locator('#mortgage-calculator');
  }
}
