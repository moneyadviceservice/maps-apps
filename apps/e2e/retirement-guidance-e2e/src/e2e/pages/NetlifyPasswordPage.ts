import { Page } from '@playwright/test';

class NetlifyPasswordPage {
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
