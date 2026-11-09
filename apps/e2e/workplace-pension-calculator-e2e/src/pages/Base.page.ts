import { ENV } from '@lib/env.lib';
import { Page } from '@lib/test.lib';

export class BasePage {
  constructor(protected readonly page: Page) {}

  async goto(endpoint = '') {
    await this.page.goto(endpoint);

    const passwordField = this.page.getByRole('textbox', { name: 'Password' });
    if (!(await passwordField.isVisible().catch(() => false))) {
      return;
    }

    const password = ENV.HTTP_PASSWORD;
    if (!password) {
      throw new Error(
        'This site requires a Netlify password. Set HTTP_PASSWORD in the environment or .env.local.',
      );
    }

    await passwordField.fill(password);
    await this.page.getByRole('button', { name: 'Submit' }).click();
    await this.page.waitForLoadState('domcontentloaded');
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
