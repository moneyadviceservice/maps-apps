import { expect, test } from '@playwright/test';

import { basePage } from '../pages/basePage';
import homePage from '../pages/HomePage';
import question6Page, {
  getQuestion6AnswerValue,
  QUESTION_6_ANSWERS,
  question6Answers,
  question6AnswersCount,
} from '../pages/question6Page';
import questionnaireNavigator from '../pages/questionnaireNavigator';

/**
 * @tests User Story: 46482
 * @tests User Story 55393
 * @tests User Story 55680
 * @test Test Case 50857 : 46482 AC1 TEST CASE 1: Verify all text content and answer options on Question 6 match the Figma design
 * @test Test Case 50858 : 46482 AC2&3 TEST CASE 2: Verify back link navigates to Q5 and no options are preselected on first visit
 * @test Test Case 50859 : 46482 AC4 TEST CASE 3: Verify an error message displays when continuing without selecting an option
 * @test Test Case: 55393 AC6 Verify updated Question 6 validation error message content
 * @test Test Case 50860 : 46482 AC5 TEST CASE 4: Verify only one radio button can be selected at a time and styling matches Figma
 * @test Test Case 50861 : 46482 AC6, AC7 & AC8 TEST CASE 5: Verify selecting any option and clicking Continue navigates the user to Question 7
 * @test Test Case: 55680 AC1 Verify error summary shows correct error message on Question 6
 * @test Test Case: 55680 AC2 Verify error link focuses the first response option on Question 6
 */

test.describe('Retirement Guidance - Question 6', () => {
  test.beforeEach(async ({ page }) => {
    await homePage.startRetirementGuidance(page);
    await questionnaireNavigator.skipToQuestion(page, 6);
    await question6Page.waitForPage(page);
  });

  test('Verify Question 6 loads with no option selected', async ({ page }) => {
    await expect(question6Page.getPageHeading(page)).toBeVisible();

    const options = basePage.getQuestionOptions(page, 'radio');
    await expect(options).toHaveCount(question6AnswersCount);

    for (let i = 0; i < (await options.count()); i += 1) {
      await expect(options.nth(i)).not.toBeChecked();
    }
  });

  test('Verify back link navigates to Question 5', async ({ page }) => {
    await basePage.clickBackLink(page);

    await expect(page).toHaveURL(/\/en\/question-5/);
  });

  test('Verify an error message displays when continuing without selecting an option', async ({
    page,
  }) => {
    await basePage.clickContinue(page);

    await expect(basePage.getErrorSummaryHeading(page)).toBeVisible();
    await expect(basePage.getErrorSummaryBody(page)).toHaveText(
      `Select 'Yes', 'No', or 'Not sure' to continue.`,
    );
  });

  test('Verify only one radio button can be selected at a time', async ({
    page,
  }) => {
    const options = basePage.getQuestionOptions(page, 'radio');
    await expect(options.first()).toBeVisible();

    await basePage.clickRadioOption(page, QUESTION_6_ANSWERS.YES);
    await expect(
      basePage.isOptionSelected(page, QUESTION_6_ANSWERS.YES),
    ).resolves.toBe(true);

    await basePage.clickRadioOption(page, QUESTION_6_ANSWERS.NO);
    await expect(
      basePage.isOptionSelected(page, QUESTION_6_ANSWERS.YES),
    ).resolves.toBe(false);
    await expect(
      basePage.isOptionSelected(page, QUESTION_6_ANSWERS.NO),
    ).resolves.toBe(true);
  });

  test(`Verify error summary shows "Select 'Yes', 'No', or 'Not sure' to continue." when continuing without selecting an option`, async ({
    page,
  }) => {
    await basePage.clickContinue(page);

    await expect(basePage.getErrorSummaryHeading(page)).toBeVisible();
    await expect(basePage.getErrorSummaryBody(page)).toHaveText(
      `Select 'Yes', 'No', or 'Not sure' to continue.`,
    );
  });

  test(`Verify clicking error link "Select 'Yes', 'No', or 'Not sure' to continue." focuses the first response option`, async ({
    page,
  }) => {
    await basePage.clickContinue(page);

    await basePage.getErrorSummaryBody(page).click();

    const firstOption = basePage.getQuestionOptions(page, 'radio').first();
    await expect(firstOption).toBeFocused();
  });

  for (const option of question6Answers) {
    test(`Verify selecting '${option}' and clicking Continue navigates to Question 7`, async ({
      page,
    }) => {
      await basePage.clickRadioOption(page, option);
      await basePage.clickContinue(page);

      await expect(page).toHaveURL((url) => {
        const { pathname, searchParams } = url;

        return (
          pathname === '/en/question-7' &&
          searchParams.has('q-6') &&
          searchParams.get('q-6') === getQuestion6AnswerValue(option).toString()
        );
      });
    });
  }
});
