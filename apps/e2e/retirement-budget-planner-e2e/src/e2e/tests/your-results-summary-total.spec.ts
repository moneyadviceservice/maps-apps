import { expect, test } from '@playwright/test';

import { pageHeading, summaryTotal } from '../data/your-results';
import aboutYouPage from '../pages/AboutYouPage';
import { basePage } from '../pages/basePage';
import homePage from '../pages/HomePage';
import resultsPage from '../pages/ResultsPage';
import retirementCostsPage from '../pages/RetirementCostsPage';
import retirementIncomePage from '../pages/RetirementIncomePage';

/**
 * @tests User Story 44435
 * @tests Test Case 49333: 44435 AC1 TEST CASE 1: Verify summary total is displayed below the balance results card
 * @tests Test Case 49334: 44435 AC2 TEST CASE 2: Verify switching from monthly to annual updates summary total (JS enabled)
 * @tests Test Case 49361: 44435 AC3 TEST CASE 3: Verify monthly -> annual summary total updates correctly when (JS disabled)
 * @tests Test Case 49376: 44435 AC4 TEST CASE 4: Verify switching from annual to monthly updates summary total (JS enabled)
 * @tests Test Case 49379: 44435 AC5 TEST CASE 5: Verify annual -> monthly summary total updates correctly when (JS disabled)
 */

test.describe('Retirement Budget Planner - Your Results - Summary Total (JS enabled)', () => {
  test.use({ javaScriptEnabled: true });

  test.beforeEach(async ({ page }) => {
    await homePage.startRetirementBudgetPlanner(page);
    await aboutYouPage.fillValuesAndContinue(page);
    await retirementIncomePage.fillValuesAndContinue(
      page,
      summaryTotal.inputValues.income.amount,
      summaryTotal.inputValues.income.frequency,
    );
    await retirementCostsPage.fillValuesAndContinue(
      page,
      summaryTotal.inputValues.costs.amount,
      summaryTotal.inputValues.costs.formInputTestId,
    );
    await basePage.waitForPageHeading(page, pageHeading);
  });

  test('Verify summary total is displayed below the balance results card (JS enabled)', async ({
    page,
  }) => {
    await expect(resultsPage.summaryTotal.component(page)).toBeVisible();
    await expect(resultsPage.summaryTotal.heading(page)).toBeVisible();
    await expect(
      resultsPage.summaryTotal.updateResultsButton(page),
    ).toBeHidden();
    await expect(
      resultsPage.summaryTotal.label(page, { labelType: 'income' }),
    ).toBeVisible();
    await expect(
      resultsPage.summaryTotal.label(page, { labelType: 'costs' }),
    ).toBeVisible();
    await expect(
      resultsPage.summaryTotal.label(page, { labelType: 'balance' }),
    ).toBeVisible();
  });

  test('Verify switching from monthly to annual updates summary total AND verify switching from annual to monthly updates summary total (JS enabled)', async ({
    page,
  }) => {
    // Monthly values are selected/shown by default
    await expect(
      resultsPage.summaryTotal.value(page, { valueType: 'income' }),
    ).toHaveText(summaryTotal.expectedOutputValues.monthly.income);
    await expect(
      resultsPage.summaryTotal.value(page, { valueType: 'costs' }),
    ).toHaveText(summaryTotal.expectedOutputValues.monthly.costs);
    await expect(
      resultsPage.summaryTotal.value(page, { valueType: 'balance' }),
    ).toHaveText(summaryTotal.expectedOutputValues.monthly.balance);

    // Switch to yearly values and verify
    await resultsPage.summaryTotal
      .frequencySelect(page)
      .selectOption(summaryTotal.frequencySelect.yearlyValue);

    await expect(
      resultsPage.summaryTotal.value(page, { valueType: 'income' }),
    ).toHaveText(summaryTotal.expectedOutputValues.yearly.income);
    await expect(
      resultsPage.summaryTotal.value(page, { valueType: 'costs' }),
    ).toHaveText(summaryTotal.expectedOutputValues.yearly.costs);
    await expect(
      resultsPage.summaryTotal.value(page, { valueType: 'balance' }),
    ).toHaveText(summaryTotal.expectedOutputValues.yearly.balance);

    // Switch back to monthly values and verify
    await resultsPage.summaryTotal
      .frequencySelect(page)
      .selectOption(summaryTotal.frequencySelect.monthlyValue);

    await expect(
      resultsPage.summaryTotal.value(page, { valueType: 'income' }),
    ).toHaveText(summaryTotal.expectedOutputValues.monthly.income);
    await expect(
      resultsPage.summaryTotal.value(page, { valueType: 'costs' }),
    ).toHaveText(summaryTotal.expectedOutputValues.monthly.costs);
    await expect(
      resultsPage.summaryTotal.value(page, { valueType: 'balance' }),
    ).toHaveText(summaryTotal.expectedOutputValues.monthly.balance);
  });
});

