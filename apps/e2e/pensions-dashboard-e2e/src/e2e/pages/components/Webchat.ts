import { type Page } from '@maps/playwright';

class Webchat {
  constructor(private readonly page: Page) {}

  get heading() {
    return this.page.getByRole('heading', { name: 'Webchat', exact: true });
  }

  get paragraph1() {
    return this.page.getByText('Chat to us', { exact: true });
  }

  get paragraph2() {
    return this.page
      .locator('div.rounded-lg')
      .filter({ has: this.page.getByRole('heading', { name: 'Webchat' }) })
      .getByText(/Mon . Fri 9am to 5pm/i);
  }

  get button() {
    return this.page.getByRole('button', {
      name: 'Start webchat',
      exact: true,
    });
  }

  get paragraph3() {
    return this.page
      .locator('div.rounded-lg')
      .filter({ has: this.page.getByRole('heading', { name: 'Webchat' }) })
      .getByText('Sat, Sun, bank holidays: closed', {
        exact: true,
      });
  }

  get paragraph4() {
    return this.page
      .locator('div.rounded-lg')
      .filter({ has: this.page.getByRole('heading', { name: 'Webchat' }) })
      .getByText(
        `We'll ask some questions, then connect you with a specialist.`,
        { exact: true },
      );
  }

  get jsErrorMessage() {
    return this.page.getByText(
      'For webchat to work, it’s necessary to enable JavaScript in this browser.',
      { exact: true },
    );
  }
}

export default Webchat;
