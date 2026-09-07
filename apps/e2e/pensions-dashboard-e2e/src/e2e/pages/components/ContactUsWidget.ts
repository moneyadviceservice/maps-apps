import commonHelpers from 'src/e2e/utils/commonHelpers';
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
    return this.page.locator('#widget-root').getByText('Contact us');
  }

  getWhatsAppButton() {
    return this.page.getByRole('button', { name: 'WhatsApp' }).first();
  }

  getCloseButton() {
    return this.page.getByRole('button', { name: 'Close', exact: true });
  }

  getWhatsAppNumberLink() {
    return this.page
      .locator('#widget-root')
      .getByRole('link', { name: '+44 (0)7985' });
  }

  async clickWhatsAppButton(page: Page): Promise<void> {
    await this.getWhatsAppButton().click();
    await page.getByText('Talk to us live using WhatsApp').waitFor();
  }

  async clickWidgetWhatsAppDownloadLink(page: Page): Promise<Page> {
    const downloadLink = page.getByRole('link', {
      name: 'WhatsApp',
      exact: true,
    });
    const newPage = await commonHelpers.clickLinkAndReturnNewPage(
      page,
      downloadLink,
    );
    return newPage;
  }
}

export default ContactUsWidget;
