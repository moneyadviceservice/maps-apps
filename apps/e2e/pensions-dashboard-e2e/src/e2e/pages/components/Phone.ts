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

  getHeading2() {
    return this.page.getByText('Talk to us by phone', { exact: true });
  }

  getButton1() {
    return this.page.getByRole('link', {
      name: /English \(UK\): 0800 072 0243/i,
    });
  }

  getButton2() {
    return this.page.getByRole('link', {
      name: /Cymraeg \(DU\): 0800 072 0263/i,
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
