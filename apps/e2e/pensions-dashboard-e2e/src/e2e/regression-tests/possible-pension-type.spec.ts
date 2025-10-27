/* eslint-disable playwright/no-conditional-in-test */
// This rule is disabled as end-to-end regression tests rely on conditional logic.

/**
 * * User Story: 36685
 * E2E Test: User Journey for Pensions That Need Action (Red Channel)
 *
 * @scope e2e-Scenarios
 *
 * This test simulates user journeys for users with pensions that need action (red channel).
 * It verifies:
 *   - AC1: User views Pensions found page
 *   - AC2: User Navigates to the 'pensions-that-need-action' page
 *   - AC3: User Clicks 'show contact details link
 *   - Retrieval and validation of pension data from the backend
 *   - Presence and correctness of scheme names on the UI
 *   - Conditional flow for Red channel including navigation and data mapping
 *
 * Tags: @e2e
 *
 * Related helpers and page objects:
 *   - PensionFoundPage
 *   - PensionThatNeedActionPage
 *   - redPensionHelper
 *   - commHelpers
 *   - authentication
 */
import { expect, test } from '@playwright/test';

import { ENV } from '../data/environmentVariables';
import homePage from '../pages/HomePage';
import { netlifyPasswordPage } from '../pages/NetlifyPasswordPage';
import pensionsFoundPage from '../pages/PensionsFoundPage';
import pensionsThatNeedActionPage from '../pages/PensionsThatNeedActionPage';
import { PensionResponse } from '../types/pension.types';
import commonHelpers from '../utils/commonHelpers';
import { assertRedPensionCalloutTextFromArrangement } from '../utils/redPensionsHelper';
import { getPensionArrangementFromBE } from '../utils/request';

const netlifyPassword = ENV.NETLIFY_PASSWORD;

test.describe('Pensions That Need Action (Red Channel) - JavaScript Enabled', () => {
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

  test('User Journey: User with 1 pension that need action @e2e', async ({
    page,
    request,
  }) => {
    test.setTimeout(120000);

    /**
     * TODO: Refactor this to use a standard method and remove duplicate methods.
     */
    await commonHelpers.navigateToPensionsFoundPageTest(page, 'testScenario1');

    const response = await getPensionArrangementFromBE(page, request);
    expect(response.status()).toBe(200);
    const responseJson = (await response.json()) as PensionResponse;
    const { pensionPolicies, pensionsDataRetrievalComplete } = responseJson;
    expect(pensionPolicies && pensionPolicies.length > 0).toBe(true);
    expect(pensionsDataRetrievalComplete).toBe(true);
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

  test('User Journey: User with 3 pensions that need action @e2e', async ({
    page,
    request,
  }) => {
    test.setTimeout(120000);

    await commonHelpers.navigateToPensionsFoundPage(page, 'testScenario2');
    const response = await getPensionArrangementFromBE(page, request);
    expect(response.status()).toBe(200);
    const responseJson = (await response.json()) as PensionResponse;
    const { pensionPolicies, pensionsDataRetrievalComplete } = responseJson;
    expect(pensionPolicies && pensionPolicies.length > 0).toBe(true);
    expect(pensionsDataRetrievalComplete).toBe(true);
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

test.describe('Pensions That Need Action (Red Channel) - JavaScript Disabled', () => {
  test.use({ javaScriptEnabled: false });

  test.beforeEach(async ({ page, baseURL }) => {
    const enUrl = baseURL + '/en';
    await page.goto(enUrl);
    await netlifyPasswordPage.enterPassword(page, netlifyPassword);
    await netlifyPasswordPage.clickSubmit(page);
    await homePage.assertCookiesCleared(page);
    await homePage.clickStart(page);
  });

  /**
   * Skipped:
   *
   * https://dev.azure.com/moneyandpensionsservice/MaPS%20Digital/_workitems/edit/37329
   */
  test.skip('User Journey: User with 1 pension that needs action (JS Disabled) @bug', async ({
    page,
    request,
  }) => {
    test.setTimeout(120000);

    await commonHelpers.navigateToPensionsFoundPageJSDisabled(
      page,
      'testScenario1',
    );

    const response = await getPensionArrangementFromBE(page, request);
    expect(response.status()).toBe(200);
    const responseJson = (await response.json()) as PensionResponse;
    const { pensionPolicies, pensionsDataRetrievalComplete } = responseJson;
    expect(pensionPolicies && pensionPolicies.length > 0).toBe(true);
    expect(pensionsDataRetrievalComplete).toBe(true);

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
