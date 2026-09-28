import { Page } from 'src/lib/test.lib';

export class BasePage {
  constructor(protected readonly page: Page) {}

  async getTab(tab: string) {
    return this.page.locator(`button[role="tab"][aria-controls="${tab}"]`);
  }

  get continueButton() {
    return this.page.locator('.tool-nav-submit');
  }

  get saveAndComeBackLater() {
    return this.page.locator('.t-save-and-return');
  }
}
