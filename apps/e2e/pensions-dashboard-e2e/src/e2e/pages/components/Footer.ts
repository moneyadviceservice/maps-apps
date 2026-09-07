import { type Locator, type Page } from '@maps/playwright';

class Footer {
  constructor(private readonly page: Page) {}

  getCookiesLink(): Locator {
    return this.page.getByRole('link', { name: 'Cookies' });
  }
}

export default Footer;
