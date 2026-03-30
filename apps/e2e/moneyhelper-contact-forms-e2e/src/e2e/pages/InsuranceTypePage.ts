import { Page } from '@playwright/test';

import { FlowName, StepName } from '../lib/constants';
import { BasePage } from './BasePage';
import { EnquiryTypePage } from './EnquiryTypePage';

/**
 * POM class for the insurance type page, containing methods specific to this page and its interactions
 * Extends BasePage and composes EnquiryTypePage to reuse navigation methods
 */
export class InsuranceTypePage extends BasePage {
  enquiryPage: EnquiryTypePage;

  constructor(page: Page) {
    super(page);
    this.enquiryPage = new EnquiryTypePage(page);
  }

  // --- Navigation methods --- //
  async goToInsuranceType() {
    await this.enquiryPage.goToEnquiryType();
    // Select 'Insurance' option on enquiry type page to navigate to insurance type page
    await this.clickRadio(FlowName.INSURANCE);
    await this.submitForm();
    await this.page.waitForURL(`/en/${StepName.INSURANCE_TYPE}`, {
      timeout: 20000,
    });
  }
}
