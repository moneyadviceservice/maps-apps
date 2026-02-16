import { Page } from '@playwright/test';

import { BasePage } from './BasePage';
import { EnquiryTypePage } from './EnquiryTypePage';
import { PensionTypePage } from './PensionTypePage';

/**
 * POM class for the appointment type page, containing methods specific to this page and its interactions
 * Extends BasePage and composes EnquiryTypePage and PensionTypePage to reuse navigation methods
 */
export class AppointmentTypePage extends BasePage {
  enquiryPage: EnquiryTypePage;
  pensionPage: PensionTypePage;

  constructor(page: Page) {
    super(page);
    this.enquiryPage = new EnquiryTypePage(page);
    this.pensionPage = new PensionTypePage(page);
  }

  // --- Navigation methods --- //
  async goToAppointmentType() {
    // Navigate through enquiry type and pension type pages to reach appointment type page
    await this.enquiryPage.goToEnquiryType();
    await this.pensionPage.goToPensionType();
    await this.clickRadio('pensions-appointments');

    await this.submitForm();
    await this.page.waitForURL(/\/en\/appointment-type/, { timeout: 20000 });
  }
}
