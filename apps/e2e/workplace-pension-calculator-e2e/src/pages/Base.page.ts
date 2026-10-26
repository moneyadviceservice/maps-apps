import { Page } from '@lib/test.lib';

export class BasePage {
  constructor(protected readonly page: Page) {}

  async goto(endpoint = '') {
    await this.page.goto(endpoint);
  }

  get url() {
    return this.page.url();
  }

  getLocatorByText(text: string) {
    return this.page.locator(`text=${text}`);
  }

  async waitForAssetResponse(assetFileName: string) {
    await this.page.waitForResponse(
      (response) =>
        response.url().includes(`/${assetFileName}`) &&
        response.request().method() === 'GET',
    );
  }
}
