import { type Page } from '@maps/playwright';
import CommonHelpers from 'src/e2e/utils/commonHelpers';
import CookieConsent from 'src/e2e/utils/cookieConsent';

class WhatsApp {
  private readonly commonHelpers: CommonHelpers;

  constructor(private readonly page: Page, cookieConsent: CookieConsent) {
    this.commonHelpers = new CommonHelpers(page, cookieConsent);
  }

  get heading() {
    return this.page.getByRole('heading', { name: 'WhatsApp', exact: true });
  }

  get paragraph1() {
    return this.page.getByText('Message us', { exact: true });
  }

  get paragraph2() {
    return this.page
      .locator('div.rounded-lg')
      .filter({ has: this.page.getByRole('heading', { name: 'WhatsApp' }) })
      .getByText(/Mon . Fri 9am to 5pm/i);
  }

  get button() {
    return this.page.getByRole('link', {
      name: /\+44 \(0\)7985 740907/i,
    });
  }

  get paragraph3() {
    return this.page.getByText(`Download app: WhatsApp`);
  }

  get paragraph4() {
    return this.page
      .locator('div.rounded-lg')
      .filter({ has: this.page.getByRole('heading', { name: 'WhatsApp' }) })
      .getByText(
        `We'll ask some questions, then connect you with a specialist.`,
        { exact: true },
      );
  }

  get paragraph5() {
    return this.page.getByText(
      `We'll reply between Monday - Friday, 9am to 5pm (except bank holidays).`,
      { exact: true },
    );
  }

  async clickWhatsAppDownloadLink(): Promise<Page> {
    const downloadLink = this.page.getByRole('link', { name: 'WhatsApp' });
    const newPage = await this.commonHelpers.clickLinkAndReturnNewPage(
      downloadLink,
    );
    return newPage;
  }
}

export default WhatsApp;
