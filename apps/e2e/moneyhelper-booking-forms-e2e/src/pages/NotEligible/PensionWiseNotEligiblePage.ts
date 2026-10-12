import { StepName } from '@app/lib/constants';
import {
  AgeExceptionsPage,
  DefinedContributionPage,
  UKPensionPage,
} from '@pages/Eligibility';

import { BasePage } from '../BasePage';

export const pensionWiseNotEligibleEntryPoints = [
  StepName.ELIGIBILITY_DEFINED_CONTRIBUTION,
  StepName.ELIGIBILITY_UK_PENSIONS,
  StepName.ELIGIBILITY_AGE_EXCEPTIONS,
] as const;

export type PensionWiseNotEligibleEntry =
  (typeof pensionWiseNotEligibleEntryPoints)[number];

/**
 * POM class for the pension wise not eligible page, providing methods to navigate to it from different eligibility entry points.
 */
export class PensionWiseNotEligiblePage extends BasePage {
  // --- Navigation methods --- //
  async goToPensionWiseNotEligible(from: PensionWiseNotEligibleEntry) {
    switch (from) {
      case StepName.ELIGIBILITY_DEFINED_CONTRIBUTION: {
        const page = new DefinedContributionPage(this.page);
        await page.goToEligibilityDefinedContribution();
        await page.selectAnswerAndContinue(
          'No, I have a different type of pension',
        );
        break;
      }

      case StepName.ELIGIBILITY_UK_PENSIONS: {
        const page = new UKPensionPage(this.page);
        await page.goToUKPension();
        await page.selectAnswerAndContinue('No');
        break;
      }

      case StepName.ELIGIBILITY_AGE_EXCEPTIONS: {
        const page = new AgeExceptionsPage(this.page);
        await page.goToEligibilityAgeExceptions();
        await page.selectAnswerAndContinue('None of these apply');
        break;
      }
    }

    await this.page.waitForURL(`/en/${StepName.PENSION_WISE_NOT_ELIGIBLE}`, {
      timeout: 20000,
    });
  }
}
