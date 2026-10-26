import { test } from '@playwright/test';

import aboutYouPage from '../pages/AboutYouPage';
import browserTabPage from '../pages/BrowserTabPage';
import { basePage } from '../pages/basePage';
import homePage from '../pages/HomePage';
import retirementIncomePage from '../pages/RetirementIncomePage';
import retirementCostsPage from '../pages/RetirementCostsPage';
import { otherToolsToTry } from '../data/your-results';

/**
 * @tests User Story 51044
 * @tests Test Case 52047: 51044 AC1 TEST CASE 1: Verify all browser tab titles display correctly in Welsh when on the CY version of the RBP
 */
const { mortgageRepayment } = otherToolsToTry.cost;

const expectedTabTitles = {
  aboutYou:
    'Amdanoch chi | Cynlluniwr cyllideb ar gyfer ymddeoliad | Teclynnau HelpwrArian',
  income:
    'Incwm ymddeoliad | Cynlluniwr cyllideb ar gyfer ymddeoliad | Teclynnau HelpwrArian',
  costs:
    'Costau ymddeoliad | Cynlluniwr cyllideb ar gyfer ymddeoliad | Teclynnau HelpwrArian',
  results:
    'Eich canlyniadau | Cynlluniwr cyllideb ar gyfer ymddeoliad | Teclynnau HelpwrArian',
};

test.describe('Retirement Budget Planner - Browser Tab Title in Welsh (CY)', () => {
  test.afterEach(async ({ page, context }) => {
    await page.close();
    await context.close();
  });

  test('should display correct tab titles on all pages', async ({ page }) => {
    // Fill About You and navigate to Income page
    await homePage.startRetirementBudgetPlanner(page);
    await page.waitForLoadState('load');
    await homePage.clickWelshLink(page);
    await basePage.waitForPageHeading(page, 'Amdanoch chi');
    await browserTabPage(page).verifyTabTitle(expectedTabTitles.aboutYou);
    await homePage.clickEnglishLink(page);
    await aboutYouPage.fillValuesAndContinue(page);
    await basePage.waitForPageHeading(page, 'Retirement income');

    // Fill Income and navigate to Costs page
    await homePage.clickWelshLink(page);
    await basePage.waitForPageHeading(page, 'Incwm ymddeoliad');
    await browserTabPage(page).verifyTabTitle(expectedTabTitles.income);
    await homePage.clickEnglishLink(page);
    await retirementIncomePage.fillValuesAndContinue(page, '5000');
    await basePage.waitForPageHeading(page, 'Retirement costs');

    // Fill Costs and navigate to Results page
    await homePage.clickWelshLink(page);
    await basePage.waitForPageHeading(page, 'Costau ymddeoliad');
    await browserTabPage(page).verifyTabTitle(expectedTabTitles.costs);
    await homePage.clickEnglishLink(page);
    await retirementCostsPage.fillValuesAndContinue(
      page,
      mortgageRepayment,
      'formmortgageRepaymentId',
    );
    // Results page
    await basePage.waitForPageHeading(page, 'Your results');
    await homePage.clickWelshLink(page);
    await basePage.waitForPageHeading(page, 'Eich canlyniadau');
    await browserTabPage(page).verifyTabTitle(expectedTabTitles.results);
  });
});
