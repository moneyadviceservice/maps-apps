import { StepName } from '@app/lib/constants';
import { Over50Page } from '@pages/Eligibility';

import { BasePage } from '../BasePage';

export type UKPensionAnswer = 'Yes' | 'No';

/**
 * POM class for the eligibility UK pension page, containing methods specific to this page and its interactions
 */
export class UKPensionPage extends BasePage<UKPensionAnswer> {
  // --- Navigation methods --- //
  async goToUKPension() {
    const over50Page = new Over50Page(this.page);

    await over50Page.goToEligibilityOver50();
    await over50Page.selectAnswerAndContinue('Yes');
    await this.page.waitForURL(`/en/${StepName.ELIGIBILITY_UK_PENSIONS}`, {
      timeout: 20000,
    });
  }
}
