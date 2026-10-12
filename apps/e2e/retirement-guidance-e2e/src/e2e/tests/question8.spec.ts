import { expect, test } from '@playwright/test';

import homePage from '../pages/HomePage';
import question8Page, {
  getQuestion8AnswerValue,
  QUESTION_8_ANSWERS,
  question8Answers,
  question8AnswersCount,
} from '../pages/question8Page';
import questionnaireNavigator from '../pages/questionnaireNavigator';

const question8Heading =
  'Are you going through a divorce or ending a civil partnership?';
const moreInfoLinkText = 'Why are we asking this?';
const moreInfoText =
  'You have different options to split your pension if you’re separating from your partner.';

/**
 * @tests User Story 46489
 * @tests User Story 55393
 * @tests User Story 55680
 * @test Test Case: AC1 Verify Question 8 text content and option count match design
 * @test Test Case: AC2 Verify back link navigates to Question 7
 * @test Test Case: AC3 Verify no options are preselected on first visit
 * @test Test Case: AC4 Verify error message displays when continuing without selection
 * @test Test Case: 55393 AC8 Verify updated Question 8 validation error message content
 * @test Test Case: AC5 Verify only one radio option can be selected at a time
 * @test Test Case: AC6 Verify selecting Yes and clicking Continue navigates to Question 9
 * @test Test Case: AC7 Verify selecting No and clicking Continue navigates to Question 9
 * @test Test Case: 55680 AC1 Verify error summary shows correct error message on Question 8
 * @test Test Case: 55680 AC2 Verify error link focuses the first response option on Question 8
 */

test.describe('Retirement Guidance - Question 8', () => {
  test.beforeEach(async ({ page }) => {
    await homePage.startRetirementGuidance(page);
    await questionnaireNavigator.skipToQuestion(page, 8);
    await question8Page.waitForPage(page);
  });

  test('AC1: Verify Question 8 content matches expected copy and option count', async ({
    page,
  }) => {
    await expect(question8Page.getPageHeading(page)).toHaveText(
      question8Heading,
    );

    const options = question8Page.getQuestionOptions(page);
    await expect(options).toHaveCount(question8AnswersCount);

    for (const option of question8Answers) {
      await expect(question8Page.getOptionByLabel(page, option)).toBeVisible();
    }

    await expect(question8Page.getMoreInfoToggle(page)).toHaveText(
      moreInfoLinkText,
    );
    await question8Page.expandMoreInfo(page);
    await expect(question8Page.getMoreInfoText(page)).toHaveText(moreInfoText);
  });

  test('AC2: Verify back link navigates to Question 7', async ({ page }) => {
    await question8Page.clickBackLink(page);

    await expect(page).toHaveURL(/\/en\/question-7/);
  });

  test('AC3: Verify Question 8 loads with no option selected', async ({
    page,
  }) => {
    const options = question8Page.getQuestionOptions(page);
    await expect(options).toHaveCount(question8AnswersCount);

    for (let i = 0; i < (await options.count()); i += 1) {
      await expect(options.nth(i)).not.toBeChecked();
    }
  });

  test('AC4: Verify error message displays when continuing without selecting an option', async ({
    page,
  }) => {
    await question8Page.clickContinue(page);

    await expect(question8Page.getErrorSummaryHeading(page)).toBeVisible();
    await expect(question8Page.getErrorSummaryBody(page)).toHaveText(
      `Select 'Yes' or 'No' to continue.`,
    );
    await expect(page).toHaveURL(/\/en\/question-8/);
  });

  test('AC5: Verify only one radio button can be selected at a time', async ({
    page,
  }) => {
    await question8Page.clickRadioOption(page, QUESTION_8_ANSWERS.YES);
    await expect(
      question8Page.isOptionSelected(page, QUESTION_8_ANSWERS.YES),
    ).resolves.toBe(true);

    await question8Page.clickRadioOption(page, QUESTION_8_ANSWERS.NO);
    await expect(
      question8Page.isOptionSelected(page, QUESTION_8_ANSWERS.YES),
    ).resolves.toBe(false);
    await expect(
      question8Page.isOptionSelected(page, QUESTION_8_ANSWERS.NO),
    ).resolves.toBe(true);
  });

  test(`Verify error summary shows "Select 'Yes' or 'No' to continue." when continuing without selecting an option`, async ({
    page,
  }) => {
    await question8Page.clickContinue(page);

    await expect(question8Page.getErrorSummaryHeading(page)).toBeVisible();
    await expect(question8Page.getErrorSummaryBody(page)).toHaveText(
      `Select 'Yes' or 'No' to continue.`,
    );
  });

  test(`Verify clicking error link "Select 'Yes' or 'No' to continue." focuses the first response option`, async ({
    page,
  }) => {
    await question8Page.clickContinue(page);

    await question8Page.getErrorSummaryBody(page).click();

    const firstOption = question8Page.getQuestionOptions(page).first();
    await expect(firstOption).toBeFocused();
  });

  for (const option of question8Answers) {
    test(`AC6 & AC7: Verify selecting '${option}' and clicking Continue navigates to Question 9`, async ({
      page,
    }) => {
      await question8Page.clickRadioOption(page, option);
      await question8Page.clickContinue(page);

      await expect(page).toHaveURL((url) => {
        const { pathname, searchParams } = url;

        return (
          pathname === '/en/question-9' &&
          searchParams.has('q-8') &&
          searchParams.get('q-8') === getQuestion8AnswerValue(option).toString()
        );
      });
    });
  }
});
