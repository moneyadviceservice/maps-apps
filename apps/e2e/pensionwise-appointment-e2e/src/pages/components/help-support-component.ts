import { Page } from '@lib/test.lib';

export class HelpSupportComponent {
  constructor(private readonly page: Page) {}

  get container() {
    return this.page.locator('[id="help"]');
  }

  get title() {
    return this.container.locator('h5');
  }

  get appointmentLink() {
    return this.container.locator('a');
  }

  get webChatLink() {
    return this.page.locator('[data-testid="custom-web-chat-link"]');
  }

  /**
   * Duplicate functionality of closeWebChat to make tests more readable.
   */
  async startWebChat() {
    await this.webChatLink.click();
  }

  /**
   * Duplicate functionality of startWebChat to make tests more readable.
   */
  async closeWebChat() {
    await this.webChatLink.click();
  }
}
