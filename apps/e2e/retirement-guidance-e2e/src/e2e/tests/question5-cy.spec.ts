import { expect, test } from '@playwright/test';

import { basePage } from '../pages/basePage';
import question5CyPage, { QUESTION_5_CY_COPY } from '../pages/question5CyPage';

/**
 * @tests User Story: 58836 - Welsh Question 5 AC coverage
 * @test 58836 AC 1 Test Case 1 : Verify Welsh Question 5 Page Loads Correctly
 * @test 58836 AC 1 Test Case 2 : Verify Question Heading is Displayed in Welsh
 * @test 58836 AC 1 Test Case 3 : Verify Pension Type Options are Displayed in Welsh
 * @test 58836 AC 1 Test Case 4 : Verify Navigation Controls are Displayed in Welsh
 * @test 58836 AC 2 Test Case 1 : Verify User Cannot Continue Without Selecting an Option
 * @test 58836 AC 2 Test Case 2 : Verify Welsh Error Message is Displayed
 * @test 58836 AC 2 Test Case 3 : Verify Empty Field Highlighting is Displayed
 * @test 58836 AC 2 Test Case 4 : Verify Validation Clears After Valid Selection
 */
test.describe('Retirement Guidance - Question 5 CY', () => {
  test.beforeEach(async ({ page }) => {
    await question5CyPage.visit(page);
  });

  test('TC_AC1_001: Verify Welsh Question 5 Page Loads Correctly', async ({
    page,
  }) => {
    await expect(page).toHaveURL(question5CyPage.questionUrlMatcher);

    await expect(question5CyPage.getHeading(page)).toHaveText(
      QUESTION_5_CY_COPY.heading,
    );
    await expect(question5CyPage.getDescription(page)).toHaveText(
      QUESTION_5_CY_COPY.description,
    );

    const checkboxOptions = question5CyPage.getCheckboxOptions(page);
    await expect(checkboxOptions).toHaveCount(
      QUESTION_5_CY_COPY.options.length,
    );

    for (const option of QUESTION_5_CY_COPY.options) {
      await expect(
        question5CyPage.getOptionByLabel(page, option),
      ).toBeVisible();
    }

    for (const hint of QUESTION_5_CY_COPY.optionHints) {
      await expect(question5CyPage.getOptionHint(page, hint)).toBeVisible();
    }

    await expect(
      page.getByRole('link', { name: 'Yn ôl', exact: true }),
    ).toBeVisible();
    await expect(question5CyPage.getContinueButton(page)).toHaveText(
      QUESTION_5_CY_COPY.continueButton,
    );

    await expect(question5CyPage.getEnglishHeading(page)).toHaveCount(0);
    await expect(
      page.getByText('Which types of pension do you have?'),
    ).toHaveCount(0);
  });

  test('TC_AC1_002: Verify Question Heading is Displayed in Welsh', async ({
    page,
  }) => {
    await expect(question5CyPage.getHeading(page)).toHaveText(
      QUESTION_5_CY_COPY.heading,
    );
  });

  test('TC_AC1_003: Verify Pension Type Options are Displayed in Welsh', async ({
    page,
  }) => {
    const checkboxOptions = question5CyPage.getCheckboxOptions(page);
    await expect(checkboxOptions).toHaveCount(
      QUESTION_5_CY_COPY.options.length,
    );

    for (let index = 0; index < QUESTION_5_CY_COPY.options.length; index += 1) {
      const option = QUESTION_5_CY_COPY.options[index];
      await expect(checkboxOptions.nth(index)).toHaveAccessibleName(option);
    }
  });

  test('TC_AC1_004: Verify Navigation Controls are Displayed in Welsh', async ({
    page,
  }) => {
    await expect(
      page.getByRole('link', { name: 'Yn ôl', exact: true }),
    ).toBeVisible();
    await expect(question5CyPage.getContinueButton(page)).toHaveText(
      QUESTION_5_CY_COPY.continueButton,
    );
  });

  test('TC_AC2_001: Verify User Cannot Continue Without Selecting an Option', async ({
    page,
  }) => {
    await question5CyPage.getContinueButton(page).click();

    await expect(page).toHaveURL(question5CyPage.questionUrlMatcher);
    await expect(question5CyPage.getErrorSummaryHeading(page)).toBeVisible();
  });

  test('TC_AC2_002: Verify Welsh Error Message is Displayed', async ({
    page,
  }) => {
    await question5CyPage.getContinueButton(page).click();

    await expect(question5CyPage.getErrorSummaryHeading(page)).toHaveText(
      QUESTION_5_CY_COPY.errorSummaryHeading,
    );
    await expect(question5CyPage.getErrorSummaryLink(page)).toHaveText(
      QUESTION_5_CY_COPY.questionSpecificError,
    );

    await expect(
      page.getByText('Select at least one option to continue.'),
    ).toHaveCount(0);
  });

  test('TC_AC2_003: Verify Empty Field Highlighting is Displayed', async ({
    page,
  }) => {
    await question5CyPage.getContinueButton(page).click();

    await expect(question5CyPage.getFieldErrorWrapper(page)).toHaveClass(
      /border-red-600/,
    );
  });

  test('TC_AC2_004: Verify Validation Clears After Valid Selection', async ({
    page,
  }) => {
    await question5CyPage.getContinueButton(page).click();
    await expect(question5CyPage.getErrorSummaryHeading(page)).toBeVisible();

    await basePage.clickCheckboxOption(page, QUESTION_5_CY_COPY.options[0]);
    await question5CyPage.getContinueButton(page).click();

    await expect(page).toHaveURL(/\/cy\/question-6/);
    await expect(question5CyPage.getErrorSummaryHeading(page)).toHaveCount(0);
    await expect(question5CyPage.getFieldErrorWrapper(page)).toHaveCount(0);

    await expect(
      page.getByRole('heading', {
        level: 1,
        name: /Ydych chi'n ystyried dod â nifer o bensiynau at ei gilydd\?/,
      }),
    ).toBeVisible();
  });
});
