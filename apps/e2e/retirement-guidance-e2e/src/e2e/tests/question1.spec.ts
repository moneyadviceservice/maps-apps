import { expect, test } from '@playwright/test';

import { basePage } from '../pages/basePage';
import homePage from '../pages/HomePage';
import question1Page, {
  getQuestion1AnswerValue,
  QUESTION_1_ANSWERS,
  question1Answers,
  question1AnswersCount,
} from '../pages/question1Page';

/**
 * @tests User Story 49394
 * @tests User Story 55393
 * @tests User Story 55680
 * @test Test Case 50579 : 49394 AC1 TEST CASE 1: Verify all text content and answer options on Question 1 match the Figma design (Manually Tested)
 * @test Test Case 50366 : 49394 AC2 & AC3 TEST CASE 2: Verify back link navigates correctly and no options are preselected on first visit
 * @test Test Case 50376 : 49394 AC4 TEST CASE 3: Verify an error message displays when continuing without selecting an option
 * @test Test Case: 55393 AC1 Verify updated Question 1 validation error message content
 * @test Test Case 50376 : 49394 AC5 TEST CASE 4: Verify only one radio button can be selected at a time and selection styling matches Figma
 * @test Test Case 50376 : 49394 AC6, AC7, AC8, AC9, AC10 & AC11 TEST CASE 5: Verify selecting any option and clicking Continue navigates the user to Question 2
 * @test Test Case: 55680 AC1 Verify error summary shows 'Select one option to continue.' on Question 1
 * @test Test Case: 55680 AC2 Verify error link 'Select one option to continue.' focuses the first response option on Question 1
 */

test.describe('Retirement Guidance - Question 1', () => {
  test.beforeEach(async ({ page }) => {
    await homePage.startRetirementGuidance(page);
    await page.getByTestId('start-button').click();
    await question1Page.waitForPage(page);
  });

  test('Verify Question 1 loads with no option selected', async ({ page }) => {
    await expect(question1Page.getPageHeading(page)).toBeVisible();

    const options = basePage.getQuestionOptions(page, 'radio');
    await expect(options).toHaveCount(question1AnswersCount);

    for (let i = 0; i < (await options.count()); i += 1) {
      await expect(options.nth(i)).not.toBeChecked();
    }
  });

  test('Verify back link navigates to the retirement guidance landing page', async ({
    page,
  }) => {
    await expect(basePage.getBackLink(page)).toHaveAttribute(
      'href',
      'https://www.moneyhelper.org.uk/en/pensions-and-retirement/pensions-basics/get-retirement-guidance',
    );
  });

  test('Verify an error message displays when continuing without selecting an option', async ({
    page,
  }) => {
    await basePage.clickContinue(page);

    await expect(basePage.getErrorSummaryHeading(page)).toBeVisible();
    await expect(basePage.getErrorSummaryBody(page)).toHaveText(
      `Select one option to continue.`,
    );
  });

  test('Verify only one radio button can be selected at a time', async ({
    page,
  }) => {
    const options = basePage.getQuestionOptions(page, 'radio');
    await expect(options.first()).toBeVisible();
    await basePage.clickRadioOption(
      page,
      QUESTION_1_ANSWERS.HOW_MY_PENSION_WORKS,
    );
    await expect(
      basePage.isOptionSelected(page, QUESTION_1_ANSWERS.HOW_MY_PENSION_WORKS),
    ).resolves.toBe(true);

    await basePage.clickRadioOption(
      page,
      QUESTION_1_ANSWERS.HOW_MUCH_MONEY_I_NEED_FOR_RETIREMENT,
    );
    await expect(
      basePage.isOptionSelected(page, QUESTION_1_ANSWERS.HOW_MY_PENSION_WORKS),
    ).resolves.toBe(false);
    await expect(
      basePage.isOptionSelected(
        page,
        QUESTION_1_ANSWERS.HOW_MUCH_MONEY_I_NEED_FOR_RETIREMENT,
      ),
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

  for (const option of question1Answers) {
    test(`Verify selecting '${option}' and clicking Continue navigates to Question 2`, async ({
      page,
    }) => {
      await basePage.clickRadioOption(page, option);
      await basePage.clickContinue(page);

      await expect(page).toHaveURL((url) => {
        const { pathname, searchParams } = url;

        return (
          pathname === '/en/question-2' &&
          searchParams.has('q-1') &&
          searchParams.get('q-1') === getQuestion1AnswerValue(option).toString()
        );
      });
    });
  }
});
