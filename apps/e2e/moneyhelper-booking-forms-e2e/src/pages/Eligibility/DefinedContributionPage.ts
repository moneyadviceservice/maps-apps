import { FlowName, StepName } from '@app/lib/constants';

import { BasePage } from '../BasePage';

export type DefinedContributionAnswer =
  | 'Yes'
  | 'Not sure'
  | 'No, I have a different type of pension';

/**
 * POM class for the eligibility defined contribution page, containing methods specific to this page and its interactions
 */
export class DefinedContributionPage extends BasePage<DefinedContributionAnswer> {
  // --- Navigation methods --- //
  async goToEligibilityDefinedContribution() {
    await this.gotoHome(`?aa=${FlowName.PENSION_WISE}`);
    await this.page.waitForURL(
      `/en/${StepName.ELIGIBILITY_DEFINED_CONTRIBUTION}`,
      {
        timeout: 20000,
      },
    );
  }
}
