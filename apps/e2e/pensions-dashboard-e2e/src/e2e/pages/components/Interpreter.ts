import { type Page } from '@maps/playwright';

class Interpreter {
  constructor(private readonly page: Page) {}

  getHeading() {
    return this.page.getByRole('heading', { name: 'Interpreter', exact: true });
  }

  getDropdownTitle() {
    return this.page
      .getByTestId('summary-block-title')
      .filter({ hasText: 'Help in other languages' });
  }

  getDropdownText() {
    return this.page
      .getByTestId('contact-us-accessible-option-interpreter')
      .getByTestId('paragraph');
  }

  getLink() {
    return this.page.getByRole('link', { name: /Call 0800 072 0243/i });
  }
}

export default Interpreter;
