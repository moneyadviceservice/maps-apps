import { expect, test } from '@playwright/test';

import {
  continueButtonText,
  otherRetirementIncomeTitle,
  personalPensionsTitle,
  retirementIncomeErrorMessage,
  retirementIncomeErrorTitle,
  statePensionTitle,
  workplacePensionsDescription,
  workplacePensionsTitle,
} from '../data/retirement-income';
import aboutYouPage from '../pages/AboutYouPage';
import { basePage } from '../pages/basePage';
import homePage from '../pages/HomePage';
import retirementIncomePage from '../pages/RetirementIncomePage';

/**
 * @tests User Story 47776
 * @tests Test Case 48481: 47776 AC1 Test case 1: Verify ordering of sections
 * @tests Test Case 48483: 47776 AC2 Test case 2: Verify workplace pension(s) section and intro text
 * @tests Test Case 48487: 47776 AC4 & AC 5 Test case 3 and 4 Add pension button for Workplace and Personal pension(s)
 * @tests Test Case 48493: 47776 AC6 and AC7 Test case 5 and 6: Validation error message and Retirement cost title is displayed in summary total box
 */

test.describe('Retirement Budget Planner - Retirement Income page - Changes after editorial review', () => {
  test.beforeEach(async ({ page }) => {
    await homePage.startRetirementBudgetPlanner(page);
    await aboutYouPage.fillValuesAndContinue(page);
    await retirementIncomePage.waitForPageToBeReady(page);
  });

  test('Verify ordering of sections', async ({ page }) => {
    // There should be exactly 4 sections
    await expect(retirementIncomePage.getAllAccordions(page)).toHaveCount(4);

    // The sections should be in the correct order with the correct titles
    await expect(retirementIncomePage.getAllAccordionTitles(page)).toHaveText([
      statePensionTitle,
      workplacePensionsTitle,
      personalPensionsTitle,
      otherRetirementIncomeTitle,
    ]);
  });

  test('Verify workplace pension(s) section and intro text', async ({
    page,
  }) => {
    // Open the workplace pensions section
    await retirementIncomePage.openAccordionByTitle(
      page,
      workplacePensionsTitle,
    );

    // Get the content of the workplace pensions section
    const workplacePensionsSectionContent =
      retirementIncomePage.getAccordionContentByTitle(
        page,
        workplacePensionsTitle,
      );

    // Verify the section content is visible and contains the correct description text
    await expect(workplacePensionsSectionContent).toBeVisible();
    await expect(workplacePensionsSectionContent).toContainText(
      workplacePensionsDescription,
    );
  });

  test('Verify add pension button for Workplace pension(s)', async ({
    page,
  }) => {
    // Open the workplace pensions section
    await retirementIncomePage.openAccordionByTitle(
      page,
      workplacePensionsTitle,
    );

    // Add a defined contribution workplace pension
    await expect(
      page.getByTestId('add-definedContribution-button'),
    ).toBeVisible();
    await retirementIncomePage.clickAddPensionButton(page, {
      type: 'definedContribution',
    });
    await expect(page.getByTestId('formdefinedContribution1Id')).toBeVisible();

    // Add a defined benefit workplace pension
    await expect(page.getByTestId('add-definedBenefit-button')).toBeVisible();
    await retirementIncomePage.clickAddPensionButton(page, {
      type: 'definedBenefit',
    });
    await expect(page.getByTestId('formdefinedBenefit1Id')).toBeVisible();
  });

  test('Verify add pension button for Personal pension(s)', async ({
    page,
  }) => {
    // Open the personal pensions section
    await retirementIncomePage.openAccordionByTitle(
      page,
      personalPensionsTitle,
    );

    // Add a personal pension
    await expect(page.getByTestId('add-privatePension-button')).toBeVisible();
    await retirementIncomePage.clickAddPensionButton(page, {
      type: 'privatePension',
    });
    await expect(page.getByTestId('formprivatePension1Id')).toBeVisible();
  });

  test('Verify validation error message', async ({ page }) => {
    // Click continue without filling in any values to trigger validation errors
    await basePage.clickButton(page, continueButtonText);
    await basePage.waitForErrorHeading(page, retirementIncomeErrorTitle);

    // Verify error heading and message
    await expect(basePage.getErrorSummaryHeading(page)).toHaveText(
      retirementIncomeErrorTitle,
    );
    await expect(basePage.getErrorSummaryRecords(page)).toHaveText(
      retirementIncomeErrorMessage,
    );
  });

  test('Verify Retirement cost title is displayed in summary total box', async ({
    page,
  }) => {
    const summaryTotalRowTitles = page
      .getByTestId('summary-total')
      .getByTestId('paragraph');

    await expect(summaryTotalRowTitles).toHaveText([
      'Retirement income',
      'Retirement costs',
      'Balance',
    ]);
  });
});
