/* eslint-disable playwright/expect-expect */
import { Cookie, expect, Page, test } from '@playwright/test';

import { FlowName, StepName } from '../lib/constants';
import { BasePage } from '../pages/BasePage';
import { ContactDetailsPage } from '../pages/ContactDetailsPage';
import { EnquiryPage } from '../pages/EnquiryPage';
import { EnquiryTypePage } from '../pages/EnquiryTypePage';
import { NamePage } from '../pages/NamePage';
import { PensionTypePage } from '../pages/PensionTypePage';

let basePage: BasePage;
let enquiryTypePage: EnquiryTypePage;
let pensionTypePage: PensionTypePage;
let namePage: NamePage;
let contactDetailsPage: ContactDetailsPage;
let enquiryPage: EnquiryPage;
let cookies: Cookie[];

test.describe('Error Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.context().clearCookies();
    basePage = new BasePage(page);
    enquiryTypePage = new EnquiryTypePage(page);
    pensionTypePage = new PensionTypePage(page);
    namePage = new NamePage(page);
    contactDetailsPage = new ContactDetailsPage(page);
    enquiryPage = new EnquiryPage(page);
  });

  // Direct navigation to a step with no session/cookie
  test('shows error page when navigating to a step with no session cookie set', async ({
    page,
  }) => {
    await page.context().clearCookies();
    await page.goto(`/en/${StepName.NAME}`);
    await expectErrorPageAndNoFsid(page);
  });

  // Session cleared mid-journey
  test('shows first step if session is cleared or expires mid-journey', async ({
    page,
  }) => {
    await pensionTypePage.goToPensionType();
    await namePage.goToName(FlowName.PENSIONS_GUIDANCE);

    // Clear fsid cookie to simulate session expiry
    const oldFsid = await clearFsidCookie(page);

    // Attempt to navigate to the next step, which should trigger the error page due to missing session
    await namePage.fillTextField('first-name', 'Test');
    await namePage.fillTextField('last-name', 'User');
    await namePage.submitForm();
    await page.waitForURL(/\/en\/enquiry-type/, { timeout: 20000 });

    // Assert that a new fsid cookie is set and user is navigated to the first step
    cookies = await page.context().cookies();
    const newFsidCookie = cookies.find((c) => c.name === 'fsid');
    expect(newFsidCookie).toBeDefined();
    expect(newFsidCookie.value).not.toEqual(oldFsid.value);
    await expect(page.getByTestId('enquiry-type-title')).toBeVisible();
  });

  test('shows error page with status code 104 when fsid cookie is tampered with', async ({
    page,
  }) => {
    await pensionTypePage.goToPensionType();
    await namePage.goToName(FlowName.PENSIONS_GUIDANCE);

    cookies = await page.context().cookies();
    const fsid = cookies.find((c) => c.name === 'fsid');

    // Edit the fsid cookie to simulate tampering
    await page.context().addCookies([
      {
        name: 'fsid',
        value: 'tampered-value',
        domain: fsid.domain,
        path: fsid.path,
        expires: fsid.expires,
        httpOnly: fsid.httpOnly,
        secure: fsid.secure,
        sameSite: fsid.sameSite,
      },
    ]);

    // Attempt to navigate to the next step, which should trigger the error page due to invalid session
    await namePage.fillTextField('first-name', 'Test');
    await namePage.fillTextField('last-name', 'User');
    await namePage.submitForm();

    await expectErrorPageAndNoFsid(page, '?status=104');
  });

  test('shows error page when fsid cookie deleted and the page is refreshed', async ({
    page,
  }) => {
    await pensionTypePage.goToPensionType();
    await namePage.goToName(FlowName.PENSIONS_GUIDANCE);

    // Clear fsid cookie to simulate session expiry
    await clearFsidCookie(page);

    // Refresh the page, which should trigger the error page due to missing session
    await page.reload();
    await expectErrorPageAndNoFsid(page);
  });

  // Tampered URL/step out of order
  test('shows error page when navigating to a step out of order', async ({
    page,
  }) => {
    await enquiryTypePage.goToEnquiryType();
    await page.goto(`/en/${StepName.NAME}`);
    await expectErrorPageAndNoFsid(page);
  });

  // Direct access to error page
  test('shows error page when navigating directly to error page', async ({
    page,
  }) => {
    await page.goto(`/en/${StepName.ERROR}`);
    await expectErrorPageAndNoFsid(page);
  });

  // Unknown route
  test('shows error page for unknown route', async ({ page }) => {
    await page.goto('/en/sdjksdkjds');
    await expectErrorPageAndNoFsid(page);
  });

  test('shows error page when submitted payload does not match any mock payload', async ({
    page,
  }) => {
    await pensionTypePage.goToPensionType();
    await namePage.goToName(FlowName.PENSIONS_GUIDANCE);

    // Fill in valid details except for the first name, which will cause the payload to not match any of the predefined mock payloads in the mock API (mock-data.ts)
    await namePage.fillTextField('first-name', 'InvalidPayload');
    await namePage.fillTextField('last-name', 'User');
    await namePage.submitForm();
    await page.waitForURL(/\/en\/date-of-birth/, { timeout: 20000 });

    await contactDetailsPage.goToContactDetails();
    await enquiryPage.goToEnquiry();

    await enquiryPage.fillTextField('text-area', 'a'.repeat(50));
    await enquiryPage.submitForm();

    await page.waitForURL(/\/en\/loading/, { timeout: 20000 });
    await page.waitForURL(/\/en\/error/, { timeout: 20000 });
    await expectErrorPageAndNoFsid(page, '?status=100');
  });

  test('shows correct "Try again" link URL for MHPD flow', async ({ page }) => {
    // Start a MHPD flow
    await basePage.gotoHome(`?aa=${FlowName.MHPD}`);
    await page.getByTestId('guidance-continue-button').click();
    await page.waitForURL(`/en/${StepName.ABOUT_MHPD}`, { timeout: 20000 });

    // Assert
    await expect(page.getByTestId('about-mhpd-title')).toBeVisible();

    // Navigate to error page
    await page.goto(`/en/${StepName.ERROR}`);
    await expectErrorPageAndNoFsid(page);

    // Assert that the "Try again" link points to the correct URL for the MHPD flow
    const container = page.getByTestId('error-component-section-item-1-0');
    const link = container.getByRole('link');
    await expect(link).toHaveAttribute('href', '/en?aa=mhpd');
  });

  test('shows correct "Try again" link URL for non-MHPD flow', async ({
    page,
  }) => {
    // Start a non-MHPD flow
    await enquiryTypePage.goToEnquiryType();

    // Assert
    await expect(page.getByTestId('enquiry-type-title')).toBeVisible();

    // Navigate to error page
    await page.goto(`/en/${StepName.ERROR}`);
    await expectErrorPageAndNoFsid(page);

    // Assert that the "Try again" link points to the correct URL for the non-MHPD flow
    const container = page.getByTestId('error-component-section-item-1-0');
    const link = container.getByRole('link');
    await expect(link).toHaveAttribute('href', '/en');
  });
});

// --- Helper functions -- //

// Helper for error page and fsid cookie assertion
async function expectErrorPageAndNoFsid(page: Page, param = '') {
  await page.waitForURL(`/en/${StepName.ERROR}${param}`, { timeout: 20000 });
  cookies = await page.context().cookies();
  const fsidCookie = cookies.find((c) => c.name === 'fsid');
  expect(fsidCookie).toBeUndefined();
  await expect(page.getByTestId('error-title')).toBeVisible();
}

// Helper to clear the fsid cookie
async function clearFsidCookie(page: Page) {
  cookies = await page.context().cookies();
  const fsid = cookies.find((c) => c.name === 'fsid');

  // Clear fsid cookie to simulate session expiry
  await page
    .context()
    .clearCookies({ name: 'fsid', domain: fsid.domain, path: fsid.path });

  return fsid;
}
