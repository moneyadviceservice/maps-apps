import { type Page } from '@maps/playwright';

class RelayUK {
  constructor(private readonly page: Page) {}

  get heading() {
    return this.page.getByRole('heading', { name: 'Relay UK', exact: true });
  }

  get dropdownTitle() {
    return this.page
      .getByTestId('summary-block-title')
      .filter({ hasText: 'Use text services' });
  }

  get dropdownText() {
    return this.page
      .getByTestId('contact-us-accessible-option-relay')
      .getByTestId('paragraph');
  }

  get link() {
    return this.page.getByRole('link', { name: /visit relay uk/i });
  }
}

export default RelayUK;
