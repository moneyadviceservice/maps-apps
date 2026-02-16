/* eslint-disable playwright/expect-expect */
import { test } from '@playwright/test';

import { assertErrorSummary, assertInlineError } from '../helpers';
import { AppointmentTypePage } from '../pages/AppointmentTypePage';
import { ContactDetailsPage } from '../pages/ContactDetailsPage';
import { DOBPage } from '../pages/DOBPage';
import { EnquiryPage } from '../pages/EnquiryPage';
import { NamePage } from '../pages/NamePage';
import { PensionTypePage } from '../pages/PensionTypePage';

test.describe('Enquiry Page Validation', () => {
  let pensionTypePage: PensionTypePage;
  let appointmentTypePage: AppointmentTypePage;
  let namePage: NamePage;
  let dobPage: DOBPage;
  let contactDetailsPage: ContactDetailsPage;
  let enquiryPage: EnquiryPage;

  test.beforeEach(async ({ page }) => {
    await page.context().clearCookies();
    pensionTypePage = new PensionTypePage(page);
    appointmentTypePage = new AppointmentTypePage(page);
    namePage = new NamePage(page);
    dobPage = new DOBPage(page);
    contactDetailsPage = new ContactDetailsPage(page);
    enquiryPage = new EnquiryPage(page);
  });

  test('shows errors for less than minimum characters', async ({ page }) => {
    // Navigate to Enquiry Page via pension type flow
    await pensionTypePage.goToPensionType();
    await namePage.goToName('pensions-guidance');
    await dobPage.goToDOB();
    await contactDetailsPage.goToContactDetails();
    await enquiryPage.goToEnquiry();

    // Fill in enquiry form
    await enquiryPage.fillTextField('text-area', 'a'.repeat(49));
    await enquiryPage.submitForm();

    // Wait for Enquiry Page to reload with validation errors
    await page.waitForURL(/\/en\/enquiry/, { timeout: 20000 });

    // Assert inline error for text-area field
    await assertErrorSummary(page);
    await assertInlineError(page, 'text-area');
  });

  test(`shows error for reference field exceeding character limit`, async ({
    page,
  }) => {
    // Navigate to Enquiry Page via pension type flow which displays the reference field on the enquiry page
    await appointmentTypePage.goToAppointmentType();
    await namePage.goToName('appointment-pension-wise');
    await dobPage.goToDOB();
    await contactDetailsPage.goToContactDetails();
    await enquiryPage.goToEnquiry();

    // Fill in enquiry form and reference field
    await enquiryPage.fillTextField('text-area', 'a'.repeat(50));
    await enquiryPage.fillTextField('booking-reference', 'a'.repeat(51));
    await enquiryPage.submitForm();

    // Wait for Enquiry Page to reload with validation errors
    await page.waitForURL(/\/en\/enquiry/, { timeout: 20000 });

    // Assert inline error for reference field
    await assertErrorSummary(page);
    await assertInlineError(page, 'booking-reference');
  });
});
