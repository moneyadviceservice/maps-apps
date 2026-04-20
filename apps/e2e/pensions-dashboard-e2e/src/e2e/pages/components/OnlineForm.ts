import { type Page } from '@maps/playwright';

class OnlineForm {
  constructor(private readonly page: Page) {}

  getHeading() {
    return this.page.getByRole('heading', { name: 'Online form', exact: true });
  }

  getParagraph1() {
    return this.page.getByText('Email us', { exact: true });
  }

  getParagraph2() {
    return this.page.getByText('Get an email reply');
  }

  getHeading2() {
    return this.page.getByText('Send an email using our online form', {
      exact: true,
    });
  }

  getButton() {
    return this.page.getByRole('link', { name: 'Open online form' });
  }

  getParagraph3() {
    return this.page.getByText(
      `If you'd rather write to us, fill out our online form.`,
      { exact: true },
    );
  }

  getParagraph4() {
    return this.page.getByText(
      `Answer a few questions and then you'll have space to write as much detail as you need.`,
      { exact: true },
    );
  }
}

export default OnlineForm;
