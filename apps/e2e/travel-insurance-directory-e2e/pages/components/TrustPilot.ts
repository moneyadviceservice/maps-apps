import { type Locator, type Page } from '@playwright/test';

import { BasePage } from '../basePage';

export class TrustPilot extends BasePage {
  businessId = '6307bc8164f919af214eb216';
  templateId = '53aa8807dec7e10d38f59f32';

  //SELECTORS

  private readonly trustpilotWidgetTestId = 'trustpilot-widget';

  constructor(page: Page) {
    super(page);
  }

  //LOCATORS

  trustpilotWidget(): Locator {
    return this.footer().getByTestId(this.trustpilotWidgetTestId);
  }
}
