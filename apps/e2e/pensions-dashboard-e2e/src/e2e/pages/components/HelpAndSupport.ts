import { type Locator, type Page } from '@maps/playwright';

class HelpAndSupport {
  constructor(private readonly page: Page) {}

  get component(): Locator {
    return this.page.getByTestId('help-and-support');
  }

  get button(): Locator {
    return this.page.getByTestId('help-and-support-banner-cta');
  }
}

export default HelpAndSupport;
