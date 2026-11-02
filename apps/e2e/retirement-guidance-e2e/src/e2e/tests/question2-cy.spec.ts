import { expect, test } from '@playwright/test';

import question2CyPage, { QUESTION_2_COPY } from '../pages/question2CyPage';

/**
 * @tests User Story: 56633
 * @test AC1: Welsh Q2 page keeps original structure and all content is in Welsh
 * @test AC2: Submitting Welsh Q2 with no selection keeps user on page and shows Welsh validation + highlighting
 * @test AC3: EN Q2 options match required copy, including third option wording
 */
test.describe('Retirement Guidance - Question 2 CY/EN content (US-56633)', () => {
  test.beforeEach(async ({ page }) => {
    await question2CyPage.visitWelsh(page);
  });

  test('AC1: Welsh Q2 shows original structure and Welsh copy', async ({
    page,
  }) => {
    await expect(page).toHaveURL(question2CyPage.questionCyUrlMatcher);

    await expect(
      question2CyPage.getHeading(page, QUESTION_2_COPY.cy.heading),
    ).toHaveText(QUESTION_2_COPY.cy.heading);

    const radioOptions = question2CyPage.getRadioOptions(page);
    await expect(radioOptions).toHaveCount(QUESTION_2_COPY.cy.options.length);

    for (const option of QUESTION_2_COPY.cy.options) {
      await expect(
        question2CyPage.getOptionByLabel(page, option),
      ).toBeVisible();
    }

    await expect(question2CyPage.getContinueButton(page)).toHaveText(
      QUESTION_2_COPY.cy.continueButton,
    );

    // Guardrail: English heading should not appear on the CY page.
    await expect(
      question2CyPage.getHeading(page, QUESTION_2_COPY.cy.englishHeading),
    ).toHaveCount(0);
  });

  test('AC2: Continue with no selection shows Welsh errors and highlights field group', async ({
    page,
  }) => {
    await question2CyPage.getContinueButton(page).click();

    // User remains on Q2.
    await expect(page).toHaveURL(question2CyPage.questionCyUrlMatcher);

    // Welsh error summary content.
    await expect(question2CyPage.getErrorSummaryHeading(page)).toHaveText(
      QUESTION_2_COPY.cy.errorSummaryHeading,
    );

    await expect(question2CyPage.getErrorSummaryLink(page)).toHaveText(
      QUESTION_2_COPY.cy.questionSpecificError,
    );

    // Field-level error and empty-field highlight wrapper.
    const errorWrapper = question2CyPage.getFieldErrorWrapper(page);
    await expect(errorWrapper).toHaveClass(/border-red-600/);

    // Current implementation displays generic field-level message.
    await expect(question2CyPage.getFieldErrorMessage(page)).toHaveText(
      QUESTION_2_COPY.cy.questionSpecificError,
    );

    // Accessibility behavior: error link focuses first option.
    await question2CyPage.getErrorSummaryLink(page).click();
    await expect(question2CyPage.getFirstRadioInput(page)).toBeFocused();
  });

  test('AC3: EN Q2 options match required copy exactly, including third option wording', async ({
    page,
  }) => {
    await question2CyPage.visitEnglish(page);

    await expect(page).toHaveURL(question2CyPage.questionEnUrlMatcher);
    await expect(
      question2CyPage.getHeading(page, QUESTION_2_COPY.en.heading),
    ).toBeVisible();

    const radioOptions = question2CyPage.getRadioOptions(page);
    await expect(radioOptions).toHaveCount(QUESTION_2_COPY.en.options.length);

    await expect(radioOptions.nth(0)).toHaveAccessibleName(
      QUESTION_2_COPY.en.options[0],
    );
    await expect(radioOptions.nth(1)).toHaveAccessibleName(
      QUESTION_2_COPY.en.options[1],
    );
    await expect(radioOptions.nth(2)).toHaveAccessibleName(
      QUESTION_2_COPY.en.thirdOption,
    );
  });
});
