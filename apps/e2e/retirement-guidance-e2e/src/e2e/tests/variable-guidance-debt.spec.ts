import { expect, type Page, test } from '@playwright/test';

import { basePage } from '../pages/basePage';
import checkAnswersPage from '../pages/checkAnswersPage';
import { QUESTION_2_ANSWERS } from '../pages/question2Page';
import { QUESTION_3_ANSWERS } from '../pages/question3Page';
import { QUESTION_5_ANSWERS } from '../pages/question5Page';
import { QUESTION_8_ANSWERS } from '../pages/question8Page';
import { QUESTION_9_ANSWERS } from '../pages/question9Page';
import { QUESTION_10_ANSWERS } from '../pages/question10Page';
import question11Page, {
  QUESTION_11_ANSWERS,
  Question11Answer,
} from '../pages/question11Page';
import questionnaireNavigator from '../pages/questionnaireNavigator';
import resultsPage from '../pages/resultsPage';
import {
  answerIndexMappers,
  navigateCheckAnswersAndUpdate,
} from '../utils/checkAnswersNavigator';

type DebtGuidanceScenario = {
  ac: string;
  q11Answer: Question11Answer;
  visibleSection: string;
  absentSection: string;
  visibleSectionText: string;
  description: string;
};

const debtGuidanceScenarios = [
  {
    ac: 'AC1',
    q11Answer: QUESTION_11_ANSWERS.YES,
    visibleSection: 'debt-23a-section',
    absentSection: 'debt-23-section',
    visibleSectionText: 'Continue to get free help with your debts',
    description:
      'Selecting Yes to Q11 (had debt advice) displays guidance package 23a',
  },
  {
    ac: 'AC2',
    q11Answer: QUESTION_11_ANSWERS.NO,
    visibleSection: 'debt-23-section',
    absentSection: 'debt-23a-section',
    visibleSectionText: 'Speak with a free and confidential debt adviser',
    description:
      'Selecting No to Q11 (no debt advice) displays guidance package 23',
  },
] as const satisfies ReadonlyArray<DebtGuidanceScenario>;

const ac2DebtGuidanceScenario = debtGuidanceScenarios[1];

const goToResultsWithDebtScenario = async (
  page: Page,
  q11Answer: Question11Answer,
) => {
  await questionnaireNavigator.skipToResults(page, {
    q2Answer: QUESTION_2_ANSWERS.YES,
    q3Answer: QUESTION_3_ANSWERS.YES,
    q5Answer: [QUESTION_5_ANSWERS.DEFINED_CONTRIBUTION],
    q8Answer: QUESTION_8_ANSWERS.YES,
    q9Answer: QUESTION_9_ANSWERS.RENT_PRIVATE_LANDLORD,
    q10Answer: QUESTION_10_ANSWERS.YES,
    q11Answer,
  });
};

const updateAnswersAndNavigateToResults = async (
  page: Page,
  currentQ11Answer: Question11Answer,
  previousQ11Answer: Question11Answer,
) => {
  const baseAnswers = [0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0]; // Default answers for debt scenario

  await navigateCheckAnswersAndUpdate(page, baseAnswers, [
    {
      questionNumber: 11,
      currentAnswer: currentQ11Answer,
      previousAnswer: previousQ11Answer,
      getAnswerIndex: answerIndexMappers.yesNo,
      questionPage: question11Page,
      selectAnswer: async (p, answer) => basePage.clickRadioOption(p, answer),
    },
  ]);
};

const assertVisibleDebtGuidanceScenario = async (
  page: Page,
  scenario: DebtGuidanceScenario,
) => {
  const visibleSection = resultsPage.getGuidanceSection(
    page,
    scenario.visibleSection,
  );
  await expect(visibleSection).toBeVisible();
  await expect(visibleSection).toContainText(scenario.visibleSectionText);
  await expect(
    resultsPage.getGuidanceSection(page, scenario.absentSection),
  ).not.toBeAttached();
};

/**
 * @tests User Story 50726
 * @test AC1 Variable Guidance (Debt) - Yes to Q11 displays guidance package 23a
 * @test AC2 Variable Guidance (Debt) - No to Q11 displays guidance package 23
 */
test.describe.serial('Retirement Guidance - Variable Guidance (Debt)', () => {
  let previousQ11Answer: Question11Answer | null = null;

  for (const {
    ac,
    q11Answer,
    visibleSection,
    absentSection,
    visibleSectionText,
    description,
  } of debtGuidanceScenarios) {
    test(`${ac}: ${description}`, async ({ page }) => {
      // eslint-disable-next-line playwright/no-conditional-in-test
      if (previousQ11Answer === null) {
        // First test: go through all questions
        await goToResultsWithDebtScenario(page, q11Answer);
      } else {
        // Subsequent tests: only update Q11 from check answers page
        await updateAnswersAndNavigateToResults(
          page,
          q11Answer,
          previousQ11Answer,
        );
      }

      await expect(resultsPage.getPageHeading(page)).toBeVisible();
      await assertVisibleDebtGuidanceScenario(page, {
        ac,
        q11Answer,
        visibleSection,
        absentSection,
        visibleSectionText,
        description,
      });

      // Track this answer for the next test
      previousQ11Answer = q11Answer;
    });
  }

  test('AC3: Changing Q11 answer from Yes to No updates results to guidance package 23', async ({
    page,
  }) => {
    // Navigate to check answers with Yes answer
    const checkAnswersUrl = `/en/change-options?q-1=0&q-2=0&q-3=0&q-4=0&q-5=0&q-6=0&q-7=0&q-8=0&q-9=3&q-10=0&q-11=0`;
    await page.goto(checkAnswersUrl);
    await checkAnswersPage.waitForPage(page);

    await expect(checkAnswersPage.getQuestionAnswer(page, 11)).toContainText(
      QUESTION_11_ANSWERS.YES,
    );

    await checkAnswersPage.clickChangeButton(page, 11);
    await question11Page.waitForPage(page);
    await basePage.clickRadioOption(page, QUESTION_11_ANSWERS.NO);
    await page.getByRole('button', { name: /Save changes|Continue/ }).click();
    await checkAnswersPage.waitForPage(page);

    await expect(checkAnswersPage.getQuestionAnswer(page, 11)).toContainText(
      QUESTION_11_ANSWERS.NO,
    );

    await checkAnswersPage.clickContinue(page);
    await resultsPage.waitForPage(page);

    await assertVisibleDebtGuidanceScenario(page, ac2DebtGuidanceScenario);
  });
});
