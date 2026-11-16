import { StepName } from '@app/lib/constants';
import { expect, test } from '@mhbf-e2e/lib/test.lib';
import { FinancialSettlementPage } from '@mhbf-e2e/pages/Eligibility';
import { DivorceNotEligiblePage } from '@mhbf-e2e/pages/NotEligible';

test.describe('Divorce and Separation - Not Eligible Page', () => {
  test('displays heading, key contact links, and reason', async ({ page }) => {
    const notEligiblePage = new DivorceNotEligiblePage(page);
    await notEligiblePage.navigateViaJourney();

    await expect(page).toHaveURL(
      new RegExp(`/en/${StepName.DIVORCE_NOT_ELIGIBLE}(?:[?#]|$)`),
    );
    await expect(notEligiblePage.title).toBeVisible();
    await expect(notEligiblePage.phoneLink).toBeVisible();
    await expect(notEligiblePage.webchatLink).toBeVisible();
    await expect(notEligiblePage.onlineFormLink).toBeVisible();
    await expect(notEligiblePage.reasonCallout).toBeVisible();
  });

  test('returns to the financial settlement question using Back', async ({
    page,
  }) => {
    const notEligiblePage = new DivorceNotEligiblePage(page);
    const financialSettlementPage = new FinancialSettlementPage(page);
    await notEligiblePage.navigateViaJourney();

    await notEligiblePage.clickBack();

    await expect(page).toHaveURL(
      new RegExp(`/en/${StepName.ELIGIBILITY_FINANCIAL_SETTLEMENT}(?:[?#]|$)`),
    );
    await expect(financialSettlementPage.questionTitle).toBeVisible();
  });
});
