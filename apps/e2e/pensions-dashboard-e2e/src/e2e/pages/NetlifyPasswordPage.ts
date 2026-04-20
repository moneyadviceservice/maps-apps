import { Page } from '@maps/playwright';

class NetlifyPasswordPage {
  passwordField(page: Page) {
    return page.getByRole('textbox', { name: 'Password' });
  }

  async enterPassword(page: Page, password: string) {
    const passwordInput = this.passwordField(page);
    await passwordInput.waitFor({ state: 'visible' });
    await passwordInput.fill(password);
  }

  async clickSubmit(page: Page) {
    const submitButton = page.getByRole('button', { name: 'Submit' });
    await submitButton.waitFor({ state: 'visible' });
    await submitButton.click();
  }
}

export const netlifyPasswordPage = new NetlifyPasswordPage();
