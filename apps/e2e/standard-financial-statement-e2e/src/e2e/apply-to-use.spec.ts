import { expect, test } from '@playwright/test';

import { applyToUsePage } from '../pages/ApplyToUsePage';
import { homePage } from '../pages/HomePage';
import { verifyDataLayer } from '../utils/verifyDataLayer';

test.describe('Apply to use SFS', () => {
  test.beforeEach(async ({ page }) => {
    await homePage.disableCookieConsent(page);
    await page.goto('/');
    expect(await homePage.assertHeading(page)).toBe(true);
  });

  test('Using SFS', async ({ page }) => {
    await homePage.clickMenuItem(page, 'Apply to use SFS');
    await expect(await homePage.getHeading(page)).toHaveText(
      'Apply to use the SFS',
    );

    await verifyDataLayer(
      page,
      'pageLoadReact',
      'http://localhost:8888/en/apply-to-use-the-sfs',
      {
        page: {
          pageName: 'Apply to use the SFS ',
          pageTitle: 'Apply to use the SFS  | SFS',
          lang: 'en',
          site: 'moneyhelper',
          pageType: 'Category',
          source: 'direct',
          categoryL1: 'Apply to use the SFS ',
          url: 'http://localhost:8888/en/apply-to-use-the-sfs',
        },
      },
    );

    await expect(await page.screenshot({ fullPage: true })).toMatchSnapshot({
      name: 'Apply-to-use-sfs.png',
      maxDiffPixelRatio: 0.01,
    });

    await homePage.clickNavLink(page, 'SFS Code of Conduct');
    await expect(await homePage.getHeading(page)).toHaveText(
      'SFS Code of Conduct',
    );
    await verifyDataLayer(
      page,
      'pageLoadReact',
      'http://localhost:8888/en/apply-to-use-the-sfs/sfs-code-of-conduct',
      {
        page: {
          pageName: 'SFS Code of Conduct ',
          pageTitle: 'SFS Code of Conduct  | SFS',
          lang: 'en',
          site: 'moneyhelper',
          pageType: 'Sub Category',
          source: 'direct',
          categoryL1: 'Apply to use the SFS',
          categoryL2: 'SFS Code of Conduct ',
          url: 'http://localhost:8888/en/apply-to-use-the-sfs/sfs-code-of-conduct',
        },
      },
    );
    await expect(await page.screenshot({ fullPage: true })).toMatchSnapshot({
      name: 'Sfs-code-of-conduct.png',
      maxDiffPixelRatio: 0.01,
    });
  });

  test('New Organisation', async ({ page }) => {
    test.setTimeout(25_000);
    // Mock the user-sign-up API endpoint for user details and OTP
    await page.route('**/api/user-sign-up', async (route, request) => {
      const postData = request.postDataJSON?.();
      // Mock the first call (user details, no otp)
      if (!postData?.otp) {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            continuation_token: 'mocked-continuation-token',
          }),
        });
      }

      // Mock the OTP call
      if (postData?.otp) {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            message: 'User signed up successfully id token',
            success: true,
            id_token: 'mocked-id-token',
          }),
        });
      }

      // Mock the OTP call
      if (postData?.otp) {
        if (postData?.otp === '123456') {
          return route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              message: 'User signed up successfully id token',
              success: true,
              id_token: 'mocked-id-token',
            }),
          });
        } else {
          return route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              name: 'otp',
              error: 'invalid_grant',
            }),
          });
        }
      }
    });

    await homePage.clickMenuItem(page, 'Apply to use SFS');
    await expect(await homePage.getHeading(page)).toHaveText(
      'Apply to use the SFS',
    );

    await applyToUsePage.selectRadioButton(page, 'new');
    await verifyDataLayer(page, 'Start', undefined, {
      eventInfo: {
        stepName: 'sfs-application-form',
        reactCompName: 'SFS Application Form New Org',
      },
    });
    await verifyDataLayer(page, 'formStarted', undefined, {
      eventInfo: {
        stepName: 'in-progress-Part-1',
        reactCompName: 'SFS Application Form New Org',
      },
    });

    await applyToUsePage.assertHeading(page, 'Part 1 - Register your');

    await applyToUsePage.clickButton(page, 'button[data-testid="signupOrg"]');
    await applyToUsePage.checkValidationErrors(page, [
      {
        fieldName: 'organisationName',
        message: 'Organisation name - This value is required.',
        fieldLevelMessage: 'This value is required.',
      },
      {
        fieldName: 'organisationStreet',
        message: 'Organisation street address - This value is required.',
        fieldLevelMessage: 'This value is required.',
      },
      {
        fieldName: 'organisationCity',
        message: 'Organisation town/city - This value is required.',
        fieldLevelMessage: 'This value is required.',
      },
      {
        fieldName: 'organisationPostcode',
        message: 'Organisation postcode - This value is required.',
        fieldLevelMessage: 'This value is required.',
      },
      {
        fieldName: 'organisationType',
        message: 'What type of organisation are you? - This value is required.',
        fieldLevelMessage: 'This value is required.',
      },
      {
        fieldName: 'geoRegions',
        message:
          'What geographical regions does your services cover? - This value is required.',
        fieldLevelMessage: 'This value is required.',
      },
      {
        fieldName: 'organisationUse',
        message: 'What is your intended use of SFS? - This value is required.',
        fieldLevelMessage: 'This value is required.',
      },
      {
        fieldName: 'debtAdvice',
        message: 'How do you deliver advice? - This value is required.',
        fieldLevelMessage: 'This value is required.',
      },
      {
        fieldName: 'sfslive',
        message: 'Are you live with the SFS? - This value is required.',
        fieldLevelMessage: 'This value is required.',
      },
      {
        fieldName: 'sfsLaunchDate',
        message:
          'SFS Launch date (or estimated launch date) - Please enter a valid date.',
        fieldLevelMessage: 'Please enter a valid date.',
      },
      {
        fieldName: 'fcaReg',
        message:
          'Is your organisation registered with the Financial Conduct Authority? - This value is required.',
        fieldLevelMessage: 'This value is required.',
      },
      {
        fieldName: 'memberships',
        message:
          'If you belong to a trade or membership body, please select from the list below: - This value is required.',
        fieldLevelMessage: 'This value is required.',
      },
    ]);
    await verifyDataLayer(page, 'errorMessage', undefined, {
      eventInfo: {
        toolName: '',
        toolStep: '',
        stepName: '',
        errorDetails: [
          {
            reactCompType: 'FormField',
            reactCompName: 'organisationName',
            errorMessage: 'This value is required.',
          },
          {
            reactCompType: 'FormField',
            reactCompName: 'organisationStreet',
            errorMessage: 'This value is required.',
          },
          {
            reactCompType: 'FormField',
            reactCompName: 'organisationCity',
            errorMessage: 'This value is required.',
          },
          {
            reactCompType: 'FormField',
            reactCompName: 'organisationPostcode',
            errorMessage: 'This value is required.',
          },
          {
            reactCompType: 'FormField',
            reactCompName: 'organisationType',
            errorMessage: 'This value is required.',
          },
          {
            reactCompType: 'FormField',
            reactCompName: 'geoRegions',
            errorMessage: 'This value is required.',
          },
          {
            reactCompType: 'FormField',
            reactCompName: 'organisationUse',
            errorMessage: 'This value is required.',
          },
          {
            reactCompType: 'FormField',
            reactCompName: 'debtAdvice',
            errorMessage: 'This value is required.',
          },
          {
            reactCompType: 'FormField',
            reactCompName: 'sfslive',
            errorMessage: 'This value is required.',
          },
          {
            reactCompType: 'FormField',
            reactCompName: 'sfsLaunchDate',
            errorMessage: 'Please enter a valid date.',
          },
          {
            reactCompType: 'FormField',
            reactCompName: 'fcaReg',
            errorMessage: 'This value is required.',
          },
          {
            reactCompType: 'FormField',
            reactCompName: 'memberships',
            errorMessage: 'This value is required.',
          },
        ],
      },
    });

    await applyToUsePage.fillInput(page, 'organisationName', 'org-name');
    await applyToUsePage.fillInput(
      page,
      'organisationWebsite',
      'www.test-org-website.com',
    );
    await applyToUsePage.fillInput(page, 'organisationStreet', 'business park');
    await applyToUsePage.fillInput(page, 'organisationCity', 'city');
    await applyToUsePage.fillInput(page, 'organisationPostcode', 'PO1 1CD');
    await applyToUsePage.selectOption(
      page,
      'organisationType',
      'Software provider',
    );
    await applyToUsePage.selectMultipleCheckbox(page, 'geoRegions', [
      'north-west',
      'south-west',
    ]);

    await applyToUsePage.selectOption(
      page,
      'organisationUse',
      'Provide debt advice',
    );

    await applyToUsePage.selectMultipleCheckbox(page, 'debtAdvice', [
      'online',
      'telephone',
    ]);

    await applyToUsePage.selectRadioButton(page, 'false');
    await applyToUsePage.fillInput(page, 'sfsLaunchDate', '2027-01-04');
    await applyToUsePage.fillInput(page, 'caseManagementSoftware', 'Unknown');
    await applyToUsePage.selectRadioButton(page, 'fca-yes');
    await applyToUsePage.fillInput(page, 'fcaRegNumber', 'Unknown');
    await applyToUsePage.selectMultipleCheckbox(page, 'memberships', ['none']);
    await applyToUsePage.clickButton(page, 'button[data-testid="signupOrg"]');

    await applyToUsePage.checkValidationErrors(page, [
      {
        fieldName: 'organisationWebsite',
        message:
          'Organisation website address (optional) - Please enter a valid URL.',
        fieldLevelMessage: 'Please enter a valid URL.',
      },
    ]);
    await verifyDataLayer(page, 'errorMessage', undefined, {
      eventInfo: {
        toolName: '',
        toolStep: '',
        stepName: '',
        errorDetails: [
          {
            reactCompType: 'FormField',
            reactCompName: 'organisationWebsite',
            errorMessage: 'Please enter a valid URL.',
          },
        ],
      },
    });

    await applyToUsePage.fillInput(
      page,
      'organisationWebsite',
      'https://www.test-org-website.com',
    );
    await applyToUsePage.selectRadioButton(page, 'false');
    await applyToUsePage.clickButton(page, 'button[data-testid="signupOrg"]');

    await applyToUsePage.assertHeading(page, 'Part 2 - Register as a user');
    await verifyDataLayer(page, 'formStarted', undefined, {
      eventInfo: {
        stepName: 'in-progress-Part-2',
        reactCompName: 'SFS Application Form Active Org',
      },
    });

    await applyToUsePage.clickButton(page, 'button[data-testid="signupUser"]');
    await applyToUsePage.checkValidationErrors(page, [
      {
        fieldName: 'firstName',
        message: 'First name - This value is required.',
        fieldLevelMessage: 'This value is required.',
      },
      {
        fieldName: 'lastName',
        message: 'Surname - This value is required.',
        fieldLevelMessage: 'This value is required.',
      },
      {
        fieldName: 'emailAddress',
        message: 'Email address - This value is required.',
        fieldLevelMessage: 'This value is required.',
      },
      {
        fieldName: 'tel',
        message: 'Telephone Number - This value is required.',
        fieldLevelMessage: 'This value is required.',
      },
      {
        fieldName: 'jobTitle',
        message: 'Job Title - This value is required.',
        fieldLevelMessage: 'This value is required.',
      },
      {
        fieldName: 'password',
        message: 'Password - This value is required.',
        fieldLevelMessage: 'This value is required.',
      },
      {
        fieldName: 'confirmPassword',
        message: 'Confirm Password - This value is required.',
        fieldLevelMessage: 'This value is required.',
      },
      {
        fieldName: 'codeOfConduct',
        message: 'Code of Conduct agreement - This value is required.',
        fieldLevelMessage: 'This value is required.',
      },
    ]);
    await verifyDataLayer(page, 'errorMessage', undefined, {
      eventInfo: {
        toolName: '',
        toolStep: '',
        stepName: '',
        errorDetails: [
          {
            reactCompType: 'FormField',
            reactCompName: 'firstName',
            errorMessage: 'This value is required.',
          },
          {
            reactCompType: 'FormField',
            reactCompName: 'lastName',
            errorMessage: 'This value is required.',
          },
          {
            reactCompType: 'FormField',
            reactCompName: 'emailAddress',
            errorMessage: 'This value is required.',
          },
          {
            reactCompType: 'FormField',
            reactCompName: 'tel',
            errorMessage: 'This value is required.',
          },
          {
            reactCompType: 'FormField',
            reactCompName: 'jobTitle',
            errorMessage: 'This value is required.',
          },
          {
            reactCompType: 'FormField',
            reactCompName: 'password',
            errorMessage: 'This value is required.',
          },
          {
            reactCompType: 'FormField',
            reactCompName: 'confirmPassword',
            errorMessage: 'This value is required.',
          },
          {
            reactCompType: 'FormField',
            reactCompName: 'codeOfConduct',
            errorMessage: 'This value is required.',
          },
        ],
      },
    });
    await applyToUsePage.fillInput(page, 'firstName', 'Beta');
    await applyToUsePage.fillInput(page, 'lastName', 'Alpha');
    await applyToUsePage.fillInput(page, 'emailAddress', 'beta@hello.com');
    await applyToUsePage.fillInput(page, 'tel', '09876543210');
    await applyToUsePage.fillInput(page, 'jobTitle', 'Operations Manager');
    await applyToUsePage.fillInput(page, 'password', 'Pa55w0rd!');
    await applyToUsePage.fillInput(page, 'confirmPassword', 'Pa55w0rd');
    await applyToUsePage.selectCheckbox(page, 'codeOfConduct', 'true');
    await applyToUsePage.clickButton(page, 'button[data-testid="signupUser"]');

    await applyToUsePage.checkValidationErrors(page, [
      {
        fieldName: 'password',
        message:
          'Password - Please ensure your password and password confirmation are identical.',
        fieldLevelMessage:
          'Please ensure your password and password confirmation are identical.',
      },
      {
        fieldName: 'confirmPassword',
        message:
          'Confirm Password - Please ensure your password and password confirmation are identical.',
        fieldLevelMessage:
          'Please ensure your password and password confirmation are identical.',
      },
    ]);
    await verifyDataLayer(page, 'errorMessage', undefined, {
      eventInfo: {
        toolName: '',
        toolStep: '',
        stepName: '',
        errorDetails: [
          {
            reactCompType: 'FormField',
            reactCompName: 'password',
            errorMessage:
              'Please ensure your password and password confirmation are identical.',
          },
          {
            reactCompType: 'FormField',
            reactCompName: 'confirmPassword',
            errorMessage:
              'Please ensure your password and password confirmation are identical.',
          },
        ],
      },
    });

    await applyToUsePage.fillInput(page, 'confirmPassword', 'Pa55w0rd!');
    await applyToUsePage.clickButton(page, 'button[data-testid="signupUser"]');

    await applyToUsePage.fillInput(page, 'otp', '123456');
    await verifyDataLayer(page, 'formStarted', undefined, {
      eventInfo: {
        stepName: 'in-progress-Part-3',
        reactCompName: 'SFS Application Form Active Org',
      },
    });
    await applyToUsePage.clickButton(page, 'button[data-testid="signupUser"]');

    const locator = await applyToUsePage.getConfirmationLocator(page);
    await expect(locator).toHaveText(
      'Thank you for your applicationWe will review the application in the next 10 working days. Once your application has been reviewed you will receive one of the following:An email confirming that your application was successful. This email will also include your SFS Membership NumberAn email request for additional informationAn email confirming rejection of applicationIf you have any questions, please contact us at sfs.support@maps.org.uk',
    );
    await verifyDataLayer(page, 'formSubmitted', undefined, {
      eventInfo: {
        stepName: 'Complete',
        reactCompName: 'SFS Application Form Active Org',
      },
    });
  });
});
