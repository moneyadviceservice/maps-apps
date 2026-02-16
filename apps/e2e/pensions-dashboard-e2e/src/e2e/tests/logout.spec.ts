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
 *
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
      await basePage.clickBurgerIcon(page);
      await expect(page.getByTestId(basePage.logoutLink)).toBeHidden();
      await expect(page.locator(basePage.cyLink)).toBeHidden();
      await basePage.closeBurgerMenuButton(page);

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
      await expect(page.locator(basePage.cyLink)).toBeHidden();

      // Complete logout flow
      await basePage.logoutSuccessfully(page);
      await youHaveExitedTheDashboardPage.viewPage(page);
      await youHaveExitedTheDashboardPage.clickReturnToStart(page);
      await homePage.checkHomePageLoads(page);
      await expect(page.getByTestId('start')).toBeVisible();
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
      await expect(page.locator(basePage.cyLink)).toBeHidden();
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
      await basePage.closeBurgerMenuButton(page);
      await expect(page.getByTestId(basePage.logoutLink)).toBeVisible();
      await expect(page.locator(basePage.cyLink)).toBeHidden();

      // Complete logout flow
      await basePage.logoutSuccessfullyJSDisabled(page);
      await youHaveExitedTheDashboardPage.viewPage(page);
      await youHaveExitedTheDashboardPage.clickReturnToStart(page);
      await homePage.checkHomePageLoads(page);
      await expect(page.getByTestId('start')).toBeVisible();
    },
  );
});
