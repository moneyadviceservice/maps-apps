import { Page } from '@maps/playwright';

class PageNotFoundPage {
  constructor(private readonly page: Page) {}

  async clickContactUsLink(): Promise<void> {
    const listContainer = this.page.getByTestId('list-element');
    const contactUsLink = listContainer.getByRole('link', {
      name: 'Contact us',
    });
    await contactUsLink.click();
  }

  get backToTopAnchor() {
    return this.page.getByTestId('back-to-top');
  }

  get helpAndSupportBanner() {
    return this.page.getByTestId('help-and-support');
  }

  get pageTitle() {
    return this.page.getByTestId('page-title');
  }
}

export default PageNotFoundPage;
