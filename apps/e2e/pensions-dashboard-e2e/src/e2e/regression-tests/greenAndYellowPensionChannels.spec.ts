/* eslint-disable playwright/no-conditional-in-test */
// This rule is disabled as end-to-end regression tests rely on conditional logic.

/**
 *  * User Story: 36696
 *  * User Story: 36659
 *  E2E Test: 1 DB & 1 DC pensions are displayed in the Yellow & Green Channels
 *
 * This test simulates a user with user with Confirmed pensions (without estimated income only) and a pending pension.
 * It verifies:
 *   - AC1: User views Pensions found page
 *   - AC2: User Navigates to the 'your-pension-breakdown' page
 *   - AC3: User navigates to the Pension details page - DC/DB pension
 *   - AC4: User navigates back to the Pension breakdown page
 *   - AC5: User navigates back to the Pensions found page
 *   - AC6: User Navigates to the 'pending-pensions' page
 *   - AC7: User navigates to the Pension details page - DC/DB pension
 *   - AC8: User navigates back to the Pending Pension page
 *   - AC9: User navigates back to the Pensions found page
 *
 * Tags: @e2e
 *
 * Related helpers and page objects:
 *   - PensionFoundPage
 *   - greenPensionHelpers
 *   - unsupportedPensionHelpers
 *   - commHelpers
 *   - authentication
 */
import { expect, test } from '@playwright/test';

import { ENV } from '../data/environmentVariables';
import homePage from '../pages/HomePage';
import { netlifyPasswordPage } from '../pages/NetlifyPasswordPage';
import pendingPensionsPage from '../pages/PendingPensionsPage';
import pensionsFoundPage from '../pages/PensionsFoundPage';
import { PensionResponse } from '../types/pension.types';
import commonHelpers from '../utils/commonHelpers';
import { verifyGreenPensions } from '../utils/greenPensionsHelper';
import { getPensionArrangementFromBE } from '../utils/request';
import { verifyYellowPension } from '../utils/yellowPensionsHelper';

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

  test('User Journey for: Green and Yellow pensions combined  @e2e', async ({
    page,
    request,
  }) => {
    test.setTimeout(100000);

    /**
     * TODO: Refactor this to use a standard method and remove duplicate methods.
     */
    await commonHelpers.navigateToPensionsFoundPageTest(page, 'greenAndYellow');

    const response = await getPensionArrangementFromBE(page, request);
    expect(response.status()).toBe(200);

    const responseJson = (await response.json()) as PensionResponse;
    const { pensionPolicies, pensionsDataRetrievalComplete } = responseJson;
    expect(pensionPolicies && pensionPolicies.length > 0).toBe(true);
    expect(pensionsDataRetrievalComplete).toBe(true);

    const greenChannelExists = await pensionsFoundPage.hasGreenChannel(page);
    if (greenChannelExists) {
      await pensionsFoundPage.navigateToPensionBreakdownPage(page);
      await verifyGreenPensions(page, pensionPolicies);
      await commonHelpers.clickBackLink(page);
    }

    const yellowChannelExists = await pensionsFoundPage.hasYellowChannel(page);
    if (yellowChannelExists) {
      await pensionsFoundPage.clickSeePendingPensions(page);
      await pendingPensionsPage.pageLoads(page);
      await verifyYellowPension(page, pensionPolicies);
      await commonHelpers.clickBackLink(page);
      await pensionsFoundPage.waitForPensionsFound(page);
    }
  });
});
