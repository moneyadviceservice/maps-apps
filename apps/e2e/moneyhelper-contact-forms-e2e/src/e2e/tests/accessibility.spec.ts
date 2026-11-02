import { expect, test } from '@playwright/test';

import { getAccessibilityViolations } from '../helpers/axe-helper';
import { BasePage } from '../pages/BasePage';
import { ContactDetailsPage } from '../pages/ContactDetailsPage';
import { DOBPage } from '../pages/DOBPage';
import { EnquiryPage } from '../pages/EnquiryPage';
import { EnquiryTypePage } from '../pages/EnquiryTypePage';
import { NamePage } from '../pages/NamePage';
import { PensionTypePage } from '../pages/PensionTypePage';

/**
 * @tests User Story 59078 - Remove accessibility tests from g365 repository
 * Migrate here to maps-apps - apps/e2e/moneyhelper-contact-forms-e2e
 * No related Test cases for this user story
 */
test.describe('Accessibility', () => {
  let basePage: BasePage;
  let enquiryTypePage: EnquiryTypePage;
  let pensionTypePage: PensionTypePage;
  let namePage: NamePage;
  let dobPage: DOBPage;
  let contactDetailsPage: ContactDetailsPage;
  let enquiryPage: EnquiryPage;

  test.beforeEach(async ({ page }) => {
    await page.context().clearCookies();
    basePage = new BasePage(page);
    enquiryTypePage = new EnquiryTypePage(page);
    pensionTypePage = new PensionTypePage(page);
    namePage = new NamePage(page);
    dobPage = new DOBPage(page);
    contactDetailsPage = new ContactDetailsPage(page);
    enquiryPage = new EnquiryPage(page);
  });

  test('guidance page has no accessibility violations', async ({ page }) => {
    await basePage.gotoHome();
    expect(await getAccessibilityViolations(page)).toEqual([]);
  });

  test('enquiry options page has no accessibility violations', async ({
    page,
  }) => {
    await enquiryTypePage.goToEnquiryType();
    expect(await getAccessibilityViolations(page)).toEqual([]);
  });

  test('pension type page has no accessibility violations', async ({
    page,
  }) => {
    await pensionTypePage.goToPensionType();
    expect(await getAccessibilityViolations(page)).toEqual([]);
  });

  test('name page has no accessibility violations', async ({ page }) => {
    await pensionTypePage.goToPensionType();
    await namePage.goToName('Ask a question about pensions');
    expect(await getAccessibilityViolations(page)).toEqual([]);
  });

  test('date of birth page has no accessibility violations', async ({
    page,
  }) => {
    await pensionTypePage.goToPensionType();
    await namePage.goToName('Ask a question about pensions');
    await dobPage.goToDOB();
    expect(await getAccessibilityViolations(page)).toEqual([]);
  });

  test('contact details page has no accessibility violations', async ({
    page,
  }) => {
    await pensionTypePage.goToPensionType();
    await namePage.goToName('Ask a question about pensions');
    await dobPage.goToDOB();
    await contactDetailsPage.goToContactDetails();
    expect(await getAccessibilityViolations(page)).toEqual([]);
  });

  test('enquiry page has no accessibility violations', async ({ page }) => {
    await pensionTypePage.goToPensionType();
    await namePage.goToName('Ask a question about pensions');
    await dobPage.goToDOB();
    await contactDetailsPage.goToContactDetails();
    await enquiryPage.goToEnquiry();
    expect(await getAccessibilityViolations(page)).toEqual([]);
  });
});
