import { StepName } from '@app/lib/constants';
import { assertErrorSummary, expect, test } from '@mhbf-e2e/lib/test.lib';

test.describe('Pension Provider Page', () => {
  /**
   * @tests 60397 - [AC - Content & Validation] Verify Pension Provider form validation errors for missing inputs
   */
  test('shows field-specific errors when provider names are missing', async ({
    page,
    pensionProviderPage,
  }) => {
    await pensionProviderPage.goToProviderStep();
    await expect(pensionProviderPage.continueButton).toBeEnabled();

    await pensionProviderPage.submitForm();

    await expect(page).toHaveURL(
      `/en/${StepName.ELIGIBILITY_PENSION_PROVIDER}`,
    );
    await assertErrorSummary(page);

    await expect(pensionProviderPage.errorSummaryHeading).toBeVisible();
    await expect(pensionProviderPage.referredFromError).toBeVisible();
    await expect(pensionProviderPage.transferringToError).toBeVisible();
  });

  /**
   * @tests 60398 - [AC - Functionality & Data Integration] Verify successful submission, Redis persistence, and navigation flow
   */
  test('saves provider names, advances, and restores them when going back', async ({
    page,
    pensionProviderPage,
  }) => {
    const referredFrom = 'Current Pension Provider';
    const transferringTo = 'Receiving Pension Provider';

    await pensionProviderPage.goToProviderStep();
    await pensionProviderPage.fillProviders(referredFrom, transferringTo);
    await pensionProviderPage.submitForm();

    await expect(page).toHaveURL(`/en/${StepName.ACCESS_SUPPORT}`, {
      timeout: 20000,
    });

    await pensionProviderPage.clickBack();
    await expect(page).toHaveURL(
      `/en/${StepName.ELIGIBILITY_PENSION_PROVIDER}`,
      { timeout: 20000 },
    );

    await expect(pensionProviderPage.referredFromInput).toHaveValue(
      referredFrom,
    );
    await expect(pensionProviderPage.transferringToInput).toHaveValue(
      transferringTo,
    );

    await pensionProviderPage.clickBack();
    await expect(page).toHaveURL(
      `/en/${StepName.PENSION_SAFEGUARDING_APPOINTMENT}`,
      { timeout: 20000 },
    );
  });
});
