/* eslint-disable playwright/no-conditional-in-test */
// This rule is disabled as end-to-end regression tests rely on conditional logic.

/**
 * * User Story: 36687
 * E2E Test: User Journey for a user with one confirmed state pension
 *
 * @scope e2e-Scenarios
 *
 * This test simulates a user selecting the 'statePensionCaseC' scenario, logging in, and navigating through the pension dashboard.
 * It verifies:
 *   - AC1: User views Pensions found page
 *   - AC2: User Navigates to the 'your-pension-breakdown' page
 *   - AC3: User navigates to the Pension details page - State pension
 *   - State pension is correctly retrieved from the backend
 *   - State pension is displayed on the dashboard
 *   - Key pension details (scheme name, retirement date, estimated monthly amount) are shown as expected
 *   - State pension details page is accurate (using utility helpers)
 *
 * Tags: @e2e
 *
 * Related helpers and page objects:
 *   - ScenarioSelectionPage
 *   - WelcomePage
 *   - LoadingPage
 *   - PensionFoundPage
 *   - statePensionHelpers
 *   - authentication
 *   - request
 *   - dateFormatter
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
import { formatDate } from '../utils/dateFormatter';
import { getPensionArrangementFromBE } from '../utils/request';
import { verifyStatePensionDetailsPage } from '../utils/statePensionsHelper';

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

  test('User Journey for: User with 1 (one) confirmed state pension @e2e', async ({
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
      'statePensionCaseC',
    );

    await welcomePage.welcomePageLoads(page);
    await welcomePage.clickWelcomeButton(page);
    await loadingPage.waitForPensionsToLoad(page);
    await pensionsFoundPage.waitForPensionsFound(page);

    const response = await getPensionArrangementFromBE(page, request);
    expect(response.status()).toBe(200);

    const responseJson = (await response.json()) as PensionResponse;
    const { pensionPolicies, pensionsDataRetrievalComplete } = responseJson;
    expect(pensionPolicies && pensionPolicies.length > 0).toBe(true);
    expect(pensionsDataRetrievalComplete).toBe(true);

    const pensionArrangement = pensionPolicies[0].pensionArrangements[0];
    const {
      pensionType,
      schemeName,
      retirementDate,
      statePensionMessageEng,
      benefitIllustrations,
    } = pensionArrangement;

    const pensionTypeMap: Record<string, string> = {
      SP: 'State pension',
    };

    const pensionTypeText = pensionTypeMap[pensionType] ?? pensionType;
    const benefitIllustration = benefitIllustrations[0];
    const [eriComponent, apComponent] =
      benefitIllustration.illustrationComponents;
    const { payableDetails: eriPayableDetails } = eriComponent;
    const { payableDetails: apPayableDetails } = apComponent;

    const displayedPensionName = await page
      .getByText('State Pension')
      .textContent();
    expect(displayedPensionName).toContain(schemeName);
    await pensionsFoundPage.navigateToPensionBreakdownPage(page);

    const pensionCardType = await page
      .getByTestId('pension-card-type')
      .textContent();
    const pensionsNameOnPensionsCard = await page
      .getByTestId('pension-card-scheme-name')
      .textContent();
    const pensionRetirementOnPensionsCard = await page
      .getByTestId('pension-card-retirement-date')
      .textContent();
    const estimatedMonthlyAmountOnPensionsCard = await page
      .getByTestId('pension-card-monthly-amount')
      .textContent();

    expect(pensionRetirementOnPensionsCard).not.toBeNull();
    const customFormatedDate = formatDate(
      pensionRetirementOnPensionsCard,
      'YYYY-MM-DD',
    );

    // Pension card, on the breakdown page
    expect(pensionCardType).toContain(pensionTypeText);
    expect(pensionsNameOnPensionsCard).toContain(schemeName);
    expect(customFormatedDate).toBe(retirementDate);
    expect(estimatedMonthlyAmountOnPensionsCard).toContain(
      eriPayableDetails.monthlyAmount.toString(),
    );

    await verifyStatePensionDetailsPage(page, {
      eriPayableDetails,
      apPayableDetails,
      retirementDate,
      statePensionMessageEng,
      pensionRetirementOnPensionsCard: pensionRetirementOnPensionsCard ?? '',
    });
  });
});
