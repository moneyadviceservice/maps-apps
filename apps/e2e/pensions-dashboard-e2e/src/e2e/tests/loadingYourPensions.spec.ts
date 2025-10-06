import { expect, test } from '@playwright/test';

import loadingPage from '../pages/LoadingPage';
import commonHelpers from '../utils/commonHelpers';

/**
 * @tests User Story 39266
 * @scenario This test scenario covers the expected content and styling of the Loading Your Pensions page, including dynamic elements like the progress bar and percentage label.
 */

/**
 * @tests Test case 40578 [AC1] Percentage text is displayed with the correct color
 * @tests Test case 40579 [AC2] Progress bar colour and text are correct
 * @tests Test case 40580 [AC3] "Do not refresh or close" message is displayed with correct styling
 * @tests Test case 40581 [AC4] "Did you know?" section has the correct background color
 * @tests Test case 40582 [AC5] Carousel displays all messages correctly on desktop
 * @tests Test case 40583 [AC6] Green tick is displayed and "Did you know?" section is hidden after 100% completion
 */
test.describe('Loading Your Pensions Page', () => {
  test('verify content on loading pensions page', async ({ page }) => {
    // 1. Initial setup
    await commonHelpers.navigateToEmulator(page);
    await commonHelpers.navigateToLoadingPage(page, 'allNewTestCases');

    // 2. Initial loading page content checks
    await expect(loadingPage.getLoadingYourPensionsHeader(page)).toBeVisible();
    await expect(loadingPage.getLoadingBarSubHeader(page)).toBeVisible();

    // 3. Progress bar verification
    await expect(loadingPage.getProgressBarContainer(page)).toHaveText(
      /\d+% complete/,
    );
    await expect(loadingPage.getProgressBarLabel(page)).toBeVisible();

    await expect
      .poll(() => loadingPage.getProgressBarColour(page))
      .toBe('rgb(200, 42, 135)');

    await expect(loadingPage.getProgressBar(page)).toHaveClass(/bg-blue-700/);

    // 4. Verify the "Do not refresh or close this page." warning text
    const expectedWarningText = 'Do not refresh or close this page.';
    await expect(loadingPage.getWarningText(page)).toHaveText(
      expectedWarningText,
    );
    await expect(loadingPage.getWarningText(page)).toBeVisible();

    await expect
      .poll(() =>
        commonHelpers.getStyle(loadingPage.getWarningText(page), 'fontSize'),
      )
      .toBe('18px');

    await expect
      .poll(() =>
        commonHelpers.getStyle(loadingPage.getWarningText(page), 'fontWeight'),
      )
      .toBe('700');

    await expect
      .poll(() =>
        commonHelpers.getStyle(loadingPage.getWarningText(page), 'color'),
      )
      .toBe('rgb(0, 0, 0)');

    /**
     * 5. Verifying "Did you know?" background colour and text
     */
    await expect(loadingPage.getCalloutContainer(page)).toBeVisible();
    await expect
      .poll(() =>
        commonHelpers.getStyle(
          loadingPage.getCalloutContainer(page),
          'backgroundColor',
        ),
      )
      .toBe('rgb(255, 249, 235)');

    // Verify "Did you know?" texts
    const orderedSegments = [
      {
        statement:
          'There is £31.1 billion in lost or unclaimed pension pots in the UK.',
        source: '(Lost Pensions Survey, Pensions Policy Institute, 2024)',
      },
      {
        statement:
          'Eight out of ten savers don’t know how much they’ll need in retirement.',
        source:
          '(Retirement Living Standards, Pensions and Lifetime Savings Association)',
      },
      {
        statement:
          'You usually need 35 qualifying years of National Insurance credits to get the full State Pension.',
        source: null,
      },
    ];

    for (const segment of orderedSegments) {
      const statementLocator = page.getByText(segment.statement);
      await expect(statementLocator).toBeVisible();

      // These have been disabled as the logic is entirely dictated by our own object structure, not test structure.
      // eslint-disable-next-line playwright/no-conditional-expect, playwright/no-conditional-in-test
      if (segment.source) {
        const sourceLocator = page.getByText(segment.source, { exact: false });
        // eslint-disable-next-line playwright/no-conditional-expect
        await expect(sourceLocator).toBeVisible();
      }
    }

    /**
     * 6. Completion state verification
     *
     * Check tick does not exist in the DOM.
     * Wait for completion text.
     * Then check the tick exists after that.
     */
    await expect(loadingPage.getGreenTick(page)).toHaveCount(0);
    await expect(loadingPage.getCompletionText(page)).toBeVisible();
    await expect(loadingPage.getGreenTick(page)).toHaveCount(1);
  });

  /**
   * @tests Test case 40584 [AC7] User's browser has JavaScript disabled, and they have navigated to the "MHPD Loading your pensions" Page.
   */
  test('verify content when JavaScript is disabled', async ({ browser }) => {
    // 1. Setup a new browser context with JavaScript disabled
    const context = await browser.newContext({
      javaScriptEnabled: false,
    });
    const page = await context.newPage();

    await commonHelpers.navigateToEmulator(page);
    await commonHelpers.navigateToLoadingPage(page, 'allNewTestCases');

    // 2. Verify no progress indicators
    await expect(page.getByText(/\d+% complete/)).toHaveCount(0);
    await expect(loadingPage.getProgressBarContainer(page)).toHaveCount(0);

    // 3. Verify static "Did you know?" content (All three messages stacked)
    await expect(loadingPage.getStaticCalloutContainer(page)).toBeVisible();

    const orderedSegments = [
      {
        statement:
          'There is £31.1 billion in lost or unclaimed pension pots in the UK.',
        source: '(Lost Pensions Survey, Pensions Policy Institute, 2024)',
      },
      {
        statement:
          'Eight out of ten savers don’t know how much they’ll need in retirement.',
        source:
          '(Retirement Living Standards, Pensions and Lifetime Savings Association)',
      },
      {
        statement:
          'You usually need 35 qualifying years of National Insurance credits to get the full State Pension.',
        source: null,
      },
    ];

    /**
     * Again, these rules have been disabled as the branching logic is dictacted by our own object
     * Not the test structure itself.
     */
    for (const segment of orderedSegments) {
      await expect(
        loadingPage
          .getStaticCalloutContainer(page)
          .getByText(segment.statement),
      ).toBeVisible();
      // eslint-disable-next-line playwright/no-conditional-in-test
      if (segment.source) {
        // eslint-disable-next-line playwright/no-conditional-expect
        await expect(
          loadingPage
            .getStaticCalloutContainer(page)
            .getByText(segment.source, { exact: false }),
        ).toBeVisible();
      }
    }
  });
});
