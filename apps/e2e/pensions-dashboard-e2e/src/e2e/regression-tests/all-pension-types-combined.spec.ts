/* eslint-disable playwright/no-conditional-in-test */
// This rule is disabled as end-to-end regression tests rely on conditional logic.

/**
 * User Story: 36697
 * User Story: 36659
 * E2E Test: User Journey for all pension types (Green, Yellow, Red, and Unsupported)
 *
 * @scope e2e-Scenarios
 *
 * This test simulates a user journey where the user has a combination of green, yellow, red, and unsupported pension types returned from the backend.
 * It verifies:
 *   - AC1: User views Pensions found page
 *   - AC2: User navigates to the pension breakdown page for green pensions
 *   - AC3: User navigates to the pending pensions page for yellow pensions
 *   - AC4: User navigates to the pensions that need action page for red pensions
 *   - AC5: User can view and hide contact details for red pensions
 *   - AC6: All expected unsupported pension types are returned from the backend but not displayed in the UI
 *   - AC7: Data mapping and details for each pension type are validated
 *
 * Tags: @e2e
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

  test('User Journey for: All supported pension types and unsupported pensions type @e2e', async ({
    page,
    request,
  }) => {
    test.setTimeout(1000 * 60 * 10);

    /**
     * TODO: Refactor this to use a standard method and remove duplicate methods.
     */
    await commonHelpers.navigateToPensionsFoundPageTest(
      page,
      'combinedPensions',
    );

    const response = await getPensionArrangementFromBE(page, request);
    expect(response.status()).toBe(200);

    const responseJson = (await response.json()) as PensionResponse;
    const { pensionPolicies, pensionsDataRetrievalComplete } = responseJson;
    expect(pensionPolicies && pensionPolicies.length > 0).toBe(true);
    expect(pensionsDataRetrievalComplete).toBe(true);

    const greenChannelExists = await pensionsFoundPage.hasGreenChannel(page);
    if (greenChannelExists) {
      console.log('Navigating to pension breakdown page.');
      await pensionsFoundPage.navigateToPensionBreakdownPage(page);
      console.log('Verifying green pensions.');
      await verifyGreenPensions(page, pensionPolicies);
      console.log('Going back to pensions breakdown page.');
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

    const pensionArrangements = pensionPolicies.flatMap(
      (policy) => policy.pensionArrangements,
    );

    const unsupportedPensionGuideText =
      await pensionsFoundPage.unsupportedPensionsCallOut(page);
    await expect(unsupportedPensionGuideText).toContainText(
      'Unsupported pensions found',
    );

    const unsupportedPensionSummaryText =
      await pensionsFoundPage.unsupportedPensionsCallOut(page);
    await expect(unsupportedPensionSummaryText).toContainText(
      pensionsFoundPage.pensionFoundPageTitleText,
    );

    // AVC and CDC are failing BE validation with "retrievalStatus": "RETRIEVAL_REQUESTED",
    // So the arrangements are not displayed as part of unsupported pensions
    const unsupportedTypes = ['HYB', 'CB'];
    unsupportedTypes.forEach((type) => {
      const pension = pensionArrangements.find(
        (arr) => arr.pensionType === type,
      );
      expect(pension).toBeDefined();
      expect(pension?.schemeName).toBe(`SchemeName${type}`);
      expect(pension?.pensionAdministrator.name).toBe(
        `${type} Administrator Name`,
      );
    });
  });
});
