import { expect, type Page, test } from '@playwright/test';

import { QUESTION_2_ANSWERS } from '../pages/question2Page';
import {
  QUESTION_5_ANSWERS,
  type Question5Answer,
} from '../pages/question5Page';
import {
  QUESTION_7_ANSWERS,
  type Question7Answer,
} from '../pages/question7Page';
import { QUESTION_8_ANSWERS } from '../pages/question8Page';
import questionnaireNavigator from '../pages/questionnaireNavigator';
import resultsPage, {
  OVERSEAS_SECTION_IDS,
  type OverseasGuidanceSectionTestId,
} from '../pages/resultsPage';

type OverseasScenario = {
  ac: string;
  description: string;
  q5Answer: Question5Answer[];
  q7Answer: Question7Answer;
  visibleSection?: OverseasGuidanceSectionTestId;
};

const scenarios: OverseasScenario[] = [
  {
    ac: 'AC1',
    description:
      'Plan to retire outside UK + State Pension only displays guidance package 08a',
    q5Answer: [QUESTION_5_ANSWERS.STATE_PENSION],
    q7Answer: QUESTION_7_ANSWERS.YES,
    visibleSection: OVERSEAS_SECTION_IDS.OVERSEAS_8A_SECTION,
  },
  {
    ac: 'AC2',
    description:
      'Plan to retire outside UK + defined contribution pension displays guidance package 08',
    q5Answer: [QUESTION_5_ANSWERS.DEFINED_CONTRIBUTION],
    q7Answer: QUESTION_7_ANSWERS.YES,
    visibleSection: OVERSEAS_SECTION_IDS.OVERSEAS_8_SECTION,
  },
  {
    ac: 'AC3',
    description:
      'Plan to retire outside UK + multiple pension types without State Pension displays guidance package 08',
    q5Answer: [
      QUESTION_5_ANSWERS.DEFINED_CONTRIBUTION,
      QUESTION_5_ANSWERS.DEFINED_BENEFIT,
    ],
    q7Answer: QUESTION_7_ANSWERS.YES,
    visibleSection: OVERSEAS_SECTION_IDS.OVERSEAS_8_SECTION,
  },
  {
    ac: 'AC4',
    description:
      'Plan to retire outside UK + not sure pension type displays guidance package 08b',
    q5Answer: [QUESTION_5_ANSWERS.NOT_SURE],
    q7Answer: QUESTION_7_ANSWERS.YES,
    visibleSection: OVERSEAS_SECTION_IDS.OVERSEAS_8B_SECTION,
  },
  {
    ac: 'AC5',
    description:
      'Plan to retire outside UK + combination including State Pension displays guidance package 08b',
    q5Answer: [
      QUESTION_5_ANSWERS.STATE_PENSION,
      QUESTION_5_ANSWERS.DEFINED_CONTRIBUTION,
    ],
    q7Answer: QUESTION_7_ANSWERS.YES,
    visibleSection: OVERSEAS_SECTION_IDS.OVERSEAS_8B_SECTION,
  },
  {
    ac: 'AC6',
    description:
      'Do not plan to retire outside UK + State Pension only displays no overseas guidance',
    q5Answer: [QUESTION_5_ANSWERS.STATE_PENSION],
    q7Answer: QUESTION_7_ANSWERS.NO,
  },
  {
    ac: 'AC7',
    description:
      'Do not plan to retire outside UK + combination / not sure pension type displays no overseas guidance',
    q5Answer: [
      QUESTION_5_ANSWERS.DEFINED_CONTRIBUTION,
      QUESTION_5_ANSWERS.NOT_SURE,
    ],
    q7Answer: QUESTION_7_ANSWERS.NO,
  },
  {
    ac: 'AC8',
    description:
      'Not sure about retiring outside UK + State Pension only displays guidance package 08a',
    q5Answer: [QUESTION_5_ANSWERS.STATE_PENSION],
    q7Answer: QUESTION_7_ANSWERS.NOT_SURE,
    visibleSection: OVERSEAS_SECTION_IDS.OVERSEAS_8A_SECTION,
  },
  {
    ac: 'AC9',
    description:
      'Not sure about retiring outside UK + defined benefit pension displays guidance package 08',
    q5Answer: [QUESTION_5_ANSWERS.DEFINED_BENEFIT],
    q7Answer: QUESTION_7_ANSWERS.NOT_SURE,
    visibleSection: OVERSEAS_SECTION_IDS.OVERSEAS_8_SECTION,
  },
  {
    ac: 'AC10',
    description:
      'Not sure about retiring outside UK + combination without State Pension displays guidance package 08',
    q5Answer: [QUESTION_5_ANSWERS.OTHER, QUESTION_5_ANSWERS.DEFINED_BENEFIT],
    q7Answer: QUESTION_7_ANSWERS.NOT_SURE,
    visibleSection: OVERSEAS_SECTION_IDS.OVERSEAS_8_SECTION,
  },
  {
    ac: 'AC11',
    description:
      'Not sure about retiring outside UK + not sure pension type displays guidance package 08b',
    q5Answer: [QUESTION_5_ANSWERS.NOT_SURE],
    q7Answer: QUESTION_7_ANSWERS.NOT_SURE,
    visibleSection: OVERSEAS_SECTION_IDS.OVERSEAS_8B_SECTION,
  },
  {
    ac: 'AC12',
    description:
      'Not sure about retiring outside UK + combination including State Pension displays guidance package 08b',
    q5Answer: [
      QUESTION_5_ANSWERS.STATE_PENSION,
      QUESTION_5_ANSWERS.DEFINED_BENEFIT,
    ],
    q7Answer: QUESTION_7_ANSWERS.NOT_SURE,
    visibleSection: OVERSEAS_SECTION_IDS.OVERSEAS_8B_SECTION,
  },
];

