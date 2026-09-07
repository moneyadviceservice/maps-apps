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

import { userJourneyTimeout } from '../../../playwright.qa.config';
import pensionsFoundPage from '../pages/PensionsFoundPage';
import commonHelpers from '../utils/commonHelpers';
import { verifyUnsupportedPensions } from '../utils/unsupportedPensionsHelpers';

test.describe('JavaScript Enabled', () => {
  test.describe.configure({ timeout: userJourneyTimeout });

  test.use({ javaScriptEnabled: true });

  test.beforeEach(async ({ page }) => {
    await commonHelpers.navigateToEmulator(page);
  });

  test('User Journey for: Unsupported pensions are not shown on MHPD Board @e2e', async ({
    page,
    request,
  }) => {
    await commonHelpers.navigateToPensionsFoundPageTest(
      page,
      'unsupportedPension_PC_V3',
    );
    const otherPensionlink = page.getByRole('link', {
      name: 'here’s what you can do.',
    });
    await expect(otherPensionlink).toBeVisible();

    const unsupportedCallout =
      await pensionsFoundPage.unsupportedPensionsCallOut(page);
    await expect(unsupportedCallout).toContainText(
      pensionsFoundPage.unsupportedPensionsFound,
    );
    const unsupportedPensionsExists =
      await pensionsFoundPage.unsupportedPensionsCallOut(page);
    // eslint-disable-next-line playwright/no-conditional-in-test
    if (unsupportedPensionsExists) {
      await verifyUnsupportedPensions(page, request);
    }
  });
});
