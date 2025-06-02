/* eslint-disable playwright/no-focused-test */
import { expect, test } from '@playwright/test';

import { zTestAllDetails } from '../data/scenarioDetails';
import loadingPage from '../pages/LoadingPage';
import pendingPensionsPage from '../pages/PendingPensionsPage';
import pensionDetailsPage from '../pages/PensionDetailsPage';
import pensionBreakdownPage from '../pages/PensionsBreakdownPage';
import pensionsFoundPage from '../pages/PensionsFoundPage';
import pensionsThatNeedAction from '../pages/PensionsThatNeedActionPage';
import scenarioSelectionPage from '../pages/ScenarioSelectionPage';
import welcomePage from '../pages/WelcomePage';
import commonHelpers from '../utils/commonHelpers';

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
    await scenarioSelectionPage.selectScenario(page, zTestAllDetails.option);
    await welcomePage.welcomePageLoads(page);
    expect(page.url()).toContain('/welcome');
    await welcomePage.clickWelcomeButton(page);
    await loadingPage.waitForPensionsToLoad(page);

    //Pensions found -> your pension breakdown - > back to pensions found
    await pensionsFoundPage.waitForPensionsFound(page);
    await expect(page.locator(pensionsFoundPage.heading)).toHaveText(
      'Pensions found',
    );
    await pensionsFoundPage.assertPensionsFound(page, zTestAllDetails.pensions);
    await expect(
      page.locator('h2:has-text("We found 14 pensions")'),
    ).toBeVisible();
    expect(page.url()).toContain(URL.YOUR_PENSION_SEARCH_RESULTS);
    await pensionsFoundPage.clickSeeYourPensions(page);
    expect(page.url()).toContain(URL.YOUR_PENSION_BREAKDOWN);
    await pensionBreakdownPage.assertPensions(page, zTestAllDetails.pensions);
    await commonHelpers.clickLink(page, 'Back');
    await pensionsFoundPage.waitForPensionsFound(page);

    //Pensions found -> pensions breakdown -> pension details -> back to pensions breakdown -> back to pensions found
    await pensionsFoundPage.clickSeeYourPensions(page);
    await pensionBreakdownPage.viewDetailsOfPension(page, 'State Pension');
    await pensionDetailsPage.assertHeading(page, 'State Pension');
    await commonHelpers.clickLink(page, 'Back');
    await commonHelpers.waitForPageToLoad(page, pensionBreakdownPage.heading);
    await commonHelpers.clickLink(page, 'Back');
    await commonHelpers.waitForPageToLoad(page, pensionsFoundPage.heading);
  });

  test('Pensions pending (yellow)', async ({ page }) => {
    await scenarioSelectionPage.selectScenario(page, zTestAllDetails.option);
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
    await commonHelpers.clickLink(page, 'Back');
    await commonHelpers.waitForPageToLoad(page, pensionsFoundPage.heading);
    expect(page.url()).toContain(URL.YOUR_PENSION_SEARCH_RESULTS);
    await pensionsFoundPage.clickSeePendingPensions(page);
    await pendingPensionsPage.pageLoads(page);
    await pendingPensionsPage.assertPendingPensions(
      page,
      zTestAllDetails.pensions,
    );
    await pendingPensionsPage.viewDetailsOfPension(
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
    await scenarioSelectionPage.selectScenario(page, zTestAllDetails.option);
    await welcomePage.welcomePageLoads(page);
    await welcomePage.clickWelcomeButton(page);
    await loadingPage.waitForPensionsToLoad(page);
    //Pensions found, pension administrator, red box header
    await pensionsFoundPage.waitForPensionsFound(page);
    await pensionsFoundPage.assertPensionsFound(page, zTestAllDetails.pensions);
    //navigate to 'review pensions that need action' page
    await pensionsFoundPage.clickReviewPensions(page);
    await pensionsThatNeedAction.assertPensionsThatNeedAction(
      page,
      zTestAllDetails.pensions,
    );
    //navigate back to previous page
    expect(page.url()).toContain(URL.PENSIONS_THAT_NEED_ACTION);
    await pensionsThatNeedAction.navigateBack(page);
    await pensionsFoundPage.waitForPensionsFound(page);
    expect(page.url()).toContain(URL.YOUR_PENSION_SEARCH_RESULTS);
  });
});
