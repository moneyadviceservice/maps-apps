import { Page } from 'src/lib/test.lib';

export class BasePage {
  constructor(protected readonly page: Page) {}

  get headerTitle() {
    return this.page.getByTestId('toolpage-span-title');
  }

  get pageTitle() {
    return this.page.locator('h1').first();
  }

  get backButton() {
    return this.page.getByTestId('tool-nav-prev');
  }
}
