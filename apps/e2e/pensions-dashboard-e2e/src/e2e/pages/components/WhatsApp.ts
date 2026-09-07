import commonHelpers from 'src/e2e/utils/commonHelpers';
import { type Page } from '@maps/playwright';

class WhatsApp {
  constructor(private readonly page: Page) {}

  getHeading() {
    return this.page.getByRole('heading', { name: 'WhatsApp', exact: true });
  }

  getParagraph1() {
    return this.page.getByText('Message us', { exact: true });
  }

  getParagraph2() {
    return this.page
      .locator('div.rounded-lg')
      .filter({ has: this.page.getByRole('heading', { name: 'WhatsApp' }) })
      .getByText(/Mon . Fri 9am to 5pm/i);
  }

  getButton() {
    return this.page.getByRole('link', {
      name: /\+44 \(0\)7985 740907/i,
    });
  }

  getParagraph3() {
    return this.page.getByText(`Download app: WhatsApp`);
  }

  getParagraph4() {
    return this.page
      .locator('div.rounded-lg')
      .filter({ has: this.page.getByRole('heading', { name: 'WhatsApp' }) })
      .getByText(
        `We'll ask some questions, then connect you with a specialist.`,
        { exact: true },
      );
  }

  getParagraph5() {
    return this.page.getByText(
      `We'll reply between Monday - Friday, 9am to 5pm (except bank holidays).`,
      { exact: true },
    );
  }

  async clickWhatsAppDownloadLink(page: Page): Promise<Page> {
    const downloadLink = page.getByRole('link', { name: 'WhatsApp' });
    const newPage = await commonHelpers.clickLinkAndReturnNewPage(
      page,
      downloadLink,
    );
    return newPage;
  }
}

export default WhatsApp;
