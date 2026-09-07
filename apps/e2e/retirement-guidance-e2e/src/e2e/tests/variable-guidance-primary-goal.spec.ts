import { expect, type Page, test } from '@playwright/test';

import { QUESTION_1_ANSWERS, Question1Answer } from '../pages/question1Page';
import { QUESTION_2_ANSWERS, Question2Answer } from '../pages/question2Page';
import {
  QUESTION_5_ANSWERS,
  type Question5Answer,
} from '../pages/question5Page';
import questionnaireNavigator from '../pages/questionnaireNavigator';
import resultsPage, {
  PRIMARY_GOAL_SECTION_IDS,
  type PrimaryGoalGuidanceSectionTestId,
} from '../pages/resultsPage';

type PrimaryGoalScenario = {
  ac: string;
  description: string;
  q1Answer: Question1Answer;
  q2Answer: Question2Answer;
  q5Answer?: Question5Answer[];
  visibleSection: PrimaryGoalGuidanceSectionTestId | 'none';
};

const scenarios: PrimaryGoalScenario[] = [
  {
    ac: 'AC1 & AC2',
    description:
      'How my pension works + less than 10 years from retirement = guidance package 22',
    q1Answer: QUESTION_1_ANSWERS.HOW_MY_PENSION_WORKS,
    q2Answer: QUESTION_2_ANSWERS.YES,
    visibleSection: 'find-your-pension-type-22-section',
  },
  {
    ac: 'AC3 & AC4',
    description:
      'How much money I need for retirement + less than 10 years from retirement = guidance package 25a',
    q1Answer: QUESTION_1_ANSWERS.HOW_MUCH_MONEY_I_NEED_FOR_RETIREMENT,
    q2Answer: QUESTION_2_ANSWERS.YES,
    visibleSection: 'primary-goal-25a-section',
  },
  {
    ac: 'AC5 & AC6',
    description:
      'How to grow my pension + less than 10 years from retirement = no guidance',
    q1Answer: QUESTION_1_ANSWERS.HOW_TO_GROW_MY_PENSION,
    q2Answer: QUESTION_2_ANSWERS.YES,
    visibleSection: 'none',
  },
  {
    ac: 'AC7 & AC8',
    description:
      'How to transfer or combine my pension + less than 10 years from retirement = no guidance',
    q1Answer: QUESTION_1_ANSWERS.HOW_TO_TRANSFER_OR_COMBINE_MY_PENSION,
    q2Answer: QUESTION_2_ANSWERS.YES,
    visibleSection: 'none',
  },
  {
    ac: 'AC9 & AC10',
    description:
      'When and how I can take my pension + DC pension + less than 10 years from retirement = guidance package 24b',
    q1Answer: QUESTION_1_ANSWERS.WHEN_AND_HOW_I_CAN_TAKE_MY_PENSION,
    q2Answer: QUESTION_2_ANSWERS.YES,
    visibleSection: 'primary-goal-24b-section',
  },
  {
    ac: 'AC2 & AC5',
    description:
      'When and how I can take my pension + non-DC pension + less than 10 years from retirement = guidance package 24c',
    q1Answer: QUESTION_1_ANSWERS.WHEN_AND_HOW_I_CAN_TAKE_MY_PENSION,
    q2Answer: QUESTION_2_ANSWERS.YES,
    q5Answer: [QUESTION_5_ANSWERS.DEFINED_BENEFIT],
    visibleSection: 'primary-goal-24c-section',
  },
  {
    ac: 'AC11 & AC12',
    description:
      'Let us guide you + less than 10 years from retirement = no guidance',
    q1Answer: QUESTION_1_ANSWERS.LET_US_GUIDE_YOU,
    q2Answer: QUESTION_2_ANSWERS.YES,
    visibleSection: 'none',
  },
  {
    ac: 'AC13 & AC14',
    description:
      'How my pension works + more than 10 years from retirement = guidance package 22',
    q1Answer: QUESTION_1_ANSWERS.HOW_MY_PENSION_WORKS,
    q2Answer: QUESTION_2_ANSWERS.NO,
    visibleSection: 'find-your-pension-type-22-section',
  },
  {
    ac: 'AC15 & AC16',
    description:
      'How much money I need for retirement + more than 10 years from retirement = guidance package 25',
    q1Answer: QUESTION_1_ANSWERS.HOW_MUCH_MONEY_I_NEED_FOR_RETIREMENT,
    q2Answer: QUESTION_2_ANSWERS.NO,
    visibleSection: 'primary-goal-25-section',
  },
  {
    ac: 'AC17 & AC18',
    description:
      'How to grow my pension + more than 10 years from retirement = no guidance',
    q1Answer: QUESTION_1_ANSWERS.HOW_TO_GROW_MY_PENSION,
    q2Answer: QUESTION_2_ANSWERS.NO,
    visibleSection: 'none',
  },
  {
    ac: 'AC19 & AC20',
    description:
      'How to transfer or combine my pension + more than 10 years from retirement = no guidance',
    q1Answer: QUESTION_1_ANSWERS.HOW_TO_TRANSFER_OR_COMBINE_MY_PENSION,
    q2Answer: QUESTION_2_ANSWERS.NO,
    visibleSection: 'none',
  },
  {
    ac: 'AC6 & AC7',
    description:
      'When and how I can take my pension + more than 10 years from retirement = guidance package 24c',
    q1Answer: QUESTION_1_ANSWERS.WHEN_AND_HOW_I_CAN_TAKE_MY_PENSION,
    q2Answer: QUESTION_2_ANSWERS.NO,
    visibleSection: 'primary-goal-24c-section',
  },
  {
    ac: 'AC23 & AC24',
    description:
      'Let us guide you + more than 10 years from retirement = no guidance',
    q1Answer: QUESTION_1_ANSWERS.LET_US_GUIDE_YOU,
    q2Answer: QUESTION_2_ANSWERS.NO,
    visibleSection: 'none',
  },
  {
    ac: 'AC25',
    description:
      'How my pension works + already retired = guidance package 22a',
    q1Answer: QUESTION_1_ANSWERS.HOW_MY_PENSION_WORKS,
    q2Answer: QUESTION_2_ANSWERS.ALREADY_RETIRED,
    visibleSection: 'primary-goal-22a-section',
  },
  {
    ac: 'AC26',
    description:
      'How much money I need for retirement + already retired = guidance package 25b',
    q1Answer: QUESTION_1_ANSWERS.HOW_MUCH_MONEY_I_NEED_FOR_RETIREMENT,
    q2Answer: QUESTION_2_ANSWERS.ALREADY_RETIRED,
    visibleSection: 'primary-goal-25b-section',
  },
  {
    ac: 'AC27',
    description:
      'How to transfer or combine my pension + already retired = no guidance',
    q1Answer: QUESTION_1_ANSWERS.HOW_TO_TRANSFER_OR_COMBINE_MY_PENSION,
    q2Answer: QUESTION_2_ANSWERS.ALREADY_RETIRED,
    visibleSection: 'none',
  },
  {
    ac: 'AC28',
    description:
      'When and how I can take my pension + already retired = guidance package 24a',
    q1Answer: QUESTION_1_ANSWERS.WHEN_AND_HOW_I_CAN_TAKE_MY_PENSION,
    q2Answer: QUESTION_2_ANSWERS.ALREADY_RETIRED,
    visibleSection: 'primary-goal-24a-section',
  },
  {
    ac: 'AC29',
    description:
      'How to grow my pension + already retired = guidance package 26',
    q1Answer: QUESTION_1_ANSWERS.HOW_TO_GROW_MY_PENSION,
    q2Answer: QUESTION_2_ANSWERS.ALREADY_RETIRED,
    visibleSection: 'primary-goal-26-section',
  },
  {
    ac: 'AC30',
    description:
      'How my pension works + already retired = guidance package 22a',
    q1Answer: QUESTION_1_ANSWERS.HOW_MY_PENSION_WORKS,
    q2Answer: QUESTION_2_ANSWERS.ALREADY_RETIRED,
    visibleSection: 'primary-goal-22a-section',
  },
  {
    ac: 'AC31',
    description:
      'How much money I need for retirement + already retired = guidance package 25b',
    q1Answer: QUESTION_1_ANSWERS.HOW_MUCH_MONEY_I_NEED_FOR_RETIREMENT,
    q2Answer: QUESTION_2_ANSWERS.ALREADY_RETIRED,
    visibleSection: 'primary-goal-25b-section',
  },
  {
    ac: 'AC32',
    description:
      'How to transfer or combine my pension + already retired = no guidance',
    q1Answer: QUESTION_1_ANSWERS.HOW_TO_TRANSFER_OR_COMBINE_MY_PENSION,
    q2Answer: QUESTION_2_ANSWERS.ALREADY_RETIRED,
    visibleSection: 'none',
  },
  {
    ac: 'AC33',
    description:
      'When and how I can take my pension + already retired = guidance package 24a',
    q1Answer: QUESTION_1_ANSWERS.WHEN_AND_HOW_I_CAN_TAKE_MY_PENSION,
    q2Answer: QUESTION_2_ANSWERS.ALREADY_RETIRED,
    visibleSection: 'primary-goal-24a-section',
  },
  {
    ac: 'AC34',
    description:
      'How to grow my pension + already retired = guidance package 26',
    q1Answer: QUESTION_1_ANSWERS.HOW_TO_GROW_MY_PENSION,
    q2Answer: QUESTION_2_ANSWERS.ALREADY_RETIRED,
    visibleSection: 'primary-goal-26-section',
  },
];

