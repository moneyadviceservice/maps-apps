import { StepName } from '@app/lib/constants';
import { assertErrorSummary, expect, test } from '@mhbf-e2e/lib/test.lib';
import { FinancialSettlementPage } from '@mhbf-e2e/pages/Eligibility';

import { financialSettlementAnswers } from '../../helpers';

const answerRoutes = [
  {
    answer: financialSettlementAnswers.YES,
    nextStep: StepName.DIVORCE_NOT_ELIGIBLE,
  },
  {
    answer: financialSettlementAnswers.NO,
    nextStep: StepName.ELIGIBILITY_DIVORCE_JURISDICTION,
  },
  {
    answer: financialSettlementAnswers.NOT_SURE,
    nextStep: StepName.ELIGIBILITY_DIVORCE_JURISDICTION,
  },
] as const;

test.describe('Financial Settlement Eligibility', () => {
  for (const { answer, nextStep } of answerRoutes) {
    test(`continues to ${nextStep} when "${answer}" is selected`, async ({
      page,
    }) => {
      const financialSettlementPage = new FinancialSettlementPage(page);
      await financialSettlementPage.goToFinancialSettlement();

      await expect(financialSettlementPage.questionTitle).toBeVisible();
      await financialSettlementPage.selectAnswerAndContinue(answer);

      await expect(page).toHaveURL(`/en/${nextStep}`);
      await expect(financialSettlementPage.pageTitle(nextStep)).toBeVisible();
    });
  }

  test('shows a validation error when continuing without selecting an answer', async ({
    page,
  }) => {
    const financialSettlementPage = new FinancialSettlementPage(page);
    await financialSettlementPage.goToFinancialSettlement();

    await expect(financialSettlementPage.submitButton).toBeEnabled();
    await financialSettlementPage.submitForm();

    await expect(page).toHaveURL(
      `/en/${StepName.ELIGIBILITY_FINANCIAL_SETTLEMENT}`,
    );
    await assertErrorSummary(page);
    await expect(financialSettlementPage.validationErrorLink).toBeVisible();
    await expect(financialSettlementPage.submitButton).toBeEnabled();
  });
});
