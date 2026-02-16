import { BasePage } from './BasePage';

/**
 * POM class for the enquiry page, containing methods specific to this page and its interactions
 */
export class EnquiryPage extends BasePage {
  // --- Navigation methods --- //

  /**
   * Navigates to the enquiry page by filling in dummy contact details data and submitting the form on the contact details page
   */
  async goToEnquiry() {
    await this.fillTextField('email', 'test@example.com');
    await this.fillTextField('phone-number', '07123456789');
    await this.fillTextField('post-code', 'SW1A 1AA');
    await this.submitForm();
    await this.page.waitForURL(/\/en\/enquiry/, { timeout: 20000 });
  }
}
