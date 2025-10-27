/* eslint-disable playwright/no-focused-test */
import { expect, test } from '@playwright/test';

import { allNewTestCases, zTestAllDetails } from '../data/scenarioDetails';
import basePage from '../pages/BasePage';
import loadingPage from '../pages/LoadingPage';
import pendingPensionsPage from '../pages/PendingPensionsPage';
import pensionDetailsPage from '../pages/PensionDetailsPage';
import pensionBreakdownPage from '../pages/PensionsBreakdownPage';
import pensionsFoundPage from '../pages/PensionsFoundPage';
import pensionsThatNeedAction from '../pages/PensionsThatNeedActionPage';
import scenarioSelectionPage from '../pages/ScenarioSelectionPage';
import welcomePage from '../pages/WelcomePage';
import commonHelpers from '../utils/commonHelpers';

const expectedText = {
  estimateTitle: 'Pensions in your estimate (3)',
  seePensionsNotIncluded: 'See pensions not included in your estimate.',
  notInYourEstimate: 'Not in your estimate (3)',
  importantBanner:
    'Important You have 4 pensions that need you to provide more information or contact the pension provider. See pensions that need action',
  bewareOfScams:
    'Beware of scams Your Pensions Dashboard contains sensitive and valuable information. Think carefully before sharing your information with a third party. Scammers play on our sense of fear. If you’ve been contacted without warning and told you need to move your pensions to a safe place, this is a scam. If you’re worried about scams, you can: Read our guidance on spotting pension scams (opens in a new window) Call our financial crimes and scams unit on 0800 015 4402 (opens in a new window)',
  statePensionCardHeader: 'State Pension',
  statePensionDateField: 'State Pension date:',
};

/**
 * Tests have been updated to account for user story 36802, and cover the following test cases
 * @tests Test Case 40586 [AC1] - Desktop layout is horizontal
 * @tests Test Case 40590 [AC2] - Sub-heading for multiple pensions found
 * @tests Test Case 40592 [AC3] - Green Channel content is correct
 * @tests Test Case 40593 [AC4] - Amber Channel content is correct
 * @tests Test Case 40594 [AC5] - Red Channel content is correct
 * @tests Test Case 40595 [AC6] - Three equal columns for Green, Amber, and Red pensions
 *
 *
 * Tests have been updated to account for user story 39445, and cover the following test cases
 * @tests Test Case 40554 [AC1] - Verify 'Pensions in your estimate' sub-heading and count
 * @tests Test Case 40555 [AC1] - Verify "See pensions not included" text and CTA when applicable
 * @tests Test Case 40556 [AC2] - Verify 'Not in your estimate' sub-heading and count
 * @tests Test Case 40557 [AC3] - Verify State Pension card details
 * @tests Test Case 40558 [AC4] - Verify "Expected retirement date" field on pension cards not in the estimate
 * @tests Test Case 40561 [AC5] - Verify banner is shown and text is correct when pensions need action
 * @tests Test Case 40563 [AC5] - Verify CTA Label
 * @tests Test Case 40564 [AC6] - Verify 'Beware of scams' banner content
 *
 *
 * The following test case has been retroactively applied to existing test. This file covers more than just the below test case.
 * @tests User Story 39705 - Update naming convention to conform to GDS standards
 * @tests Test Case 38798 [AC0] - Search parameters not present in URL
 * @tests Test Case 38798 [AC1] - Search parameters present in URL
 *
 * This file covers more than just the above test cases.
 */

