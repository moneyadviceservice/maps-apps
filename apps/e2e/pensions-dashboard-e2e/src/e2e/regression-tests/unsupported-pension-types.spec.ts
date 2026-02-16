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
import { expect, test } from '@maps/playwright';

import pensionsFoundPage from '../pages/PensionsFoundPage';
import commonHelpers from '../utils/commonHelpers';
import { verifyUnsupportedPensions } from '../utils/unsupportedPensionsHelpers';

test.describe('JavaScript Enabled', () => {
  test.use({ javaScriptEnabled: true });

  test.beforeEach(async ({ page }) => {
    await commonHelpers.navigateToEmulator(page);
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
    const unsupportedPensionsExists =
      await pensionsFoundPage.unsupportedPensionsCallOut(page);
    if (unsupportedPensionsExists) {
      await verifyUnsupportedPensions(page, request);
    }
  });
});
