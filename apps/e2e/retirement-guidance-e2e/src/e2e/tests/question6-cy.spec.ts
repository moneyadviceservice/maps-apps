import { expect, test } from '@playwright/test';

import question6CyPage, { QUESTION_6_CY_COPY } from '../pages/question6CyPage';

/**
 * @tests User Story: Welsh Question 6 validation and content coverage
 * @test 56637 AC 1 Test Case 1 : Verify Welsh Question 6 page is displayed correctly
 * @test 56637 AC 1 Test Case 2 : Verify Welsh translation accuracy for Question 6 content
 * @test 56637 AC 1 Test Case 3 : Verify page layout remains unchanged in Welsh version
 * @test 56637 AC 2 Test Case 1 : Verify user cannot continue without selecting an option
 * @test 56637 AC 2 Test Case 2 : Verify Welsh error message is displayed when no option is selected
 * @test 56637 AC 2 Test Case 3 : Verify empty field highlighting is displayed on validation failure
 * @test 56637 AC 2 Test Case 4 : Verify error message is removed after valid option selection
 * @test 56637 AC 2 Test Case 5 : Verify each answer option can be selected and allows progression
 *
 */
test.describe('Retirement Guidance - Question 6 CY', () => {
  test.beforeEach(async ({ page }) => {
    await question6CyPage.visit(page);
  });

  test('TC_GRG_Q6_WEL_001: Verify Welsh Question 6 page is displayed correctly', async ({
    page,
  }) => {
    await expect(page).toHaveURL(question6CyPage.questionUrlMatcher);

    await expect(question6CyPage.getHeading(page)).toHaveText(
      QUESTION_6_CY_COPY.heading,
    );
    await expect(question6CyPage.getDescription(page)).toHaveText(
      QUESTION_6_CY_COPY.description,
    );

    const options = question6CyPage.getRadioOptions(page);
    await expect(options).toHaveCount(QUESTION_6_CY_COPY.options.length);

    for (const option of QUESTION_6_CY_COPY.options) {
      await expect(
        question6CyPage.getOptionByLabel(page, option),
      ).toBeVisible();
    }

    await expect(question6CyPage.getContinueButton(page)).toHaveText(
      QUESTION_6_CY_COPY.continueButton,
    );

    // Verify no English heading is visible
    await expect(question6CyPage.getEnglishHeading(page)).toBeHidden();
  });

  test('TC_GRG_Q6_WEL_002: Verify Welsh translation accuracy for Question 6 content', async ({
    page,
  }) => {
    await expect(question6CyPage.getHeading(page)).toHaveText(
      QUESTION_6_CY_COPY.heading,
    );
    await expect(question6CyPage.getDescription(page)).toHaveText(
      QUESTION_6_CY_COPY.description,
    );

    for (let index = 0; index < QUESTION_6_CY_COPY.options.length; index += 1) {
      const option = QUESTION_6_CY_COPY.options[index];
      await expect(
        question6CyPage.getRadioOptions(page).nth(index),
      ).toHaveAccessibleName(option);
    }

    await expect(question6CyPage.getContinueButton(page)).toHaveText(
      QUESTION_6_CY_COPY.continueButton,
    );
  });

  test('TC_GRG_Q6_WEL_003: Verify page layout remains unchanged in Welsh version', async ({
    page,
  }) => {
    const cyOptions = question6CyPage.getRadioOptions(page);
    const cyCount = await cyOptions.count();
    await expect(cyOptions).toHaveCount(QUESTION_6_CY_COPY.options.length);
    await expect(question6CyPage.getContinueButton(page)).toBeVisible();

    await question6CyPage.visitEnglish(page);

    await expect(page).toHaveURL(question6CyPage.questionEnUrlMatcher);
    await expect(question6CyPage.getRadioOptions(page)).toHaveCount(cyCount);
    await expect(question6CyPage.getEnglishContinueButton(page)).toBeVisible();
    await expect(question6CyPage.getEnglishHeading(page)).toBeVisible();
  });

  test('TC_GRG_Q6_WEL_004: Verify user cannot continue without selecting an option', async ({
    page,
  }) => {
    await question6CyPage.getContinueButton(page).click();

    await expect(page).toHaveURL(question6CyPage.questionUrlMatcher);
    await expect(question6CyPage.getErrorSummaryHeading(page)).toBeVisible();
  });

  test('TC_GRG_Q6_WEL_005: Verify Welsh error message is displayed when no option is selected', async ({
    page,
  }) => {
    await question6CyPage.getContinueButton(page).click();

    await expect(question6CyPage.getErrorSummaryHeading(page)).toHaveText(
      QUESTION_6_CY_COPY.errorSummaryHeading,
    );

    await expect(question6CyPage.getErrorSummaryLink(page)).toHaveText(
      /^Dewiswch ['']Ydw[''], ['']Na[''], neu ['']Ddim yn siŵr[''] i barhau\.?$/,
    );
  });

  test('TC_GRG_Q6_WEL_006: Verify empty field highlighting is displayed on validation failure', async ({
    page,
  }) => {
    await question6CyPage.getContinueButton(page).click();
    await expect(question6CyPage.getFieldErrorWrapper(page)).toHaveClass(
      /border-red-600/,
    );
  });

  test('TC_GRG_Q6_WEL_007: Verify error message is removed after valid option selection', async ({
    page,
  }) => {
    await question6CyPage.getContinueButton(page).click();
    await expect(question6CyPage.getErrorSummaryHeading(page)).toBeVisible();

    await question6CyPage.selectOptionByLabel(
      page,
      QUESTION_6_CY_COPY.options[0],
    );
    await question6CyPage.getContinueButton(page).click();

    await expect(page).toHaveURL(/\/cy\/question-7/);
    await expect(question6CyPage.getErrorSummaryHeading(page)).toHaveCount(0);
    await expect(question6CyPage.getFieldErrorWrapper(page)).toHaveCount(0);
  });

  for (const option of QUESTION_6_CY_COPY.options) {
    test(`TC_GRG_Q6_WEL_008: Verify selecting '${option}' allows progression`, async ({
      page,
    }) => {
      await question6CyPage.selectOptionByLabel(page, option);
      await question6CyPage.getContinueButton(page).click();

      await expect(page).toHaveURL(/\/cy\/question-7/);
      await expect(question6CyPage.getErrorSummaryHeading(page)).toHaveCount(0);
    });
  }
});
