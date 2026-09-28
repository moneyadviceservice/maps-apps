import { StepName } from '../lib/constants';
import { BasePage } from './BasePage';

type GoToConfirmationOptions = {
  bookingReference?: string;
};

/**
 * POM class for the confirmation page, containing methods specific to this page and its interactions
 */
export class ConfirmationPage extends BasePage {
  // --- Navigation methods --- //

  /**
   * Navigates to the confirmation page by filling in dummy data and submitting the form on the enquiry page
   * Optionally accepts a booking reference to fill in if the flow requires it (e.g. Pensionwise and Pensions & Divorce)
   * Waits for the loading page and then the confirmation page to load before resolving
   * @param options - Optional parameters for navigating to the confirmation page, such as booking reference
   */
  async goToConfirmation(options?: GoToConfirmationOptions) {
    await this.fillTextField('text-area', 'a'.repeat(50));

    if (options?.bookingReference) {
      await this.fillTextField('booking-reference', options.bookingReference);
    }

    await this.submitForm();
    await this.page.waitForURL(`/en/${StepName.LOADING}`, { timeout: 20000 });
    await this.page.waitForURL(`/en/${StepName.CONFIRMATION}`, {
      timeout: 20000,
    });
  }
}
