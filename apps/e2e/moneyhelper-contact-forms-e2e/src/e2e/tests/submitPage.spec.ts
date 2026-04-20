import { APIRequestContext, Cookie, expect, test } from '@playwright/test';

import { StepName } from '../lib/constants';
import { EXPECTED_CASE_REFS } from '../mocks/mock-data';
import { ContactDetailsPage } from '../pages/ContactDetailsPage';
import { DOBPage } from '../pages/DOBPage';
import { EnquiryPage } from '../pages/EnquiryPage';
import { expectErrorPageAndNoFsid } from '../pages/ErrorPage';
import { NamePage } from '../pages/NamePage';
import { PensionTypePage } from '../pages/PensionTypePage';

const apiUrl = process.env.API_URL || 'http://localhost:4001/mockEndPoint';

test.describe('Submit Page (api call)', () => {
  let namePage: NamePage;
  let dobPage: DOBPage;
  let contactDetailsPage: ContactDetailsPage;
  let enquiryPage: EnquiryPage;
  let pensionTypePage: PensionTypePage;
  let cookies: Cookie[];

  test.beforeEach(async ({ page, request }) => {
    // Reset the API call count before each test
    await request.get(`${apiUrl}/reset`);
    await page.context().clearCookies();
    pensionTypePage = new PensionTypePage(page);
    namePage = new NamePage(page);
    dobPage = new DOBPage(page);
    contactDetailsPage = new ContactDetailsPage(page);
    enquiryPage = new EnquiryPage(page);
  });

  test('ensures no duplicate API calls occur on refresh of the loading page', async ({
    page,
    request,
  }) => {
    // Set an artificial delay on the mock API to simulate a slow response, which allows us to test that refreshing the loading page does not trigger duplicate submissions
    await request.get(`${apiUrl}/set-delay/10000`);

    // Start navigation and form filling
    await pensionTypePage.goToPensionType();
    await namePage.goToName('Ask a question about pensions');
    await dobPage.goToDOB();
    await contactDetailsPage.goToContactDetails();
    await enquiryPage.goToEnquiry();

    await pensionTypePage.fillTextField('text-area', 'a'.repeat(50));

    // Submit the form
    await pensionTypePage.submitForm();

    // Wait for navigation to loading page
    await pensionTypePage.page.waitForURL(`/en/${StepName.LOADING}`, {
      timeout: 20000,
    });

    // Detect when the API calls starts via a promise
    await waitForApiCallStarted(request);
    await page.waitForLoadState('load');
    await pensionTypePage.page.goto(pensionTypePage.page.url());

    // Wait for navigation to loading (SSR logic should redirect if submission is in progress)
    await pensionTypePage.page.waitForURL(`/en/${StepName.LOADING}`, {
      timeout: 20000,
    });

    // Wait for navigation to confirmation page
    await pensionTypePage.page.waitForURL(`/en/${StepName.CONFIRMATION}`, {
      timeout: 20000,
    });

    await expect(
      page.locator('[data-testid="confirmation-callout-content"] strong'),
    ).toHaveText(EXPECTED_CASE_REFS[1]);

    // Check the API call count
    const response = await request.get(`${apiUrl}/count`);
    const countData = await response.json();
    expect(countData.count).toBe(1);
  });

  // eslint-disable-next-line playwright/expect-expect
  test('handles stale submission by redirecting to error page', async ({
    page,
  }) => {
    // Set the mock API call to be delayed for 35 seconds (longer than stale threshold - see SUBMISSION_STALE_TIMEOUT_MS in submitFlow.ts)
    await page.request.get(`${apiUrl}/set-delay/35000`);

    // Start navigation and form filling
    await pensionTypePage.goToPensionType();
    await namePage.goToName('Ask a question about pensions');
    await dobPage.goToDOB();
    await contactDetailsPage.goToContactDetails();
    await enquiryPage.goToEnquiry();

    await pensionTypePage.fillTextField('text-area', 'a'.repeat(50));

    // Submit the form
    await pensionTypePage.submitForm();

    // Wait for navigation to loading page
    await pensionTypePage.page.waitForURL(`/en/${StepName.LOADING}`, {
      timeout: 20000,
    });

    // Wait for the stale timeout to elapse (e.g., 31 seconds - just over the 30 second stale threshold)
    await new Promise((r) => setTimeout(r, 31000));

    // Reload to trigger SSR logic stale submission handling
    await pensionTypePage.page.goto(pensionTypePage.page.url());

    // Should be redirected to error page
    await expectErrorPageAndNoFsid(page, cookies, '?status=104');
  });
});

/**
 * Helper function to poll the mock API for when a POST request is initiated. It repeatedly calls the /last-started endpoint until it detects that a POST request has started after the polling began, or until a timeout is reached. This is used to synchronize the test with the timing of the API call in the submit flow, especially since the mock API has an artificial delay to simulate real-world conditions.
 * @param request
 * @param timeout
 * @returns
 */
async function waitForApiCallStarted(
  request: APIRequestContext,
  timeout = 20000,
) {
  const pollStart = Date.now();
  const start = Date.now();
  while (Date.now() - start < timeout) {
    const response = await request.get(`${apiUrl}/last-started`);
    const data = await response.json();
    if (data.lastPostStartedAt && data.lastPostStartedAt >= pollStart) {
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  throw new Error('Timed out waiting for API call to start');
}
