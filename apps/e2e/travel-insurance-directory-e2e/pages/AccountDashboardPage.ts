import { type Locator, type Page } from '@playwright/test';

import { BasePage } from './basePage';

export class AccountDashboardPage extends BasePage {
  //SELECTORS
  private readonly mainAuthorisedFirmSectionTestId =
    'main-authorised-firm-section';

  constructor(page: Page) {
    super(page);
  }

  //LOCATORS
  protected mainAuthorisedFirmSection(): Locator {
    return this.page.getByTestId(this.mainAuthorisedFirmSectionTestId);
  }

  coverAndServiceLink(): Locator {
    return this.mainAuthorisedFirmSection().getByRole('link', {
      name: 'Cover and service',
      exact: true,
    });
  }

  customerContactDetailsLink(): Locator {
    return this.mainAuthorisedFirmSection().getByRole('link', {
      name: 'Customer contact details',
      exact: true,
    });
  }

  //ACTIONS
  async clickCoverAndService(): Promise<void> {
    await this.coverAndServiceLink().click();
  }

  async clickCustomerContactDetails(): Promise<void> {
    await this.customerContactDetailsLink().click();
  }
}
