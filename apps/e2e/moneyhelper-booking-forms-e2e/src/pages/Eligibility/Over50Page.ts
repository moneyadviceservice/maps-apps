import { StepName } from '@app/lib/constants';

import { BasePage } from '../BasePage';
import { DefinedContributionPage } from './DefinedContributionPage';

export type Over50Answer = 'Yes' | 'No';

/**
 * POM class for the eligibility over 50 page, containing methods specific to this page and its interactions
 */
export class Over50Page extends BasePage<Over50Answer> {
  // --- Navigation methods --- //
  async goToEligibilityOver50() {
    const definedContributionPage = new DefinedContributionPage(this.page);

    await definedContributionPage.goToEligibilityDefinedContribution();
    await definedContributionPage.selectAnswerAndContinue('Yes');
    await this.page.waitForURL(`/en/${StepName.ELIGIBILITY_OVER_50}`, {
      timeout: 20000,
    });
  }
}
