import { type Page } from '@maps/playwright';

class OnlineForm {
  constructor(private readonly page: Page) {}

  get heading() {
    return this.page.getByRole('heading', { name: 'Online form', exact: true });
  }

  get paragraph1() {
    return this.page.getByText('Email us', { exact: true });
  }

  get paragraph2() {
    return this.page.getByText('Reply in 3 working days', { exact: true });
  }

  get button() {
    return this.page.getByRole('link', { name: 'Open online form' });
  }

  get paragraph3() {
    return this.page.getByText(
      `If you'd rather write to us, fill out our online form.`,
      { exact: true },
    );
  }

  get paragraph4() {
    return this.page.getByText(
      `Answer a few questions and then you'll have space to write as much detail as you need.`,
      { exact: true },
    );
  }
}

export default OnlineForm;
