import { expect, test } from '@playwright/test';

import { basePage } from '../pages/basePage';
import homePage from '../pages/HomePage';
import question4Page, {
  getQuestion4AnswerValue,
  QUESTION_4_ANSWERS,
  question4Answers,
  question4AnswersCount,
} from '../pages/question4Page';
import questionnaireNavigator from '../pages/questionnaireNavigator';

/**
 * @tests User Story: Verify Question 4 loads successfully and is fully rendered
 * @tests User Story 55393
 * @tests User Story 55680
 * @test Test Case: Verify Question 4 loads successfully and is fully rendered
 * @test Test Case: Verify no options are preselected on first visit
 * @test Test Case: Verify back link navigates to Question 3
 * @test Test Case: Verify error message displays when continuing without selection
 * @test Test Case: 55393 AC4 Verify updated Question 4 validation error message content
 * @test Test Case: Verify only one radio button can be selected at a time
 * @test Test Case: Verify selecting any option and clicking Continue navigates to Question 5
 * @test Test Case: 55680 AC1 Verify error summary shows correct error message on Question 4
 * @test Test Case: 55680 AC2 Verify error link focuses the first response option on Question 4
 */

test.describe('Retirement Guidance - Question 4', () => {
  test.beforeEach(async ({ page }) => {
    await homePage.startRetirementGuidance(page);
    await questionnaireNavigator.skipToQuestion(page, 4);
    await question4Page.waitForPage(page);
  });

  test('Verify Question 4 loads with no option selected', async ({ page }) => {
    await expect(question4Page.getPageHeading(page)).toBeVisible();

    const options = basePage.getQuestionOptions(page, 'radio');
    await expect(options).toHaveCount(question4AnswersCount);

    for (let i = 0; i < (await options.count()); i += 1) {
      await expect(options.nth(i)).not.toBeChecked();
    }
  });

  test('Verify back link navigates to Question 3', async ({ page }) => {
    await basePage.clickBackLink(page);

    await expect(page).toHaveURL(/\/en\/question-3/);
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

    await basePage.clickRadioOption(page, QUESTION_4_ANSWERS.YES);
    await expect(
      basePage.isOptionSelected(page, QUESTION_4_ANSWERS.YES),
    ).resolves.toBe(true);

    await basePage.clickRadioOption(page, QUESTION_4_ANSWERS.NO);
    await expect(
      basePage.isOptionSelected(page, QUESTION_4_ANSWERS.YES),
    ).resolves.toBe(false);
    await expect(
      basePage.isOptionSelected(page, QUESTION_4_ANSWERS.NO),
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

  for (const option of question4Answers) {
    test(`Verify selecting '${option}' and clicking Continue navigates to Question 5`, async ({
      page,
    }) => {
      await basePage.clickRadioOption(page, option);
      await basePage.clickContinue(page);

      await expect(page).toHaveURL((url) => {
        const { pathname, searchParams } = url;

        return (
          pathname === '/en/question-5' &&
          searchParams.has('q-4') &&
          searchParams.get('q-4') === getQuestion4AnswerValue(option).toString()
        );
      });
    });
  }
});
