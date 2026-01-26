/* eslint-disable playwright/no-conditional-in-test */
// This rule is disabled as end-to-end regression tests rely on conditional logic.

/**
 * * User Story: 36689
 * E2E Test: User Journey for scenario where no pension is found
 *
 * @scope e2e-Scenarios
 *
 * This test simulates a user journey where no pension is found after login.
 * It verifies:
 *   - AC1: User sees No Pensions found page with no pension displayed
 *   - No pension guidance text is shown
 *   - Backend returns empty pension policies and peiData
 *
 * Tags: @e2e
 *
 * Related helpers and page objects:
 *   - PensionFoundPage
 *   - ScenarioSelectionPage
 *   - WelcomePage
 *   - LoadingPage
 *   - authentication
 *   - request
 */
import { expect, test } from '@maps/playwright';
import loadingPage from '../pages/LoadingPage';
import pensionsFoundPage from '../pages/PensionsFoundPage';
import scenarioSelectionPage from '../pages/ScenarioSelectionPage';
import welcomePage from '../pages/WelcomePage';
import { PensionResponse } from '../types/pension.types';
import { getPensionSummary } from '../utils/request';
import commonHelpers from '../utils/commonHelpers';

test.describe('JavaScript Enabled', () => {
  test.use({ javaScriptEnabled: true });

  test.beforeEach(async ({ page }) => {
    await commonHelpers.navigateToEmulator(page);
  });

  test('User Journey for Scenario: No pension found @e2e', async ({
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
      'testScenario9',
    );
    await welcomePage.welcomePageLoads(page);
    await page.waitForTimeout(500);
    await welcomePage.clickWelcomeButton(page);
    await loadingPage.waitForPensionsToLoad(page);
    // verify no pension is displayed on MHPD
    const noPensionElement = await pensionsFoundPage.noPensionFound(page);
    await expect(noPensionElement).toHaveText('No pensions found');

    const noPensionGuideText = await pensionsFoundPage.noPensionGuideText(page);
    await expect(noPensionGuideText).toHaveText(
      pensionsFoundPage.noPensionsIntro,
    );

    // double check if the API call also returns an empty array
    const response = await getPensionSummary(page, request);
    expect(response.status()).toBe(200);

    const responseJson = (await response.json()) as PensionResponse;
    const { pensionPolicies, isPensionRetrievalComplete } = responseJson;
    expect(pensionPolicies).toBeUndefined();
    expect(isPensionRetrievalComplete).toBe(true);
  });
});
