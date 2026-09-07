import { expect, test } from '@playwright/test';

import question4CyPage, { QUESTION_4_CY_COPY } from '../pages/question4CyPage';

/**
 * @tests Welsh Question 4 - AC1 and AC2 validation coverage
 * @test 56635 AC 1 Test Case 1: Verify Welsh Question 4 Page Loads Correctly
 * @test 56635 AC 1 Test Case 2: Verify Question Text is Displayed in Welsh
 * @test 56635 AC 1 Test Case 3: Verify Answer Options Are Displayed in Welsh
 * @test 56635 AC 1 Test Case 4: Verify Action Buttons Are Displayed in Welsh
 * @test 56635 AC 2 Test Case 1: Verify User Cannot Continue Without Selecting an Option
 * @test 56635 AC 2 Test Case 2: Verify Welsh Error Message is Displayed
 * @test 56635 AC 2 Test Case 3: Verify Empty Field Highlighting is Displayed
 * @test 56635 AC 2 Test Case 4: Verify Error Summary Matches Design
 * @test 56635 AC 2 Test Case 5: Verify User Can Proceed After Selecting a Valid Option
 * @test 56635 AC 2 Test Case 6: Verify Accessibility of Welsh Validation Error
 */
test.describe('Retirement Guidance - Question 4 CY TC Suite', () => {
  test.beforeEach(async ({ page }) => {
    await question4CyPage.visit(page);
  });

  test('TC_AC1_001 - Verify Welsh Question 4 Page Loads Correctly', async ({
    page,
  }) => {
    await expect(page).toHaveURL(question4CyPage.questionUrlMatcher);

    await expect(question4CyPage.getHeading(page)).toHaveText(
      QUESTION_4_CY_COPY.heading,
    );
    await expect(question4CyPage.getDescription(page)).toHaveText(
      QUESTION_4_CY_COPY.description,
    );

    const radioOptions = question4CyPage.getRadioOptions(page);
    await expect(radioOptions).toHaveCount(QUESTION_4_CY_COPY.options.length);

    await expect(question4CyPage.getContinueButton(page)).toHaveText(
      QUESTION_4_CY_COPY.continueButton,
    );

    await expect(question4CyPage.getEnglishHeading(page)).toHaveCount(0);
  });

  test('TC_AC1_002 - Verify Question Text is Displayed in Welsh', async ({
    page,
  }) => {
    await expect(question4CyPage.getHeading(page)).toHaveText(
      QUESTION_4_CY_COPY.heading,
    );
  });

  test('TC_AC1_003 - Verify Answer Options Are Displayed in Welsh', async ({
    page,
  }) => {
    const radioOptions = question4CyPage.getRadioOptions(page);
    await expect(radioOptions).toHaveCount(QUESTION_4_CY_COPY.options.length);

    for (let index = 0; index < QUESTION_4_CY_COPY.options.length; index += 1) {
      const option = QUESTION_4_CY_COPY.options[index];
      await expect(radioOptions.nth(index)).toHaveAccessibleName(option);
    }
  });

  test('TC_AC1_004 - Verify Action Buttons Are Displayed in Welsh', async ({
    page,
  }) => {
    await expect(question4CyPage.getContinueButton(page)).toHaveText(
      QUESTION_4_CY_COPY.continueButton,
    );
  });

  test('TC_AC2_001 - Verify User Cannot Continue Without Selecting an Option', async ({
    page,
  }) => {
    await question4CyPage.getContinueButton(page).click();

    await expect(page).toHaveURL(question4CyPage.questionUrlMatcher);
    await expect(question4CyPage.getErrorSummaryHeading(page)).toBeVisible();
  });

  test('TC_AC2_002 - Verify Welsh Error Message is Displayed', async ({
    page,
  }) => {
    await question4CyPage.getContinueButton(page).click();

    await expect(question4CyPage.getErrorSummaryHeading(page)).toHaveText(
      QUESTION_4_CY_COPY.errorSummaryHeading,
    );
    await expect(question4CyPage.getErrorSummaryLink(page)).toHaveText(
      QUESTION_4_CY_COPY.questionSpecificError,
    );

    await expect(
      page.getByText("Select 'Yes', 'No', or 'Not sure' to continue."),
    ).toHaveCount(0);
  });

  test('TC_AC2_003 - Verify Empty Field Highlighting is Displayed', async ({
    page,
  }) => {
    await question4CyPage.getContinueButton(page).click();

    const errorWrapper = question4CyPage.getFieldErrorWrapper(page);
    await expect(errorWrapper).toHaveClass(/border-red-600/);
    await expect(question4CyPage.getFieldErrorMessage(page)).toHaveText(
      QUESTION_4_CY_COPY.questionSpecificError,
    );
  });

  test('TC_AC2_004 - Verify Error Summary Matches Design', async ({ page }) => {
    await question4CyPage.getContinueButton(page).click();

    await expect(question4CyPage.getErrorSummaryHeading(page)).toHaveText(
      QUESTION_4_CY_COPY.errorSummaryHeading,
    );
    await expect(question4CyPage.getErrorSummaryLink(page)).toHaveText(
      QUESTION_4_CY_COPY.questionSpecificError,
    );

    // Basic design contract checks for summary and highlighted field.
    await expect(question4CyPage.getErrorSummaryHeading(page)).toBeVisible();
    await expect(question4CyPage.getFieldErrorWrapper(page)).toHaveClass(
      /border-red-600/,
    );
  });

  test('TC_AC2_005 - Verify User Can Proceed After Selecting a Valid Option', async ({
    page,
  }) => {
    await question4CyPage.getContinueButton(page).click();
    await expect(question4CyPage.getErrorSummaryHeading(page)).toBeVisible();

    await question4CyPage.selectOptionByLabel(
      page,
      QUESTION_4_CY_COPY.options[0],
    );
    await question4CyPage.getContinueButton(page).click();

    await expect(page).toHaveURL(/\/cy\/question-5/);
  });

  test('TC_AC2_006 - Verify Accessibility of Welsh Validation Error', async ({
    page,
  }) => {
    await question4CyPage.getContinueButton(page).click();

    await expect(question4CyPage.getErrorSummaryHeading(page)).toHaveText(
      QUESTION_4_CY_COPY.errorSummaryHeading,
    );

    await question4CyPage.getErrorSummaryLink(page).click();
    await expect(question4CyPage.getFirstRadioInput(page)).toBeFocused();
  });
});
