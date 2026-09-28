import { Page } from '@lib/test.lib';

import { HelpSupportComponent } from './components/help-support-component';

export class BasePage {
  public webChatComponent: HelpSupportComponent;

  constructor(protected readonly page: Page) {
    this.webChatComponent = new HelpSupportComponent(page);
  }

  async goto(path = '') {
    await this.page.goto(path);
  }

  get acceptAllCookiesButton() {
    return this.page.locator('#ccc-notify-accept');
  }

  get pageTitle() {
    return this.page.getByTestId('page-title');
  }

  get sectionTitle() {
    return this.page.getByTestId('section-title');
  }

  get heroTitle() {
    return this.page.getByTestId('hero-title');
  }

  /**
   * Used to click the main content to trigger an update for analytics to load.
   */
  get body() {
    return this.page.locator('body');
  }
}
