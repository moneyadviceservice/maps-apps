import { expect, test } from '@playwright/test';

import basePage from '../pages/BasePage';
import homePage from '../pages/HomePage';
import loadingPage from '../pages/LoadingPage';
import pensionsFoundPage from '../pages/PensionsFoundPage';
import scenarioSelectionPage from '../pages/ScenarioSelectionPage';
import supportPages from '../pages/SupportPages';
import welcomePage from '../pages/WelcomePage';
import youHaveExitedTheDashboardPage from '../pages/YouHaveExitedTheDashboardPage';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  const areCookiesCleared = await homePage.assertCookiesCleared(page);
  expect(areCookiesCleared).toBe(true);
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
      await expect(page.locator(basePage.logoutLink)).toBeHidden();
      await expect(page.locator(basePage.cyLink)).toBeHidden();
      await basePage.closeBurgerMenuButton(page);

      //Navigate to Pension found page
      await homePage.clickStart(page);
      await page
        .locator(scenarioSelectionPage.submitButton)
        .waitFor({ state: 'visible' });
      await scenarioSelectionPage.selectScenario(page, 'allNewTestCases');
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
      await expect(page.locator(basePage.logoutLink)).toBeVisible();
      await expect(page.locator(basePage.cyLink)).toBeHidden();

      // Complete logout flow
      await basePage.logoutSuccessfully(page);
      await youHaveExitedTheDashboardPage.viewPage(page);
      await youHaveExitedTheDashboardPage.clickReturnToStart(page);
      await homePage.checkHomePageLoads(page);
      await expect(page.getByTestId('start')).toBeVisible();
    },
  );
});

test.describe('JavaScript Disabled', () => {
  test.use({ javaScriptEnabled: false });

  test(
    'Verify Logout link has been removed from landing page but visible on other pages: logout via logout link from pension found page',
    { tag: ['@smokeTest', '@logout', '@jsdisabled'] },
    async ({ page }) => {
      await expect(page.getByTestId('start')).toBeVisible();
      await page.locator(basePage.burgerIcon).click();
      await expect(page.locator(basePage.logoutLink)).toBeHidden();
      await expect(page.locator(basePage.cyLink)).toBeHidden();
      await page.locator(basePage.burgerIcon).click();

      //Navigate to Pension found page
      await homePage.clickStart(page);
      await page
        .locator(scenarioSelectionPage.submitButton)
        .waitFor({ state: 'visible' });
      await scenarioSelectionPage.selectScenario(page, 'allNewTestCases');
      await welcomePage.welcomePageLoads(page);
      await welcomePage.clickWelcomeButton(page);
      await loadingPage.waitForPensionsToLoadJSDisabled(page);
      await pensionsFoundPage.waitForPensionsFound(page);

      // verify logout functionality from pension found page
      await basePage.closeBurgerMenuButton(page);
      await expect(page.locator(basePage.logoutLink)).toBeVisible();
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