const assertOnlyExpectedOverseasGuidance = async (
  page: Page,
  visibleSection?: OverseasGuidanceSectionTestId,
) => {
  const sections: OverseasGuidanceSectionTestId[] = [
    OVERSEAS_SECTION_IDS.OVERSEAS_8_SECTION,
    OVERSEAS_SECTION_IDS.OVERSEAS_8A_SECTION,
    OVERSEAS_SECTION_IDS.OVERSEAS_8B_SECTION,
  ];

  for (const section of sections) {
    const locator = resultsPage.getGuidanceSection(page, section);

    if (visibleSection && section === visibleSection) {
      await expect(locator).toBeVisible();
    } else {
      await expect(locator).toBeHidden();
    }
  }
};

const goToResultsWithOverseasScenario = async (
  page: Page,
  scenario: Pick<OverseasScenario, 'q5Answer' | 'q7Answer'>,
) => {
  const { q7Answer, q5Answer } = scenario;

  await questionnaireNavigator.skipToResults(page, {
    q2Answer: QUESTION_2_ANSWERS.YES,
    q5Answer,
    q7Answer,
    q8Answer: QUESTION_8_ANSWERS.NO,
  });
};

/**
 * @tests User Story 50892
 * @test AC1  Plan to retire outside UK + State Pension only displays guidance package 08a
 * @test AC2  Plan to retire outside UK + DC/DB/Hybrid pension displays guidance package 08
 * @test AC3  Plan to retire outside UK + combination without State Pension displays guidance package 08
 * @test AC4  Plan to retire outside UK + not sure pension type displays guidance package 08b
 * @test AC5  Plan to retire outside UK + combination including State Pension displays guidance package 08b
 * @test AC6  Do not plan to retire outside UK + any pension type displays no overseas guidance
 * @test AC7  Do not plan to retire outside UK + combination / not sure displays no overseas guidance
 * @test AC8  Not sure about retiring outside UK + State Pension only displays guidance package 08a
 * @test AC9  Not sure about retiring outside UK + DC/DB/Hybrid pension displays guidance package 08
 * @test AC10 Not sure about retiring outside UK + combination without State Pension displays guidance package 08
 * @test AC11 Not sure about retiring outside UK + not sure pension type displays guidance package 08b
 * @test AC12 Not sure about retiring outside UK + combination including State Pension displays guidance package 08b
 */
test.describe
  .serial('Retirement Guidance - Results - Variable Guidance (Overseas)', () => {
  for (const scenario of scenarios) {
    test(`${scenario.ac}: ${scenario.description}`, async ({ page }) => {
      await goToResultsWithOverseasScenario(page, scenario);

      await expect(page).toHaveURL(/\/en\/results/);
      await assertOnlyExpectedOverseasGuidance(page, scenario.visibleSection);
    });
  }
});
