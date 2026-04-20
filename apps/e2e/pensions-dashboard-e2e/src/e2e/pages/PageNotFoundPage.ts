import { Page } from '@maps/playwright';

interface PageNotFoundPage {
  clickContactUsLink(page: Page): Promise<void>;
  getBackToTopAnchor(page: Page);
  getHelpAndSupportBanner(page: Page);
  getPageTitle(page: Page);
}

const pageNotFoundPage: PageNotFoundPage = {
  async clickContactUsLink(page: Page): Promise<void> {
    const listContainer = page.getByTestId('list-element');
    const contactUsLink = listContainer.getByRole('link', {
      name: 'Contact us',
    });
    await contactUsLink.click();
  },

  getBackToTopAnchor(page: Page) {
    return page.getByTestId('back-to-top');
  },

  getHelpAndSupportBanner(page: Page) {
    return page.getByTestId('help-and-support');
  },

  getPageTitle(page: Page) {
    return page.getByTestId('page-title');
  },
};

export default pageNotFoundPage;
