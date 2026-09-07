import { expect, test } from '@playwright/test';

import { selfServeCreds } from '../../data/selfServeCredentials.data';
import { SelfServePage } from '../../pages/SelfServePage';

let selfServePage: SelfServePage;

test.describe('Login', () => {
  test.beforeEach(async ({ page }) => {
    selfServePage = new SelfServePage(page);
    await selfServePage.goto();
    await selfServePage.acceptCookiesIfVisible();
  });

  /**
   * @tests 50485 - header and footer visibility
   */
  test('Content', async () => {
    await test.step('Header & footer is visible', async () => {
      await expect(selfServePage.header()).toBeVisible();
      await expect(selfServePage.footer()).toBeVisible();
    });

    await test.step('Heading', async () => {
      await selfServePage.assertHeading('Login');
    });
  });

  /**
   * @tests 50428 - invalid email
   */
  test('Error - Invalid email', async () => {
    await selfServePage.fillEmailField(selfServeCreds.INVALID_EMAIL);
    await selfServePage.clickLoginButton();
    await expect(selfServePage.errorSummaryHeading()).toHaveText(
      'There is a problem',
    );
    await expect(selfServePage.errorSummaryLink()).toHaveText(
      'Enter a valid email address',
    );
    await expect(selfServePage.inlineEmailError()).toHaveText(
      'Enter a valid email address',
    );
    await expect(selfServePage.otpField()).toBeHidden();
  });

  /**
   * @tests 50429 - unknown email
   */
  test('Error - Unknown user', async () => {
    await selfServePage.fillEmailField(selfServeCreds.UNKNOWN_USER_E2E_EMAIL);
    await selfServePage.clickLoginButton();
    await expect(selfServePage.errorSummaryHeading()).toHaveText(
      'There is a problem',
    );
    await expect(selfServePage.errorSummaryLink()).toHaveText(
      "We couldn't find an account with this email address",
    );
    await expect(selfServePage.inlineEmailError()).toHaveText(
      "We couldn't find an account with this email address",
    );
    await expect(selfServePage.otpField()).toBeHidden();
  });

  /**
   * @tests 50431 - empty email
   */
  test('Error - Empty email', async () => {
    await selfServePage.emailField().clear();
    await selfServePage.clickLoginButton();
    await expect(selfServePage.errorSummaryHeading()).toHaveText(
      'There is a problem',
    );
    await expect(selfServePage.errorSummaryLink()).toHaveText(
      'Enter your email address',
    );
    await expect(selfServePage.inlineEmailError()).toHaveText(
      'Enter your email address',
    );
    await expect(selfServePage.otpField()).toBeHidden();
  });

  /**
   * @tests 51276 - Empty OTP
   */
  test('Error - OTP empty', async () => {
    await selfServePage.fillEmailField(selfServeCreds.ACCOUNT_LOGIN_EMAIL);
    await selfServePage.clickLoginButton();
    await selfServePage.otpField().clear();
    await selfServePage.clickLoginButton();
    await expect(selfServePage.errorSummaryHeading()).toHaveText(
      'There is a problem',
    );
    await expect(selfServePage.errorSummaryLink()).toHaveText(
      'Please enter the one-time passcode',
    );
    await expect(selfServePage.inlineOtpError()).toHaveText(
      'Please enter the one-time passcode',
    );
  });

  /**
   * @tests 51278 - OTP too short
   */
  test('Error - OTP too short', async () => {
    await selfServePage.fillEmailField(selfServeCreds.ACCOUNT_LOGIN_EMAIL);
    await selfServePage.clickLoginButton();
    await selfServePage.fillOtpField('12345');
    await selfServePage.clickLoginButton();
    await expect(selfServePage.errorSummaryHeading()).toHaveText(
      'There is a problem',
    );
    await expect(selfServePage.errorSummaryLink()).toHaveText(
      'Incorrect one-time passcode. Please check the code and try again.',
    );
    await expect(selfServePage.inlineOtpError()).toHaveText(
      'Incorrect one-time passcode. Please check the code and try again.',
    );
  });

  /**
   * @tests 51277 - Invalid OTP
   */
  test('Error - OTP invalid', async () => {
    await selfServePage.fillEmailField(selfServeCreds.ACCOUNT_LOGIN_EMAIL);
    await selfServePage.clickLoginButton();
    await selfServePage.fillOtpField('111111');
    await selfServePage.clickLoginButton();
    await expect(selfServePage.errorSummaryHeading()).toHaveText(
      'There is a problem',
    );
    await expect(selfServePage.errorSummaryLink()).toHaveText(
      'Incorrect one-time passcode. Please check the code and try again.',
    );
    await expect(selfServePage.inlineOtpError()).toHaveText(
      'Incorrect one-time passcode. Please check the code and try again.',
    );
  });

  /**
   * @tests 50430 - error clearing
   */
  test('Error clearing', async () => {
    await test.step('Display error', async () => {
      await selfServePage.fillEmailField(selfServeCreds.INVALID_EMAIL);
      await selfServePage.clickLoginButton();
      await expect(selfServePage.errorSummaryHeading()).toHaveText(
        'There is a problem',
      );
    });

    await test.step('Enter valid email', async () => {
      await selfServePage.fillEmailField(selfServeCreds.ACCOUNT_LOGIN_EMAIL);
      await selfServePage.clickLoginButton();
      await selfServePage.fillOtpField(selfServeCreds.VALID_OTP);
      await selfServePage.clickLoginButton();
      await selfServePage.assertHeading('Main authorised firm');
    });
  });

  /**
   * @tests 50415 - account login
   * @tests 50487 - account logout
   */
  test('Login to firm account - success', async () => {
    await test.step('Login', async () => {
      await selfServePage.fillEmailField(selfServeCreds.ACCOUNT_LOGIN_EMAIL);
      await selfServePage.clickLoginButton();
      await selfServePage.fillOtpField(selfServeCreds.VALID_OTP);
      await selfServePage.clickLoginButton();
    });

    await test.step('Account', async () => {
      await expect(
        selfServePage.headingLocator('Register your firm'),
      ).toBeVisible();
      await expect(
        selfServePage.headingLocator('Main authorised firm'),
      ).toBeVisible();
    });

    await test.step('Sign out', async () => {
      await selfServePage.clickSignOutLink();
      await expect(selfServePage.headingLocator('Login')).toBeVisible();
    });
  });
});
