import { type Page } from '@maps/playwright';

class BSL {
  constructor(private readonly page: Page) {}

  get heading() {
    return this.page.getByRole('heading', { name: 'BSL', exact: true });
  }

  get dropdownTitle() {
    return this.page
      .getByTestId('summary-block-title')
      .filter({ hasText: 'Use sign language' });
  }

  get dropdownText() {
    return this.page
      .getByTestId('contact-us-accessible-option-bsl')
      .getByTestId('paragraph');
  }

  get link() {
    return this.page.getByRole('link', {
      name: /Connect to InterpretersLive!/i,
    });
  }
}

export default BSL;
