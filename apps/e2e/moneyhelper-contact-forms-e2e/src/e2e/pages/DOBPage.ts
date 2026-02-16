import { BasePage } from './BasePage';

/**
 * POM class for the date of birth page, containing methods specific to this page and its interactions
 */
export class DOBPage extends BasePage {
  // --- Navigation methods --- //

  /**
   * Navigates to the DOB step by filling in dummy name data and submitting the form on the name page
   */
  async goToDOB() {
    await this.fillTextField('first-name', 'Test');
    await this.fillTextField('last-name', 'User');
    await this.submitForm();
    await this.page.waitForURL(/\/en\/date-of-birth/, { timeout: 20000 });
  }
}
