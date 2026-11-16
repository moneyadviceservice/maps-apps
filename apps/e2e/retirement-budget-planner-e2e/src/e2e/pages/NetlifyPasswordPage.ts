import { Page } from '@playwright/test';

class NetlifyPasswordPage {
  async goto(page: Page, endpoint: string) {
    await page.goto(endpoint);

    const passwordField = page.getByPlaceholder('Password');
    if (!(await passwordField.isVisible())) return;

    const password = process.env['HTTP_PASSWORD'];
    if (!password) {
      throw new Error(
        'This deployment is password protected. Set HTTP_PASSWORD in the environment or the Retirement Budget Planner E2E .env.local file.',
      );
    }

    await this.enterPassword(page, password);
    await this.clickSubmit(page);
    await page.waitForLoadState('domcontentloaded');
  }

  async enterPassword(page: Page, password: string) {
    const passwordField = page.getByPlaceholder('Password');
    await passwordField.waitFor({ state: 'visible' });
    await passwordField.fill(password);
  }

  async clickSubmit(page: Page) {
    const submitButton = page.getByRole('button', { name: 'Submit' });
    await submitButton.waitFor({ state: 'visible' });
    await submitButton.click();
  }
}

export const netlifyPasswordPage = new NetlifyPasswordPage();
