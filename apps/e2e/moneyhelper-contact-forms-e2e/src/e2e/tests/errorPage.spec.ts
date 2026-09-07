/* eslint-disable playwright/expect-expect */
import { Cookie, expect, Page, test } from '@playwright/test';

import { COOKIE_NAME, FlowName, StepName } from '../lib/constants';
import { BasePage } from '../pages/BasePage';
import { EnquiryTypePage } from '../pages/EnquiryTypePage';
import { expectErrorPageAndNoFsid } from '../pages/ErrorPage';
import { NamePage } from '../pages/NamePage';
import { PensionTypePage } from '../pages/PensionTypePage';

let basePage: BasePage;
let enquiryTypePage: EnquiryTypePage;
let pensionTypePage: PensionTypePage;
let namePage: NamePage;
let cookies: Cookie[];

test.describe('Error Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.context().clearCookies();
    basePage = new BasePage(page);
    enquiryTypePage = new EnquiryTypePage(page);
    pensionTypePage = new PensionTypePage(page);
    namePage = new NamePage(page);
  });

  // Direct navigation to a step with no session/cookie
  test('shows error page when navigating to a step with no session cookie set', async ({
    page,
  }) => {
    await page.goto(`/en/${StepName.NAME}`);
    await expectErrorPageAndNoFsid(page);
  });

  // Session cleared mid-journey
  test('shows error page when fsid cookie deleted mid-journey and user attempts to continue to next step', async ({
    page,
  }) => {
    await pensionTypePage.goToPensionType();
    await namePage.goToName('Ask a question about pensions');

    // Clear fsid cookie to simulate session expiry
    await clearFsidCookie(page);

    // Attempt to navigate to the next step, which should trigger the error page due to missing session
    await namePage.fillTextField('first-name', 'Test');
    await namePage.fillTextField('last-name', 'User');
    await namePage.submitForm();

    await expectErrorPageAndNoFsid(page, '?status=105');
  });

  test('shows error page with status code 105 when fsid cookie is tampered with', async ({
    page,
  }) => {
    await pensionTypePage.goToPensionType();
    await namePage.goToName('Ask a question about pensions');

    cookies = await page.context().cookies();
    const fsid = getFsidCookie(cookies);

    // Edit the fsid cookie to simulate tampering
    await page.context().addCookies([
      {
        name: COOKIE_NAME,
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

    await expectErrorPageAndNoFsid(page, '?status=105');
  });

  test('shows error page when fsid cookie deleted and the page is refreshed', async ({
    page,
  }) => {
    await pensionTypePage.goToPensionType();
    await namePage.goToName('Ask a question about pensions');

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

  test('shows correct "Try again" link URL for MHPD flow', async ({ page }) => {
    // Start a MHPD flow
    await basePage.gotoHome(`?aa=${FlowName.MHPD}`);
    await page.getByTestId('guidance-continue-button').click();
    await page.waitForURL(`/en/${StepName.ABOUT_MHPD}`, { timeout: 20000 });

    // Assert
    await expect(page.getByTestId('about-mhpd-title')).toBeVisible();

    // Navigate to error page
    await page.goto(`/en/${StepName.ERROR}`);

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

    // Assert that the "Try again" link points to the correct URL for the non-MHPD flow
    const container = page.getByTestId('error-component-section-item-1-0');
    const link = container.getByRole('link');
    await expect(link).toHaveAttribute('href', '/en');
  });
});

// --- Helper functions -- //
function getFsidCookie(cookies: Cookie[]): Cookie {
  const fsid = cookies.find((cookie) => cookie.name === COOKIE_NAME);

  if (!fsid) {
    throw new Error('Expected fsid cookie to be present');
  }

  return fsid;
}

// Helper to clear the fsid cookie
async function clearFsidCookie(page: Page) {
  cookies = await page.context().cookies();
  const fsid = getFsidCookie(cookies);

  // Clear fsid cookie to simulate session expiry
  await page.context().clearCookies({
    name: COOKIE_NAME,
    domain: fsid.domain,
    path: fsid.path,
  });

  return fsid;
}
