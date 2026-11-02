import { StepName } from '@app/lib/constants';
import { expect, test } from '@mhbf-e2e/lib/test.lib';

test.describe('Pension Safeguarding Landing Page', () => {
  test.beforeEach(async ({ safeguardingLandingPage }) => {
    // Navigate directly to the landing page before each scenario
    await safeguardingLandingPage.goTo();
  });

  /**
   * @tests 60401 - [AC 1] Verify Safeguarding Landing Page Content
   */
  test('displays correct initial content', async ({
    safeguardingLandingPage,
  }) => {
    await expect(safeguardingLandingPage.heading).toBeVisible();
    await expect(safeguardingLandingPage.bookAppointmentButton).toBeVisible();
    await expect(safeguardingLandingPage.findAppointmentLink).toBeVisible();
    await expect(safeguardingLandingPage.privacyNoticeLink).toBeVisible();
  });

  /**
   * @tests 60401 - [AC 3] Verify Privacy Notice Navigation
   */
  test('opens the current placeholder destination from the Privacy Notice link', async ({
    page,
    safeguardingLandingPage,
  }) => {
    const [privacyPage] = await Promise.all([
      page.waitForEvent('popup'),
      safeguardingLandingPage.privacyNoticeLink.click(),
    ]);

    // TODO: Update the expected URL once the destination is fully implemented
    await expect(privacyPage).toHaveURL(
      new RegExp(`/en/${StepName.PENSION_SAFEGUARDING_APPOINTMENT}#$`),
    );

    await privacyPage.close();
  });

  /**
   * @tests 60401 - [AC 4, AC 6] Verify Booking Flow Entry and Back Navigation
   */
  test('navigates to booking flow and back to landing page', async ({
    page,
    pensionProviderPage,
    safeguardingLandingPage,
  }) => {
    await safeguardingLandingPage.bookAppointmentButton.click();
    await expect(page).toHaveURL(
      new RegExp(`/en/${StepName.ELIGIBILITY_PENSION_PROVIDER}`),
    );
    await expect(pensionProviderPage.referredFromInput).toBeVisible();

    await pensionProviderPage.clickBack();
    await expect(page).toHaveURL(
      new RegExp(`/en/${StepName.PENSION_SAFEGUARDING_APPOINTMENT}`),
    );
    await expect(safeguardingLandingPage.heading).toBeVisible();
  });

  /**
   * @tests 60401 - [AC 5] Verify Find Appointment Navigation
   */
  test('navigates to the Find Appointment page', async ({
    page,
    safeguardingLandingPage,
  }) => {
    await safeguardingLandingPage.findAppointmentLink.click();
    await expect(page).toHaveURL(
      new RegExp(`/en/${StepName.FIND_APPOINTMENT}`),
    );
  });
});
