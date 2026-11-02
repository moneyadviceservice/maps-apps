import { expect, test } from '@playwright/test';

import { retireBeforeStatePensionAge } from '../data/next-steps';
import {
  spaGreaterThanCurrentAge,
  spaLessThanCurrentAge,
} from '../data/spa-and-income-tax';
import { pageHeading } from '../data/your-results';
import aboutYouPage from '../pages/AboutYouPage';
import { basePage } from '../pages/basePage';
import homePage from '../pages/HomePage';
import resultsPage from '../pages/ResultsPage';
import retirementCostsPage from '../pages/RetirementCostsPage';
import retirementIncomePage from '../pages/RetirementIncomePage';

const PRIVATE_PENSION_TEST_ID = 'formprivatePensionId';
const MORTGAGE_TEST_ID = 'formmortgageRepaymentId';
const STATE_PENSION_TEST_ID = 'formstatePensionId';
const STATE_PENSION_ACCORDION_TITLE = 'State Pension';

const parseCurrencyToNumber = (value: string): number =>
  Number(value.replace(/[^\d.-]/g, ''));

/**
 * @tests User Story 52314
 * @tests AC1-AC8 Retirement income after tax and retirement costs visual copy
 */
test.describe('Retirement Budget Planner - Results copy and formatting (US-52314)', () => {
  test.describe('When current age is at or below State Pension age (AC1, AC4, AC5)', () => {
    test.beforeEach(async ({ page }) => {
      const { day, month, year, retireAge } = spaLessThanCurrentAge.aboutYou;
      const { pensionValue } = spaLessThanCurrentAge.income;
      const { mortgageRepayment } = spaLessThanCurrentAge.cost;

      await homePage.startRetirementBudgetPlanner(page);
      await aboutYouPage.fillValuesAndContinue(
        page,
        day,
        month,
        year,
        retireAge,
      );
      await retirementIncomePage.fillPersonalPensionValueAndContinue(
        page,
        PRIVATE_PENSION_TEST_ID,
        pensionValue,
      );
      await retirementCostsPage.fillValuesAndContinue(
        page,
        mortgageRepayment,
        MORTGAGE_TEST_ID,
      );
      await basePage.waitForPageHeading(page, pageHeading);
    });

    test('AC1: Shows State Pension age statement', async ({ page }) => {
      await expect(resultsPage.statePensionHeading(page)).toHaveText(
        /From your State Pension age of \d+(?: years and \d+ months)?, your retirement income could be £[\d,]+ a month after tax\./,
      );
    });

    test('AC4: Shows the retirement income and costs visual heading copy', async ({
      page,
    }) => {
      await expect(resultsPage.incomeAndCostsHeading(page)).toBeVisible();
    });

    test('AC5: Shows the retirement income and costs visual supporting copy', async ({
      page,
    }) => {
      await expect(resultsPage.incomeAndCostsDescription(page)).toBeVisible();
    });
  });

  test.describe('When current age is above State Pension age (AC2, AC3, AC6, AC7)', () => {
    test.beforeEach(async ({ page }) => {
      const { day, month, year, retireAge } = spaGreaterThanCurrentAge.aboutYou;
      const { pensionValue } = spaGreaterThanCurrentAge.income;
      const { mortgageRepayment } = spaGreaterThanCurrentAge.cost;

      await homePage.startRetirementBudgetPlanner(page);
      await aboutYouPage.fillValuesAndContinue(
        page,
        day,
        month,
        year,
        retireAge,
      );
      await retirementIncomePage.fillPersonalPensionValueAndContinue(
        page,
        PRIVATE_PENSION_TEST_ID,
        pensionValue,
      );
      await retirementCostsPage.fillValuesAndContinue(
        page,
        mortgageRepayment,
        MORTGAGE_TEST_ID,
      );
      await basePage.waitForPageHeading(page, pageHeading);
    });

    test('AC2: Shows non-State Pension age statement', async ({ page }) => {
      await expect(resultsPage.statePensionHeading(page)).toHaveText(
        /Your retirement income could be £[\d,]+ a month after tax\./,
      );
      await expect(resultsPage.statePensionHeading(page)).not.toContainText(
        'From your State Pension age of',
      );
    });

    test('AC3: Formats retirement income amount in bold', async ({ page }) => {
      await expect(
        resultsPage.retirementIncomeStatementBoldAmount(page),
      ).toBeVisible();
    });

    test('AC6 and AC7: Summary total first line is retirement income after tax and is consistent with the statement', async ({
      page,
    }) => {
      await expect(
        resultsPage.summaryTotal.label(page, { labelType: 'income' }),
      ).toHaveText('Retirement income after tax');

      const topStatementText = await resultsPage
        .statePensionHeading(page)
        .innerText();
      const topStatementAmount = topStatementText.match(/£[\d,]+/)?.[0] ?? '';

      const summaryIncomeValue = await resultsPage.summaryTotal
        .value(page, { valueType: 'income' })
        .innerText();

      // Top statement rounds to whole pounds; summary total keeps pence.
      expect(Math.round(parseCurrencyToNumber(summaryIncomeValue))).toBe(
        parseCurrencyToNumber(topStatementAmount),
      );
    });
  });

  test.describe('When retirement age is below State Pension age (AC8)', () => {
    test.beforeEach(async ({ page }) => {
      const { day, month, year, retireAge } =
        retireBeforeStatePensionAge.aboutYou;
      const { pensionValue, statePensionValue } =
        retireBeforeStatePensionAge.income;
      const { mortgageRepayment } = retireBeforeStatePensionAge.cost;

      await homePage.startRetirementBudgetPlanner(page);
      await aboutYouPage.fillValuesAndContinue(
        page,
        day,
        month,
        year,
        retireAge,
      );
      await retirementIncomePage.fillAnyAccordion(
        page,
        STATE_PENSION_TEST_ID,
        statePensionValue,
        STATE_PENSION_ACCORDION_TITLE,
      );
      await retirementIncomePage.fillPersonalPensionValueAndContinue(
        page,
        PRIVATE_PENSION_TEST_ID,
        pensionValue,
      );
      await retirementCostsPage.fillValuesAndContinue(
        page,
        mortgageRepayment,
        MORTGAGE_TEST_ID,
      );
      await basePage.waitForPageHeading(page, pageHeading);
    });

    test('AC8: Shows retire-before-State-Pension card below the money-left-over or income-unlikely card', async ({
      page,
    }) => {
      await expect(
        resultsPage.retireBeforeStatePensionCallout.component(page),
      ).toBeVisible();
      await expect(
        resultsPage.retireBeforeStatePensionCallout.title(page),
      ).toHaveText('You plan to retire before you can claim the State Pension');

      const moneyLeftOverCard = resultsPage.moneyLeftOverHeading(page);
      const incomeUnlikelyCard = resultsPage.costsHigherThanIncomeHeading(page);

      const moneyLeftOverCount = await moneyLeftOverCard.count();
      const incomeUnlikelyCount = await incomeUnlikelyCard.count();

      expect(moneyLeftOverCount + incomeUnlikelyCount).toBeGreaterThan(0);

      const topIncomeVsCostCard = moneyLeftOverCount
        ? moneyLeftOverCard.first()
        : incomeUnlikelyCard.first();

      const topIncomeVsCostBox = await topIncomeVsCostCard.boundingBox();
      const retireBeforeSpaBox =
        await resultsPage.retireBeforeStatePensionCallout
          .component(page)
          .boundingBox();

      expect(topIncomeVsCostBox).not.toBeNull();
      expect(retireBeforeSpaBox).not.toBeNull();

      // Non-null asserted above; these values are safe to access directly.
      expect(retireBeforeSpaBox!.y).toBeGreaterThan(topIncomeVsCostBox!.y);
    });
  });
});
