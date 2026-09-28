import { expect, test } from '../../fixtures/selfServeTest';
import {
  REREGISTRATION_SEED_QUERY,
  seedReregistrationAndReturnToAccount,
} from '../../helpers/seedReregistration';
import { RegistrationPage } from '../../pages/RegistrationPage';

test.describe('Re-registration', () => {
  test('Banner — 30-day window shows expiry copy', async ({ page }) => {
    const selfServePage = await seedReregistrationAndReturnToAccount(
      page,
      REREGISTRATION_SEED_QUERY.thirtyDayWindow,
    );

    await expect(
      selfServePage.headingLocator('Main authorised firm'),
    ).toBeVisible();
    await expect(selfServePage.reregistrationHeading()).toBeVisible();
    await expect(selfServePage.reregistrationGetStartedLink()).toBeVisible();
    await expect(selfServePage.reregistrationExpiryText()).toBeVisible();
  });

  test('Banner — past anniversary has no expiry copy', async ({ page }) => {
    const selfServePage = await seedReregistrationAndReturnToAccount(
      page,
      REREGISTRATION_SEED_QUERY.pastAnniversary,
    );

    await expect(
      selfServePage.headingLocator('Main authorised firm'),
    ).toBeVisible();
    await expect(selfServePage.reregistrationHeading()).toBeVisible();
    await expect(selfServePage.reregistrationGetStartedLink()).toBeVisible();
    await expect(selfServePage.reregistrationExpiryText()).toBeHidden();
  });

  test('Drop-off and resume mid-flow', async ({ page }) => {
    const selfServePage = await seedReregistrationAndReturnToAccount(
      page,
      REREGISTRATION_SEED_QUERY.thirtyDayWindow,
    );
    const registrationPage = new RegistrationPage(page);

    await expect(
      selfServePage.headingLocator('Main authorised firm'),
    ).toBeVisible();

    await test.step('Start re-registration and advance past step1', async () => {
      await selfServePage.clickReregistrationGetStarted();
      await registrationPage.expectNavigationTo('/register/firm/step1');
      await expect(
        registrationPage.headingLocator('Are your customers covered?'),
      ).toBeVisible();
      await registrationPage.clickYesRadioButton();
      await registrationPage.clickContinueButton();
      await registrationPage.expectNavigationTo('/register/firm/step2');
      await expect(
        registrationPage.headingLocator(
          'How does your firm assess medical risk?',
        ),
      ).toBeVisible();
    });

    await test.step('Return to account and resume', async () => {
      await page.goto('/account');
      await expect(
        selfServePage.headingLocator('Main authorised firm'),
      ).toBeVisible();
      await expect(selfServePage.reregistrationHeading()).toBeVisible();
      await expect(selfServePage.reregistrationResumeLink()).toBeVisible();
      await expect(selfServePage.reregistrationGetStartedLink()).toBeHidden();

      await selfServePage.clickReregistrationResume();
      await registrationPage.expectNavigationTo('/register/firm/step2');
      await expect(
        registrationPage.headingLocator(
          'How does your firm assess medical risk?',
        ),
      ).toBeVisible();
    });
  });

  test('Successful renew clears account banner', async ({ page }) => {
    const selfServePage = await seedReregistrationAndReturnToAccount(
      page,
      REREGISTRATION_SEED_QUERY.thirtyDayWindow,
    );
    const registrationPage = new RegistrationPage(page);

    await expect(
      selfServePage.headingLocator('Main authorised firm'),
    ).toBeVisible();

    await test.step('Start draft then confirm', async () => {
      await selfServePage.clickReregistrationGetStarted();
      await registrationPage.expectNavigationTo('/register/firm/step1');
      await page.goto('/register/confirm-details');
      await expect(
        registrationPage.headingLocator('Confirm details'),
      ).toBeVisible();
      await registrationPage.submitForm();
      await registrationPage.expectNavigationTo('/register/success');
    });

    await test.step('Account banner is gone', async () => {
      await page.goto('/account');
      await expect(
        selfServePage.headingLocator('Main authorised firm'),
      ).toBeVisible();
      await expect(selfServePage.reregistrationHeading()).toBeHidden();
      await expect(selfServePage.reregistrationExpiryText()).toBeHidden();
    });
  });
});
