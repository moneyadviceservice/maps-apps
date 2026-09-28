import { expect, test } from '@playwright/test';

import { retirementCostsHeading } from '../data/retirement-costs';
import { retirementIncomeHeading } from '../data/retirement-income';
import aboutYouPage from '../pages/AboutYouPage';
import { basePage } from '../pages/basePage';
import homePage from '../pages/HomePage';
import retirementIncomePage from '../pages/RetirementIncomePage';
import summaryAnnouncementPage from '../pages/SummaryAnnouncementPage';

/**
 * @tests User Story 50542
 * @scenario Announce update on Retirement Income page
 * @scenario Announce update on Retirement Costs page
 * @scenario Balance updates are announced to screen reader users
 * @scenario Overspending is communicated accessibly
 */
test.describe('Retirement Budget Planner - real-time summary accessibility announcements', () => {
  test.beforeEach(async ({ page }) => {
    await homePage.startRetirementBudgetPlanner(page);
    await aboutYouPage.fillValuesAndContinue(page);
    await basePage.waitForPageHeading(page, retirementIncomeHeading);
  });

  test('Announce update on Retirement Income page', async ({ page }) => {
    const previousIncomeValue =
      await summaryAnnouncementPage.getIncomeValueText(page);
    const previousBalanceValue =
      await summaryAnnouncementPage.getBalanceValueText(page);

    await basePage.fillInputByTestId(page, 'formstatePensionId', '1200');

    await expect(
      summaryAnnouncementPage.summaryDescription(page),
    ).toContainText('Financial summary showing income, spending and balance');

    await expect(summaryAnnouncementPage.incomeValue(page)).not.toHaveText(
      previousIncomeValue,
    );
    await expect(summaryAnnouncementPage.balanceValue(page)).not.toHaveText(
      previousBalanceValue,
    );

    await expect(summaryAnnouncementPage.incomeSummaryRow(page)).toBeVisible();
    await expect(summaryAnnouncementPage.costsSummaryRow(page)).toBeVisible();
    await expect(summaryAnnouncementPage.balanceSummaryRow(page)).toBeVisible();

    await expect(
      summaryAnnouncementPage.summaryAnnouncement(page),
    ).toContainText('Summary updated.');
  });

  test('Announce update on Retirement Costs page', async ({ page }) => {
    await retirementIncomePage.fillValuesAndContinue(page, '1200');
    await basePage.waitForPageHeading(page, retirementCostsHeading);

    const previousCostsValue = await summaryAnnouncementPage.getCostsValueText(
      page,
    );
    const previousBalanceValue =
      await summaryAnnouncementPage.getBalanceValueText(page);

    await basePage.fillInputByTestId(page, 'formmortgageRepaymentId', '400');

    await expect(
      summaryAnnouncementPage.summaryDescription(page),
    ).toContainText('Financial summary showing income, spending and balance');

    await expect(summaryAnnouncementPage.costsValue(page)).not.toHaveText(
      previousCostsValue,
    );
    await expect(summaryAnnouncementPage.balanceValue(page)).not.toHaveText(
      previousBalanceValue,
    );

    await expect(summaryAnnouncementPage.incomeSummaryRow(page)).toBeVisible();
    await expect(summaryAnnouncementPage.costsSummaryRow(page)).toBeVisible();
    await expect(summaryAnnouncementPage.balanceSummaryRow(page)).toBeVisible();

    await expect(
      summaryAnnouncementPage.summaryAnnouncement(page),
    ).toContainText('Summary updated.');
  });

  test('Balance updates are announced to screen reader users', async ({
    page,
  }) => {
    const previousBalanceValue =
      await summaryAnnouncementPage.getBalanceValueText(page);

    await basePage.fillInputByTestId(page, 'formstatePensionId', '1500');

    const updatedBalanceValue =
      await summaryAnnouncementPage.getBalanceValueText(page);

    await expect(summaryAnnouncementPage.balanceValue(page)).not.toHaveText(
      previousBalanceValue,
    );
    expect(updatedBalanceValue).not.toBe(previousBalanceValue);

    await expect(
      summaryAnnouncementPage.summaryAnnouncement(page),
    ).toContainText('Summary updated.');
    await expect(
      summaryAnnouncementPage.summaryAnnouncement(page),
    ).toContainText('Balance');
  });

  test('Overspending is communicated accessibly', async ({ page }) => {
    await retirementIncomePage.fillValuesAndContinue(page, '1200');
    await basePage.waitForPageHeading(page, retirementCostsHeading);

    await basePage.fillInputByTestId(page, 'formmortgageRepaymentId', '5000');

    await expect(summaryAnnouncementPage.balanceValue(page)).toContainText('-');
    await expect(
      summaryAnnouncementPage.balanceSummaryRow(page),
    ).toHaveAttribute('aria-label', /Overspending/);
    await expect(
      summaryAnnouncementPage.summaryAnnouncement(page),
    ).toContainText('overspending');
  });
});
