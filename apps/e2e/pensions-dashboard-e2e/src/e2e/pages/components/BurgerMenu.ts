import { type Locator, type Page } from '@maps/playwright';

class BurgerMenu {
  constructor(private readonly page: Page) {}

  get helpAndSupportLink(): Locator {
    return this.page.getByTestId('help-and-support-link');
  }
}

export default BurgerMenu;
