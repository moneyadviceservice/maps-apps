import { expect, test } from '@playwright/test';

import {
  aboutYouTitle,
  dobAgeRangeErrorMessage,
  dobDayErrorMessage,
  dobErrorMessage,
  dobMonthErrorMessage,
  dobYearErrorMessage,
  genderErrorMessage,
  retireAgeErrorMessage,
} from '../data/about-you';
import aboutYouPage from '../pages/AboutYouPage';
import { basePage } from '../pages/basePage';
import homePage from '../pages/HomePage';

/**
 * @tests User Story 47775
 * @tests User story 41057
 */

test.describe('Retirement Budget Planner - Changes to About You after editorial review', () => {
  test.beforeEach(async ({ page }) => {
    await homePage.startRetirementBudgetPlanner(page);
  });

  test('Verify validation messages on About You page when no values are entered', async ({
    page,
  }) => {
    await basePage.clickButton(page, 'Continue');
    await expect(basePage.getPageTitle(page)).resolves.toHaveText(
      aboutYouTitle,
    );
    await expect(basePage.getPageTitle(page)).resolves.toBeVisible();
    await expect(aboutYouPage.getErrorMessage(page, 'dob')).resolves.toBe(
      dobErrorMessage,
    );
    await expect(aboutYouPage.getErrorMessage(page, 'gender')).resolves.toBe(
      genderErrorMessage,
    );
    await expect(aboutYouPage.getErrorMessage(page, 'retireAge')).resolves.toBe(
      retireAgeErrorMessage,
    );
  });

  test('Verify validation message when proceeding with a retirement age less than my current age', async ({
    page,
  }) => {
    await aboutYouPage.fillValuesAndContinue(page, '9', '11', '1965', '55');
    await expect(basePage.getPageTitle(page)).resolves.toHaveText(
      aboutYouTitle,
    );
    await expect(basePage.getPageTitle(page)).resolves.toBeVisible();

    await expect(aboutYouPage.getErrorMessage(page, 'retireAge')).resolves.toBe(
      retireAgeErrorMessage,
    );
  });

  test('Verify validation message when user input a day value over 31', async ({
    page,
  }) => {
    await aboutYouPage.fillValuesAndContinue(page, '32', '11', '1965', '65');
    await expect(basePage.getPageTitle(page)).resolves.toHaveText(
      aboutYouTitle,
    );

    await expect(aboutYouPage.getErrorMessage(page, 'dob')).resolves.toBe(
      dobDayErrorMessage,
    );
  });

  test('Verify validation message when user input a month value over 12', async ({
    page,
  }) => {
    await aboutYouPage.fillValuesAndContinue(page, '3', '13', '1965', '65');
    await expect(basePage.getPageTitle(page)).resolves.toHaveText(
      aboutYouTitle,
    );

    await expect(aboutYouPage.getErrorMessage(page, 'dob')).resolves.toBe(
      dobMonthErrorMessage,
    );
  });

  test('Verify validation message when user input a year value that is less than 4 numbers', async ({
    page,
  }) => {
    await aboutYouPage.fillValuesAndContinue(page, '3', '3', '196', '65');
    await expect(basePage.getPageTitle(page)).resolves.toHaveText(
      aboutYouTitle,
    );

    await expect(aboutYouPage.getErrorMessage(page, 'dob')).resolves.toBe(
      dobYearErrorMessage,
    );
  });

  test('Verify validation message when user input dob where user is under 18', async ({
    page,
  }) => {
    await aboutYouPage.fillValuesAndContinue(page, '3', '3', '2015', '65');
    await expect(basePage.getPageTitle(page)).resolves.toHaveText(
      aboutYouTitle,
    );

    await expect(aboutYouPage.getErrorMessage(page, 'dob')).resolves.toBe(
      dobAgeRangeErrorMessage,
    );
  });
});
