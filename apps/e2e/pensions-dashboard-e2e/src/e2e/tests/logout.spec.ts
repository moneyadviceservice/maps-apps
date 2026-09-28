import { expect, test } from '@maps/playwright';

import { allNewTestCases } from '../data/scenarioDetails';

/**
 * @tests User Story 39277 IMP01 - UX/UI Improvements - All MHPD Pages - Back to top link
 * @test  User Story 39423 IMP05 - UX/UI Improvements - Pensions that need action Page
 * @test  User Story 40993 UX/UI Improvements Welcome Page - Additional UX/I Improvements
 * @test  User Story 40991 UX/UI Improvements Landing Page - Additional UX/I Improvements
 * @tests Test Case 39966: 39277 Test Case 1 AC1 Back to top link is visible all MHPD pages - Desktop View
 * @tests User Story 53942: Exit page updates
 * @tests Test Case 54955: 53942 - AC1 - Test Case 1 - Page content
 * @tests Test Case 54956: 53942 - AC2 - Test Case 2 - Make the most of your pension hyperlink
 * @tests Test Case 54957: 53942 - AC3 - Test Case 3 - Budget Planner hyperlink
 * @tests Test Case 54959: 53942 - AC4 - Test Case 4 - Pension Calculator hyperlink
 * @tests Test Case 54960: 53942 - AC5 - Test Case 5 - Return to start page button
 * @tests Test Case 54961: 53942 - AC6 - Test Case 6 - Mobile Testing
 */

test.beforeEach(async ({ commonHelpers }) => {
  await commonHelpers.navigateToStartPage();
  await commonHelpers.setCookieConsentAccepted();
});

test.describe('JavaScript Enabled', () => {
  test.use({ javaScriptEnabled: true });

  test(
    'Verify Logout link has been removed from landing page but visible on other pages: logout via logout link from support pages',
    { tag: ['@smokeTest', '@logout', '@jsenabled'] },
    async ({
      page,
      basePage,
      commonHelpers,
      homePage,
      loadingPage,
      pensionsFoundPage,
      supportPages,
      youHaveExitedTheDashboardPage,
      scenarioSelectionPage,
      welcomePage,
    }) => {
      // Verify logout is no longer on landing page
      await expect(page.getByTestId('start')).toBeVisible();

      //Navigate to Pension found page
      await homePage.clickStart();
      await page
        .locator(scenarioSelectionPage.submitButton)
        .waitFor({ state: 'visible' });
      await scenarioSelectionPage.selectScenarioComposerDev(
        allNewTestCases.option,
      );
      await welcomePage.welcomePageLoads();
      await welcomePage.clickWelcomeButton();
      await loadingPage.waitForPensionsToLoad(commonHelpers, 'en');
      await pensionsFoundPage.waitForPensionsFound();

      // Navigate to support page and verify logout functionality
      await supportPages.findLinkAndSelect('Explore the Pensions Dashboard');
      expect(page.url()).toContain('/explore-the-pensions-dashboard');
      await basePage.clickBurgerIcon();
      await expect(page.getByTestId(basePage.logoutLink)).toBeVisible();
      await expect(page.locator(basePage.cyLink)).toBeVisible();

      // Complete logout flow
      await basePage.logoutSuccessfully();
      await youHaveExitedTheDashboardPage.viewPage();

      const testLinks = [
        {
          name: 'Make the most of your pension',
          url: 'https://www.moneyhelper.org.uk/en/pensions-and-retirement/make-the-most-of-your-pension',
        },
        {
          name: 'Budget planner',
          url: 'https://www.moneyhelper.org.uk/en/everyday-money/budgeting/budget-planner',
        },
        {
          name: 'Pension calculator',
          url: 'https://www.moneyhelper.org.uk/en/pensions-and-retirement/pensions-basics/pension-calculator',
        },
      ];

      for (const item of testLinks) {
        const newTab = await youHaveExitedTheDashboardPage.clickLink(item.name);

        await expect(newTab).toHaveURL(item.url);

        await newTab.close();
      }

      await youHaveExitedTheDashboardPage.clickReturnToStart();
      await homePage.checkHomePageLoads();
      await expect(page.getByTestId('start')).toBeVisible();
      await basePage.clickBurgerIcon();
      await expect(page.getByTestId(basePage.logoutLink)).toBeHidden();
      await expect(page.locator(basePage.cyLink)).toBeVisible();
      await basePage.closeBurgerMenuButton();
    },
  );

  test('Logout via link from What you can do section on Possible Pension page', async ({
    page,
    basePage,
    commonHelpers,
    homePage,
    loadingPage,
    pensionsFoundPage,
    pensionsThatNeedActionPage,
    scenarioSelectionPage,
    welcomePage,
  }) => {
    await homePage.clickStart();
    await page
      .locator(scenarioSelectionPage.submitButton)
      .waitFor({ state: 'visible' });
    await scenarioSelectionPage.selectScenarioComposerDev(
      allNewTestCases.option,
    );
    await welcomePage.welcomePageLoads();
    await welcomePage.clickWelcomeButton();
    await loadingPage.waitForPensionsToLoad(commonHelpers, 'en');
    //Pensions found, pension administrator, red box header
    await pensionsFoundPage.waitForPensionsFound();
    //navigate to 'review pensions that need action' page
    await pensionsFoundPage.hasRedChannel();
    await pensionsFoundPage.clickReviewPensions();
    // logout from the link on What You Can Do section
    await pensionsThatNeedActionPage.proceedToLogoutViaWhatYouCanDoSection(
      basePage,
    );
  });
});

test.describe('JavaScript Disabled', () => {
  test.use({ javaScriptEnabled: false });

  test(
    'Verify Logout link has been removed from landing page but visible on other pages: logout via logout link from pension found page',
    { tag: ['@smokeTest', '@logout', '@jsdisabled'] },
    async ({
      page,
      basePage,
      homePage,
      loadingPage,
      pensionsFoundPage,
      youHaveExitedTheDashboardPage,
      scenarioSelectionPage,
      welcomePage,
    }) => {
      await expect(page.getByTestId('start')).toBeVisible();
      await page.locator(basePage.burgerIcon).click();
      await expect(page.getByTestId(basePage.logoutLink)).toBeHidden();
      await expect(page.locator(basePage.cyLink)).toBeVisible();
      await page.locator(basePage.burgerIcon).click();

      //Navigate to Pension found page
      await homePage.clickStart();
      await page
        .locator(scenarioSelectionPage.submitButton)
        .waitFor({ state: 'visible' });
      await scenarioSelectionPage.selectScenarioNonJs('allNewTestCasesPC');
      await welcomePage.welcomePageLoads();
      await welcomePage.clickWelcomeButton();
      await loadingPage.waitForPensionsToLoadJSDisabled();
      await pensionsFoundPage.waitForPensionsFound();

      // verify logout functionality from pension found page
      await basePage.openBurgerMenuButton();
      await expect(page.getByTestId(basePage.logoutLink)).toBeVisible();
      await expect(page.locator(basePage.cyLink)).toBeVisible();

      // Complete logout flow
      await basePage.logoutSuccessfullyJSDisabled();
      await youHaveExitedTheDashboardPage.viewPage();
      await youHaveExitedTheDashboardPage.clickReturnToStart();
      await homePage.checkHomePageLoads('en');
      await expect(page.getByTestId('start')).toBeVisible();
    },
  );
});
