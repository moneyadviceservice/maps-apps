import { expect, test } from '@playwright/test';

import question1CyPage, { QUESTION_1_CY_COPY } from '../pages/question1CyPage';

/**
 * @tests User Story: US-56613
 * @test 55613 AC1 Test Case 1 : Welsh Q1 page keeps original structure and all content is in Welsh
 * @test 55613 AC1 Test Case 2 : Verify all selectable answers on Question 1 are translated into Welsh.
 * @test 55613 AC1 Test Case 3 : Verify the Continue button text is translated into Welsh.
 * @test 55613 AC2 Test Case 1 : Verify user cannot continue without selecting an option on Question 1.
 * @test 55613 AC2 Test Case 2 : Verify Welsh validation error message appears when no option is selected on Question 1.
 * @test 55613 AC2 Test Case 3 : Submitting Welsh Q1 with no selection keeps user on page and shows Welsh validation + highlighting
 * @test 55613 AC2 Test Case 4 : Verify error clears after valid selection and user can continue to Question 2.
 * @test 55613 AC2 Test Case 5 : Verify Welsh validation error supports accessible navigation to field on Question 1.
 */
test.describe('Retirement Guidance - Question 1 CY (US-56613)', () => {
  // Note: This spec intentionally validates Welsh-only content and error behavior for Q1.
  test.beforeEach(async ({ page }) => {
    await question1CyPage.visit(page);
  });

  test('TC_AC1_001: Welsh Q1 loads with original structure and Welsh content', async ({
    page,
  }) => {
    await expect(page).toHaveURL(question1CyPage.questionUrlMatcher);

    await expect(question1CyPage.getHeading(page)).toHaveText(
      QUESTION_1_CY_COPY.heading,
    );
    await expect(question1CyPage.getDescription(page)).toHaveText(
      QUESTION_1_CY_COPY.description,
    );

    const radioOptions = question1CyPage.getRadioOptions(page);
    await expect(radioOptions).toHaveCount(QUESTION_1_CY_COPY.options.length);

    await expect(question1CyPage.getOptionSeparator(page)).toHaveText(
      QUESTION_1_CY_COPY.optionSeparator,
    );
    await expect(question1CyPage.getContinueButton(page)).toHaveText(
      QUESTION_1_CY_COPY.continueButton,
    );

    // Guardrail: English heading should not appear on the CY page.
    await expect(question1CyPage.getEnglishHeading(page)).toHaveCount(0);
  });

  test('TC_AC1_002: All selectable Q1 options are displayed in Welsh and correct order', async ({
    page,
  }) => {
    const radioOptions = question1CyPage.getRadioOptions(page);
    await expect(radioOptions).toHaveCount(QUESTION_1_CY_COPY.options.length);

    for (let index = 0; index < QUESTION_1_CY_COPY.options.length; index += 1) {
      const option = QUESTION_1_CY_COPY.options[index];
      await expect(radioOptions.nth(index)).toHaveAccessibleName(option);
    }
  });

  test('TC_AC1_003: Continue button text is displayed in Welsh', async ({
    page,
  }) => {
    await expect(question1CyPage.getContinueButton(page)).toHaveText(
      QUESTION_1_CY_COPY.continueButton,
    );
  });

  test('TC_AC2_001: User cannot continue without selecting an option', async ({
    page,
  }) => {
    await question1CyPage.getContinueButton(page).click();

    // User remains on Q1 and validation triggers.
    await expect(page).toHaveURL(question1CyPage.questionUrlMatcher);
    await expect(question1CyPage.getErrorSummaryHeading(page)).toBeVisible();
  });

  test('TC_AC2_002: Welsh validation message appears when no option is selected', async ({
    page,
  }) => {
    await question1CyPage.getContinueButton(page).click();

    // User remains on Q1.
    await expect(page).toHaveURL(question1CyPage.questionUrlMatcher);

    // Welsh error summary content.
    await expect(question1CyPage.getErrorSummaryHeading(page)).toHaveText(
      QUESTION_1_CY_COPY.errorSummaryHeading,
    );

    await expect(question1CyPage.getErrorSummaryLink(page)).toHaveText(
      QUESTION_1_CY_COPY.questionSpecificError,
    );

    // Guardrail: no English validation message should be shown.
    await expect(page.getByText('Select one option to continue.')).toHaveCount(
      0,
    );
  });

  test('TC_AC2_003: Empty field highlighting is shown on validation failure', async ({
    page,
  }) => {
    await question1CyPage.getContinueButton(page).click();

    // Field-level error and empty-field highlight wrapper.
    const errorWrapper = question1CyPage.getFieldErrorWrapper(page);
    await expect(errorWrapper).toHaveClass(/border-red-600/);

    // Current implementation shows the generic field-level message.
    await expect(question1CyPage.getFieldErrorMessage(page)).toHaveText(
      QUESTION_1_CY_COPY.questionSpecificError,
    );
  });

  test('TC_AC2_004: Error clears after valid selection and user can continue', async ({
    page,
  }) => {
    await question1CyPage.getContinueButton(page).click();
    await expect(question1CyPage.getErrorSummaryHeading(page)).toBeVisible();

    await question1CyPage.selectOptionByLabel(
      page,
      QUESTION_1_CY_COPY.options[0],
    );
    await question1CyPage.getContinueButton(page).click();

    await expect(page).toHaveURL(/\/cy\/question-2/);
    await expect(question1CyPage.getErrorSummaryHeading(page)).toHaveCount(0);
  });

  test('TC_AC2_005: Welsh validation error supports accessible navigation to field', async ({
    page,
  }) => {
    await question1CyPage.getContinueButton(page).click();

    await expect(question1CyPage.getErrorSummaryHeading(page)).toHaveText(
      QUESTION_1_CY_COPY.errorSummaryHeading,
    );

    // Accessibility behavior: error link focuses the first response option.
    await question1CyPage.getErrorSummaryLink(page).click();
    await expect(question1CyPage.getFirstRadioInput(page)).toBeFocused();
  });
});
