/* eslint-disable playwright/no-conditional-in-test */
// This rule is disabled as end-to-end regression tests rely on conditional logic.

/**
 * * User Story: 36690
 * E2E Test: User Journey for Nine Green Pensions in Green Channel
 *
 * @scope e2e-Scenarios
 *
 * This test simulates a user journey for a user with 9 green pensions, all in the Green Channel.
 * It verifies:
 *   - AC1: User views Pensions found page
 *   - AC2: User Navigates to the 'your-pension-breakdown' page
 *   - AC3: User navigates to the Pension details page - State pension
 *   - AC4: User navigates to the Pension details page - DC/DB pension
 *   - AC4: User navigates back to the Pension breakdown page
 *   - Retrieval and validation of pension data from the backend
 *   - Presence and correctness of scheme names on the UI
 *   - Conditional flow for Green, Yellow, and Red channels including navigation and data mapping
 *
 * Tags: @e2e
 *
 * Related helpers and page objects:
 *   - PensionFoundPage
 *   - PendingPensionPage
 *   - greenPensionHelpers
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

  test('User Journey for: User with 9 Green pensions in Green Channel @e2e', async ({
    page,
    request,
  }) => {
    test.setTimeout(120000);

    /**
     * TODO: Refactor this to use a standard method and remove duplicate methods.
     */
    await commonHelpers.navigateToPensionsFoundPageTest(
      page,
      'nineGreenPensions',
    );

    const response = await getPensionArrangementFromBE(page, request);
    expect(response.status()).toBe(200);
    const responseJson = (await response.json()) as PensionResponse;
    const { pensionPolicies, pensionsDataRetrievalComplete } = responseJson;
    expect(pensionPolicies && pensionPolicies.length > 0).toBe(true);
    expect(pensionsDataRetrievalComplete).toBe(true);

    const schemeNames =
      pensionsFoundPage.getExpectedSchemeNames(pensionPolicies);
    const textInChannels = await pensionsFoundPage.getAllChannelText(page);
    for (const scheme of schemeNames) {
      expect(textInChannels).toContain(pensionsFoundPage.normalizeText(scheme));
    }

    const greenChannelExists = await pensionsFoundPage.hasGreenChannel(page);
    if (greenChannelExists) {
      await pensionsFoundPage.navigateToPensionBreakdownPage(page);
      await verifyGreenPensions(page, pensionPolicies);
      await commonHelpers.clickBackLink(page);
      await pensionsFoundPage.waitForPensionsFound(page);
    }
    const yellowChannelExists = await pensionsFoundPage.hasYellowChannel(page);
    if (yellowChannelExists) {
      await pensionsFoundPage.clickSeePendingPensions(page);
      await pendingPensionsPage.pageLoads(page);
      await commonHelpers.clickBackLink(page);
      await pensionsFoundPage.waitForPensionsFound(page);
    }
    const redChannelExists = await pensionsFoundPage.hasRedChannel(page);
    if (redChannelExists) {
      await pensionsFoundPage.clickSeePendingPensions(page);
      await commonHelpers.clickBackLink(page);
      await pensionsFoundPage.waitForPensionsFound(page);
    }
  });
});
