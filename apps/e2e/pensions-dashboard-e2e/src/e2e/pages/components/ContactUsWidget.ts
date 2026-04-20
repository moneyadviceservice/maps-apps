import { type Page } from '@maps/playwright';

class ContactUsWidget {
  constructor(private readonly page: Page) {}

  getButton() {
    return this.page
      .locator('#contact-us-widget')
      .getByRole('button', { name: 'Open contact us' });
  }

  getWidget() {
    return this.page.getByRole('dialog');
  }

  getHeader() {
    return this.page.getByText('Contact us').first();
  }

  getCloseButton() {
    return this.page.getByRole('button', { name: 'Close', exact: true });
  }
}

export default ContactUsWidget;
