import { FlowName, FormFieldName, StepName } from '@app/lib/constants';
import type { Locator } from '@mhbf-e2e/lib/test.lib';

import { errorSummaryHeading } from '../../helpers';
import { BasePage } from '../BasePage';

export class PensionProviderPage extends BasePage {
  // Inherits constructor(public readonly page: Page) automatically from BasePage

  get referredFromInput(): Locator {
    return this.page.getByRole('textbox', {
      name: 'Which pension provider referred you for Pension Safeguarding Guidance?',
    });
  }

  get transferringToInput(): Locator {
    return this.page.getByRole('textbox', {
      name: 'Which pension provider do you plan to transfer to?',
    });
  }

  get referredFromError(): Locator {
    return this.inlineError(FormFieldName.ELIGIBILITY_REFERRED_FROM);
  }

  get transferringToError(): Locator {
    return this.inlineError(FormFieldName.ELIGIBILITY_TRANSFERRING_TO);
  }

  get errorSummaryHeading(): Locator {
    return this.page.getByTestId(errorSummaryHeading);
  }

  /**
   * Alias for `submitButton` inherited from `BasePage`.
   */
  get continueButton(): Locator {
    return this.submitButton;
  }

  // --- Page Actions --- //

  /**
   * Starts a Pension Safeguarding journey and navigates to the provider step.
   */
  async goToProviderStep(lang = 'en'): Promise<void> {
    await this.page.goto(`/${lang}?aa=${FlowName.PENSION_SAFE_GUARDING}`);
    await this.page.waitForURL(
      `/${lang}/${StepName.PENSION_SAFEGUARDING_APPOINTMENT}`,
    );
    await this.submitForm();
    await this.page.waitForURL(
      `/${lang}/${StepName.ELIGIBILITY_PENSION_PROVIDER}`,
    );
  }

  /**
   * Fills both pension provider input fields.
   */
  async fillProviders(
    referredFrom: string,
    transferringTo: string,
  ): Promise<void> {
    await this.referredFromInput.fill(referredFrom);
    await this.transferringToInput.fill(transferringTo);
  }
}
