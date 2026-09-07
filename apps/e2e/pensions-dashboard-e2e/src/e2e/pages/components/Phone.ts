import { type Page } from '@maps/playwright';

class Phone {
  constructor(private readonly page: Page) {}

  getHeading() {
    return this.page.getByRole('heading', { name: 'Phone', exact: true });
  }

  getParagraph1() {
    return this.page.getByText('Call us', { exact: true });
  }

  getParagraph2() {
    return this.page
      .locator('div.rounded-lg')
      .filter({ has: this.page.getByRole('heading', { name: 'Phone' }) })
      .getByText(/Mon . Fri 9am to 5pm/i);
  }

  getButton() {
    return this.page.getByRole('link', {
      name: /0800 072 0243/i,
    });
  }

  getParagraph3() {
    return this.page
      .locator('div.rounded-lg')
      .filter({ has: this.page.getByRole('heading', { name: 'Phone' }) })
      .getByText('Sat, Sun, bank holidays: closed', {
        exact: true,
      });
  }

  getParagraph4() {
    return this.page.getByText(
      `UK calls are free and may be recorded to improve our service.`,
      { exact: true },
    );
  }
}

export default Phone;
