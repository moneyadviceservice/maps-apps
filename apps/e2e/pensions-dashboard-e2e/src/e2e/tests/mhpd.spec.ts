import { expect, test } from '@maps/playwright';

import { allNewTestCases, zTestAllDetails } from '../data/scenarioDetails';

const expectedText = {
  estimateTitle: 'Pensions in your estimate (3)',
  seePensionsNotIncluded: 'See pensions not included in your estimate.',
  notInYourEstimate: 'Pensions without estimated incomes (4)',
  importantBanner:
    'Important You have 4 pensions that need you to provide more information or contact the pension provider. See pensions that need action',
  areYouExpectingToSeeOtherPensions: 'Are you expecting to see other pensions?',
  bewareOfScams:
    'Beware of scams Your Pensions Dashboard contains sensitive and valuable information. Think carefully before sharing your information with a third party. Scammers play on our sense of fear. If you’ve been contacted without warning and told you need to move your pensions to a safe place, this is a scam. If you’re worried about scams, you can: Read our guidance on spotting pension scams (opens in a new window) Call our Pensions Helpline on 0800 011 3797 (opens in a new window)',
  statePensionCardHeader: 'State Pension',
  statePensionDateField: 'State Pension date:',
};

const URL = {
  YOUR_PENSION_SEARCH_RESULTS: '/en/your-pension-search-results',
  YOUR_PENSION_BREAKDOWN: '/en/your-pension-breakdown',
  PENDING_PENSIONS: '/en/pending-pensions',
  PENSIONS_THAT_NEED_ACTION: '/en/pensions-that-need-action',
  PENSION_DETAILS: '/en/pension-details/',
  EXITED: '/en/you-have-exited-the-pensions-dashboard',
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
 * @tests Test Case 50643: Dev - Results Page Quick Wins Iterationy
 * @tests Test Case 51117 [AC5, AC6] - Are you expecting to see other pensions heading
 *
 * @tests User Story 51558: Dev - Home page link
 * @tests Test Case 51817: 51558 AC1, 5 TestCase1 : Home link visible with No back Button
 * @tests Test Case 51819: 51558 AC2 TestCase2 : Home link visible No back link on Pensions that need actions page
 * @tests Test Case 51821: 51558 AC3, 5 TestCase3 : Home link next to back link on Pensions that need action page
 * @tests Test Case 51823: 51558 AC4, 5 TestCase4 : Home link next to Back button
 *
 * @tests User Story 51449: 'Did you understand this page' component
 * @tests Test Case 52064: [AC1] Your Pensions
 * @tests Test Case 52098: [AC1] Pending Pensions
 * @tests Test Case 52100: [AC1] Pensions that Need Action
 *
 * @tests User Story 57345: FE - Combine Pending to Confirmed Pensions
 * @tests Test Case 58862: 57345 AC4 Test Case 4 : /pending-pensions url is inaccessible
 * @tests Test Case 58852: 57345 AC1 Test Case 1 : Verify no Pending Pension section on Search Results page
 *
 * This file covers more than just the above test cases.
 */

test.describe('Supported Pensions - Verify components and information', () => {
  test.beforeEach(async ({ commonSessions }) => {
    const scenarioName = zTestAllDetails.option;
    await commonSessions.navigateToPensionsFoundPage(scenarioName);
  });

  test(
    'Pensions confirmed (green)',
    { tag: '@green' },
    async ({
      page,
      isMobile,
      basePage,
      commonHelpers,
      didYouUnderstand,
      pensionBreakdownPage,
      pensionDetailsPage,
      pensionsFoundPage,
      pageNotFoundPage,
    }) => {
      // Pensions found -> your pension breakdown -> back to pensions found
      await pensionsFoundPage.waitForPensionsFound();
      await expect(page.locator(pensionsFoundPage.heading)).toHaveText(
        'Pensions found',
      );

      // Check container uses grid layout
      const display = await pensionsFoundPage.getLayoutDisplay();
      const expectedLayout = isMobile ? 'block' : 'grid';
      expect(display).toBe(expectedLayout);
      const displayedTitleTextOnPensionsFoundPage =
        await basePage.getPageTitle();
      expect(displayedTitleTextOnPensionsFoundPage).toContain(
        pensionsFoundPage.pensionFoundPageTitleText,
      );
      await pensionsFoundPage.assertPensionsFound(
        page,
        zTestAllDetails.pensions,
      );
      await expect(
        page.locator('h2:has-text("We found 11 pensions")'),
      ).toBeVisible();
      expect(page.url()).toContain(URL.YOUR_PENSION_SEARCH_RESULTS);
      await pensionsFoundPage.clickSeeYourPensions();

      await expect(page).toHaveURL(URL.YOUR_PENSION_BREAKDOWN);

      await expect(didYouUnderstand.feedbackBanner).toBeVisible();

      const displayedTitleTextOnPensionBreakdownPage =
        await basePage.getPageTitle();
      expect(displayedTitleTextOnPensionBreakdownPage).toContain(
        pensionBreakdownPage.pensionBreakdownPageTitleText,
      );

      // User story 39445
      const scamsText = await pensionBreakdownPage.getBewareOfScamsText();
      expect(scamsText).toBe(expectedText.bewareOfScams);

      const estimateTitleText =
        await pensionBreakdownPage.getEstimateTitleText();
      expect(estimateTitleText).toBe(expectedText.estimateTitle);

      const notIncludedParagraphText =
        await pensionBreakdownPage.getNotIncludedParagraphText();
      expect(notIncludedParagraphText).toBe(
        expectedText.seePensionsNotIncluded,
      );

      const statePensionCardType =
        await pensionBreakdownPage.getStatePensionCardType();
      expect(statePensionCardType).toBe(expectedText.statePensionCardHeader);

      // The below needs to be edited at some point as it is basically doing the same thing as the above under a different name.
      const statePensionCardHeading =
        await pensionBreakdownPage.getStatePensionCardType();
      expect(statePensionCardHeading).toBe(expectedText.statePensionCardHeader);

      const statePensionDateField =
        await pensionBreakdownPage.getStatePensionDateText();
      expect(statePensionDateField).toContain(
        expectedText.statePensionDateField,
      );

      const notInYourEstimateTitleText =
        await pensionBreakdownPage.getNotInYourEstimateTitleText();
      expect(notInYourEstimateTitleText).toBe(expectedText.notInYourEstimate);

      await commonHelpers.clickLink('See pensions that need action');
      await expect(page).toHaveURL(/pensions-that-need-action/);
      await expect(basePage.getHomeLink()).toBeVisible();
      await expect(basePage.getBackLink()).toBeVisible();
      await commonHelpers.clickLink('Back');

      const importantBanner = await pensionBreakdownPage.getImportantBanner();
      expect(importantBanner).toBe(expectedText.importantBanner);

      await commonHelpers.clickHomeLink();
      await pensionsFoundPage.waitForPensionsFound();

      //Pensions found -> pensions breakdown -> pension details -> back to pensions breakdown -> back to pensions found
      await pensionsFoundPage.clickSeeYourPensions();
      await pensionBreakdownPage.viewDetailsOfPension('State Pension');
      await pensionDetailsPage.assertHeadingStatePension();
      const displayedTitleTextOnStatePensionPage =
        await basePage.getPageTitle();
      expect(displayedTitleTextOnStatePensionPage).toContain(
        pensionDetailsPage.statePensionTitlePageText,
      );
      await commonHelpers.clickLink('Back');
      await commonHelpers.waitForPageToLoad(pensionBreakdownPage.heading);
      await commonHelpers.clickHomeLink();
      await commonHelpers.waitForPageToLoad(pensionsFoundPage.heading);

      // Are you expecting to see other pensions? banner
      await expect(pensionsFoundPage.areYouExpectingHeader()).toHaveText(
        expectedText.areYouExpectingToSeeOtherPensions,
      );
      await pensionsFoundPage.pensionsNotShowingLink().click();
      await expect(page).toHaveURL(/\/en\/pensions-not-showing/);
      await commonHelpers.clickHomeLink();
      await commonHelpers.waitForPageToLoad(pensionsFoundPage.heading);

      //Pending Pensions No longer displayed on Search Results page
      await expect(pensionsFoundPage.warningContainer()).toBeHidden();
      await expect(pensionsFoundPage.getPendingPensionsHeading()).toBeHidden();
      //Pending Pensions URL inaccessible
      await page.goto('en/pending-pensions');
      await expect(pageNotFoundPage.pageTitle).toHaveText(
        'Sorry we couldn’t find the page you’re looking for',
      );
    },
  );

  test('Pensions that need action (red)', async ({
    page,
    basePage,
    commonHelpers,
    didYouUnderstand,
    pensionsFoundPage,
    pensionsThatNeedActionPage,
  }) => {
    await pensionsFoundPage.clickReviewPensions();

    // Verify the new naming convention
    const displayedTitleTextOnRedPensionPage = await basePage.getPageTitle();
    expect(displayedTitleTextOnRedPensionPage).toContain(
      pensionsThatNeedActionPage.redPensionsPageTitleText,
    );
    expect(page.url()).toContain(URL.PENSIONS_THAT_NEED_ACTION);

    await expect(didYouUnderstand.feedbackBanner).toBeVisible();

    await expect(pensionsThatNeedActionPage.paragraph1).toBeVisible();
    await expect(pensionsThatNeedActionPage.paragraph2).toBeVisible();
    await expect(pensionsThatNeedActionPage.paragraph3).toBeVisible();
    await expect(pensionsThatNeedActionPage.paragraph4).toBeVisible();
    await expect(pensionsThatNeedActionPage.possibleMatchHeading).toBeVisible();
    await expect(
      pensionsThatNeedActionPage.possibleMatchParagraph,
    ).toBeVisible();
    await expect(pensionsThatNeedActionPage.moreInfoHeading).toBeVisible();
    await expect(pensionsThatNeedActionPage.moreInfoParagraph).toBeVisible();

    await pensionsThatNeedActionPage.assertPensionsThatNeedAction(
      zTestAllDetails.pensions,
    );

    // In your test:
    const items = pensionsThatNeedActionPage.listItems;
    await expect(items).toHaveCount(5);
    await expect(items).toContainText([
      'your full name, plus any previous names',
      'your date of birth',
      'your current and previous addresses',
      `your reference number, if there's one on the card`,
      'your National Insurance number (NINO)',
    ]);

    // From MEM red pension check that you can proceed to pension details page
    // and verify that its show the new pension details features(tabs).
    await pensionsThatNeedActionPage.proceedToPensionDetailsPageFromMEMPension();
    await commonHelpers.clickBackLink();
    expect(displayedTitleTextOnRedPensionPage).toContain(
      pensionsThatNeedActionPage.redPensionsPageTitleText,
    );
    expect(page.url()).toContain(URL.PENSIONS_THAT_NEED_ACTION);

    // Return to pensions found page
    await commonHelpers.clickHomeLink();
    await pensionsFoundPage.waitForPensionsFound();
    expect(page.url()).toContain(URL.YOUR_PENSION_SEARCH_RESULTS);
  });
});

test.describe('Unsupported Pensions - Verify components and information', () => {
  test.beforeEach(async ({ commonSessions }) => {
    const scenarioName = allNewTestCases.option;
    await commonSessions.navigateToPensionsFoundPage(scenarioName);
  });

  /**
   *  User story 36802
   *  @tests Test Case 40598 [AC7] - "Unsupported pensions found" component is shown
   */
  test('Unsupported pensions found', async ({ page, pensionsFoundPage }) => {
    expect(page.url()).toContain(URL.YOUR_PENSION_SEARCH_RESULTS);

    // --- Unsupported pensions callout ---
    await pensionsFoundPage.scrollUnsupportedCalloutIntoView();
    const callout = await pensionsFoundPage.getUnsupportedCalloutLocator();

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

test.describe('Home page link', () => {
  test.beforeEach(async ({ commonSessions }) => {
    const scenarioName = zTestAllDetails.option;
    await commonSessions.navigateToPensionsFoundPage(scenarioName);
  });

  test('should navigate to home page when home link is clicked', async ({
    page,
    basePage,
    pensionBreakdownPage,
    pensionDetailsPage,
    pensionsFoundPage,
    pensionsNotShowingPage,
    pensionsThatNeedActionPage,
  }) => {
    const assertHomeLinkOnlyIsVisible = async () => {
      await expect(basePage.getHomeLink()).toBeVisible();
      await expect(basePage.getBackLink()).toBeHidden();
    };
    const assertHomeLinkAndBackButtonVisible = async () => {
      await expect(basePage.getHomeLink()).toBeVisible();
      await expect(basePage.getBackLink()).toBeVisible();
    };

    // 1. Pensions breakdown page
    await pensionsFoundPage.clickSeeYourPensions();
    await assertHomeLinkOnlyIsVisible();
    await basePage.checkHomeNavigation();
    expect(page.url()).toContain(URL.YOUR_PENSION_SEARCH_RESULTS);

    // 2. Timeline page
    await pensionsFoundPage.clickSeeYourPensions();
    await pensionBreakdownPage.clickTimelineLink();
    await assertHomeLinkAndBackButtonVisible();
    await basePage.checkHomeNavigation();
    expect(page.url()).toContain(URL.YOUR_PENSION_SEARCH_RESULTS);

    // 3. Pensions that need action page
    await pensionsThatNeedActionPage.proceedToRedTrafficPensionDetailsPage();
    await assertHomeLinkOnlyIsVisible();
    await basePage.checkHomeNavigation();
    expect(page.url()).toContain(URL.YOUR_PENSION_SEARCH_RESULTS);

    // 4. Pensions not found page
    await page.goto('/en/pensions-not-showing');
    await pensionsNotShowingPage.pageLoads();
    await assertHomeLinkOnlyIsVisible();
    await basePage.checkHomeNavigation();
    expect(page.url()).toContain(URL.YOUR_PENSION_SEARCH_RESULTS);

    // 5. State pension page
    await pensionsFoundPage.clickSeeYourPensions();
    await pensionBreakdownPage.viewDetailsOfPension('State Pension');
    await pensionDetailsPage.assertHeadingStatePension();
    await assertHomeLinkAndBackButtonVisible();
    await basePage.checkHomeNavigation();
    expect(page.url()).toContain(URL.YOUR_PENSION_SEARCH_RESULTS);

    // 6. Pension details summary page
    await pensionsFoundPage.clickSeeYourPensions();
    await pensionBreakdownPage.viewDetailsOfPension('Your 21st Trust');
    await assertHomeLinkAndBackButtonVisible();
    await basePage.checkHomeNavigation();
    expect(page.url()).toContain(URL.YOUR_PENSION_SEARCH_RESULTS);

    // 7. Pension details income and values page
    await pensionsFoundPage.clickSeeYourPensions();
    await pensionBreakdownPage.viewDetailsOfPension('Your 21st Trust');
    await pensionDetailsPage.checkPensionDetailsTabs(
      'tab-pension-income-and-values',
      'Income and values',
    );
    await assertHomeLinkAndBackButtonVisible();
    await basePage.checkHomeNavigation();
    expect(page.url()).toContain(URL.YOUR_PENSION_SEARCH_RESULTS);

    // 8. Pension details about this pension page
    await pensionsFoundPage.clickSeeYourPensions();
    await pensionBreakdownPage.viewDetailsOfPension('Your 21st Trust');
    await pensionDetailsPage.checkPensionDetailsTabs(
      'tab-about-this-pension',
      'About this pension',
    );
    await assertHomeLinkAndBackButtonVisible();
    await basePage.checkHomeNavigation();
    expect(page.url()).toContain(URL.YOUR_PENSION_SEARCH_RESULTS);

    // 9. Pension details Contact pension provider page
    await pensionsFoundPage.clickSeeYourPensions();
    await pensionBreakdownPage.viewDetailsOfPension('Your 21st Trust');
    await pensionDetailsPage.checkPensionDetailsTabs(
      'tab-contact-pension-provider',
      'Contact provider',
    );
    await assertHomeLinkAndBackButtonVisible();
    await basePage.checkHomeNavigation();
    expect(page.url()).toContain(URL.YOUR_PENSION_SEARCH_RESULTS);
  });
});
