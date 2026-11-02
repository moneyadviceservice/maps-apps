import { type Page } from '@maps/playwright';

class Interpreter {
  constructor(private readonly page: Page) {}

  get heading() {
    return this.page.getByRole('heading', { name: 'Interpreter', exact: true });
  }

  get dropdownTitle() {
    return this.page
      .getByTestId('summary-block-title')
      .filter({ hasText: 'Help in other languages' });
  }

  get dropdownText() {
    return this.page
      .getByTestId('contact-us-accessible-option-interpreter')
      .getByTestId('paragraph');
  }

  get link() {
    return this.page.getByRole('link', { name: /Call 0800 072 0243/i });
  }
}

export default Interpreter;
