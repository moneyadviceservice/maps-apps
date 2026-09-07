import { type Page } from '@maps/playwright';

class BSL {
  constructor(private readonly page: Page) {}

  getHeading() {
    return this.page.getByRole('heading', { name: 'BSL', exact: true });
  }

  getDropdownTitle() {
    return this.page
      .getByTestId('summary-block-title')
      .filter({ hasText: 'Use sign language' });
  }

  getDropdownText() {
    return this.page
      .getByTestId('contact-us-accessible-option-bsl')
      .getByTestId('paragraph');
  }

  getLink() {
    return this.page.getByRole('link', {
      name: /Connect to InterpretersLive!/i,
    });
  }
}

export default BSL;
