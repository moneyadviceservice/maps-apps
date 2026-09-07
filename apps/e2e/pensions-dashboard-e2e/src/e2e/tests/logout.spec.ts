import { expect, test } from '@maps/playwright';

import { allNewTestCases } from '../data/scenarioDetails';
import basePage from '../pages/BasePage';
import homePage from '../pages/HomePage';
import loadingPage from '../pages/LoadingPage';
import pensionsFoundPage from '../pages/PensionsFoundPage';
import pensionsThatNeedAction from '../pages/PensionsThatNeedActionPage';
import scenarioSelectionPage from '../pages/ScenarioSelectionPage';
import supportPages from '../pages/SupportPages';
import welcomePage from '../pages/WelcomePage';
import youHaveExitedTheDashboardPage from '../pages/YouHaveExitedTheDashboardPage';
import commonHelpers from '../utils/commonHelpers';

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

test.beforeEach(async ({ page }) => {
  await commonHelpers.navigateToStartPage(page);
  await commonHelpers.setCookieConsentAccepted(page);
});

test.describe('JavaScript Enabled', () => {
  test.use({ javaScriptEnabled: true });

  test(
    'Verify Logout link has been removed from landing page but visible on other pages: logout via logout link from support pages',
    { tag: ['@smokeTest', '@logout', '@jsenabled'] },
    async ({ page }) => {
      // Verify logout is no longer on landing page
      await expect(page.getByTestId('start')).toBeVisible();

      //Navigate to Pension found page
      await homePage.clickStart(page);
      await page
        .locator(scenarioSelectionPage.submitButton)
        .waitFor({ state: 'visible' });
      await scenarioSelectionPage.selectScenarioComposerDev(
        page,
        allNewTestCases.option,
      );
      await welcomePage.welcomePageLoads(page);
      await welcomePage.clickWelcomeButton(page);
      await loadingPage.waitForPensionsToLoad(page);
      await pensionsFoundPage.waitForPensionsFound(page);

      // Navigate to support page and verify logout functionality
      await supportPages.findLinkAndSelect(
        page,
        'Explore the Pensions Dashboard',
      );
      expect(page.url()).toContain('/explore-the-pensions-dashboard');
      await basePage.clickBurgerIcon(page);
      await expect(page.getByTestId(basePage.logoutLink)).toBeVisible();
      await expect(page.locator(basePage.cyLink)).toBeVisible();

      // Complete logout flow
      await basePage.logoutSuccessfully(page);
      await youHaveExitedTheDashboardPage.viewPage(page);

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
        const newTab = await youHaveExitedTheDashboardPage.clickLink(
          page,
          item.name,
        );

        await expect(newTab).toHaveURL(item.url);

        await newTab.close();
      }

      await youHaveExitedTheDashboardPage.clickReturnToStart(page);
      await homePage.checkHomePageLoads(page);
      await expect(page.getByTestId('start')).toBeVisible();
      await basePage.clickBurgerIcon(page);
      await expect(page.getByTestId(basePage.logoutLink)).toBeHidden();
      await expect(page.locator(basePage.cyLink)).toBeVisible();
      await basePage.closeBurgerMenuButton(page);
    },
  );

  test('Logout via link from What you can do section on Possible Pension page', async ({
    page,
  }) => {
    await homePage.clickStart(page);
    await page
      .locator(scenarioSelectionPage.submitButton)
      .waitFor({ state: 'visible' });
    await scenarioSelectionPage.selectScenarioComposerDev(
      page,
      allNewTestCases.option,
    );
    await welcomePage.welcomePageLoads(page);
    await welcomePage.clickWelcomeButton(page);
    await loadingPage.waitForPensionsToLoad(page);
    //Pensions found, pension administrator, red box header
    await pensionsFoundPage.waitForPensionsFound(page);
    //navigate to 'review pensions that need action' page
    await pensionsFoundPage.hasRedChannel(page);
    await pensionsFoundPage.clickReviewPensions(page);
    // logout from the link on What You Can Do section
    await pensionsThatNeedAction.proceedToLogoutViaWhatYouCanDoSection(page);
  });
});

test.describe('JavaScript Disabled', () => {
  test.use({ javaScriptEnabled: false });

  test(
    'Verify Logout link has been removed from landing page but visible on other pages: logout via logout link from pension found page',
    { tag: ['@smokeTest', '@logout', '@jsdisabled'] },
    async ({ page }) => {
      await expect(page.getByTestId('start')).toBeVisible();
      await page.locator(basePage.burgerIcon).click();
      await expect(page.getByTestId(basePage.logoutLink)).toBeHidden();
      await expect(page.locator(basePage.cyLink)).toBeVisible();
      await page.locator(basePage.burgerIcon).click();

      //Navigate to Pension found page
      await homePage.clickStart(page);
      await page
        .locator(scenarioSelectionPage.submitButton)
        .waitFor({ state: 'visible' });
      await scenarioSelectionPage.selectScenarioNonJs(
        page,
        'allNewTestCasesPC',
      );
      await welcomePage.welcomePageLoads(page);
      await welcomePage.clickWelcomeButton(page);
      await loadingPage.waitForPensionsToLoadJSDisabled(page);
      await pensionsFoundPage.waitForPensionsFound(page);

      // verify logout functionality from pension found page
      await basePage.openBurgerMenuButton(page);
      await expect(page.getByTestId(basePage.logoutLink)).toBeVisible();
      await expect(page.locator(basePage.cyLink)).toBeVisible();

      // Complete logout flow
      await basePage.logoutSuccessfullyJSDisabled(page);
      await youHaveExitedTheDashboardPage.viewPage(page);
      await youHaveExitedTheDashboardPage.clickReturnToStart(page);
      await homePage.checkHomePageLoads(page);
      await expect(page.getByTestId('start')).toBeVisible();
    },
  );
});
