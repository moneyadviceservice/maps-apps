import type CommonHelpers from 'src/e2e/utils/commonHelpers';
import { type Page } from '@maps/playwright';

class ContactUsWidget {
  constructor(private readonly page: Page) {}

  get button() {
    return this.page
      .locator('#contact-us-widget')
      .getByRole('button', { name: 'Open contact us' });
  }

  get widget() {
    return this.page.getByRole('dialog');
  }

  get header() {
    return this.page.locator('#widget-root').getByText('Contact us');
  }

  get whatsAppButton() {
    return this.page.getByRole('button', { name: 'WhatsApp' }).first();
  }

  get closeButton() {
    return this.page.getByRole('button', { name: 'Close', exact: true });
  }

  get whatsAppNumberLink() {
    return this.page
      .locator('#widget-root')
      .getByRole('link', { name: '+44 (0)7985' });
  }

  async clickWhatsAppButton(): Promise<void> {
    await this.whatsAppButton.click();
    await this.page.getByText('Talk to us live using WhatsApp').waitFor();
  }

  async clickWidgetWhatsAppDownloadLink(
    commonHelpers: CommonHelpers,
  ): Promise<Page> {
    const downloadLink = this.page.getByRole('link', {
      name: 'WhatsApp',
      exact: true,
    });
    const newPage = await commonHelpers.clickLinkAndReturnNewPage(downloadLink);
    return newPage;
  }
}

export default ContactUsWidget;
