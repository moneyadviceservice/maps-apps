import { BasePage } from './BasePage';

/**
 * POM class for the contact details page, containing methods specific to this page and its interactions
 */
export class ContactDetailsPage extends BasePage {
  // --- Navigation methods --- //

  /**
   * Navigates to the contact details page by filling in dummy dob data and submitting the form on the dob page
   */
  async goToContactDetails() {
    await this.fillTextField('day', '01');
    await this.fillTextField('month', '01');
    await this.fillTextField('year', '1990');
    await this.submitForm();
    await this.page.waitForURL(/\/en\/contact-details/, { timeout: 20000 });
  }
}
