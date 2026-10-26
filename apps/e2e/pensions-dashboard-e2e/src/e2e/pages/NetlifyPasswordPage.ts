import { Page } from '@maps/playwright';

class NetlifyPasswordPage {
  constructor(private readonly page: Page) {}

  passwordField() {
    return this.page.getByRole('textbox', { name: 'Password' });
  }

  async enterPassword(password: string) {
    const passwordInput = this.passwordField();
    await passwordInput.waitFor({ state: 'visible' });
    await passwordInput.fill(password);
  }

  async clickSubmit() {
    const submitButton = this.page.getByRole('button', { name: 'Submit' });
    await submitButton.waitFor({ state: 'visible' });
    await submitButton.click();
  }
}

export default NetlifyPasswordPage;
