import { Page } from '@maps/playwright';

interface ContactUsPage {
  clickContactUs(page: Page): Promise<void>;
  getPageTitle(page: Page);
  getIntroText(page: Page);
  getParagraph(page: Page);
  getHyperlink(page: Page);
  getContactUsFormHeading(page: Page);
  clickHelpAndSupportContactUs(page: Page);
}

const contactUsPage: ContactUsPage = {
  async clickContactUs(page: Page): Promise<void> {
    await page.getByTestId('welcome-button').click();
  },

  getPageTitle(page: Page) {
    return page.getByTestId('page-title');
  },

  getIntroText(page: Page) {
    return page.getByTestId('tool-intro');
  },

  getParagraph(page: Page) {
    return page.getByTestId('paragraph').nth(2);
  },

  getHyperlink(page: Page) {
    return page.getByRole('link', { name: 'Make a complaint' });
  },

  getContactUsFormHeading(page: Page) {
    return page
      .frameLocator('#contact-us-form')
      .getByRole('heading', { name: 'Get in touch', level: 1 });
  },

  async clickHelpAndSupportContactUs(page: Page): Promise<void> {
    const container = page.getByTestId('help-and-support');
    const link = container.getByRole('link', { name: 'Contact us' });
    await link.click();
    await page.locator('h1:text-is("Contact us")').waitFor();
  },
};

export default contactUsPage;
