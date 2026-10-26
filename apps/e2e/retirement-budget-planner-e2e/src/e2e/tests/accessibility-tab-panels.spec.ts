import { expect, test } from '@playwright/test';

import { aboutYouTab, aboutYouTitle } from '../data/about-you';
import { resultsTab } from '../data/results';
import { retirementCostsTab } from '../data/retirement-costs';
import {
  retirementIncomeHeading,
  retirementIncomeTab,
} from '../data/retirement-income';
import aboutYouPage from '../pages/AboutYouPage';
import { basePage } from '../pages/basePage';
import homePage from '../pages/HomePage';
import resultsPage from '../pages/ResultsPage';
import retirementCostsPage from '../pages/RetirementCostsPage';
import retirementIncomePage from '../pages/RetirementIncomePage';

/**
 * @tests User Story 50527
 * @tests Test Case 50527: AC1 Test Case 1: Shift +Tab moves focus between active tabs from Income page
 * @tests Test Case 50527: AC1 Test Case 2: Enter key activates selected tab after Shift +Tab navigation
 * @tests Test Case 50527: AC1 Test Case 3: Verify focus order when reverse navigating from Income page
 * @tests Test Case 50527: AC2 Test Case 1: Tab navigation available after returning from Results page
 * @tests Test Case 50527: AC2 Test Case 2: Shift +Tab navigation between tabs after returning from Results page
 */

test.describe('Retirement Budget Planner - Tab panels accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await homePage.startRetirementBudgetPlanner(page);
    await aboutYouPage.fillValuesAndContinue(page);
    await retirementIncomePage.waitForPageToBeReady(page);
  });

  test('Tab panel keyboard navigation on retirement income page', async ({
    page,
  }) => {
    const aboutYouTabButton = page.getByRole('button', {
      name: aboutYouTab,
      exact: true,
    });
    const retirementIncomeTabButton = page.getByRole('button', {
      name: retirementIncomeTab,
      exact: true,
    });

    await expect(retirementIncomeTabButton).toHaveAttribute(
      'aria-current',
      'step',
    );

    await retirementIncomePage.fillAnyAccordion(
      page,
      'formstatePensionId',
      '500',
      'State Pension',
    );

    await page.keyboard.press('Shift+Tab'); // Tab back to state pension intro text link
    await page.keyboard.press('Shift+Tab'); // Tab back to state pension accordion header
    await page.keyboard.press('Shift+Tab'); // Tab back to retirement income tab button
    await expect(retirementIncomeTabButton).toBeFocused();

    // Tab back to about you tab button
    await page.keyboard.press('Shift+Tab');
    await expect(aboutYouTabButton).toBeFocused();

    // Tab forward to retirement income tab button
    await page.keyboard.press('Tab');
    await expect(retirementIncomeTabButton).toBeFocused();

    // Tab back to about you tab button and navigate to about you page
    await page.keyboard.press('Shift+Tab');
    await expect(aboutYouTabButton).toBeFocused();
    await page.keyboard.press('Enter');
    await aboutYouPage.waitForPageToBeReady(page);
    await expect(basePage.pageHeading(page, aboutYouTitle)).toBeVisible();
    await expect(aboutYouTabButton).toHaveAttribute('aria-current', 'step');
  });

  test('Tab panel keyboard navigation on results page', async ({ page }) => {
    const aboutYouTabButton = page.getByRole('button', {
      name: aboutYouTab,
      exact: true,
    });
    const retirementIncomeTabButton = page.getByRole('button', {
      name: retirementIncomeTab,
      exact: true,
    });
    const retirementCostsTabButton = page.getByRole('button', {
      name: retirementCostsTab,
      exact: true,
    });
    const resultsTabButton = page.getByRole('button', {
      name: resultsTab,
      exact: true,
    });

    // Navigate to results page
    await retirementIncomePage.fillValuesAndContinue(page);
    await retirementCostsPage.fillValuesAndContinue(page);
    await resultsPage.waitForPageToBeReady(page);

    await expect(resultsTabButton).toHaveAttribute('aria-current', 'step');

    // Click back to retirement costs page via edit button
    await resultsPage.retirementCostsVisual
      .costCategoryEditButtonByLabel(page, 'Housing')
      .click();
    await retirementCostsPage.waitForPageToBeReady(page);
    await expect(retirementCostsTabButton).toHaveAttribute(
      'aria-current',
      'step',
    );

    // Click back to retirement income page via back button
    await basePage.clickBackLink(page);
    await retirementIncomePage.waitForPageToBeReady(page);
    await expect(retirementIncomeTabButton).toHaveAttribute(
      'aria-current',
      'step',
    );

    // Tab back to results tab button
    await page.keyboard.press('Shift+Tab');
    await expect(resultsTabButton).toBeFocused();

    // Tab back to retirement costs tab button
    await page.keyboard.press('Shift+Tab');
    await expect(retirementCostsTabButton).toBeFocused();

    // Tab back to retirement income tab button
    await page.keyboard.press('Shift+Tab');
    await expect(retirementIncomeTabButton).toBeFocused();

    // Tab back to about you tab button
    await page.keyboard.press('Shift+Tab');
    await expect(aboutYouTabButton).toBeFocused();

    // Tab forward to retirement income tab button and navigate to retirement income page
    await page.keyboard.press('Tab');
    await expect(retirementIncomeTabButton).toBeFocused();
    await page.keyboard.press('Enter');
    await retirementIncomePage.waitForPageToBeReady(page);
    await expect(
      basePage.pageHeading(page, retirementIncomeHeading),
    ).toBeVisible();
    await expect(retirementIncomeTabButton).toHaveAttribute(
      'aria-current',
      'step',
    );
  });
});
