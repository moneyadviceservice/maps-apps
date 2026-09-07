import { expect, test } from '@playwright/test';

import { basePage } from '../pages/basePage';
import homePage from '../pages/HomePage';
import question5Page, {
  getQuestion5MultipleAnswerValues,
  getQuestion5SingleAnswerValue,
  QUESTION_5_ANSWERS,
  question5Answers,
  question5AnswersCount,
} from '../pages/question5Page';
import questionnaireNavigator from '../pages/questionnaireNavigator';

/**
 * @tests User Story: Verify Question 5 loads successfully and is fully rendered
 * @tests User Story 55393
 * @tests User Story 55680
 * @test  User Story 58836
 *
 * @test TC_AC3_001 Verify Question 5 subtext displays exact wording.
 * @test TC_AC4_001 Verify Defined benefit hint text matches exact wording.
 * @test TC_AC5_001 Verify State Pension option capitalization.
 * @test Test Case: Verify Question 5 loads successfully and is fully rendered
 * @test Test Case: Verify no options are preselected on first visit
 * @test Test Case: Verify back link navigates to Question 4
 * @test Test Case: Verify error message displays when continuing without selection
 * @test Test Case: 55393 AC5 Verify updated Question 5 validation error message content
 * @test Test Case: Verify checkbox styling displays correctly when selected
 * @test Test Case: Verify multiple checkboxes can be selected simultaneously
 * @test Test Case: Verify selecting any option(s) and clicking Continue navigates to Question 6
 * @test Test Case: 55680 AC1 Verify error summary shows 'Select at least one option to continue.' on Question 5
 * @test Test Case: 55680 AC2 Verify error link 'Select at least one option to continue.' focuses the first response option on Question 5
 */

test.describe('Retirement Guidance - Question 5', () => {
  test.beforeEach(async ({ page }) => {
    await homePage.startRetirementGuidance(page);
    await questionnaireNavigator.skipToQuestion(page, 5);
    await question5Page.waitForPage(page);
  });

  test('Verify Question 5 loads with no option checked', async ({ page }) => {
    await expect(question5Page.getPageHeading(page)).toBeVisible();

    const options = basePage.getQuestionOptions(page, 'checkbox');
    await expect(options).toHaveCount(question5AnswersCount);

    for (let i = 0; i < (await options.count()); i += 1) {
      await expect(options.nth(i)).not.toBeChecked();
    }
  });

  test('Verify back link navigates to Question 4', async ({ page }) => {
    await basePage.clickBackLink(page);

    await expect(page).toHaveURL(/\/en\/question-4/);
  });

  test('Verify an error message displays when continuing without selecting an option', async ({
    page,
  }) => {
    await basePage.clickContinue(page);

    await expect(basePage.getErrorSummaryHeading(page)).toBeVisible();
    await expect(basePage.getErrorSummaryBody(page)).toHaveText(
      `Select at least one option to continue.`,
    );
  });

  test('Verify checkbox is checked and styled correctly when selected', async ({
    page,
  }) => {
    await basePage.clickCheckboxOption(
      page,
      QUESTION_5_ANSWERS.DEFINED_CONTRIBUTION,
    );

    await expect(
      basePage.isOptionChecked(page, QUESTION_5_ANSWERS.DEFINED_CONTRIBUTION),
    ).resolves.toBe(true);
  });

  test('Verify multiple checkboxes can be selected simultaneously', async ({
    page,
  }) => {
    const optionsToSelect = [
      QUESTION_5_ANSWERS.DEFINED_CONTRIBUTION,
      QUESTION_5_ANSWERS.DEFINED_BENEFIT,
    ];

    for (const option of optionsToSelect) {
      await basePage.clickCheckboxOption(page, option);
    }

    for (const option of optionsToSelect) {
      await expect(basePage.isOptionChecked(page, option)).resolves.toBe(true);
    }
  });

  test('Verify error summary shows "Select at least one option to continue." when continuing without selecting an option', async ({
    page,
  }) => {
    await basePage.clickContinue(page);

    await expect(basePage.getErrorSummaryHeading(page)).toBeVisible();
    await expect(basePage.getErrorSummaryBody(page)).toHaveText(
      `Select at least one option to continue.`,
    );
  });

  test('TC_AC3_001: Verify Question 5 Subtext Displays Correct Wording', async ({
    page,
  }) => {
    await expect(
      page.getByText(
        'How your pension works, and your options, depends on the types you have.',
        {
          exact: true,
        },
      ),
    ).toBeVisible();
  });

  test('TC_AC4_001: Verify Defined Benefit Hint Text', async ({ page }) => {
    await expect(
      page.getByText(
        /^Often called a final salary or career average scheme\. A workplace pension where the income is based on your salary and years you['’]ve been a scheme member\.$/,
      ),
    ).toBeVisible();
  });

  test('TC_AC5_001: Verify State Pension Capitalisation', async ({ page }) => {
    await expect(
      basePage.getOptionByLabel(page, QUESTION_5_ANSWERS.STATE_PENSION),
    ).toHaveText('State Pension');

    await expect(
      page.getByText('State Pension', { exact: true }),
    ).toBeVisible();
    await expect(page.getByText('State pension', { exact: true })).toHaveCount(
      0,
    );
    await expect(page.getByText('state pension', { exact: true })).toHaveCount(
      0,
    );
    await expect(page.getByText('STATE PENSION', { exact: true })).toHaveCount(
      0,
    );
  });

  test('Verify clicking error link "Select at least one option to continue." focuses the first response option', async ({
    page,
  }) => {
    await basePage.clickContinue(page);

    await basePage.getErrorSummaryBody(page).click();

    const firstOption = basePage.getQuestionOptions(page, 'checkbox').first();
    await expect(firstOption).toBeFocused();
  });

  for (const option of question5Answers) {
    test(`Verify selecting '${option}' and clicking Continue navigates to Question 6`, async ({
      page,
    }) => {
      await basePage.clickCheckboxOption(page, option);
      await basePage.clickContinue(page);

      await expect(page).toHaveURL((url) => {
        const { pathname, searchParams } = url;

        return (
          pathname === '/en/question-6' &&
          searchParams.has('q-5') &&
          searchParams.get('q-5') ===
            getQuestion5SingleAnswerValue(option).toString()
        );
      });
    });
  }

  test('Verify selecting multiple options and clicking Continue navigates to Question 6', async ({
    page,
  }) => {
    const optionsToSelect = [
      QUESTION_5_ANSWERS.DEFINED_CONTRIBUTION,
      QUESTION_5_ANSWERS.STATE_PENSION,
      QUESTION_5_ANSWERS.NOT_SURE,
    ];

    for (const option of optionsToSelect) {
      await basePage.clickCheckboxOption(page, option);
    }

    await basePage.clickContinue(page);

    await expect(page).toHaveURL((url) => {
      const { pathname, searchParams } = url;

      return (
        pathname === '/en/question-6' &&
        searchParams.has('q-5') &&
        searchParams.get('q-5') ===
          getQuestion5MultipleAnswerValues(optionsToSelect).join(',')
      );
    });
  });
});
