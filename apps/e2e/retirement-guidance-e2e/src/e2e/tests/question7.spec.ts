import { expect, test } from '@playwright/test';

import { basePage } from '../pages/basePage';
import homePage from '../pages/HomePage';
import question7Page, {
  getQuestion7AnswerValue,
  QUESTION_7_ANSWERS,
  question7Answers,
  question7AnswersCount,
} from '../pages/question7Page';
import questionnaireNavigator from '../pages/questionnaireNavigator';

/**
 * @tests User Story 46488
 * @tests User Story 55393
 * @tests User Story 55680
 * @test Test Case: AC1 Verify Question 7 text content and option count match design
 * @test Test Case: AC2 Verify back link navigates to Question 6
 * @test Test Case: AC3 Verify no options are preselected on first visit
 * @test Test Case: AC4 Verify error message displays when continuing without selection
 * @test Test Case: 55393 AC7 Verify updated Question 7 validation error message content
 * @test Test Case: AC5 Verify only one radio option can be selected at a time
 * @test Test Case: AC6, AC7, AC8 Verify selecting any option and clicking Continue navigates to Question 8
 * @test Test Case: 55680 AC1 Verify error summary shows correct error message on Question 7
 * @test Test Case: 55680 AC2 Verify error link focuses the first response option on Question 7
 */

test.describe('Retirement Guidance - Question 7', () => {
  test.beforeEach(async ({ page }) => {
    await homePage.startRetirementGuidance(page);
    await questionnaireNavigator.skipToQuestion(page, 7);
    await question7Page.waitForPage(page);
  });

  test('Verify Question 7 content matches expected copy and option count', async ({
    page,
  }) => {
    await expect(question7Page.getPageHeading(page)).toBeVisible();

    const options = basePage.getQuestionOptions(page, 'radio');
    await expect(options).toHaveCount(question7AnswersCount);

    for (const option of question7Answers) {
      await expect(basePage.getOptionByLabel(page, option)).toBeVisible();
    }
  });

  test('Verify back link is clickable and navigates away from Question 7', async ({
    page,
  }) => {
    const initialUrl = page.url();
    await basePage.clickBackLink(page);
    await page.waitForURL((url) => url.toString() !== initialUrl);
    // Navigation occurred and away from Q7
    await expect(page).not.toHaveURL(/\/en\/question-7/);
  });

  test('Verify Question 7 loads with no option selected', async ({ page }) => {
    const options = basePage.getQuestionOptions(page, 'radio');
    await expect(options).toHaveCount(question7AnswersCount);

    for (let i = 0; i < (await options.count()); i += 1) {
      await expect(options.nth(i)).not.toBeChecked();
    }
  });

  test('Verify error message displays when continuing without selecting an option', async ({
    page,
  }) => {
    await basePage.clickContinue(page);

    await expect(basePage.getErrorSummaryHeading(page)).toBeVisible();
    await expect(basePage.getErrorSummaryBody(page)).toHaveText(
      `Select 'Yes', 'No', or 'Not sure' to continue.`,
    );
    await expect(page).toHaveURL(/\/en\/question-7/);
  });

  test('Verify only one radio button can be selected at a time', async ({
    page,
  }) => {
    await basePage.clickRadioOption(page, QUESTION_7_ANSWERS.YES);
    await expect(
      basePage.isOptionSelected(page, QUESTION_7_ANSWERS.YES),
    ).resolves.toBe(true);

    await basePage.clickRadioOption(page, QUESTION_7_ANSWERS.NO);
    await expect(
      basePage.isOptionSelected(page, QUESTION_7_ANSWERS.YES),
    ).resolves.toBe(false);
    await expect(
      basePage.isOptionSelected(page, QUESTION_7_ANSWERS.NO),
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

  for (const option of question7Answers) {
    test(`Verify selecting '${option}' and clicking Continue navigates to Question 8`, async ({
      page,
    }) => {
      await basePage.clickRadioOption(page, option);
      await basePage.clickContinue(page);

      await expect(page).toHaveURL((url) => {
        const { pathname, searchParams } = url;

        return (
          pathname === '/en/question-8' &&
          searchParams.has('q-7') &&
          searchParams.get('q-7') === getQuestion7AnswerValue(option).toString()
        );
      });
    });
  }
});