const goToResultsWithPrimaryGoalScenario = async (
  page: Page,
  scenario: Pick<PrimaryGoalScenario, 'q1Answer' | 'q2Answer' | 'q5Answer'>,
) => {
  const { q1Answer, q2Answer, q5Answer } = scenario;

  await questionnaireNavigator.skipToResults(page, {
    q1Answer,
    q2Answer,
    ...(q5Answer && { q5Answer }),
  });
};

const assertOnlyExpectedPrimaryGoalGuidance = async (
  page: Page,
  expectedSectionId: PrimaryGoalGuidanceSectionTestId | 'none',
) => {
  for (const sectionId of Object.values(PRIMARY_GOAL_SECTION_IDS)) {
    const section = resultsPage.getGuidanceSection(page, sectionId);

    if (sectionId === expectedSectionId) {
      await expect(section).toBeVisible();
    } else {
      await expect(section).not.toBeAttached();
    }
  }
};

/**
 * @tests User Story 50907
 * @test AC1  Verify Guidance Package 22 is displayed
 * @test AC2  How My Pension Works (< 10 Years) - Combination Pension Type
 * @test AC3  How Much Money I Need for Retirement (< 10 Years) - Any Pension Type
 * @test AC4  How Much Money I Need for Retirement (< 10 Years) - Combination Pension Type
 * @test AC5  How to Grow My Pension (< 10 Years) - Any Pension Type
 * @test AC6  How to Grow My Pension (< 10 Years) - Combination Pension Type
 * @test AC7  How to Combine or Transfer My Pension (< 10 Years) - Any Pension Type
 * @test AC8  How to Combine or Transfer My Pension (< 10 Years) - Combination Pension Type
 * @test AC9  When and How I Can Take My Pension (< 10 Years) - Any Pension Type
 * @test AC10 When and How I Can Take My Pension (< 10 Years) - Combination Pension Type
 * @test AC11 Let Us Guide You (< 10 Years) - Any Pension Type
 * @test AC12 Let Us Guide You (< 10 Years) - Combination Pension Type
 * @test AC13 How My Pension Works (> 10 Years) - Any Pension Type
 * @test AC14 How My Pension Works (> 10 Years) - Combination Pension Type
 * @test AC15 How Much Money I Need for Retirement (> 10 Years) - Any Pension Type
 * @test AC16 How Much Money I Need for Retirement (> 10 Years) - Combination Pension Type
 * @test AC17 How to Grow My Pension (> 10 Years) - Any Pension Type
 * @test AC18 How to Grow My Pension (> 10 Years) - Combination Pension Type
 * @test AC19 How to Combine or Transfer My Pension (> 10 Years) - Any Pension Type
 * @test AC20 TC020 - How to Combine or Transfer My Pension (> 10 Years) - Combination Pension Type
 * @test AC21 When and How I Can Take My Pension (> 10 Years) - Any Pension Type
 * @test AC22 When and How I Can Take My Pension (> 10 Years) - Combination Pension Type
 * @test AC23 Let Us Guide You (> 10 Years) - Any Pension Type
 * @test AC24 Let Us Guide You (> 10 Years) - Combination Pension Type
 * @test AC25 How My Pension Works (Retired) - Any Pension Type
 * @test AC26 How Much Money I Need for Retirement (Retired) - Any Pension Type
 * @test AC27 How to Transfer or Combine My Pensions (Retired) - Any Pension Type
 * @test AC28 When and How I Can Take My Pension (Retired) - Any Pension Type
 * @test AC29 How to Grow My Pension (Retired) - Any Pension Type
 * @test AC30 How My Pension Works (Retired) - Combination Pension Type
 * @test AC31 How Much Money I Need for Retirement (Retired) - Combination Pension Type
 * @test AC32 How to Transfer or Combine My Pensions (Retired) - Combination Pension Type
 * @test AC33 When and How I Can Take My Pension (Retired) - Combination Pension Type
 * @test AC34 How to Grow My Pension (Retired) - Combination Pension Type
 */
test.describe
  .serial('Retirement Guidance - Results - Variable Guidance (Primary Goal)', () => {
  for (const scenario of scenarios) {
    // eslint-disable-next-line playwright/expect-expect
    test(`${scenario.ac}: ${scenario.description}`, async ({ page }) => {
      await goToResultsWithPrimaryGoalScenario(page, scenario);
      await resultsPage.waitForPage(page);
      await assertOnlyExpectedPrimaryGoalGuidance(
        page,
        scenario.visibleSection,
      );
    });
  }
});