test.describe('Retirement Budget Planner - Your Results - Summary Total (JS disabled)', () => {
  test.use({ javaScriptEnabled: false });

  test.beforeEach(async ({ page }) => {
    await homePage.startRetirementBudgetPlanner(page, {
      waitForNetworkSettle: false,
    });

    await aboutYouPage.fillValuesAndContinue(page);
    await retirementIncomePage.fillValuesAndContinue(
      page,
      summaryTotal.inputValues.income.amount,
      summaryTotal.inputValues.income.frequency,
    );
    await retirementCostsPage.fillValuesAndContinue(
      page,
      summaryTotal.inputValues.costs.amount,
      summaryTotal.inputValues.costs.formInputTestId,
    );
    await basePage.waitForPageHeading(page, pageHeading);
  });

  test('Verify summary total is displayed below the balance results card (JS disabled)', async ({
    page,
  }) => {
    await expect(resultsPage.summaryTotal.component(page)).toBeVisible();
    await expect(resultsPage.summaryTotal.heading(page)).toBeVisible();
    await expect(
      resultsPage.summaryTotal.updateResultsButton(page),
    ).toBeVisible();
    await expect(
      resultsPage.summaryTotal.label(page, { labelType: 'income' }),
    ).toBeVisible();
    await expect(
      resultsPage.summaryTotal.label(page, { labelType: 'costs' }),
    ).toBeVisible();
    await expect(
      resultsPage.summaryTotal.label(page, { labelType: 'balance' }),
    ).toBeVisible();
  });

  test('Verify monthly -> annual summary total updates correctly AND verify annual -> monthly summary total updates correctly when (JS disabled)', async ({
    page,
  }) => {
    // Monthly values are selected/shown by default
    await expect(
      resultsPage.summaryTotal.value(page, { valueType: 'income' }),
    ).toHaveText(summaryTotal.expectedOutputValues.monthly.income);
    await expect(
      resultsPage.summaryTotal.value(page, { valueType: 'costs' }),
    ).toHaveText(summaryTotal.expectedOutputValues.monthly.costs);
    await expect(
      resultsPage.summaryTotal.value(page, { valueType: 'balance' }),
    ).toHaveText(summaryTotal.expectedOutputValues.monthly.balance);

    // Switch to yearly values and verify
    await resultsPage.summaryTotal
      .frequencySelect(page)
      .selectOption(summaryTotal.frequencySelect.yearlyValue);
    await resultsPage.summaryTotal.updateResultsButton(page).click();

    await expect(
      resultsPage.summaryTotal.value(page, { valueType: 'income' }),
    ).toHaveText(summaryTotal.expectedOutputValues.yearly.income);
    await expect(
      resultsPage.summaryTotal.value(page, { valueType: 'costs' }),
    ).toHaveText(summaryTotal.expectedOutputValues.yearly.costs);
    await expect(
      resultsPage.summaryTotal.value(page, { valueType: 'balance' }),
    ).toHaveText(summaryTotal.expectedOutputValues.yearly.balance);

    // Switch back to monthly values and verify
    await resultsPage.summaryTotal
      .frequencySelect(page)
      .selectOption(summaryTotal.frequencySelect.monthlyValue);
    await resultsPage.summaryTotal.updateResultsButton(page).click();

    await expect(
      resultsPage.summaryTotal.value(page, { valueType: 'income' }),
    ).toHaveText(summaryTotal.expectedOutputValues.monthly.income);
    await expect(
      resultsPage.summaryTotal.value(page, { valueType: 'costs' }),
    ).toHaveText(summaryTotal.expectedOutputValues.monthly.costs);
    await expect(
      resultsPage.summaryTotal.value(page, { valueType: 'balance' }),
    ).toHaveText(summaryTotal.expectedOutputValues.monthly.balance);
  });
});
