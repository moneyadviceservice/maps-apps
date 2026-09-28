import { expect, test } from '@playwright/test';

import { basePage } from '../pages/basePage';
import homePage from '../pages/HomePage';
import question2Page, {
  getQuestion2AnswerValue,
  QUESTION_2_ANSWERS,
  question2Answers,
  question2AnswersCount,
} from '../pages/question2Page';
import questionnaireNavigator from '../pages/questionnaireNavigator';

/**
 * @tests User Story 46480
 * @tests User Story 55393
 * @tests User Story 55680
 * @test Test Case 50618 : 46480 AC1 TEST CASE 1: Verify all text content and answer options on Question 2 match the Figma design (manually tested)
 * @test Test Case 50619 : 46480 AC2 & AC3 TEST CASE 2: Verify back link navigates to Q1 and no options are preselected on first visit
 * @test Test Case 50623 : 46480 AC4 TEST CASE 3: Verify an error message displays when continuing without selecting an option
 * @test Test Case: 55393 AC2 Verify updated Question 2 validation error message content
 * @test Test Case 50624 : 46480 AC5 TEST CASE 4: Verify only one radio button can be selected at a time and styling matches Figma
 * @test Test Case 50627 : 46480 AC6, 7 & 8 TEST CASE 5: Verify selecting any option and clicking Continue navigates the user to Question 3
 * @test Test Case: 55680 AC1 Verify error summary shows correct error message on Question 2
 * @test Test Case: 55680 AC2 Verify error link focuses the first response option on Question 2
 */

test.describe('Retirement Guidance - Question 2', () => {
  test.beforeEach(async ({ page }) => {
    await homePage.startRetirementGuidance(page);
    await questionnaireNavigator.skipToQuestion(page, 2);
    await question2Page.waitForPage(page);
  });

  test('Verify Question 2 loads with no option selected', async ({ page }) => {
    await expect(question2Page.getPageHeading(page)).toBeVisible();

    const options = basePage.getQuestionOptions(page, 'radio');
    await expect(options).toHaveCount(question2AnswersCount);

    for (let i = 0; i < (await options.count()); i += 1) {
      await expect(options.nth(i)).not.toBeChecked();
    }
  });

  test('Verify back link navigates to Question 1', async ({ page }) => {
    await basePage.clickBackLink(page);

    await expect(page).toHaveURL(/\/en\/question-1/);
  });

  test('Verify an error message displays when continuing without selecting an option', async ({
    page,
  }) => {
    await basePage.clickContinue(page);

    await expect(basePage.getErrorSummaryHeading(page)).toBeVisible();
    await expect(basePage.getErrorSummaryBody(page)).toHaveText(
      `Select 'Yes', 'No', or 'I'm already retired' to continue.`,
    );
  });

  test('Verify only one radio button can be selected at a time', async ({
    page,
  }) => {
    const options = basePage.getQuestionOptions(page, 'radio');
    await expect(options.first()).toBeVisible();

    await basePage.clickRadioOption(page, QUESTION_2_ANSWERS.YES);
    await expect(
      basePage.isOptionSelected(page, QUESTION_2_ANSWERS.YES),
    ).resolves.toBe(true);

    await basePage.clickRadioOption(page, QUESTION_2_ANSWERS.NO);
    await expect(
      basePage.isOptionSelected(page, QUESTION_2_ANSWERS.YES),
    ).resolves.toBe(false);
    await expect(
      basePage.isOptionSelected(page, QUESTION_2_ANSWERS.NO),
    ).resolves.toBe(true);
  });

  test(`Verify error summary shows "Select 'Yes', 'No', or 'I\u2019m already retired' to continue." when continuing without selecting an option`, async ({
    page,
  }) => {
    await basePage.clickContinue(page);

    await expect(basePage.getErrorSummaryHeading(page)).toBeVisible();
    await expect(basePage.getErrorSummaryBody(page)).toHaveText(
      `Select 'Yes', 'No', or 'I'm already retired' to continue.`,
    );
  });

  test(`Verify clicking error link "Select 'Yes', 'No', or 'I\u2019m already retired' to continue." focuses the first response option`, async ({
    page,
  }) => {
    await basePage.clickContinue(page);

    await basePage.getErrorSummaryBody(page).click();

    const firstOption = basePage.getQuestionOptions(page, 'radio').first();
    await expect(firstOption).toBeFocused();
  });

  for (const option of question2Answers) {
    test(`Verify selecting '${option}' and clicking Continue navigates to Question 3`, async ({
      page,
    }) => {
      await basePage.clickRadioOption(page, option);
      await basePage.clickContinue(page);

      await expect(page).toHaveURL((url) => {
        const { pathname, searchParams } = url;

        return (
          pathname === '/en/question-3' &&
          searchParams.has('q-2') &&
          searchParams.get('q-2') === getQuestion2AnswerValue(option).toString()
        );
      });
    });
  }
});
