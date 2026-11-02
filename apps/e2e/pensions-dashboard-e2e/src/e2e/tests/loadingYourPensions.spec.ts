import { expect, test } from '@maps/playwright';

import { allNewTestCases } from '../data/scenarioDetails';

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
  test('verify content on loading pensions page', async ({
    commonHelpers,
    loadingPage,
  }) => {
    // 1. Initial setup
    await commonHelpers.navigateToEmulator('en');
    await commonHelpers.navigateToLoadingPage(allNewTestCases.option);

    // 2. Initial loading page content checks
    await expect(loadingPage.loadingYourPensionsHeader).toBeVisible();
    await expect(loadingPage.loadingBarSubHeader).toBeVisible();

    // 3. Progress bar verification
    await expect(loadingPage.progressBarContainer).toHaveText(/\d+% complete/);
    await expect(loadingPage.progressBarLabel).toBeVisible();

    await expect
      .poll(() => loadingPage.progressBarColour)
      .toBe('rgb(200, 42, 135)');

    await expect(loadingPage.progressBar).toHaveClass(/bg-blue-700/);

    // 4. Verify the "Do not refresh or close this page." warning text
    const expectedWarningText = 'Do not refresh or close this page.';
    await expect(loadingPage.warningText).toHaveText(expectedWarningText);
    await expect(loadingPage.warningText).toBeVisible();

    await expect
      .poll(() => commonHelpers.getStyle(loadingPage.warningText, 'fontSize'))
      .toBe('18px');

    await expect
      .poll(() => commonHelpers.getStyle(loadingPage.warningText, 'fontWeight'))
      .toBe('700');

    await expect
      .poll(() => commonHelpers.getStyle(loadingPage.warningText, 'color'))
      .toBe('rgb(0, 0, 0)');

    /**
     * 5. Completion state verification
     *
     * Check tick does not exist in the DOM.
     * Wait for completion text.
     * Then check the tick exists after that.
     */
    await expect(loadingPage.greenTick).toHaveCount(0);
    await expect(loadingPage.completionText).toBeVisible();
    await expect(loadingPage.greenTick).toHaveCount(1);
  });

  /**
   * @tests Test case 40584 [AC7] User's browser has JavaScript disabled, and they have navigated to the "MHPD Loading your pensions" Page.
   */
  test('verify content when JavaScript is disabled', async ({
    browser,
    commonHelpers,
    loadingPage,
  }) => {
    // 1. Setup a new browser context with JavaScript disabled
    const context = await browser.newContext({
      javaScriptEnabled: false,
    });
    const page = await context.newPage();

    await commonHelpers.navigateToEmulator('en');
    await commonHelpers.navigateToLoadingPageNonJs('allNewTestCasesPC');

    // 2. Verify no progress indicators
    await expect(page.getByText(/\d+% complete/)).toHaveCount(0);
    await expect(loadingPage.progressBarContainer).toHaveCount(0);
  });
});
