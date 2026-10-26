import { type Page } from '@maps/playwright';

class BetaBanner {
  constructor(private readonly page: Page) {}

  get banner() {
    return this.page.getByTestId('phase-banner');
  }

  get link() {
    return this.banner.getByRole('link');
  }
}

export default BetaBanner;
