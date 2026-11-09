import { ENV } from '@lib/env.lib';
import { Page } from '@lib/test.lib';

export class BasePage {
  constructor(protected readonly page: Page) {}

  async goto(url: string) {
    // Let Playwright resolve relative URLs against the configured baseURL.
    await this.page.goto(url);

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
}
