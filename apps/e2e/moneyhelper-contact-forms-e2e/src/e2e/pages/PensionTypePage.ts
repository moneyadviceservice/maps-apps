import { Page } from '@playwright/test';

import { BasePage } from './BasePage';
import { EnquiryTypePage } from './EnquiryTypePage';

/**
 * POM class for the pension type page, containing methods specific to this page and its interactions
 * Extends BasePage and composes EnquiryTypePage to reuse navigation methods
 */
export class PensionTypePage extends BasePage {
  enquiryPage: EnquiryTypePage;

  constructor(page: Page) {
    super(page);
    this.enquiryPage = new EnquiryTypePage(page);
  }

  // --- Navigation methods --- //
  async goToPensionType() {
    await this.enquiryPage.goToEnquiryType();
    // Select 'Pension' option on enquiry type page to navigate to pension type page
    await this.clickRadio('pensions-and-retirement');

    await this.submitForm();
    await this.page.waitForURL(/\/en\/pension-type/, { timeout: 20000 });
  }
}
