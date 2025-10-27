/**
 * * User Story: 36688
 * E2E Test: User Journey for unsupported pension types
 *
 * @scope e2e-Scenarios
 *
 * This test simulates a user journey where unsupported pension types 'AVC', 'HYB', 'CB', 'CDC'are returned from the backend.
 * but they are not shown on the MHPD dashboard as expected
 * It verifies:
 *   - AC1: User sees Pensions found page with no pension displayed
 *   - Unsupported pension types are returned from the backend and validated
 *   - Unsupported pension guide test is displayed on the page to notify end user that the pension are there but unsupported at this time
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
import { expect, test } from '@playwright/test';

import { ENV } from '../data/environmentVariables';
import homePage from '../pages/HomePage';
import { netlifyPasswordPage } from '../pages/NetlifyPasswordPage';
import pensionsFoundPage from '../pages/PensionsFoundPage';
import commonHelpers from '../utils/commonHelpers';
import { PensionResponse } from '../types/pension.types';
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

  test('User Journey for: Unsupported pensions are not shown on MHPD Board @e2e', async ({
    page,
    request,
  }) => {
    test.setTimeout(100000);

    /**
     * TODO: Refactor this to use a standard method and remove duplicate methods.
     * i.e. scenarioSelectionPage.selectScenario({ scenarioName: 'testScenario9', environment: 'test' })
     */
    await commonHelpers.navigateToPensionsFoundPageTest(
      page,
      'unsupportedPensions',
    );

    const otherPensionlink = page.getByRole('link', {
      name: 'Are you expecting to see other pensions?',
    });
    await expect(otherPensionlink).toBeVisible();
    const unsupportedCallout = page.getByTestId('unsupported-callout');
    await expect(unsupportedCallout).toContainText(
      'Unsupported pensions found',
    );
    await expect(unsupportedCallout).toContainText(
      pensionsFoundPage.unsupportedPensionsFound,
    );
    const response = await getPensionArrangementFromBE(page, request);
    expect(response.status()).toBe(200);

    const responseJson = (await response.json()) as PensionResponse;
    const { pensionPolicies, pensionsDataRetrievalComplete } = responseJson;
    expect(pensionPolicies && pensionPolicies.length > 0).toBe(true);
    expect(pensionsDataRetrievalComplete).toBe(true);

    // Verify all expected unsupported pension types are returned from the response but not displayed in the UI.
    const pensionArrangements = pensionPolicies.flatMap(
      (policy) => policy.pensionArrangements,
    );

    const unsupportedTypes = ['AVC', 'HYB', 'CB', 'CDC'];
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
