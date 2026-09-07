import { appUrl } from '@lib/env.lib';
import { expect, test } from '@lib/test.lib';
import { mockUserSignUpApi } from '@lib/user-sign-up.mock';

import {
  CONFIRMATION_MESSAGE,
  PART1_FORM_FIELDS,
  PART1_REQUIRED_ERRORS,
  PART1_WEBSITE_URL_ERROR,
  PART2_FORM_FIELDS,
  PART2_REQUIRED_ERRORS,
  PASSWORD_MISMATCH_ERRORS,
} from '../../data/apply-to-use.data';
import { HEADER_LINK, NAV_LINK } from '../../data/nav.data';
import { verifyDataLayer } from '../../utils/verifyDataLayer';

/**
 * @tests 39359: SFS apply-to-use form validation and signup journey
 */
test.describe('Apply to use SFS', () => {
  test.beforeEach(async ({ extendedPage, homePage }) => {
    await extendedPage.gotoHome();
    await expect(homePage.introHeading).toBeVisible();
  });

  test('Using SFS', async ({ homePage, extendedPage }) => {
    await homePage.clickMenuItem(HEADER_LINK.applyToUse);
    await expect(homePage.heading).toHaveText('Apply to use the SFS');

    await verifyDataLayer(
      extendedPage,
      'pageLoadReact',
      appUrl('/en/apply-to-use-the-sfs'),
      {
        page: {
          pageName: 'Apply to use the SFS ',
          pageTitle: 'Apply to use the SFS  | SFS',
          lang: 'en',
          site: 'moneyhelper',
          pageType: 'Category',
          source: 'direct',
          categoryL1: 'Apply to use the SFS ',
          url: appUrl('/en/apply-to-use-the-sfs'),
        },
      },
    );

    await homePage.clickNavLink(NAV_LINK.sfsCodeOfConduct);
    await expect(homePage.heading).toHaveText('SFS Code of Conduct');
    await verifyDataLayer(
      extendedPage,
      'pageLoadReact',
      appUrl('/en/apply-to-use-the-sfs/sfs-code-of-conduct'),
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
          url: appUrl('/en/apply-to-use-the-sfs/sfs-code-of-conduct'),
        },
      },
    );
  });

  test('New Organisation', async ({
    homePage,
    applyToUsePage,
    extendedPage,
  }) => {
    test.setTimeout(25_000);
    await mockUserSignUpApi(extendedPage);

    await homePage.clickMenuItem(HEADER_LINK.applyToUse);
    await expect(homePage.heading).toHaveText('Apply to use the SFS');

    await applyToUsePage.selectRadioButton('new');
    await verifyDataLayer(extendedPage, 'Start', undefined, {
      eventInfo: {
        stepName: 'sfs-application-form',
        reactCompName: 'SFS Application Form New Org',
      },
    });
    await verifyDataLayer(extendedPage, 'formStarted', undefined, {
      eventInfo: {
        stepName: 'in-progress-Part-1',
        reactCompName: 'SFS Application Form New Org',
      },
    });

    await applyToUsePage.expectHeading('Part 1 - Register your');

    await applyToUsePage.submitPart1();

    /**
     * @tests 39641: Testing that validation errors display and correctly link to the relevant form field upon clicking
     */

    await applyToUsePage.expectValidationErrors(PART1_REQUIRED_ERRORS);
    await applyToUsePage.verifyErrorSummaryLinksFocusFields(PART1_FORM_FIELDS);
    await verifyDataLayer(extendedPage, 'errorMessage', undefined, {
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

    await applyToUsePage.fillInput('organisationName', 'org-name');
    await applyToUsePage.fillInput(
      'organisationWebsite',
      'www.test-org-website.com', // should fail Zod `url` validator (WHATWG-parseable URL needs a scheme/protocol (eg. https://) at the front)
    );
    await applyToUsePage.fillInput('organisationStreet', 'business park');
    await applyToUsePage.fillInput('organisationCity', 'city');
    await applyToUsePage.fillInput('organisationPostcode', 'PO1 1CD');
    await applyToUsePage.selectOption('organisationType', 'Software provider');
    await applyToUsePage.selectMultipleCheckbox('geoRegions', [
      'north-west',
      'south-west',
    ]);
    await applyToUsePage.selectOption('organisationUse', 'Provide debt advice');
    await applyToUsePage.selectMultipleCheckbox('debtAdvice', [
      'online',
      'telephone',
    ]);
    await applyToUsePage.selectRadioButton('field-sfslive-false');
    await applyToUsePage.fillInput('sfsLaunchDate', '2027-01-04');
    await applyToUsePage.fillInput('caseManagementSoftware', 'Unknown');
    await applyToUsePage.selectRadioButton('field-fcaReg-fca-yes');
    await applyToUsePage.fillInput('fcaRegNumber', 'Unknown');
    await applyToUsePage.selectMultipleCheckbox('memberships', ['none']);
    await applyToUsePage.submitPart1();

    await applyToUsePage.expectValidationErrors(PART1_WEBSITE_URL_ERROR);
    await verifyDataLayer(extendedPage, 'errorMessage', undefined, {
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
      'organisationWebsite',
      'https://www.test-org-website.com',
    );
    await applyToUsePage.selectRadioButton('field-sfslive-false'); // sfslive input value is reset when page re-renders with validation errors, so need to populate it again for valid submit
    await applyToUsePage.submitPart1();

    await applyToUsePage.expectHeading('Part 2 - Register as a user');
    await verifyDataLayer(extendedPage, 'formStarted', undefined, {
      eventInfo: {
        stepName: 'in-progress-Part-2',
        reactCompName: 'SFS Application Form New Org',
      },
    });

    await applyToUsePage.submitPart2();
    await applyToUsePage.expectValidationErrors(PART2_REQUIRED_ERRORS);
    await applyToUsePage.verifyErrorSummaryLinksFocusFields(
      PART2_FORM_FIELDS,
      true,
    );
    await verifyDataLayer(extendedPage, 'errorMessage', undefined, {
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

    await applyToUsePage.fillInput('firstName', 'Beta');
    await applyToUsePage.fillInput('lastName', 'Alpha');
    await applyToUsePage.fillInput('emailAddress', 'beta@hello.com');
    await applyToUsePage.fillInput('tel', '09876543210');
    await applyToUsePage.fillInput('jobTitle', 'Operations Manager');
    await applyToUsePage.fillInput('password', 'Pa55w0rd!');
    await applyToUsePage.fillInput('confirmPassword', 'Pa55w0rd');
    await applyToUsePage.selectCheckbox('codeOfConduct', 'true');
    await applyToUsePage.submitPart2();

    await applyToUsePage.expectValidationErrors(PASSWORD_MISMATCH_ERRORS);
    await verifyDataLayer(extendedPage, 'errorMessage', undefined, {
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

    await applyToUsePage.fillInput('confirmPassword', 'Pa55w0rd!');
    await applyToUsePage.submitPart2();

    await applyToUsePage.fillInput('otp', '123456');
    await verifyDataLayer(extendedPage, 'formStarted', undefined, {
      eventInfo: {
        stepName: 'in-progress-Part-3',
        reactCompName: 'SFS Application Form New Org',
      },
    });

    /**
     * @tests 39325: Test that aria-describedby for password matches id of password hint
     */

    await applyToUsePage.assertAriaDescribedBy(
      'Password',
      'field-password-hint',
    );

    await applyToUsePage.submitPart2();

    await applyToUsePage.expectConfirmationVisible();
    await expect(applyToUsePage.confirmationCallout).toHaveText(
      CONFIRMATION_MESSAGE,
    );
    await verifyDataLayer(extendedPage, 'formSubmitted', undefined, {
      eventInfo: {
        stepName: 'Complete',
        reactCompName: 'SFS Application Form New Org',
      },
    });
  });

  test('returns to Part 1 when navigating back from Part 2', async ({
    homePage,
    applyToUsePage,
    extendedPage,
  }) => {
    await homePage.clickMenuItem(HEADER_LINK.applyToUse);
    await expect(homePage.heading).toHaveText('Apply to use the SFS');

    await applyToUsePage.selectRadioButton('new');
    await applyToUsePage.expectHeading('Part 1 - Register your');
    await applyToUsePage.fillValidNewOrgPart1();
    await applyToUsePage.submitPart1();

    await applyToUsePage.expectHeading('Part 2 - Register as a user');
    await expect(extendedPage).toHaveURL(/user=true/);
    await expect(extendedPage).toHaveURL(/sign-up-part-2/);

    await extendedPage.goBack();

    await expect(extendedPage).not.toHaveURL(/user=true/);
    await expect(extendedPage).not.toHaveURL(/sign-up-part-2/);
    await applyToUsePage.expectHeading('Part 1 - Register your');
    await expect(
      extendedPage.getByRole('heading', {
        name: 'Part 2 - Register as a user',
      }),
    ).toBeHidden();
    await expect(applyToUsePage.submitOrgButton).toBeVisible();
    await expect(applyToUsePage.submitUserButton).toBeHidden();
  });
});
