import { StepName } from '@app/lib/constants';

import type { FinancialSettlementAnswer } from '../../helpers';
import { BasePage } from '../BasePage';

export class FinancialSettlementPage extends BasePage<FinancialSettlementAnswer> {
  get questionTitle() {
    return this.pageTitle(
      StepName.ELIGIBILITY_FINANCIAL_SETTLEMENT,
      'Has a financial settlement already been agreed?',
    );
  }

  /**
   * Targets the specific error link
   */
  get validationErrorLink() {
    return this.errorSummary.getByRole('link', {
      name: /financial settlement/i,
    });
  }

  async goToFinancialSettlement(): Promise<void> {
    const appointmentTypePage = new BasePage(this.page);
    await appointmentTypePage.gotoHome();
    await appointmentTypePage.selectAnswerAndContinue('Divorce and separation');
    await this.page.waitForURL(`**/en/${StepName.DIVORCE_APPOINTMENT}`);

    await this.submitForm();
    await this.page.waitForURL(
      `**/en/${StepName.ELIGIBILITY_FINANCIAL_SETTLEMENT}`,
    );
  }
}
