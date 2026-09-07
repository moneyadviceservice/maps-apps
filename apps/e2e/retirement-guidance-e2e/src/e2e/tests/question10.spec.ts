import { expect, test } from '@playwright/test';

import { basePage } from '../pages/basePage';
import homePage from '../pages/HomePage';
import question10Page, {
  getQuestion10AnswerValue,
  QUESTION_10_ANSWERS,
  question10AnswersCount,
} from '../pages/question10Page';
import questionnaireNavigator from '../pages/questionnaireNavigator';

/**
 * @tests User Story: 49760
 * @tests User Story 55393
 * @tests User Story 55680
 * @test Test Case 51035 : 49760 AC2 AC3 TEST CASE 2: Verify back link navigates to Q9 and no options are preselected on first visit
 * @test Test Case 51037 : 49760 AC4 TEST CASE 3: Verify an error message displays when continuing without selecting an option
 * @test Test Case: 55393 AC10 Verify updated Question 10 validation error message content
 * @test Test Case 51038 : 49760 AC5 TEST CASE 4: Verify only one radio button can be selected at a time and styling matches Figma
 * @test Test Case 51039 : 49760 AC6 AC7 TEST CASE 5: Verify Yes navigates to Q11 and No navigates to the Check your answers page
 * @test Test Case: 55680 AC1 Verify error summary shows correct error message on Question 10
 * @test Test Case: 55680 AC2 Verify error link focuses the first response option on Question 10
 */

test.describe('Retirement Guidance - Question 10', () => {
  test.beforeEach(async ({ page }) => {
    await homePage.startRetirementGuidance(page);
    await questionnaireNavigator.skipToQuestion(page, 10);
    await question10Page.waitForPage(page);
  });

  test('Verify Question 10 loads with no option selected', async ({ page }) => {
    await expect(question10Page.getPageHeading(page)).toBeVisible();

    const options = basePage.getQuestionOptions(page, 'radio');
    await expect(options).toHaveCount(question10AnswersCount);

    for (let i = 0; i < (await options.count()); i += 1) {
      await expect(options.nth(i)).not.toBeChecked();
    }
  });

  test('Verify back link navigates to Question 9', async ({ page }) => {
    await basePage.clickBackLink(page);

    await expect(page).toHaveURL(/\/en\/question-9/);
  });

  test('Verify an error message displays when continuing without selecting an option', async ({
    page,
  }) => {
    await basePage.clickContinue(page);

    await expect(basePage.getErrorSummaryHeading(page)).toBeVisible();
    await expect(basePage.getErrorSummaryBody(page)).toHaveText(
      `Select 'Yes' or 'No' to continue.`,
    );
  });

  test('Verify only one radio button can be selected at a time', async ({
    page,
  }) => {
    const options = basePage.getQuestionOptions(page, 'radio');
    await expect(options.first()).toBeVisible();

    await basePage.clickRadioOption(page, QUESTION_10_ANSWERS.YES);
    await expect(
      basePage.isOptionSelected(page, QUESTION_10_ANSWERS.YES),
    ).resolves.toBe(true);

    await basePage.clickRadioOption(page, QUESTION_10_ANSWERS.NO);
    await expect(
      basePage.isOptionSelected(page, QUESTION_10_ANSWERS.YES),
    ).resolves.toBe(false);
    await expect(
      basePage.isOptionSelected(page, QUESTION_10_ANSWERS.NO),
    ).resolves.toBe(true);
  });

  test(`Verify error summary shows "Select 'Yes' or 'No' to continue." when continuing without selecting an option`, async ({
    page,
  }) => {
    await basePage.clickContinue(page);

    await expect(basePage.getErrorSummaryHeading(page)).toBeVisible();
    await expect(basePage.getErrorSummaryBody(page)).toHaveText(
      `Select 'Yes' or 'No' to continue.`,
    );
  });

  test(`Verify clicking error link "Select 'Yes' or 'No' to continue." focuses the first response option`, async ({
    page,
  }) => {
    await basePage.clickContinue(page);

    await basePage.getErrorSummaryBody(page).click();

    const firstOption = basePage.getQuestionOptions(page, 'radio').first();
    await expect(firstOption).toBeFocused();
  });

  test('Verify selecting "Yes" and clicking Continue navigates to Question 11', async ({
    page,
  }) => {
    await basePage.clickRadioOption(page, QUESTION_10_ANSWERS.YES);
    await basePage.clickContinue(page);

    await expect(page).toHaveURL((url) => {
      const { pathname, searchParams } = url;
      const expectedPathname = '/en/question-11';

      return (
        pathname === expectedPathname &&
        searchParams.has('q-10') &&
        searchParams.get('q-10') ===
          getQuestion10AnswerValue(QUESTION_10_ANSWERS.YES).toString()
      );
    });
  });

  test('Verify selecting "No" and clicking Continue navigates to Check your answers page', async ({
    page,
  }) => {
    await basePage.clickRadioOption(page, QUESTION_10_ANSWERS.NO);
    await basePage.clickContinue(page);

    await expect(page).toHaveURL((url) => {
      const { pathname, searchParams } = url;
      const expectedPathname = '/en/change-options';

      return (
        pathname === expectedPathname &&
        searchParams.has('q-10') &&
        searchParams.get('q-10') ===
          getQuestion10AnswerValue(QUESTION_10_ANSWERS.NO).toString()
      );
    });
  });
});
