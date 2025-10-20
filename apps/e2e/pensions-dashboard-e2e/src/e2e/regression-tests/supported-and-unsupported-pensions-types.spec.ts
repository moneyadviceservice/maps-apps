/* eslint-disable playwright/no-conditional-in-test */
// This rule is disabled as end-to-end regression tests rely on conditional logic.

/**
 *  * User Story: 36695
 * E2E Test: User Journey for one supported pension and four unsupported pensions
 *
 * @scope e2e-Scenarios
 *
 * This test simulates a user with one supported pension and four unsupported pensions.
 * It verifies:
 *   - AC1: User views Pensions found page
 *   - AC2: User Navigates to the 'your-pension-breakdown' page
 *   - AC3: User navigates to the Pension details page - DC/DB pension
 *   - AC4: User navigates back to the Pension breakdown page
 *   - AC5: User navigates back to the Pensions found page
 *   - Unsupported pensions are not shown on the dashboard
 *   - Unsupported pension types are returned from the backend but not displayed
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
import { homePage } from '../pages/HomePage';
import loadingPage from '../pages/LoadingPage';
import { netlifyPasswordPage } from '../pages/NetlifyPasswordPage';
import pensionsFoundPage from '../pages/PensionsFoundPage';
import { scenarioSelectionPage } from '../pages/ScenarioSelectionPage';
import welcomePage from '../pages/WelcomePage';
import { PensionResponse } from '../types/pension.types';
import commonHelpers from '../utils/commonHelpers';
import { verifyGreenPensions } from '../utils/greenPensionsHelper';
import { getPensionArrangementFromBE } from '../utils/request';
import { verifyUnsupportedPensionTypes } from '../utils/unsupportedPensionHelpers';

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

  test('User Journey for: One(1) Supported pension and four (4) unsupported pensions  @e2e', async ({
    page,
    request,
  }) => {
    test.setTimeout(100000);

    /**
     * TODO: Refactor this to use a standard method and remove duplicate methods.
     * i.e. scenarioSelectionPage.selectScenario({ scenarioName: 'testScenario9', environment: 'test' })
     */
    await scenarioSelectionPage.selectScenarioComposerTest(
      page,
      'unsupportedSupported',
    );

    await welcomePage.welcomePageLoads(page);
    await welcomePage.clickWelcomeButton(page);
    await loadingPage.waitForPensionsToLoad(page);
    await pensionsFoundPage.waitForPensionsFound(page);
    const otherPensionlink = await pensionsFoundPage.linkExpectingOtherPensions(
      page,
    );
    await expect(otherPensionlink).toContainText(
      'Are you expecting to see other pensions?',
    );
    const unsupportedPensionGuideText =
      await pensionsFoundPage.unsupportedPensionsCallOut(page);
    await expect(unsupportedPensionGuideText).toContainText(
      'Unsupported pensions found',
    );
    const unsupportedPensionSummaryText =
      await pensionsFoundPage.unsupportedPensionsCallOut(page);
    await expect(unsupportedPensionSummaryText).toContainText(
      pensionsFoundPage.unsupportedPensionText,
    );
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

    const unsupportedTypes = ['AVC', 'HYB'];
    verifyUnsupportedPensionTypes(pensionPolicies, unsupportedTypes);
  });
});
