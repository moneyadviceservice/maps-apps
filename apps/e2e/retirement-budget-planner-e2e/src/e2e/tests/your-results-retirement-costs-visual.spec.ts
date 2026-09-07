import { expect, test } from '@playwright/test';

import { retirementCostsHeading } from '../data/retirement-costs';
import {
  editButtonLinkRegex,
  pageHeading,
  retirementCostsVisual,
} from '../data/your-results';
import aboutYouPage from '../pages/AboutYouPage';
import { basePage } from '../pages/basePage';
import homePage from '../pages/HomePage';
import resultsPage from '../pages/ResultsPage';
import retirementCostsPage from '../pages/RetirementCostsPage';
import retirementIncomePage from '../pages/RetirementIncomePage';

/**
 * @tests User Story 44437
 * @tests Test Case 49528: 44437 AC1 TEST CASE 1: Verify the retirement costs doughnut chart is visible below the balance result card
 * @tests Test Case 49540: 44437 AC2 TEST CASE 2: Verify only cost categories with values entered are shown on the doughnut chart
 * @tests Test Case 49545: 44437 AC3 TEST CASE 3: Verify all cost category labels are always shown alongside the doughnut chart
 * @tests Test Case 49552: 44437 AC4 TEST CASE 4: Verify clicking 'Edit' next to 'Housing' navigates to the Housing section on the Retirement cost page
 * @tests Test Case 49555: 44437 AC5 TEST CASE 5: Verify clicking 'Edit' next to 'Household bills' navigates to the 'Household bills' section
 * @tests Test Case 49558: 44437 AC6 TEST CASE 6: Verify clicking 'Edit' next to Travel navigates to the Travel section
 * @tests Test Case 49559: 44437 AC7 TEST CASE 7: Verify clicking Edit next to Borrowing navigates to the Borrowing section
 * @tests Test Case 49560: 44437 AC8 TEST CASE 8: Verify clicking 'Edit' next to 'Insurance' navigates to the Insurance section on the Retirement cost page
 * @tests Test Case 49562: 44437 AC9 TEST CASE 9: Verify clicking 'Edit' next to 'Living costs' navigates to the Living costs section on the Retirement cost page
 * @tests Test Case 49563: 44437 AC10 TEST CASE 10: Verify clicking 'Edit' next to 'Other essential outgoings' navigates to the Other essential outgoings section on the Retirement cost page
 */

test.describe('Retirement Budget Planner - Your Results - Retirement costs visual', () => {
  test.beforeEach(async ({ page }) => {
    await homePage.startRetirementBudgetPlanner(page);
    await aboutYouPage.fillValuesAndContinue(page);
    await retirementIncomePage.fillValuesAndContinue(
      page,
      retirementCostsVisual.inputValues.income.amount,
      retirementCostsVisual.inputValues.income.frequency,
    );

    // Fill multiple retirement costs values
    for (const inputValue of Object.values(
      retirementCostsVisual.inputValues.costs,
    )) {
      await retirementCostsPage.fillAnyAccordion(
        page,
        inputValue.formInputTestId,
        inputValue.amount,
        inputValue.accordionTitle,
      );
    }

    await basePage.continueButton(page).click();
    await basePage.waitForPageHeading(page, pageHeading);
  });

  test('Verify the retirement costs doughnut chart is visible below the balance result card', async ({
    page,
  }) => {
    await expect(
      resultsPage.retirementCostsVisual.component(page),
    ).toBeVisible();
    await expect(resultsPage.retirementCostsVisual.heading(page)).toBeVisible();
    await expect(
      resultsPage.retirementCostsVisual.pieChart(page),
    ).toBeVisible();
    await expect(resultsPage.retirementCostsVisual.heading(page)).toBeVisible();
    await expect(
      resultsPage.retirementCostsVisual.pieChart(page),
    ).toHaveAttribute(
      'style',
      retirementCostsVisual.expectedOutputValues.pieChartStyle,
    );
  });

  test('Verify only cost categories with values entered are shown on the doughnut chart AND Verify all cost category labels are always shown alongside the doughnut chart', async ({
    page,
  }) => {
    await expect(
      resultsPage.retirementCostsVisual.pieChart(page),
    ).toHaveAttribute(
      'style',
      retirementCostsVisual.expectedOutputValues.pieChartStyle,
    );

    // Verify output of all retirement costs categories
    for (const expectedOutput of Object.values(
      retirementCostsVisual.expectedOutputValues.categories,
    )) {
      await expect(
        resultsPage.retirementCostsVisual.costCategoryByLabel(
          page,
          expectedOutput.label,
        ),
      ).toBeVisible();
      await expect(
        resultsPage.retirementCostsVisual.costCategoryValueByLabel(
          page,
          expectedOutput.label,
        ),
      ).toHaveText(expectedOutput.value);

      const editButton =
        resultsPage.retirementCostsVisual.costCategoryEditButtonByLabel(
          page,
          expectedOutput.label,
        );
      await expect(editButton).toBeVisible();
      await expect(editButton).toHaveAttribute(
        'href',
        editButtonLinkRegex(expectedOutput.linkAnchor),
      );
    }
  });

  test("Verify clicking 'Edit' next to 'Housing', 'Household bills', 'Living costs', 'Insurance', 'Borrowing', 'Travel', and 'Other essential outgoings' navigates to the relevant section on the Retirement cost page", async ({
    page,
  }) => {
    // Verify output of all retirement costs categories
    for (const expectedOutput of Object.values(
      retirementCostsVisual.expectedOutputValues.categories,
    )) {
      // Verify the accordion is open
      await resultsPage.retirementCostsVisual
        .costCategoryEditButtonByLabel(page, expectedOutput.label)
        .click();
      await basePage.waitForPageHeading(page, retirementCostsHeading);
      await expect(page).toHaveURL(
        editButtonLinkRegex(expectedOutput.linkAnchor),
      );
      await expect(
        retirementCostsPage.getAccordionByTitle(page, expectedOutput.label),
      ).toHaveAttribute('open');

      // Verify the accordion title is visible, in viewport and focused
      const accordionTitle = retirementCostsPage.getAccordionSummaryByTitle(
        page,
        expectedOutput.label,
      );
      await expect(accordionTitle).toBeVisible();
      await expect(accordionTitle).toBeInViewport();
      await expect(accordionTitle).toBeFocused();

      // Navigate back to results page for the next iteration
      await basePage.continueButton(page).click();
      await basePage.waitForPageHeading(page, pageHeading);
    }
  });
});
