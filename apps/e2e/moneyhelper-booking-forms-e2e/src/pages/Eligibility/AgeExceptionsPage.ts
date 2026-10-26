import { StepName } from '@app/lib/constants';

import { BasePage } from '../BasePage';
import { Over50Page } from './Over50Page';

export const AgeExceptionsAnswer = {
  InheritedPension: 'You have inherited someone else’s pension',
  PoorHealth: 'You are retiring early due to poor health',
  ProtectedPensionAge:
    'Your pension scheme allows early access (protected pension age)',
  None: 'None of these apply',
} as const;

export type AgeExceptionsAnswer =
  (typeof AgeExceptionsAnswer)[keyof typeof AgeExceptionsAnswer];

/**
 * POM class for the eligibility age exceptions page, containing methods specific to this page and its interactions
 */
export class AgeExceptionsPage extends BasePage<AgeExceptionsAnswer> {
  // --- Navigation methods --- //
  async goToEligibilityAgeExceptions() {
    const over50Page = new Over50Page(this.page);

    await over50Page.goToEligibilityOver50();
    await over50Page.selectAnswerAndContinue('No');
    await this.page.waitForURL(`/en/${StepName.ELIGIBILITY_AGE_EXCEPTIONS}`, {
      timeout: 20000,
    });
  }
}
