import { StepName } from '@app/lib/constants';
import { expect, test } from '@mhbf-e2e/lib/test.lib';
import {
  pensionWiseNotEligibleEntryPoints,
  PensionWiseNotEligiblePage,
} from '@mhbf-e2e/pages/NotEligible';

test.describe('Pension Wise Not Eligible', () => {
  /**
@tests 59393 - Check the "call us on 0800 011 3797" link destination
@tests 59393 - Check the "use our webchat" link visibility and destination
@tests 59393 - Check the "use our online form" link visibility and destination
@tests 59393 - Click the "Back" link at the top of the page ensures the user is routed back to the specific eligibility question page they just answered. (3 possible entries)
   */

  test('telephone link uses the pension specialists dialer destination', async ({
    page,
  }) => {
    const notEligiblePage = new PensionWiseNotEligiblePage(page);

    await notEligiblePage.goToPensionWiseNotEligible(
      StepName.ELIGIBILITY_DEFINED_CONTRIBUTION,
    );

    await expect(notEligiblePage.pensionSpecialistPhoneLink).toHaveAttribute(
      'href',
      'tel:08000113797',
    );
  });

  test('webchat link is visible and uses its configured destination', async ({
    page,
  }) => {
    const notEligiblePage = new PensionWiseNotEligiblePage(page);

    await notEligiblePage.goToPensionWiseNotEligible(
      StepName.ELIGIBILITY_DEFINED_CONTRIBUTION,
    );

    await expect(notEligiblePage.webchatLink).toBeVisible();
    await expect(notEligiblePage.webchatLink).toHaveAttribute(
      'href',
      `/en/${StepName.PENSION_WISE_NOT_ELIGIBLE}#`,
    );
  });

  test('online form link is visible and uses its configured destination', async ({
    page,
  }) => {
    const notEligiblePage = new PensionWiseNotEligiblePage(page);

    await notEligiblePage.goToPensionWiseNotEligible(
      StepName.ELIGIBILITY_DEFINED_CONTRIBUTION,
    );

    await expect(notEligiblePage.onlineFormLink).toBeVisible();
    await expect(notEligiblePage.onlineFormLink).toHaveAttribute(
      'href',
      `/en/${StepName.PENSION_WISE_NOT_ELIGIBLE}#`,
    );
  });

  for (const entryPoint of pensionWiseNotEligibleEntryPoints) {
    test(`Back returns to ${entryPoint}`, async ({ page }) => {
      const notEligiblePage = new PensionWiseNotEligiblePage(page);

      await notEligiblePage.goToPensionWiseNotEligible(entryPoint);
      await notEligiblePage.clickBack();

      await page.waitForURL(`/en/${entryPoint}`, { timeout: 20000 });
      await expect(page).toHaveURL(new RegExp(`/en/${entryPoint}`));
      await expect(notEligiblePage.pageTitle(entryPoint)).toBeVisible();
    });
  }
});
