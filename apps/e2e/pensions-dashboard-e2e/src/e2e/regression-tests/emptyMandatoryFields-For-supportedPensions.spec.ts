/* eslint-disable playwright/no-conditional-in-test */
// This rule is disabled as end-to-end regression tests rely on conditional logic.

/**
 * E2E Test: Display of '--' for Missing Mandatory Pension Information
 *
 * @scope e2e-Scenarios
 *
 * This test verifies that when mandatory information is not available for all supported pension types (across Green, Yellow, and Red channels),
 * the UI displays '--' in place of the missing data fields.
 *
 * Test Scope:
 *   - Ensures '--' is shown for all pensions in all channels (Green, Yellow, Red) when mandatory information is missing.
 *   - Validates that the UI does not misleading values for missing mandatory fields.
 *
 * Tags: @e2e @emptyFields
 *
 * Related helpers and page objects:
 *   - PensionFoundPage
 *   - PendingPensionPage
 *   - PensionThatNeedActionPage
 *   - greenPensionHelpers
 *   - yellowPensionHelpers
 *   - redPensionHelper
 *   - commHelpers
 *   - authentication
 *   - request
 *   - types
 */
import { expect, test } from '@playwright/test';

import { ENV } from '../data/environmentVariables';
import homePage from '../pages/HomePage';
import { netlifyPasswordPage } from '../pages/NetlifyPasswordPage';
import pendingPensionsPage from '../pages/PendingPensionsPage';
import pensionsFoundPage from '../pages/PensionsFoundPage';
import pensionsThatNeedActionPage from '../pages/PensionsThatNeedActionPage';
import { PensionResponse } from '../types/pension.types';
import commonHelpers from '../utils/commonHelpers';
import { verifyGreenPensions } from '../utils/greenPensionsHelper';
import { assertRedPensionCalloutTextFromArrangement } from '../utils/redPensionsHelper';
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

  test('User Journey for: Empty mandatory fields for all supported pension types in all channels @e2e', async ({
    page,
    request,
  }) => {
    test.setTimeout(100000);

    /**
     * TODO: Refactor this to use a standard method and remove duplicate methods.
     */
    await commonHelpers.navigateToPensionsFoundPageTest(page, 'emptyFields');

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

    const redChannelExists = await pensionsFoundPage.hasRedChannel(page);
    if (redChannelExists) {
      await pensionsThatNeedActionPage.proceedToPensionNeedingActionDetailsPage(
        page,
      );
      await pensionsThatNeedActionPage.clickAllShowAndHideContactDetails(page);
      await assertRedPensionCalloutTextFromArrangement(page, pensionPolicies);
      await commonHelpers.clickBackLink(page);
      await pensionsFoundPage.waitForPensionsFound(page);
    }
  });
});
