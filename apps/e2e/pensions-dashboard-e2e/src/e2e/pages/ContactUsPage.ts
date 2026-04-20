import { Page } from '@maps/playwright';

interface ContactUsPage {
  clickContactUs(page: Page): Promise<void>;
  getPageTitle(page: Page);
  getIntroText(page: Page);
  getParagraph(page: Page);
  getHyperlink(page: Page);
  getContactUsFormHeading(page: Page);
  getOnlineFormButton(page: Page);
  getBackButton(page: Page);
  clickHelpAndSupportContactUs(page: Page);
  getBackToTopAnchor(page: Page);
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
    return page.getByTestId('contact-us-intro-paragraph');
  },

  getHyperlink(page: Page) {
    return page.getByRole('link', { name: 'Make a complaint' });
  },

  getContactUsFormHeading(page: Page) {
    return page
      .frameLocator('#contact-us-form')
      .getByRole('heading', { name: 'Get in touch', level: 1 });
  },

  getOnlineFormButton(page: Page) {
    return page.getByTestId('contact-form-button');
  },

  getBackButton(page: Page) {
    return page.getByTestId('back');
  },

  getBackToTopAnchor(page: Page) {
    return page.getByRole('link', { name: 'Back to top' });
  },

  async clickHelpAndSupportContactUs(page: Page): Promise<void> {
    const container = page.getByTestId('help-and-support');
    const link = container.getByRole('link', { name: 'Contact us' });
    await link.click();
    await page.locator('h1:text-is("Contact us")').waitFor();
  },
};

export default contactUsPage;
