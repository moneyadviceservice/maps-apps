/* eslint-disable playwright/expect-expect */
import { test } from '@playwright/test';

import { assertErrorSummary, assertInlineError } from '../helpers';
import { AppointmentTypePage } from '../pages/AppointmentTypePage';
import { ContactDetailsPage } from '../pages/ContactDetailsPage';
import { DOBPage } from '../pages/DOBPage';
import { NamePage } from '../pages/NamePage';
import { PensionTypePage } from '../pages/PensionTypePage';

const phoneNumber = '07123456789';
const email = 'test@example.com';
const postCode = 'SW1A 1AA';
const phoneNotRequiredFieldCases = [
  {
    desc: 'invalid email',
    data: {
      email: 'not-an-email',
      'phone-number': phoneNumber,
      'post-code': postCode,
    },
    expectErrors: ['email'],
  },
  {
    desc: 'missing email',
    data: {
      email: '',
      'phone-number': phoneNumber,
      'post-code': postCode,
    },
    expectErrors: ['email'],
  },
  {
    desc: 'invalid phone number',
    data: {
      email,
      'phone-number': 'abc',
      'post-code': postCode,
    },
    expectErrors: ['phone-number'],
  },
];
const phoneRequiredFieldCases = [
  {
    desc: 'missing phone number',
    data: {
      email,
      'phone-number': '',
      'post-code': postCode,
    },
    expectErrors: ['phone-number'],
  },
  {
    desc: 'missing email and phone number',
    data: {
      email: '',
      'phone-number': '',
      'post-code': '',
    },
    expectErrors: ['email', 'phone-number'],
  },
];

test.describe('Contact Details Page Validation', () => {
  let namePage: NamePage;
  let dobPage: DOBPage;
  let contactDetailsPage: ContactDetailsPage;

  test.beforeEach(async ({ page }) => {
    await page.context().clearCookies();
    namePage = new NamePage(page);
    dobPage = new DOBPage(page);
    contactDetailsPage = new ContactDetailsPage(page);
  });

  phoneNotRequiredFieldCases.forEach(({ desc, data, expectErrors }) => {
    test(`shows errors for ${desc}`, async ({ page }) => {
      const pensionTypePage = new PensionTypePage(page);

      // Navigate to Contact Details page via pension type flow
      await pensionTypePage.goToPensionType();
      await namePage.goToName('pensions-guidance');
      await dobPage.goToDOB();
      await contactDetailsPage.goToContactDetails();

      // Fill in Contact Details fields per scenario
      await contactDetailsPage.fillTextField('email', data.email);
      await contactDetailsPage.fillTextField(
        'phone-number',
        data['phone-number'],
      );
      await contactDetailsPage.fillTextField('post-code', data['post-code']);
      await contactDetailsPage.submitForm();

      // Wait for Contact Details page to reload with validation errors
      await page.waitForURL(/\/en\/contact-details/, { timeout: 20000 });

      // Assert inline errors for all relevant fields in this scenario - this approach avoids conditional logic in the test and keeps it data-driven
      await assertErrorSummary(page);
      for (const field of expectErrors) {
        await assertInlineError(page, field);
      }
    });
  });

  phoneRequiredFieldCases.forEach(({ desc, data, expectErrors }) => {
    test(`shows errors for ${desc} when flow requires phone number`, async ({
      page,
    }) => {
      const appointmentTypePage = new AppointmentTypePage(page);

      // Navigate to Contact Details page via appointment type flow which requires phone number
      await appointmentTypePage.goToAppointmentType();
      await namePage.goToName('appointment-pension-wise');
      await dobPage.goToDOB();
      await contactDetailsPage.goToContactDetails();

      // Fill in Contact Details fields with missing phone number
      await contactDetailsPage.fillTextField('email', data.email);
      await contactDetailsPage.fillTextField(
        'phone-number',
        data['phone-number'],
      );
      await contactDetailsPage.fillTextField('post-code', data['post-code']);
      await contactDetailsPage.submitForm();

      // Wait for Contact Details page to reload with validation errors
      await page.waitForURL(/\/en\/contact-details/, { timeout: 20000 });

      // Assert inline error for phone number field
      await assertErrorSummary(page);
      for (const field of expectErrors) {
        await assertInlineError(page, field);
      }
    });
  });
});
