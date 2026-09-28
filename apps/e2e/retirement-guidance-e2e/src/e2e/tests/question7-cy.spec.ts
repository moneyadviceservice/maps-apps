import { expect, test } from '@playwright/test';

import question7CyPage, { QUESTION_7_CY_COPY } from '../pages/question7CyPage';

/**
 * @tests User Story: 56638 - Welsh Question 7 AC coverage
 * @test 56638 AC 1 Test Case 1 : Verify Welsh Q7 page is displayed in original structure and all content is translated correctly
 * @test 56638 AC 1 Test Case 2 : Verify Welsh translation accuracy for question heading
 * @test 56638 AC 1 Test Case 3 : Verify Welsh translation accuracy for answer options
 * @test 56638 AC 1 Test Case 4 : Verify accessibility and screen reader text is available in Welsh
 * @test 56638 AC 2 Test Case 1 : Verify user cannot continue without selecting an answer
 * @test 56638 AC 2 Test Case 2 : Verify Welsh error message content matches approved design
 * @test 56638 AC 2 Test Case 3 : Verify error summary link focuses on the question field
 * @test 56638 AC 2 Test Case 4 : Verify field highlighting matches design specifications
 * @test 56638 AC 2 Test Case 5 : Verify validation error clears after selecting a valid answer
 */
test.describe('Retirement Guidance - Question 7 CY', () => {
  test.beforeEach(async ({ page }) => {
    await question7CyPage.visit(page);
  });

  test('56638 AC 1 Test Case 1 : Verify Welsh Q7 page is displayed in original structure and all content is translated correctly', async ({
    page,
  }) => {
    await expect(page).toHaveURL(question7CyPage.questionUrlMatcher);

    await expect(question7CyPage.getHeading(page)).toHaveText(
      QUESTION_7_CY_COPY.heading,
    );
    await expect(question7CyPage.getDescription(page)).toHaveText(
      QUESTION_7_CY_COPY.description,
    );

    const cyOptions = question7CyPage.getRadioOptions(page);
    await expect(cyOptions).toHaveCount(QUESTION_7_CY_COPY.options.length);

    for (const option of QUESTION_7_CY_COPY.options) {
      await expect(
        question7CyPage.getOptionByLabel(page, option),
      ).toBeVisible();
    }

    await expect(question7CyPage.getContinueButton(page)).toHaveText(
      QUESTION_7_CY_COPY.continueButton,
    );

    await expect(page.getByText(QUESTION_7_CY_COPY.englishHeading)).toHaveCount(
      0,
    );
    await expect(
      page.getByText(QUESTION_7_CY_COPY.englishDescription, { exact: true }),
    ).toHaveCount(0);

    const cyOptionCount = await cyOptions.count();
    await question7CyPage.visitEnglish(page);
    await expect(page).toHaveURL(question7CyPage.questionEnUrlMatcher);
    await expect(question7CyPage.getEnglishHeading(page)).toBeVisible();
    await expect(question7CyPage.getEnglishContinueButton(page)).toBeVisible();
    await expect(question7CyPage.getRadioOptions(page)).toHaveCount(
      cyOptionCount,
    );
  });

  test('56638 AC 1 Test Case 2 : Verify Welsh translation accuracy for question heading', async ({
    page,
  }) => {
    await expect(question7CyPage.getHeading(page)).toHaveText(
      QUESTION_7_CY_COPY.heading,
    );
  });

  test('56638 AC 1 Test Case 3 : Verify Welsh translation accuracy for answer options', async ({
    page,
  }) => {
    const options = question7CyPage.getRadioOptions(page);
    await expect(options).toHaveCount(QUESTION_7_CY_COPY.options.length);

    for (let index = 0; index < QUESTION_7_CY_COPY.options.length; index += 1) {
      const option = QUESTION_7_CY_COPY.options[index];
      await expect(options.nth(index)).toHaveAccessibleName(option);
    }
  });

  test('56638 AC 1 Test Case 4 : Verify accessibility and screen reader text is available in Welsh', async ({
    page,
  }) => {
    await expect(question7CyPage.getRadioGroup(page)).toBeVisible();

    const options = question7CyPage.getRadioOptions(page);
    await expect(options).toHaveCount(QUESTION_7_CY_COPY.options.length);

    for (const option of QUESTION_7_CY_COPY.options) {
      await expect(
        question7CyPage.getOptionByLabel(page, option),
      ).toHaveAccessibleName(option);
    }

    for (const englishOption of QUESTION_7_CY_COPY.englishOptions) {
      await expect(page.getByLabel(englishOption, { exact: true })).toHaveCount(
        0,
      );
    }
  });

  test('56638 AC 2 Test Case 1 : Verify user cannot continue without selecting an answer', async ({
    page,
  }) => {
    await question7CyPage.getContinueButton(page).click();

    await expect(page).toHaveURL(question7CyPage.questionUrlMatcher);
    await expect(question7CyPage.getErrorSummaryHeading(page)).toBeVisible();
    await expect(question7CyPage.getFieldErrorWrapper(page)).toHaveClass(
      /border-red-600/,
    );
  });

  test('56638 AC 2 Test Case 2 : Verify Welsh error message content matches approved design', async ({
    page,
  }) => {
    await question7CyPage.getContinueButton(page).click();

    await expect(question7CyPage.getErrorSummaryHeading(page)).toHaveText(
      QUESTION_7_CY_COPY.errorSummaryHeading,
    );
    await expect(question7CyPage.getErrorSummaryLink(page)).toHaveText(
      QUESTION_7_CY_COPY.questionSpecificError,
    );

    await expect(
      page.getByText(QUESTION_7_CY_COPY.englishQuestionSpecificError),
    ).toHaveCount(0);
  });

  test('56638 AC 2 Test Case 3 : Verify error summary link focuses on the question field', async ({
    page,
  }) => {
    await question7CyPage.getContinueButton(page).click();
    await expect(question7CyPage.getErrorSummaryHeading(page)).toBeVisible();

    await question7CyPage.getErrorSummaryLink(page).click();
    await expect(question7CyPage.getFirstRadioInput(page)).toBeFocused();
    await expect(question7CyPage.getFieldErrorWrapper(page)).toHaveClass(
      /border-red-600/,
    );
  });

  test('56638 AC 2 Test Case 4 : Verify field highlighting matches design specifications', async ({
    page,
  }) => {
    await question7CyPage.getContinueButton(page).click();
    await expect(question7CyPage.getFieldErrorWrapper(page)).toHaveClass(
      /border-red-600/,
    );
  });

  test('56638 AC 2 Test Case 5 : Verify validation error clears after selecting a valid answer', async ({
    page,
  }) => {
    await question7CyPage.getContinueButton(page).click();
    await expect(question7CyPage.getErrorSummaryHeading(page)).toBeVisible();

    await question7CyPage.selectOptionByLabel(
      page,
      QUESTION_7_CY_COPY.options[0],
    );
    await question7CyPage.getContinueButton(page).click();

    await expect(page).toHaveURL(/\/cy\/question-8/);
    await expect(question7CyPage.getErrorSummaryHeading(page)).toHaveCount(0);
    await expect(question7CyPage.getFieldErrorWrapper(page)).toHaveCount(0);
  });
});
