/**
 * E2E Test: User Journey for a user with one Defined Benefit (DB) pension in Green Channel
 *
 * @scope e2e-Scenarios
 *
 * This test simulates a user selecting the 'statePensionCaseC' scenario, logging in, and navigating through the pension dashboard.
 * It verifies:
 *   - Defined Benefit pension is correctly retrieved from the backend
 *   - DB pension is displayed on the dashboard
 *   - Key pension details (scheme name, retirement date, etc.) are shown as expected
 *
 * Tags: @e2e
 *
 * Related helpers and page objects:
 *   - ScenarioSelectionPage
 *   - WelcomePage
 *   - LoadingPage
 *   - PensionFoundPage
 *   - authentication
 *   - request
 */
import { expect, test } from '@playwright/test';

import { ENV } from '../data/environmentVariables';
import homePage from '../pages/HomePage';
import { netlifyPasswordPage } from '../pages/NetlifyPasswordPage';
import pensionsFoundPage from '../pages/PensionsFoundPage';
import { PensionResponse } from '../types/pension.types';
import commonHelpers from '../utils/commonHelpers';
import { verifyGreenPensions } from '../utils/greenPensionsHelper';
import { getPensionArrangementFromBE } from '../utils/request';

const netlifyPassword = ENV.NETLIFY_PASSWORD;

test.describe('JavaScript Enabled', () => {
  test.use({ javaScriptEnabled: true });

  test.beforeEach(async ({ page, baseURL }) => {
    await page.goto('/');

    if (baseURL.includes('netlify.app')) {
      await netlifyPasswordPage.enterPassword(page, netlifyPassword);
      await netlifyPasswordPage.clickSubmit(page);
    }

    await homePage.checkHomePageLoads(page);
    await homePage.assertCookiesCleared(page);
    await homePage.clickStart(page);
  });

  test('User Journey for: User with Defined Benefit (DB) pensions with lump sum pension in Green Channel @e2e', async ({
    page,
    request,
  }) => {
    test.setTimeout(120000);

    /**
     * TODO: Refactor this to use a standard method and remove duplicate methods.
     */
    await commonHelpers.navigatetoPensionsFoundPage(page, 'lumpSumTest');

    const response = await getPensionArrangementFromBE(page, request);
    expect(response.status()).toBe(200);
    const responseJson = (await response.json()) as PensionResponse;
    const { pensionPolicies, pensionsDataRetrievalComplete } = responseJson;
    expect(pensionPolicies && pensionPolicies.length > 0).toBe(true);
    expect(pensionsDataRetrievalComplete).toBe(true);

    const greenChannelLink = page.getByRole('link', {
      name: 'See your pensions',
    });
    await expect(greenChannelLink).toBeVisible();
    await pensionsFoundPage.clickSeeYourPensions(page);
    await verifyGreenPensions(page, pensionPolicies);
    await page.goBack();
    await pensionsFoundPage.waitForPensionsFound(page);
  });
});
