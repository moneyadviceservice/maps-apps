/* eslint-disable playwright/expect-expect */
import { expect, test } from '@playwright/test';

import { FlowName, StepName } from '../lib/constants';
import { EXPECTED_CASE_REFS } from '../mocks/mock-data';
import { AppointmentTypePage } from '../pages/AppointmentTypePage';
import { ConfirmationPage } from '../pages/ConfirmationPage';
import { ContactDetailsPage } from '../pages/ContactDetailsPage';
import { DOBPage } from '../pages/DOBPage';
import { EnquiryPage } from '../pages/EnquiryPage';
import { EnquiryTypePage } from '../pages/EnquiryTypePage';
import { InsuranceTypePage } from '../pages/InsuranceTypePage';
import { NamePage } from '../pages/NamePage';
import { PensionTypePage } from '../pages/PensionTypePage';

test.describe('Confirmation Page (golden path)', () => {
  let enquiryTypePage: EnquiryTypePage;
  let pensionTypePage: PensionTypePage;
  let appointmentTypePage: AppointmentTypePage;
  let insuranceTypePage: InsuranceTypePage;
  let namePage: NamePage;
  let dobPage: DOBPage;
  let contactDetailsPage: ContactDetailsPage;
  let enquiryPage: EnquiryPage;
  let confirmationPage: ConfirmationPage;

  test.beforeEach(async ({ page }) => {
    await page.context().clearCookies();
    enquiryTypePage = new EnquiryTypePage(page);
    pensionTypePage = new PensionTypePage(page);
    appointmentTypePage = new AppointmentTypePage(page);
    insuranceTypePage = new InsuranceTypePage(page);
    namePage = new NamePage(page);
    dobPage = new DOBPage(page);
    contactDetailsPage = new ContactDetailsPage(page);
    enquiryPage = new EnquiryPage(page);
    confirmationPage = new ConfirmationPage(page);
  });

  test('shows confirmation screen for the pensions guidance flow', async ({
    page,
  }) => {
    // Navigate to Confirmation Page via the pensions-guidance flow
    await pensionTypePage.goToPensionType();
    await namePage.goToName('Ask a question about pensions');
    await dobPage.goToDOB();
    await contactDetailsPage.goToContactDetails();
    await enquiryPage.goToEnquiry();
    await confirmationPage.goToConfirmation();

    await expect(
      page.locator('[data-testid="confirmation-callout-content"]'),
    ).toContainText(EXPECTED_CASE_REFS[1]);
  });

  test('shows confirmation screen for the pension wise flow', async ({
    page,
  }) => {
    // Navigate to Confirmation Page via the appointment-pension-wise flow
    await appointmentTypePage.goToAppointmentType();
    await namePage.goToName('Pension Wise appointment');
    await dobPage.goToDOB();
    await contactDetailsPage.goToContactDetails();
    await enquiryPage.goToEnquiry();
    await confirmationPage.goToConfirmation({
      bookingReference: 'a'.repeat(50),
    });

    await expect(
      page.locator('[data-testid="confirmation-callout-content"]'),
    ).toContainText(EXPECTED_CASE_REFS[4]);
  });

  test('shows confirmation screen for the pensions and divorce flow', async ({
    page,
  }) => {
    // Navigate to Confirmation Page via the appointment-divorce flow
    await appointmentTypePage.goToAppointmentType();
    await namePage.goToName('Pensions and divorce or dissolution appointment');
    await dobPage.goToDOB();
    await contactDetailsPage.goToContactDetails();
    await enquiryPage.goToEnquiry();
    await confirmationPage.goToConfirmation({
      bookingReference: 'a'.repeat(50),
    });

    await expect(
      page.locator('[data-testid="confirmation-callout-content"]'),
    ).toContainText(EXPECTED_CASE_REFS[5]);
  });

  test('shows confirmation screen for the pensions tracing flow', async ({
    page,
  }) => {
    // Navigate to Confirmation Page via the pensions-tracing flow
    await pensionTypePage.goToPensionType();
    await namePage.goToName('Ask about finding old or lost pensions');
    await dobPage.goToDOB();
    await contactDetailsPage.goToContactDetails();
    await enquiryPage.goToEnquiry();
    await confirmationPage.goToConfirmation();

    await expect(
      page.locator('[data-testid="confirmation-callout-content"]'),
    ).toContainText(EXPECTED_CASE_REFS[3]);
  });

  test('shows confirmation screen for the money management flow', async ({
    page,
  }) => {
    // Navigate to Confirmation Page via the money-management flow
    await enquiryTypePage.goToEnquiryType();
    await namePage.goToName(
      'Managing your money (including benefits, mortgages and general money questions)',
    );
    await dobPage.goToDOB();
    await contactDetailsPage.goToContactDetails();
    await enquiryPage.goToEnquiry();
    await confirmationPage.goToConfirmation();

    await expect(
      page.locator('[data-testid="confirmation-callout-content"]'),
    ).toContainText(EXPECTED_CASE_REFS[9]);
  });

  test('shows confirmation screen for the debt flow', async ({ page }) => {
    // Navigate to Confirmation Page via the debt flow
    await enquiryTypePage.goToEnquiryType();
    await namePage.goToName('Dealing with debt');
    await dobPage.goToDOB();
    await contactDetailsPage.goToContactDetails();
    await enquiryPage.goToEnquiry();
    await confirmationPage.goToConfirmation();

    await expect(
      page.locator('[data-testid="confirmation-callout-content"]'),
    ).toContainText(EXPECTED_CASE_REFS[10]);
  });

  test('shows confirmation screen for the insurance other flow', async ({
    page,
  }) => {
    // Navigate to Confirmation Page via the insurance other flow
    await insuranceTypePage.goToInsuranceType();
    await namePage.goToName('All other types of insurance');
    await dobPage.goToDOB();
    await contactDetailsPage.goToContactDetails();
    await enquiryPage.goToEnquiry();
    await confirmationPage.goToConfirmation();

    await expect(
      page.locator('[data-testid="confirmation-callout-content"]'),
    ).toContainText(EXPECTED_CASE_REFS[8]);
  });

  test('shows confirmation screen for the scams flow', async ({ page }) => {
    // Navigate to Confirmation Page via the scams flow
    await enquiryTypePage.goToEnquiryType();
    await namePage.goToName(
      'Worries about financial scams, fraud or mis-selling',
    );

    await dobPage.goToDOB();
    await contactDetailsPage.goToContactDetails();
    await enquiryPage.goToEnquiry();
    await confirmationPage.goToConfirmation();

    await expect(
      page.locator('[data-testid="confirmation-callout-content"]'),
    ).toContainText(EXPECTED_CASE_REFS[0]);
  });

  test('shows confirmation screen for the mhpd flow via the auto advance route', async ({
    page,
  }) => {
    await enquiryPage.gotoHome(`?aa=${FlowName.MHPD}`);
    await page.getByTestId('guidance-continue-button').click();
    await page.waitForURL(`/en/${StepName.ABOUT_MHPD}`, { timeout: 20000 });
    await enquiryPage.submitForm();

    await page.waitForURL(`/en/${StepName.NAME}`, { timeout: 20000 });

    await dobPage.goToDOB();
    await contactDetailsPage.goToContactDetails();
    await enquiryPage.goToEnquiry();
    await confirmationPage.goToConfirmation();

    await expect(
      page.locator('[data-testid="confirmation-callout-content"]'),
    ).toContainText(EXPECTED_CASE_REFS[7]);
  });

  test('shows confirmation page when user goes back from loading to enquiry and resubmits', async ({
    page,
  }) => {
    // Navigate to Confirmation Page via the appointment-pension-wise flow
    await pensionTypePage.goToPensionType();
    await namePage.goToName('Ask a question about pensions');
    await dobPage.goToDOB();
    await contactDetailsPage.goToContactDetails();
    await enquiryPage.goToEnquiry();

    await pensionTypePage.fillTextField('text-area', 'a'.repeat(50));

    await pensionTypePage.submitForm();
    await confirmationPage.page.goBack();
    await pensionTypePage.submitForm();

    await pensionTypePage.page.waitForURL(`/en/${StepName.LOADING}`, {
      timeout: 20000,
    });
    await pensionTypePage.page.waitForURL(`/en/${StepName.CONFIRMATION}`, {
      timeout: 20000,
    });

    await expect(
      page.locator('[data-testid="confirmation-callout-content"]'),
    ).toContainText(EXPECTED_CASE_REFS[1]);
  });
});
