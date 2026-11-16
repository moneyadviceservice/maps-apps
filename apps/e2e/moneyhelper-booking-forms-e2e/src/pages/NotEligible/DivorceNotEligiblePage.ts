import { StepName } from '@app/lib/constants';

import { BasePage } from '../BasePage';

export class DivorceNotEligiblePage extends BasePage {
  get title() {
    return this.pageTitle(
      StepName.DIVORCE_NOT_ELIGIBLE,
      'You’re not eligible for a divorce and separation appointment',
    );
  }

  get explanation() {
    return this.page.getByText(
      'You can’t book a divorce and separation appointment if:',
      { exact: true },
    );
  }

  get phoneLink() {
    return this.page.getByRole('link', { name: /0800 011 3797/ });
  }

  get webchatLink() {
    return this.page.getByRole('link', { name: /webchat/i });
  }

  get onlineFormLink() {
    return this.page.getByRole('link', { name: /online form/i });
  }

  get reasonCallout() {
    return this.page.getByText(/agreed a financial settlement/i);
  }

  get openingHours() {
    return this.page.getByText(/between 9am and 5pm/i);
  }

  /**
   * Helper to reach this step through the UI
   */
  async navigateViaJourney(): Promise<void> {
    await this.gotoHome();
    await this.selectAnswerAndContinue('Divorce and separation');
    await this.page.waitForURL(`**/en/${StepName.DIVORCE_APPOINTMENT}`);

    await this.submitForm();
    await this.page.waitForURL(
      `**/en/${StepName.ELIGIBILITY_FINANCIAL_SETTLEMENT}`,
    );

    await this.selectAnswerAndContinue('Yes');
    await this.page.waitForURL(`**/en/${StepName.DIVORCE_NOT_ELIGIBLE}`);
  }
}
