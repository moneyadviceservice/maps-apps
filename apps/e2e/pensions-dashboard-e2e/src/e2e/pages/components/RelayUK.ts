import { type Page } from '@maps/playwright';

class RelayUK {
  constructor(private readonly page: Page) {}

  getHeading() {
    return this.page.getByRole('heading', { name: 'Relay UK', exact: true });
  }

  getDropdownTitle() {
    return this.page
      .getByTestId('summary-block-title')
      .filter({ hasText: 'Use text services' });
  }

  getDropdownText() {
    return this.page
      .getByTestId('contact-us-accessible-option-relay')
      .getByTestId('paragraph');
  }

  getLink() {
    return this.page.getByRole('link', { name: /visit relay uk/i });
  }
}

export default RelayUK;
