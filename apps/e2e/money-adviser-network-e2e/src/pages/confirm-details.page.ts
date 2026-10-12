import { Page } from '@lib/test.lib';

import { BasePage } from './base.page';

export class ConfirmDetailsPage extends BasePage {
  constructor(protected readonly page: Page) {
    super(page);
  }

  async goto() {
    throw new Error('You cannot directly navigate to a confirmation page.');
  }

  /**
   * An array of elements which are the customers values chosen in the journey
   */
  private get customersChoicesColumnData() {
    return this.page.locator('form dl dd:nth-of-type(1)');
  }

  get tableCells() {
    return {
      onlineForm: {
        advicePreference: this.customersChoicesColumnData.nth(0),
        firstName: this.customersChoicesColumnData.nth(1),
        lastName: this.customersChoicesColumnData.nth(2),
        email: this.customersChoicesColumnData.nth(3),
      },
      telephoneForm: {
        advicePreference: this.customersChoicesColumnData.nth(0),
        timeslotBooked: this.customersChoicesColumnData.nth(1),
        firstName: this.customersChoicesColumnData.nth(2),
        lastName: this.customersChoicesColumnData.nth(3),
        telephone: this.customersChoicesColumnData.nth(4),
        postCode: this.customersChoicesColumnData.nth(5),
        securityQuestion: this.customersChoicesColumnData.nth(6),
        securityAnswer: this.customersChoicesColumnData.nth(7),
      },
    };
  }

  /**
   * Submit button on the confirm details page.
   */
  get submitButton() {
    return this.page.getByTestId('submit-form');
  }
}
