import { BasePage } from './BasePage';

/**
 * POM class for the enquiry type page, containing methods specific to this page and its interactions
 */
export class EnquiryTypePage extends BasePage {
  // --- Navigation methods --- //
  async goToEnquiryType() {
    await this.gotoHome();
    await this.page.getByTestId('guidance-continue-button').click();
    await this.page.waitForURL(/\/en\/enquiry-type/, { timeout: 20000 });
  }
}
