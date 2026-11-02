import { expect, test } from '@playwright/test';

import { retirementCostsHeading } from '../data/retirement-costs';
import aboutYouPage from '../pages/AboutYouPage';
import { basePage } from '../pages/basePage';
import homePage from '../pages/HomePage';
import retirementCostsPage from '../pages/RetirementCostsPage';
import retirementIncomePage from '../pages/RetirementIncomePage';

/**
 * @test 58357 RBP - Summary total component does not use permitted ARIA attributes - BUG
 * 59193 58537 BUG : ARIA attributes tweak to the Retirement income, costs and Results page
 */

test.describe('ARIA Attributes', () => {
  test('Retirement Income Page: Summary totals should not have forbidden ARIA combinations', async ({
    page,
  }) => {
    await homePage.startRetirementBudgetPlanner(page, {
      waitForNetworkSettle: false,
    });
    await homePage.handleCookies(page);
    await aboutYouPage.fillValuesAndContinue(page);

    await page.waitForLoadState('load');
    await page.waitForURL(/\/en\/income/, { timeout: 10000 });
    await basePage.waitForPageHeading(page, 'Retirement income');

    await retirementIncomePage.fillValuesAndContinue(page, '500', 'year');
    await page.waitForLoadState('load');
    await page.waitForURL(/\/en\/income/, { timeout: 10000 });

    const summaryElements = page.locator(
      'dl[aria-labelledby="summary-total-heading"] dd span',
    );
    const count = await summaryElements.count();

    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const element = summaryElements.nth(i);
      await expect(element).not.toHaveAttribute('aria-label');
      await expect(element).not.toHaveAttribute('role', 'definition');
    }
  });

  test('Retirement Costs Page: Summary totals should not have forbidden ARIA combinations', async ({
    page,
  }) => {
    await homePage.startRetirementBudgetPlanner(page, {
      waitForNetworkSettle: false,
    });
    await homePage.handleCookies(page);
    await aboutYouPage.fillValuesAndContinue(page);

    await page.waitForLoadState('load');
    await page.waitForURL(/\/en\/income/, { timeout: 10000 });
    await basePage.waitForPageHeading(page, 'Retirement income');

    await retirementIncomePage.fillValuesAndContinue(page, '500', 'year');
    await page.waitForLoadState('load');
    await page.waitForURL(/\/en\/essential-outgoings/, { timeout: 10000 });
    await basePage.waitForPageHeading(page, retirementCostsHeading);

    await retirementCostsPage.fillValuesAndContinue(page, '100');
    await page.waitForLoadState('load');
    await page.waitForURL(/\/en\/essential-outgoings/, { timeout: 10000 });

    const summaryElements = page.locator(
      'dl[aria-labelledby="summary-total-heading"] dd span',
    );
    const count = await summaryElements.count();

    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const element = summaryElements.nth(i);
      await expect(element).not.toHaveAttribute('aria-label');
      await expect(element).not.toHaveAttribute('role', 'definition');
    }
  });

  test('Results Page: Summary totals should not have forbidden ARIA combinations', async ({
    page,
  }) => {
    await homePage.startRetirementBudgetPlanner(page, {
      waitForNetworkSettle: false,
    });
    await homePage.handleCookies(page);
    await aboutYouPage.fillValuesAndContinue(page);

    await page.waitForLoadState('load');
    await page.waitForURL(/\/en\/income/, { timeout: 10000 });
    await basePage.waitForPageHeading(page, 'Retirement income');

    await retirementIncomePage.fillValuesAndContinue(page, '500', 'year');
    await page.waitForLoadState('load');
    await page.waitForURL(/\/en\/essential-outgoings/, { timeout: 10000 });

    await retirementCostsPage.fillValuesAndContinue(page, '100');
    await page.waitForLoadState('load');
    await page.waitForURL(/\/en\/summary/, { timeout: 10000 });

    const summaryElements = page.locator(
      'dl[aria-labelledby="summary-total-heading"] dd span',
    );
    const count = await summaryElements.count();

    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const element = summaryElements.nth(i);
      await expect(element).not.toHaveAttribute('aria-label');
      await expect(element).not.toHaveAttribute('role', 'definition');
    }
  });
});
