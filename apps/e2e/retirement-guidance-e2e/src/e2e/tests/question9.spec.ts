import { expect, test } from '@playwright/test';

import { basePage } from '../pages/basePage';
import homePage from '../pages/HomePage';
import question9Page, {
  getQuestion9AnswerValue,
  QUESTION_9_ANSWERS,
  question9Answers,
  question9AnswersCount,
} from '../pages/question9Page';
import questionnaireNavigator from '../pages/questionnaireNavigator';

/**
 * @tests User Story 46487
 * @tests User Story 55393
 * @tests User Story 55680
 * @test Test Case: AC1 Verify Question 9 content matches expected copy and option count
 * @test Test Case: AC2 Verify back link navigates to Question 8
 * @test Test Case: AC3 Verify no options are preselected on first visit
 * @test Test Case: AC4 Verify error message displays when continuing without selection
 * @test Test Case: 55393 AC9 Verify updated Question 9 validation error message content
 * @test Test Case: AC5 Verify only one radio option can be selected at a time
 * @test Test Case: AC6 Verify selecting Rent – private landlord and clicking Continue navigates to Question 10
 * @test Test Case: AC7 Verify selecting Rent – social housing and clicking Continue navigates to Question 10
 * @test Test Case: AC8 Verify selecting Mortgage and clicking Continue navigates to Question 10
 * @test Test Case: AC9 Verify selecting None and clicking Continue navigates to Question 10
 * @test Test Case: 55680 AC1 Verify error summary shows 'Select one option to continue.' on Question 9
 * @test Test Case: 55680 AC2 Verify error link 'Select one option to continue.' focuses the first response option on Question 9
 */

test.describe('Retirement Guidance - Question 9', () => {
  test.beforeEach(async ({ page }) => {
    await homePage.startRetirementGuidance(page);
    await questionnaireNavigator.skipToQuestion(page, 9);
    await question9Page.waitForPage(page);
  });

  test('AC1: Verify Question 9 content matches expected copy and option count', async ({
    page,
  }) => {
    await expect(question9Page.getPageHeading(page)).toBeVisible();
    await expect(question9Page.getPageDescription(page)).toBeVisible();

    const options = basePage.getQuestionOptions(page, 'radio');
    await expect(options).toHaveCount(question9AnswersCount);

    for (const option of question9Answers) {
      await expect(basePage.getOptionByLabel(page, option)).toBeVisible();
    }
  });

  test('AC2: Verify back link navigates to Question 8', async ({ page }) => {
    await basePage.clickBackLink(page);

    await expect(page).toHaveURL(/\/en\/question-8/);
  });

  test('AC3: Verify Question 9 loads with no option selected', async ({
    page,
  }) => {
    const options = basePage.getQuestionOptions(page, 'radio');
    await expect(options).toHaveCount(question9AnswersCount);

    for (let i = 0; i < (await options.count()); i += 1) {
      await expect(options.nth(i)).not.toBeChecked();
    }
  });

  test('AC4: Verify error message displays when continuing without selecting an option', async ({
    page,
  }) => {
    await basePage.clickContinue(page);

    await expect(basePage.getErrorSummaryHeading(page)).toBeVisible();
    await expect(basePage.getErrorSummaryBody(page)).toHaveText(
      `Select one option to continue.`,
    );
    await expect(page).toHaveURL(/\/en\/question-9/);
  });

  test('AC5: Verify only one radio button can be selected at a time', async ({
    page,
  }) => {
    await basePage.clickRadioOption(
      page,
      QUESTION_9_ANSWERS.RENT_PRIVATE_LANDLORD,
    );
    await expect(
      basePage.isOptionSelected(page, QUESTION_9_ANSWERS.RENT_PRIVATE_LANDLORD),
    ).resolves.toBe(true);

    await basePage.clickRadioOption(
      page,
      QUESTION_9_ANSWERS.RENT_SOCIAL_HOUSING,
    );
    await expect(
      basePage.isOptionSelected(page, QUESTION_9_ANSWERS.RENT_PRIVATE_LANDLORD),
    ).resolves.toBe(false);
    await expect(
      basePage.isOptionSelected(page, QUESTION_9_ANSWERS.RENT_SOCIAL_HOUSING),
    ).resolves.toBe(true);
  });

  test('Verify error summary shows "Select one option to continue." when continuing without selecting an option', async ({
    page,
  }) => {
    await basePage.clickContinue(page);

    await expect(basePage.getErrorSummaryHeading(page)).toBeVisible();
    await expect(basePage.getErrorSummaryBody(page)).toHaveText(
      `Select one option to continue.`,
    );
  });

  test('Verify clicking error link "Select one option to continue." focuses the first response option', async ({
    page,
  }) => {
    await basePage.clickContinue(page);

    await basePage.getErrorSummaryBody(page).click();

    const firstOption = basePage.getQuestionOptions(page, 'radio').first();
    await expect(firstOption).toBeFocused();
  });

  for (const option of question9Answers) {
    test(`AC6, AC7, AC8 & AC9: Verify selecting '${option}' and clicking Continue navigates to Question 10`, async ({
      page,
    }) => {
      await basePage.clickRadioOption(page, option);
      await basePage.clickContinue(page);

      await expect(page).toHaveURL((url) => {
        const { pathname, searchParams } = url;

        return (
          pathname === '/en/question-10' &&
          searchParams.has('q-9') &&
          searchParams.get('q-9') === getQuestion9AnswerValue(option).toString()
        );
      });
    });
  }
});