test.describe('Moneyhelper Pension Dashboard', () => {
  const URL: { [key in string]: string } = {
    YOUR_PENSION_SEARCH_RESULTS: '/en/your-pension-search-results',
    YOUR_PENSION_BREAKDOWN: '/en/your-pension-breakdown',
    PENDING_PENSIONS: '/en/pending-pensions',
    PENSIONS_THAT_NEED_ACTION: '/en/pensions-that-need-action',
    PENSION_DETAILS: '/en/pension-details/',
    EXITED: '/en/you-have-exited-the-pensions-dashboard',
  };
  test.beforeEach(async ({ page }) => {
    await commonHelpers.navigateToEmulator(page);
  });
  test.afterEach(async ({ page }) => {
    await commonHelpers.logoutOfApplication(page);
  });

  test('Pensions confirmed (green)', { tag: '@green' }, async ({ page }) => {
    await scenarioSelectionPage.selectScenarioComposerDev(
      page,
      zTestAllDetails.option,
    );
    await welcomePage.welcomePageLoads(page);
    // Added to cover Test Case 38798
    await page.waitForURL('**/welcome');
    const displayedTitleTextonWelcomePage = await basePage.getPageTitle(page);
    expect(displayedTitleTextonWelcomePage).toContain(
      welcomePage.welcomePageTitleText,
    );
    await welcomePage.clickWelcomeButton(page);
    await loadingPage.waitForPensionsToLoad(page);

    //Pensions found -> your pension breakdown - > back to pensions found
    await pensionsFoundPage.waitForPensionsFound(page);
    await expect(page.locator(pensionsFoundPage.heading)).toHaveText(
      'Pensions found',
    );

    // Check container uses grid layout
    const display = await pensionsFoundPage.getLayoutDisplay(page);
    await expect(display).toBe('grid');

    const displayedTitleTextOnPensionsFoundPage = await basePage.getPageTitle(
      page,
    );
    expect(displayedTitleTextOnPensionsFoundPage).toContain(
      pensionsFoundPage.pensionFoundPageTitleText,
    );
    await pensionsFoundPage.assertPensionsFound(page, zTestAllDetails.pensions);
    await expect(
      page.locator('h2:has-text("We found 11 pensions")'),
    ).toBeVisible();
    expect(page.url()).toContain(URL.YOUR_PENSION_SEARCH_RESULTS);
    await pensionsFoundPage.clickSeeYourPensions(page);
    expect(page.url()).toContain(URL.YOUR_PENSION_BREAKDOWN);
    const displayedTitleTextOnPensionBreakdownPage =
      await basePage.getPageTitle(page);
    expect(displayedTitleTextOnPensionBreakdownPage).toContain(
      pensionBreakdownPage.pensionBreakdownPageTitleText,
    );
    await pensionBreakdownPage.assertPensions(page, zTestAllDetails.pensions);

    // User story 39445
    const scamsText = await pensionBreakdownPage.getBewareOfScamsText(page);
    expect(scamsText).toBe(expectedText.bewareOfScams);

    const estimateTitleText = await pensionBreakdownPage.getEstimateTitleText(
      page,
    );
    expect(estimateTitleText).toBe(expectedText.estimateTitle);

    const notIncludedParagraphText =
      await pensionBreakdownPage.getNotIncludedParagraphText(page);
    expect(notIncludedParagraphText).toBe(expectedText.seePensionsNotIncluded);

    const statePensionCardType =
      await pensionBreakdownPage.getStatePensionCardType(page);
    expect(statePensionCardType).toBe(expectedText.statePensionCardHeader);

    const statePensionCardHeading =
      await pensionBreakdownPage.getStatePensionCardHeading(page);
    expect(statePensionCardHeading).toBe(expectedText.statePensionCardHeader);

    const statePensionDateField =
      await pensionBreakdownPage.getStatePensionDateText(page);
    expect(statePensionDateField).toContain(expectedText.statePensionDateField);

    await commonHelpers.clickLink(page, 'not included');
    await expect(page).toHaveURL(/#no-income/);

    const notInYourEstimateTitleText =
      await pensionBreakdownPage.getNotInYourEstimateTitleText(page);
    expect(notInYourEstimateTitleText).toBe(expectedText.notInYourEstimate);

    await commonHelpers.clickLink(page, 'See pensions that need action');
    await expect(page).toHaveURL(/pensions-that-need-action/);
    await commonHelpers.clickLink(page, 'Back');

    const importantBanner = await pensionBreakdownPage.getImportantBanner(page);
    expect(importantBanner).toBe(expectedText.importantBanner);

    await commonHelpers.clickLink(page, 'Back');
    await pensionsFoundPage.waitForPensionsFound(page);

    //Pensions found -> pensions breakdown -> pension details -> back to pensions breakdown -> back to pensions found
    await pensionsFoundPage.clickSeeYourPensions(page);
    await pensionBreakdownPage.viewDetailsOfPension(page, 'State Pension');
    await pensionDetailsPage.assertHeadingStatePension(page);
    const displayedTitleTextOnStatePensionPage = await basePage.getPageTitle(
      page,
    );
    expect(displayedTitleTextOnStatePensionPage).toContain(
      pensionDetailsPage.statePensionTitlePageText,
    );
    await commonHelpers.clickLink(page, 'Back');
    await commonHelpers.waitForPageToLoad(page, pensionBreakdownPage.heading);
    await commonHelpers.clickLink(page, 'Back');
    await commonHelpers.waitForPageToLoad(page, pensionsFoundPage.heading);
  });

  test('Pensions pending (yellow)', async ({ page }) => {
    await scenarioSelectionPage.selectScenarioComposerDev(
      page,
      zTestAllDetails.option,
    );
    await welcomePage.welcomePageLoads(page);
    expect(page.url()).toContain('/welcome');
    await welcomePage.clickWelcomeButton(page);

    //Pensions found -> See pending pensions - > back to pensions found
    await loadingPage.waitForPensionsToLoad(page);
    await pensionsFoundPage.waitForPensionsFound(page);
    await expect(page.locator(pensionsFoundPage.heading)).toHaveText(
      'Pensions found',
    );
    await pensionsFoundPage.assertPensionsFound(page, zTestAllDetails.pensions);
    expect(page.url()).toContain(URL.YOUR_PENSION_SEARCH_RESULTS);

    //Pensions found -> See pending pensions - > Pension details page
    await pensionsFoundPage.clickSeePendingPensions(page);
    await pendingPensionsPage.pageLoads(page);
    expect(page.url()).toContain(URL.PENDING_PENSIONS);
    const displayedTitleTextOnPendingPensionPage = await basePage.getPageTitle(
      page,
    );
    expect(displayedTitleTextOnPendingPensionPage).toContain(
      pendingPensionsPage.pendingPensionsPageTitleText,
    );
    await commonHelpers.clickLink(page, 'Back');
    await commonHelpers.waitForPageToLoad(page, pensionsFoundPage.heading);
    expect(page.url()).toContain(URL.YOUR_PENSION_SEARCH_RESULTS);
    await pensionsFoundPage.clickSeePendingPensions(page);
    await pendingPensionsPage.pageLoads(page);
    await pendingPensionsPage.assertPendingPensions(
      page,
      zTestAllDetails.pensions,
    );
    await pendingPensionsPage.viewDetailsOfPendingPension(
      page,
      'Master Trust Workplace 0887',
    );
    await pensionDetailsPage.assertPendingPensionDetailsPage(
      page,
      zTestAllDetails.pensions,
    );

    //Pension details page -> Pending pensions page -> Pensions found page
    await commonHelpers.clickLink(page, 'Back');
    await pendingPensionsPage.pageLoads(page);
    expect(page.url()).toContain(URL.PENDING_PENSIONS);
    await commonHelpers.clickLink(page, 'Back');
    await commonHelpers.waitForPageToLoad(page, pensionsFoundPage.heading);
    expect(page.url()).toContain(URL.YOUR_PENSION_SEARCH_RESULTS);
  });

  test('Pensions that need action (red)', async ({ page }) => {
    await commonHelpers.navigatetoPensionsFoundPage(
      page,
      zTestAllDetails.option,
    );

    await pensionsFoundPage.clickReviewPensions(page);
    // verify the new naming convention
    const displayedTitleTextOnRedPensionPage = await basePage.getPageTitle(
      page,
    );
    expect(displayedTitleTextOnRedPensionPage).toContain(
      pensionsThatNeedAction.redPensionsPageTitleText,
    );
    expect(page.url()).toContain(URL.PENSIONS_THAT_NEED_ACTION);
    // from MEM red pension check that you can proceed to pension details page
    // and verify that its show the new pension details features(tabs)
    await pensionsThatNeedAction.proceedToPensionDetailsPageFromMEMPension(
      page,
    );
    await commonHelpers.clickBackLink(page);
    expect(displayedTitleTextOnRedPensionPage).toContain(
      pensionsThatNeedAction.redPensionsPageTitleText,
    );
    expect(page.url()).toContain(URL.PENSIONS_THAT_NEED_ACTION);
    // retutn to pensions found page
    await commonHelpers.clickBackLink(page);
    await pensionsFoundPage.waitForPensionsFound(page);
    expect(page.url()).toContain(URL.YOUR_PENSION_SEARCH_RESULTS);
  });

  /**
   *  User story 36802
   *  @tests Test Case 40598 [AC7] - "Unsupported pensions found" component is shown
   */
  test('Unsupported pensions found', async ({ page }) => {
    await scenarioSelectionPage.selectScenarioComposerDev(
      page,
      allNewTestCases.option,
    );
    await welcomePage.welcomePageLoads(page);
    await welcomePage.clickWelcomeButton(page);
    await loadingPage.waitForPensionsToLoad(page);
    await pensionsFoundPage.waitForPensionsFound(page);
    expect(page.url()).toContain(URL.YOUR_PENSION_SEARCH_RESULTS);

    // --- Unsupported pensions callout ---
    await pensionsFoundPage.scrollUnsupportedCalloutIntoView(page);
    const callout = await pensionsFoundPage.getUnsupportedCalloutLocator(page);

    // Wait until it's in the viewport before asserting
    await expect
      .poll(async () =>
        callout.evaluate((el) => {
          const r = el.getBoundingClientRect();
          return (
            r.top <
              (window.innerHeight || document.documentElement.clientHeight) &&
            r.bottom > 0
          );
        }),
      )
      .toBeTruthy();

    await expect(callout).toBeVisible();
    await expect(callout.getByText('Unsupported pensions found')).toBeVisible();
    await expect(callout).toContainText(
      'We found 1 or more pensions that could belong to you that we can’t display yet.',
    );
  });
});
