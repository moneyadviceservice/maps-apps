import { type Page } from '@maps/playwright';

class Webchat {
  constructor(private readonly page: Page) {}

  getHeading() {
    return this.page.getByRole('heading', { name: 'Webchat', exact: true });
  }

  getParagraph1() {
    return this.page.getByText('Chat to us', { exact: true });
  }

  getParagraph2() {
    return this.page
      .locator('div.rounded-lg')
      .filter({ has: this.page.getByRole('heading', { name: 'Webchat' }) })
      .getByText(/Mon . Fri 9am to 5pm/i);
  }

  getButton() {
    return this.page.getByRole('button', {
      name: 'Start webchat',
      exact: true,
    });
  }

  getParagraph3() {
    return this.page
      .locator('div.rounded-lg')
      .filter({ has: this.page.getByRole('heading', { name: 'Webchat' }) })
      .getByText('Sat, Sun, bank holidays: closed', {
        exact: true,
      });
  }

  getParagraph4() {
    return this.page
      .locator('div.rounded-lg')
      .filter({ has: this.page.getByRole('heading', { name: 'Webchat' }) })
      .getByText(
        `We'll ask some questions, then connect you with a specialist.`,
        { exact: true },
      );
  }

  getJSErrorMessage() {
    return this.page.getByText(
      'For webchat to work, it’s necessary to enable JavaScript in this browser.',
      { exact: true },
    );
  }

  async closeWebchatWindow(page: Page) {
    const chatFrame = page.frameLocator('iframe[title="Messenger"]');
    const clearButton = chatFrame.locator(
      'button[aria-label="Minimize the Messenger"]',
    );
    await clearButton.click();
  }
}

export default Webchat;
