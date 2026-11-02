import { expect, test } from '@playwright/test';

import question3CyPage, { QUESTION_3_CY_COPY } from '../pages/question3CyPage';

/**
 * @tests User Story: 56634
 * @test AC1: Welsh Q3 page keeps original structure and all content is in Welsh
 * @test AC2: Submitting Welsh Q3 with no selection keeps user on page and shows Welsh validation + highlighting
 */
test.describe('Retirement Guidance - Question 3 CY (US-56634)', () => {
  test.beforeEach(async ({ page }) => {
    await question3CyPage.visit(page);
  });

  test('AC1: Welsh Q3 shows original structure and Welsh copy', async ({
    page,
  }) => {
    await expect(page).toHaveURL(question3CyPage.questionUrlMatcher);

    await expect(question3CyPage.getHeading(page)).toHaveText(
      QUESTION_3_CY_COPY.heading,
    );
    await expect(question3CyPage.getDescription(page)).toHaveText(
      QUESTION_3_CY_COPY.description,
    );

    const radioOptions = question3CyPage.getRadioOptions(page);
    await expect(radioOptions).toHaveCount(QUESTION_3_CY_COPY.options.length);

    for (const option of QUESTION_3_CY_COPY.options) {
      await expect(
        question3CyPage.getOptionByLabel(page, option),
      ).toBeVisible();
    }

    await expect(question3CyPage.getSelfEmployedHint(page)).toHaveText(
      QUESTION_3_CY_COPY.selfEmployedHint,
    );
    await expect(question3CyPage.getContinueButton(page)).toHaveText(
      QUESTION_3_CY_COPY.continueButton,
    );

    // Guardrail: English heading should not be shown on CY page.
    await expect(question3CyPage.getEnglishHeading(page)).toHaveCount(0);
  });

  test('AC2: Continue with no selection shows Welsh errors and highlights field group', async ({
    page,
  }) => {
    await question3CyPage.getContinueButton(page).click();

    // User remains on Q3.
    await expect(page).toHaveURL(question3CyPage.questionUrlMatcher);

    // Welsh error summary content.
    await expect(question3CyPage.getErrorSummaryHeading(page)).toHaveText(
      QUESTION_3_CY_COPY.errorSummaryHeading,
    );

    await expect(question3CyPage.getErrorSummaryLink(page)).toHaveText(
      QUESTION_3_CY_COPY.questionSpecificError,
    );

    // Field-level error and empty-field highlight wrapper.
    const errorWrapper = question3CyPage.getFieldErrorWrapper(page);
    await expect(errorWrapper).toHaveClass(/border-red-600/);

    await expect(question3CyPage.getFieldErrorMessage(page)).toHaveText(
      QUESTION_3_CY_COPY.questionSpecificError,
    );

    // Accessibility behavior from existing Q3 validations: link focuses first option.
    await question3CyPage.getErrorSummaryLink(page).click();
    await expect(question3CyPage.getFirstRadioInput(page)).toBeFocused();
  });
});
