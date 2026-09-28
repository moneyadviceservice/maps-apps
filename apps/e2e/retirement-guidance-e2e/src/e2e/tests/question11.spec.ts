import { expect, test } from '@playwright/test';

import { basePage } from '../pages/basePage';
import homePage from '../pages/HomePage';
import question10Page from '../pages/question10Page';
import question11Page, {
  getQuestion11AnswerValue,
  QUESTION_11_ANSWERS,
  question11Answers,
  question11AnswersCount,
} from '../pages/question11Page';
import questionnaireNavigator from '../pages/questionnaireNavigator';

/**
 * @tests User Story: 49762
 * @tests User Story 55393
 * @tests User Story 55680
 * @test Test Case 51041 : 49762 AC2 AC3 AC4 TEST CASE 2: Verify back link, no preselection on first visit and validation error on empty continue
 * @test Test Case: 55393 AC11 Verify updated Question 11 validation error message content
 * @test Test Case 51043 : 49762 AC5 AC6 AC7 TEST CASE 3: Verify only one option can be selected and both Yes and No navigate to the Check your answers page
 * @test Test Case: 55680 AC1 Verify error summary shows correct error message on Question 11
 * @test Test Case: 55680 AC2 Verify error link focuses the first response option on Question 11
 */

test.describe('Retirement Guidance - Question 11', () => {
  test.beforeEach(async ({ page }) => {
    await homePage.startRetirementGuidance(page);
    await questionnaireNavigator.skipToQuestion(page, 11);
    await question11Page.waitForPage(page);
  });

  test('Verify Question 11 loads with no option selected', async ({ page }) => {
    await expect(question11Page.getPageHeading(page)).toBeVisible();

    const options = basePage.getQuestionOptions(page, 'radio');
    await expect(options).toHaveCount(question11AnswersCount);

    for (let i = 0; i < (await options.count()); i += 1) {
      await expect(options.nth(i)).not.toBeChecked();
    }
  });

  test('Verify back link navigates to Question 10', async ({ page }) => {
    await basePage.clickBackLink(page);
    await question10Page.waitForPage(page);

    await expect(page).toHaveURL(/\/en\/question-10/);
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

    await basePage.clickRadioOption(page, QUESTION_11_ANSWERS.YES);
    await expect(
      basePage.isOptionSelected(page, QUESTION_11_ANSWERS.YES),
    ).resolves.toBe(true);

    await basePage.clickRadioOption(page, QUESTION_11_ANSWERS.NO);
    await expect(
      basePage.isOptionSelected(page, QUESTION_11_ANSWERS.YES),
    ).resolves.toBe(false);
    await expect(
      basePage.isOptionSelected(page, QUESTION_11_ANSWERS.NO),
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

  for (const option of question11Answers) {
    test(`Verify selecting '${option}' and clicking Continue navigates to Check your answers page`, async ({
      page,
    }) => {
      await basePage.clickRadioOption(page, option);
      await basePage.clickContinue(page);

      await expect(page).toHaveURL((url) => {
        const { pathname, searchParams } = url;

        return (
          pathname === '/en/change-options' &&
          searchParams.has('q-11') &&
          searchParams.get('q-11') ===
            getQuestion11AnswerValue(option).toString()
        );
      });
    });
  }
});
