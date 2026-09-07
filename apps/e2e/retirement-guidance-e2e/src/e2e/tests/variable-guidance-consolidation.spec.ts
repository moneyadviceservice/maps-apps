import { expect, type Page, test } from '@playwright/test';

import { QUESTION_2_ANSWERS } from '../pages/question2Page';
import { QUESTION_5_ANSWERS, Question5Answer } from '../pages/question5Page';
import { QUESTION_6_ANSWERS, Question6Answer } from '../pages/question6Page';
import { QUESTION_7_ANSWERS } from '../pages/question7Page';
import { QUESTION_8_ANSWERS } from '../pages/question8Page';
import questionnaireNavigator from '../pages/questionnaireNavigator';
import resultsPage from '../pages/resultsPage';

const CONSOLIDATION_SECTION_IDS = {
  PACKAGE_22: 'find-your-pension-type-22-section',
  PACKAGE_01: 'consolidation-1-section',
  PACKAGE_01A: 'consolidation-1a-section',
  PACKAGE_01B: 'consolidation-1b-section',
  PACKAGE_01C: 'consolidation-1c-section',
} as const;

type ConsolidationSectionTestId =
  (typeof CONSOLIDATION_SECTION_IDS)[keyof typeof CONSOLIDATION_SECTION_IDS];

type ConsolidationScenario = {
  ac: string;
  description: string;
  q5Answer: Question5Answer[];
  q6Answer: Question6Answer;
  visibleSection?: ConsolidationSectionTestId;
};

const scenarios: ConsolidationScenario[] = [
  {
    ac: 'AC1',
    description:
      'State Pension only + Yes to Q6 shows no consolidation guidance',
    q5Answer: [QUESTION_5_ANSWERS.STATE_PENSION],
    q6Answer: QUESTION_6_ANSWERS.YES,
  },
  {
    ac: 'AC1',
    description:
      'State Pension only + No to Q6 shows no consolidation guidance',
    q5Answer: [QUESTION_5_ANSWERS.STATE_PENSION],
    q6Answer: QUESTION_6_ANSWERS.NO,
  },
  {
    ac: 'AC1',
    description:
      'State Pension only + Not sure to Q6 shows no consolidation guidance',
    q5Answer: [QUESTION_5_ANSWERS.STATE_PENSION],
    q6Answer: QUESTION_6_ANSWERS.NOT_SURE,
  },
  {
    ac: 'AC2',
    description: 'Defined benefit only + Yes to Q6 shows guidance package 01a',
    q5Answer: [QUESTION_5_ANSWERS.DEFINED_BENEFIT],
    q6Answer: QUESTION_6_ANSWERS.YES,
    visibleSection: CONSOLIDATION_SECTION_IDS.PACKAGE_01A,
  },
  {
    ac: 'AC2',
    description:
      'Defined benefit only + Not sure to Q6 shows guidance package 01a',
    q5Answer: [QUESTION_5_ANSWERS.DEFINED_BENEFIT],
    q6Answer: QUESTION_6_ANSWERS.NOT_SURE,
    visibleSection: CONSOLIDATION_SECTION_IDS.PACKAGE_01A,
  },
  {
    ac: 'AC3',
    description:
      'Defined benefit only + No to Q6 shows no consolidation guidance',
    q5Answer: [QUESTION_5_ANSWERS.DEFINED_BENEFIT],
    q6Answer: QUESTION_6_ANSWERS.NO,
  },
  {
    ac: 'AC4',
    description:
      'Defined contribution only + Yes to Q6 shows guidance package 01',
    q5Answer: [QUESTION_5_ANSWERS.DEFINED_CONTRIBUTION],
    q6Answer: QUESTION_6_ANSWERS.YES,
    visibleSection: CONSOLIDATION_SECTION_IDS.PACKAGE_01,
  },
  {
    ac: 'AC4',
    description:
      'Defined contribution only + Not sure to Q6 shows guidance package 01',
    q5Answer: [QUESTION_5_ANSWERS.DEFINED_CONTRIBUTION],
    q6Answer: QUESTION_6_ANSWERS.NOT_SURE,
    visibleSection: CONSOLIDATION_SECTION_IDS.PACKAGE_01,
  },
  {
    ac: 'AC5',
    description:
      'Defined contribution only + No to Q6 shows no consolidation guidance',
    q5Answer: [QUESTION_5_ANSWERS.DEFINED_CONTRIBUTION],
    q6Answer: QUESTION_6_ANSWERS.NO,
  },
  {
    ac: 'AC6',
    description:
      'Hybrid pension only (Other) + Yes to Q6 shows guidance package 01',
    q5Answer: [QUESTION_5_ANSWERS.OTHER],
    q6Answer: QUESTION_6_ANSWERS.YES,
    visibleSection: CONSOLIDATION_SECTION_IDS.PACKAGE_01,
  },
  {
    ac: 'AC6',
    description:
      'Hybrid pension only (Other) + Not sure to Q6 shows guidance package 01',
    q5Answer: [QUESTION_5_ANSWERS.OTHER],
    q6Answer: QUESTION_6_ANSWERS.NOT_SURE,
    visibleSection: CONSOLIDATION_SECTION_IDS.PACKAGE_01,
  },
  {
    ac: 'AC7',
    description: 'Hybrid pension only (Other) + No to Q6 shows no guidance',
    q5Answer: [QUESTION_5_ANSWERS.OTHER],
    q6Answer: QUESTION_6_ANSWERS.NO,
  },
  {
    ac: 'AC8',
    description: 'Not sure pension type + Yes to Q6 shows guidance package 22',
    q5Answer: [QUESTION_5_ANSWERS.NOT_SURE],
    q6Answer: QUESTION_6_ANSWERS.YES,
    visibleSection: CONSOLIDATION_SECTION_IDS.PACKAGE_22,
  },
  {
    ac: 'AC8',
    description: 'Not sure pension type + No to Q6 shows guidance package 22',
    q5Answer: [QUESTION_5_ANSWERS.NOT_SURE],
    q6Answer: QUESTION_6_ANSWERS.NO,
    visibleSection: CONSOLIDATION_SECTION_IDS.PACKAGE_22,
  },
  {
    ac: 'AC8',
    description:
      'Not sure pension type + Not sure to Q6 shows guidance package 22',
    q5Answer: [QUESTION_5_ANSWERS.NOT_SURE],
    q6Answer: QUESTION_6_ANSWERS.NOT_SURE,
    visibleSection: CONSOLIDATION_SECTION_IDS.PACKAGE_22,
  },
  {
    ac: 'AC9',
    description:
      'Combination with defined benefit & state pension + Yes to Q6 shows guidance package 01a',
    q5Answer: [
      QUESTION_5_ANSWERS.DEFINED_BENEFIT,
      QUESTION_5_ANSWERS.STATE_PENSION,
    ],
    q6Answer: QUESTION_6_ANSWERS.YES,
    visibleSection: CONSOLIDATION_SECTION_IDS.PACKAGE_01A,
  },
  {
    ac: 'AC9',
    description:
      'Combination with defined benefit & hybrid + Yes to Q6 shows guidance package 01a',
    q5Answer: [QUESTION_5_ANSWERS.DEFINED_BENEFIT, QUESTION_5_ANSWERS.OTHER],
    q6Answer: QUESTION_6_ANSWERS.YES,
    visibleSection: CONSOLIDATION_SECTION_IDS.PACKAGE_01A,
  },
  {
    ac: 'AC9',
    description:
      'Combination with defined benefit & not sure + Yes to Q6 shows guidance package 01a',
    q5Answer: [QUESTION_5_ANSWERS.DEFINED_BENEFIT, QUESTION_5_ANSWERS.NOT_SURE],
    q6Answer: QUESTION_6_ANSWERS.YES,
    visibleSection: CONSOLIDATION_SECTION_IDS.PACKAGE_01A,
  },
  {
    ac: 'AC9',
    description:
      'Combination with defined benefit & state pension & hybrid + Yes to Q6 shows guidance package 01a',
    q5Answer: [
      QUESTION_5_ANSWERS.DEFINED_BENEFIT,
      QUESTION_5_ANSWERS.STATE_PENSION,
      QUESTION_5_ANSWERS.OTHER,
    ],
    q6Answer: QUESTION_6_ANSWERS.YES,
    visibleSection: CONSOLIDATION_SECTION_IDS.PACKAGE_01A,
  },
  {
    ac: 'AC9',
    description:
      'Combination with defined benefit & state pension & not sure + Yes to Q6 shows guidance package 01a',
    q5Answer: [
      QUESTION_5_ANSWERS.DEFINED_BENEFIT,
      QUESTION_5_ANSWERS.STATE_PENSION,
      QUESTION_5_ANSWERS.NOT_SURE,
    ],
    q6Answer: QUESTION_6_ANSWERS.YES,
    visibleSection: CONSOLIDATION_SECTION_IDS.PACKAGE_01A,
  },
  {
    ac: 'AC9',
    description:
      'Combination with defined benefit & hybrid & not sure + Yes to Q6 shows guidance package 01a',
    q5Answer: [
      QUESTION_5_ANSWERS.DEFINED_BENEFIT,
      QUESTION_5_ANSWERS.OTHER,
      QUESTION_5_ANSWERS.NOT_SURE,
    ],
    q6Answer: QUESTION_6_ANSWERS.YES,
    visibleSection: CONSOLIDATION_SECTION_IDS.PACKAGE_01A,
  },
  {
    ac: 'AC9',
    description:
      'Combination with defined benefit & state pension & hybrid & not sure + Yes to Q6 shows guidance package 01a',
    q5Answer: [
      QUESTION_5_ANSWERS.DEFINED_BENEFIT,
      QUESTION_5_ANSWERS.STATE_PENSION,
      QUESTION_5_ANSWERS.OTHER,
      QUESTION_5_ANSWERS.NOT_SURE,
    ],
    q6Answer: QUESTION_6_ANSWERS.YES,
    visibleSection: CONSOLIDATION_SECTION_IDS.PACKAGE_01A,
  },
  {
    ac: 'AC9',
    description:
      'Combination with defined benefit & state pension + Not sure to Q6 shows guidance package 01a',
    q5Answer: [
      QUESTION_5_ANSWERS.DEFINED_BENEFIT,
      QUESTION_5_ANSWERS.STATE_PENSION,
    ],
    q6Answer: QUESTION_6_ANSWERS.NOT_SURE,
    visibleSection: CONSOLIDATION_SECTION_IDS.PACKAGE_01A,
  },
  {
    ac: 'AC9',
    description:
      'Combination with defined benefit & hybrid + Not sure to Q6 shows guidance package 01a',
    q5Answer: [QUESTION_5_ANSWERS.DEFINED_BENEFIT, QUESTION_5_ANSWERS.OTHER],
    q6Answer: QUESTION_6_ANSWERS.NOT_SURE,
    visibleSection: CONSOLIDATION_SECTION_IDS.PACKAGE_01A,
  },
  {
    ac: 'AC9',
    description:
      'Combination with defined benefit & not sure + Not sure to Q6 shows guidance package 01a',
    q5Answer: [QUESTION_5_ANSWERS.DEFINED_BENEFIT, QUESTION_5_ANSWERS.NOT_SURE],
    q6Answer: QUESTION_6_ANSWERS.NOT_SURE,
    visibleSection: CONSOLIDATION_SECTION_IDS.PACKAGE_01A,
  },
  {
    ac: 'AC9',
    description:
      'Combination with defined benefit & state pension & hybrid + Not sure to Q6 shows guidance package 01a',
    q5Answer: [
      QUESTION_5_ANSWERS.DEFINED_BENEFIT,
      QUESTION_5_ANSWERS.STATE_PENSION,
      QUESTION_5_ANSWERS.OTHER,
    ],
    q6Answer: QUESTION_6_ANSWERS.NOT_SURE,
    visibleSection: CONSOLIDATION_SECTION_IDS.PACKAGE_01A,
  },
  {
    ac: 'AC9',
    description:
      'Combination with defined benefit & state pension & not sure + Not sure to Q6 shows guidance package 01a',
    q5Answer: [
      QUESTION_5_ANSWERS.DEFINED_BENEFIT,
      QUESTION_5_ANSWERS.STATE_PENSION,
      QUESTION_5_ANSWERS.NOT_SURE,
    ],
    q6Answer: QUESTION_6_ANSWERS.NOT_SURE,
    visibleSection: CONSOLIDATION_SECTION_IDS.PACKAGE_01A,
  },
  {
    ac: 'AC9',
    description:
      'Combination with defined benefit & hybrid & not sure + Not sure to Q6 shows guidance package 01a',
    q5Answer: [
      QUESTION_5_ANSWERS.DEFINED_BENEFIT,
      QUESTION_5_ANSWERS.OTHER,
      QUESTION_5_ANSWERS.NOT_SURE,
    ],
    q6Answer: QUESTION_6_ANSWERS.NOT_SURE,
    visibleSection: CONSOLIDATION_SECTION_IDS.PACKAGE_01A,
  },
  {
    ac: 'AC9',
    description:
      'Combination with defined benefit & state pension & hybrid & not sure + Not sure to Q6 shows guidance package 01a',
    q5Answer: [
      QUESTION_5_ANSWERS.DEFINED_BENEFIT,
      QUESTION_5_ANSWERS.STATE_PENSION,
      QUESTION_5_ANSWERS.OTHER,
      QUESTION_5_ANSWERS.NOT_SURE,
    ],
    q6Answer: QUESTION_6_ANSWERS.NOT_SURE,
    visibleSection: CONSOLIDATION_SECTION_IDS.PACKAGE_01A,
  },
  {
    ac: 'AC10',
    description:
      'Combination with defined benefit & defined contribution + Yes to Q6 shows guidance package 01c',
    q5Answer: [
      QUESTION_5_ANSWERS.DEFINED_BENEFIT,
      QUESTION_5_ANSWERS.DEFINED_CONTRIBUTION,
    ],
    q6Answer: QUESTION_6_ANSWERS.YES,
    visibleSection: CONSOLIDATION_SECTION_IDS.PACKAGE_01C,
  },
  {
    ac: 'AC10',
    description:
      'Combination with defined benefit & defined contribution & state pension + Yes to Q6 shows guidance package 01c',
    q5Answer: [
      QUESTION_5_ANSWERS.DEFINED_BENEFIT,
      QUESTION_5_ANSWERS.DEFINED_CONTRIBUTION,
      QUESTION_5_ANSWERS.STATE_PENSION,
    ],
    q6Answer: QUESTION_6_ANSWERS.YES,
    visibleSection: CONSOLIDATION_SECTION_IDS.PACKAGE_01C,
  },
  {
    ac: 'AC10',
    description:
      'Combination with defined benefit & defined contribution & hybrid + Yes to Q6 shows guidance package 01c',
    q5Answer: [
      QUESTION_5_ANSWERS.DEFINED_BENEFIT,
      QUESTION_5_ANSWERS.DEFINED_CONTRIBUTION,
      QUESTION_5_ANSWERS.OTHER,
    ],
    q6Answer: QUESTION_6_ANSWERS.YES,
    visibleSection: CONSOLIDATION_SECTION_IDS.PACKAGE_01C,
  },
  {
    ac: 'AC10',
    description:
      'Combination with defined benefit & defined contribution & not sure + Yes to Q6 shows guidance package 01c',
    q5Answer: [
      QUESTION_5_ANSWERS.DEFINED_BENEFIT,
      QUESTION_5_ANSWERS.DEFINED_CONTRIBUTION,
      QUESTION_5_ANSWERS.NOT_SURE,
    ],
    q6Answer: QUESTION_6_ANSWERS.YES,
    visibleSection: CONSOLIDATION_SECTION_IDS.PACKAGE_01C,
  },
  {
    ac: 'AC10',
    description:
      'Combination with defined benefit & defined contribution & state pension & hybrid + Yes to Q6 shows guidance package 01c',
    q5Answer: [
      QUESTION_5_ANSWERS.DEFINED_BENEFIT,
      QUESTION_5_ANSWERS.DEFINED_CONTRIBUTION,
      QUESTION_5_ANSWERS.STATE_PENSION,
      QUESTION_5_ANSWERS.OTHER,
    ],
    q6Answer: QUESTION_6_ANSWERS.YES,
    visibleSection: CONSOLIDATION_SECTION_IDS.PACKAGE_01C,
  },
  {
    ac: 'AC10',
    description:
      'Combination with defined benefit & defined contribution & state pension & not sure + Yes to Q6 shows guidance package 01c',
    q5Answer: [
      QUESTION_5_ANSWERS.DEFINED_BENEFIT,
      QUESTION_5_ANSWERS.DEFINED_CONTRIBUTION,
      QUESTION_5_ANSWERS.STATE_PENSION,
      QUESTION_5_ANSWERS.NOT_SURE,
    ],
    q6Answer: QUESTION_6_ANSWERS.YES,
    visibleSection: CONSOLIDATION_SECTION_IDS.PACKAGE_01C,
  },
  {
    ac: 'AC10',
    description:
      'Combination with defined benefit & defined contribution & hybrid & not sure + Yes to Q6 shows guidance package 01c',
    q5Answer: [
      QUESTION_5_ANSWERS.DEFINED_BENEFIT,
      QUESTION_5_ANSWERS.DEFINED_CONTRIBUTION,
      QUESTION_5_ANSWERS.OTHER,
      QUESTION_5_ANSWERS.NOT_SURE,
    ],
    q6Answer: QUESTION_6_ANSWERS.YES,
    visibleSection: CONSOLIDATION_SECTION_IDS.PACKAGE_01C,
  },
  {
    ac: 'AC10',
    description:
      'Combination with defined benefit & defined contribution & state pension & hybrid & not sure + Yes to Q6 shows guidance package 01c',
    q5Answer: [
      QUESTION_5_ANSWERS.DEFINED_BENEFIT,
      QUESTION_5_ANSWERS.DEFINED_CONTRIBUTION,
      QUESTION_5_ANSWERS.STATE_PENSION,
      QUESTION_5_ANSWERS.OTHER,
      QUESTION_5_ANSWERS.NOT_SURE,
    ],
    q6Answer: QUESTION_6_ANSWERS.YES,
    visibleSection: CONSOLIDATION_SECTION_IDS.PACKAGE_01C,
  },
  {
    ac: 'AC10',
    description:
      'Combination with defined benefit & defined contribution + Not sure to Q6 shows guidance package 01c',
    q5Answer: [
      QUESTION_5_ANSWERS.DEFINED_BENEFIT,
      QUESTION_5_ANSWERS.DEFINED_CONTRIBUTION,
    ],
    q6Answer: QUESTION_6_ANSWERS.NOT_SURE,
    visibleSection: CONSOLIDATION_SECTION_IDS.PACKAGE_01C,
  },
  {
    ac: 'AC10',
    description:
      'Combination with defined benefit & defined contribution & state pension + Not sure to Q6 shows guidance package 01c',
    q5Answer: [
      QUESTION_5_ANSWERS.DEFINED_BENEFIT,
      QUESTION_5_ANSWERS.DEFINED_CONTRIBUTION,
      QUESTION_5_ANSWERS.STATE_PENSION,
    ],
    q6Answer: QUESTION_6_ANSWERS.NOT_SURE,
    visibleSection: CONSOLIDATION_SECTION_IDS.PACKAGE_01C,
  },
  {
    ac: 'AC10',
    description:
      'Combination with defined benefit & defined contribution & hybrid + Not sure to Q6 shows guidance package 01c',
    q5Answer: [
      QUESTION_5_ANSWERS.DEFINED_BENEFIT,
      QUESTION_5_ANSWERS.DEFINED_CONTRIBUTION,
      QUESTION_5_ANSWERS.OTHER,
    ],
    q6Answer: QUESTION_6_ANSWERS.NOT_SURE,
    visibleSection: CONSOLIDATION_SECTION_IDS.PACKAGE_01C,
  },
  {
    ac: 'AC10',
    description:
      'Combination with defined benefit & defined contribution & not sure + Not sure to Q6 shows guidance package 01c',
    q5Answer: [
      QUESTION_5_ANSWERS.DEFINED_BENEFIT,
      QUESTION_5_ANSWERS.DEFINED_CONTRIBUTION,
      QUESTION_5_ANSWERS.NOT_SURE,
    ],
    q6Answer: QUESTION_6_ANSWERS.NOT_SURE,
    visibleSection: CONSOLIDATION_SECTION_IDS.PACKAGE_01C,
  },
  {
    ac: 'AC10',
    description:
      'Combination with defined benefit & defined contribution & state pension & hybrid + Not sure to Q6 shows guidance package 01c',
    q5Answer: [
      QUESTION_5_ANSWERS.DEFINED_BENEFIT,
      QUESTION_5_ANSWERS.DEFINED_CONTRIBUTION,
      QUESTION_5_ANSWERS.STATE_PENSION,
      QUESTION_5_ANSWERS.OTHER,
    ],
    q6Answer: QUESTION_6_ANSWERS.NOT_SURE,
    visibleSection: CONSOLIDATION_SECTION_IDS.PACKAGE_01C,
  },
  {
    ac: 'AC10',
    description:
      'Combination with defined benefit & defined contribution & state pension & not sure + Not sure to Q6 shows guidance package 01c',
    q5Answer: [
      QUESTION_5_ANSWERS.DEFINED_BENEFIT,
      QUESTION_5_ANSWERS.DEFINED_CONTRIBUTION,
      QUESTION_5_ANSWERS.STATE_PENSION,
      QUESTION_5_ANSWERS.NOT_SURE,
    ],
    q6Answer: QUESTION_6_ANSWERS.NOT_SURE,
    visibleSection: CONSOLIDATION_SECTION_IDS.PACKAGE_01C,
  },
  {
    ac: 'AC10',
    description:
      'Combination with defined benefit & defined contribution & hybrid & not sure + Not sure to Q6 shows guidance package 01c',
    q5Answer: [
      QUESTION_5_ANSWERS.DEFINED_BENEFIT,
      QUESTION_5_ANSWERS.DEFINED_CONTRIBUTION,
      QUESTION_5_ANSWERS.OTHER,
      QUESTION_5_ANSWERS.NOT_SURE,
    ],
    q6Answer: QUESTION_6_ANSWERS.NOT_SURE,
    visibleSection: CONSOLIDATION_SECTION_IDS.PACKAGE_01C,
  },
  {
    ac: 'AC10',
    description:
      'Combination with defined benefit & defined contribution & state pension & hybrid & not sure + Not sure to Q6 shows guidance package 01c',
    q5Answer: [
      QUESTION_5_ANSWERS.DEFINED_BENEFIT,
      QUESTION_5_ANSWERS.DEFINED_CONTRIBUTION,
      QUESTION_5_ANSWERS.STATE_PENSION,
      QUESTION_5_ANSWERS.OTHER,
      QUESTION_5_ANSWERS.NOT_SURE,
    ],
    q6Answer: QUESTION_6_ANSWERS.NOT_SURE,
    visibleSection: CONSOLIDATION_SECTION_IDS.PACKAGE_01C,
  },
  {
    ac: 'AC11',
    description:
      'Combination without defined benefit (state pension & defined contribution) + Yes to Q6 shows guidance package 01',
    q5Answer: [
      QUESTION_5_ANSWERS.STATE_PENSION,
      QUESTION_5_ANSWERS.DEFINED_CONTRIBUTION,
    ],
    q6Answer: QUESTION_6_ANSWERS.YES,
    visibleSection: CONSOLIDATION_SECTION_IDS.PACKAGE_01,
  },
  {
    ac: 'AC11',
    description:
      'Combination without defined benefit (state pension & hybrid) + Yes to Q6 shows guidance package 01',
    q5Answer: [QUESTION_5_ANSWERS.STATE_PENSION, QUESTION_5_ANSWERS.OTHER],
    q6Answer: QUESTION_6_ANSWERS.YES,
    visibleSection: CONSOLIDATION_SECTION_IDS.PACKAGE_01,
  },
  {
    ac: 'AC11',
    description:
      'Combination without defined benefit (state pension & not sure) + Yes to Q6 shows guidance package 01',
    q5Answer: [QUESTION_5_ANSWERS.STATE_PENSION, QUESTION_5_ANSWERS.NOT_SURE],
    q6Answer: QUESTION_6_ANSWERS.YES,
    visibleSection: CONSOLIDATION_SECTION_IDS.PACKAGE_01,
  },
  {
    ac: 'AC11',
    description:
      'Combination without defined benefit (defined contribution & hybrid) + Yes to Q6 shows guidance package 01',
    q5Answer: [
      QUESTION_5_ANSWERS.DEFINED_CONTRIBUTION,
      QUESTION_5_ANSWERS.OTHER,
    ],
    q6Answer: QUESTION_6_ANSWERS.YES,
    visibleSection: CONSOLIDATION_SECTION_IDS.PACKAGE_01,
  },
  {
    ac: 'AC11',
    description:
      'Combination without defined benefit (defined contribution & not sure) + Yes to Q6 shows guidance package 01',
    q5Answer: [
      QUESTION_5_ANSWERS.DEFINED_CONTRIBUTION,
      QUESTION_5_ANSWERS.NOT_SURE,
    ],
    q6Answer: QUESTION_6_ANSWERS.YES,
    visibleSection: CONSOLIDATION_SECTION_IDS.PACKAGE_01,
  },
  {
    ac: 'AC11',
    description:
      'Combination without defined benefit (hybrid & not sure) + Yes to Q6 shows guidance package 01',
    q5Answer: [QUESTION_5_ANSWERS.OTHER, QUESTION_5_ANSWERS.NOT_SURE],
    q6Answer: QUESTION_6_ANSWERS.YES,
    visibleSection: CONSOLIDATION_SECTION_IDS.PACKAGE_01,
  },
  {
    ac: 'AC11',
    description:
      'Combination without defined benefit (state pension & defined contribution & hybrid) + Yes to Q6 shows guidance package 01',
    q5Answer: [
      QUESTION_5_ANSWERS.STATE_PENSION,
      QUESTION_5_ANSWERS.DEFINED_CONTRIBUTION,
      QUESTION_5_ANSWERS.OTHER,
    ],
    q6Answer: QUESTION_6_ANSWERS.YES,
    visibleSection: CONSOLIDATION_SECTION_IDS.PACKAGE_01,
  },
  {
    ac: 'AC11',
    description:
      'Combination without defined benefit (state pension & defined contribution & not sure) + Yes to Q6 shows guidance package 01',
    q5Answer: [
      QUESTION_5_ANSWERS.STATE_PENSION,
      QUESTION_5_ANSWERS.DEFINED_CONTRIBUTION,
      QUESTION_5_ANSWERS.NOT_SURE,
    ],
    q6Answer: QUESTION_6_ANSWERS.YES,
    visibleSection: CONSOLIDATION_SECTION_IDS.PACKAGE_01,
  },
  {
    ac: 'AC11',
    description:
      'Combination without defined benefit (state pension & hybrid & not sure) + Yes to Q6 shows guidance package 01',
    q5Answer: [
      QUESTION_5_ANSWERS.STATE_PENSION,
      QUESTION_5_ANSWERS.OTHER,
      QUESTION_5_ANSWERS.NOT_SURE,
    ],
    q6Answer: QUESTION_6_ANSWERS.YES,
    visibleSection: CONSOLIDATION_SECTION_IDS.PACKAGE_01,
  },
  {
    ac: 'AC11',
    description:
      'Combination without defined benefit (defined contribution, hybrid, not sure) + Yes to Q6 shows guidance package 01',
    q5Answer: [
      QUESTION_5_ANSWERS.DEFINED_CONTRIBUTION,
      QUESTION_5_ANSWERS.OTHER,
      QUESTION_5_ANSWERS.NOT_SURE,
    ],
    q6Answer: QUESTION_6_ANSWERS.YES,
    visibleSection: CONSOLIDATION_SECTION_IDS.PACKAGE_01,
  },
  {
    ac: 'AC11',
    description:
      'Combination without defined benefit (state pension, defined contribution, hybrid, not sure) + Yes to Q6 shows guidance package 01',
    q5Answer: [
      QUESTION_5_ANSWERS.STATE_PENSION,
      QUESTION_5_ANSWERS.DEFINED_CONTRIBUTION,
      QUESTION_5_ANSWERS.OTHER,
      QUESTION_5_ANSWERS.NOT_SURE,
    ],
    q6Answer: QUESTION_6_ANSWERS.YES,
    visibleSection: CONSOLIDATION_SECTION_IDS.PACKAGE_01,
  },
  {
    ac: 'AC11',
    description:
      'Combination without defined benefit (state pension & defined contribution) + Not sure to Q6 shows guidance package 01',
    q5Answer: [
      QUESTION_5_ANSWERS.STATE_PENSION,
      QUESTION_5_ANSWERS.DEFINED_CONTRIBUTION,
    ],
    q6Answer: QUESTION_6_ANSWERS.NOT_SURE,
    visibleSection: CONSOLIDATION_SECTION_IDS.PACKAGE_01,
  },
  {
    ac: 'AC11',
    description:
      'Combination without defined benefit (state pension & hybrid) + Not sure to Q6 shows guidance package 01',
    q5Answer: [QUESTION_5_ANSWERS.STATE_PENSION, QUESTION_5_ANSWERS.OTHER],
    q6Answer: QUESTION_6_ANSWERS.NOT_SURE,
    visibleSection: CONSOLIDATION_SECTION_IDS.PACKAGE_01,
  },
  {
    ac: 'AC11',
    description:
      'Combination without defined benefit (state pension & not sure) + Not sure to Q6 shows guidance package 01',
    q5Answer: [QUESTION_5_ANSWERS.STATE_PENSION, QUESTION_5_ANSWERS.NOT_SURE],
    q6Answer: QUESTION_6_ANSWERS.NOT_SURE,
    visibleSection: CONSOLIDATION_SECTION_IDS.PACKAGE_01,
  },
  {
    ac: 'AC11',
    description:
      'Combination without defined benefit (defined contribution & hybrid) + Not sure to Q6 shows guidance package 01',
    q5Answer: [
      QUESTION_5_ANSWERS.DEFINED_CONTRIBUTION,
      QUESTION_5_ANSWERS.OTHER,
    ],
    q6Answer: QUESTION_6_ANSWERS.NOT_SURE,
    visibleSection: CONSOLIDATION_SECTION_IDS.PACKAGE_01,
  },
  {
    ac: 'AC11',
    description:
      'Combination without defined benefit (defined contribution & not sure) + Not sure to Q6 shows guidance package 01',
    q5Answer: [
      QUESTION_5_ANSWERS.DEFINED_CONTRIBUTION,
      QUESTION_5_ANSWERS.NOT_SURE,
    ],
    q6Answer: QUESTION_6_ANSWERS.NOT_SURE,
    visibleSection: CONSOLIDATION_SECTION_IDS.PACKAGE_01,
  },
  {
    ac: 'AC11',
    description:
      'Combination without defined benefit (hybrid & not sure) + Not sure to Q6 shows guidance package 01',
    q5Answer: [QUESTION_5_ANSWERS.OTHER, QUESTION_5_ANSWERS.NOT_SURE],
    q6Answer: QUESTION_6_ANSWERS.NOT_SURE,
    visibleSection: CONSOLIDATION_SECTION_IDS.PACKAGE_01,
  },
  {
    ac: 'AC11',
    description:
      'Combination without defined benefit (state pension & defined contribution & hybrid) + Not sure to Q6 shows guidance package 01',
    q5Answer: [
      QUESTION_5_ANSWERS.STATE_PENSION,
      QUESTION_5_ANSWERS.DEFINED_CONTRIBUTION,
      QUESTION_5_ANSWERS.OTHER,
    ],
    q6Answer: QUESTION_6_ANSWERS.NOT_SURE,
    visibleSection: CONSOLIDATION_SECTION_IDS.PACKAGE_01,
  },
  {
    ac: 'AC11',
    description:
      'Combination without defined benefit (state pension & defined contribution & not sure) + Not sure to Q6 shows guidance package 01',
    q5Answer: [
      QUESTION_5_ANSWERS.STATE_PENSION,
      QUESTION_5_ANSWERS.DEFINED_CONTRIBUTION,
      QUESTION_5_ANSWERS.NOT_SURE,
    ],
    q6Answer: QUESTION_6_ANSWERS.NOT_SURE,
    visibleSection: CONSOLIDATION_SECTION_IDS.PACKAGE_01,
  },
  {
    ac: 'AC11',
    description:
      'Combination without defined benefit (state pension & hybrid & not sure) + Not sure to Q6 shows guidance package 01',
    q5Answer: [
      QUESTION_5_ANSWERS.STATE_PENSION,
      QUESTION_5_ANSWERS.OTHER,
      QUESTION_5_ANSWERS.NOT_SURE,
    ],
    q6Answer: QUESTION_6_ANSWERS.NOT_SURE,
    visibleSection: CONSOLIDATION_SECTION_IDS.PACKAGE_01,
  },
  {
    ac: 'AC11',
    description:
      'Combination without defined benefit (defined contribution, hybrid, not sure) + Not sure to Q6 shows guidance package 01',
    q5Answer: [
      QUESTION_5_ANSWERS.DEFINED_CONTRIBUTION,
      QUESTION_5_ANSWERS.OTHER,
      QUESTION_5_ANSWERS.NOT_SURE,
    ],
    q6Answer: QUESTION_6_ANSWERS.NOT_SURE,
    visibleSection: CONSOLIDATION_SECTION_IDS.PACKAGE_01,
  },
  {
    ac: 'AC11',
    description:
      'Combination without defined benefit (state pension, defined contribution, hybrid, not sure) + Not sure to Q6 shows guidance package 01',
    q5Answer: [
      QUESTION_5_ANSWERS.STATE_PENSION,
      QUESTION_5_ANSWERS.DEFINED_CONTRIBUTION,
      QUESTION_5_ANSWERS.OTHER,
      QUESTION_5_ANSWERS.NOT_SURE,
    ],
    q6Answer: QUESTION_6_ANSWERS.NOT_SURE,
    visibleSection: CONSOLIDATION_SECTION_IDS.PACKAGE_01,
  },
  {
    ac: 'AC12',
    description:
      'Combination including not sure (state pension & defined benefit) + No to Q6 shows no guidance',
    q5Answer: [
      QUESTION_5_ANSWERS.STATE_PENSION,
      QUESTION_5_ANSWERS.DEFINED_BENEFIT,
    ],
    q6Answer: QUESTION_6_ANSWERS.NO,
  },
  {
    ac: 'AC12',
    description:
      'Combination including not sure (state pension & defined contribution) + No to Q6 shows no guidance',
    q5Answer: [
      QUESTION_5_ANSWERS.STATE_PENSION,
      QUESTION_5_ANSWERS.DEFINED_CONTRIBUTION,
    ],
    q6Answer: QUESTION_6_ANSWERS.NO,
  },
  {
    ac: 'AC12',
    description:
      'Combination including not sure (state pension & hybrid pension) + No to Q6 shows no guidance',
    q5Answer: [QUESTION_5_ANSWERS.STATE_PENSION, QUESTION_5_ANSWERS.OTHER],
    q6Answer: QUESTION_6_ANSWERS.NO,
  },
  {
    ac: 'AC12',
    description:
      'Combination including not sure (state pension & not sure) + No to Q6 shows no guidance',
    q5Answer: [QUESTION_5_ANSWERS.STATE_PENSION, QUESTION_5_ANSWERS.NOT_SURE],
    q6Answer: QUESTION_6_ANSWERS.NO,
  },
  {
    ac: 'AC12',
    description:
      'Combination including not sure (defined benefit & defined contribution) + No to Q6 shows no guidance',
    q5Answer: [
      QUESTION_5_ANSWERS.DEFINED_BENEFIT,
      QUESTION_5_ANSWERS.DEFINED_CONTRIBUTION,
    ],
    q6Answer: QUESTION_6_ANSWERS.NO,
  },
  {
    ac: 'AC12',
    description:
      'Combination including not sure (defined benefit & hybrid pension) + No to Q6 shows no guidance',
    q5Answer: [QUESTION_5_ANSWERS.DEFINED_BENEFIT, QUESTION_5_ANSWERS.OTHER],
    q6Answer: QUESTION_6_ANSWERS.NO,
  },
  {
    ac: 'AC12',
    description:
      'Combination including not sure (defined benefit & not sure) + No to Q6 shows no guidance',
    q5Answer: [QUESTION_5_ANSWERS.DEFINED_BENEFIT, QUESTION_5_ANSWERS.NOT_SURE],
    q6Answer: QUESTION_6_ANSWERS.NO,
  },
  {
    ac: 'AC12',
    description:
      'Combination including not sure (defined contribution & hybrid pension) + No to Q6 shows no guidance',
    q5Answer: [
      QUESTION_5_ANSWERS.DEFINED_CONTRIBUTION,
      QUESTION_5_ANSWERS.OTHER,
    ],
    q6Answer: QUESTION_6_ANSWERS.NO,
  },
  {
    ac: 'AC12',
    description:
      'Combination including not sure (defined contribution & not sure) + No to Q6 shows no guidance',
    q5Answer: [
      QUESTION_5_ANSWERS.DEFINED_CONTRIBUTION,
      QUESTION_5_ANSWERS.NOT_SURE,
    ],
    q6Answer: QUESTION_6_ANSWERS.NO,
  },
  {
    ac: 'AC12',
    description:
      'Combination including not sure (hybrid pension & not sure) + No to Q6 shows no guidance',
    q5Answer: [QUESTION_5_ANSWERS.OTHER, QUESTION_5_ANSWERS.NOT_SURE],
    q6Answer: QUESTION_6_ANSWERS.NO,
  },
  {
    ac: 'AC12',
    description:
      'Combination including not sure (state pension & defined benefit & defined contribution) + No to Q6 shows no guidance',
    q5Answer: [
      QUESTION_5_ANSWERS.STATE_PENSION,
      QUESTION_5_ANSWERS.DEFINED_BENEFIT,
      QUESTION_5_ANSWERS.DEFINED_CONTRIBUTION,
    ],
    q6Answer: QUESTION_6_ANSWERS.NO,
  },
  {
    ac: 'AC12',
    description:
      'Combination including not sure (state pension & defined benefit & hybrid pension) + No to Q6 shows no guidance',
    q5Answer: [
      QUESTION_5_ANSWERS.STATE_PENSION,
      QUESTION_5_ANSWERS.DEFINED_BENEFIT,
      QUESTION_5_ANSWERS.OTHER,
    ],
    q6Answer: QUESTION_6_ANSWERS.NO,
  },
  {
    ac: 'AC12',
    description:
      'Combination including not sure (state pension & defined benefit & not sure) + No to Q6 shows no guidance',
    q5Answer: [
      QUESTION_5_ANSWERS.STATE_PENSION,
      QUESTION_5_ANSWERS.DEFINED_BENEFIT,
      QUESTION_5_ANSWERS.NOT_SURE,
    ],
    q6Answer: QUESTION_6_ANSWERS.NO,
  },
  {
    ac: 'AC12',
    description:
      'Combination including not sure (state pension & defined contribution & hybrid pension) + No to Q6 shows no guidance',
    q5Answer: [
      QUESTION_5_ANSWERS.STATE_PENSION,
      QUESTION_5_ANSWERS.DEFINED_CONTRIBUTION,
      QUESTION_5_ANSWERS.OTHER,
    ],
    q6Answer: QUESTION_6_ANSWERS.NO,
  },
  {
    ac: 'AC12',
    description:
      'Combination including not sure (state pension & defined contribution & not sure) + No to Q6 shows no guidance',
    q5Answer: [
      QUESTION_5_ANSWERS.STATE_PENSION,
      QUESTION_5_ANSWERS.DEFINED_CONTRIBUTION,
      QUESTION_5_ANSWERS.NOT_SURE,
    ],
    q6Answer: QUESTION_6_ANSWERS.NO,
  },
  {
    ac: 'AC12',
    description:
      'Combination including not sure (state pension & hybrid pension & not sure) + No to Q6 shows no guidance',
    q5Answer: [
      QUESTION_5_ANSWERS.STATE_PENSION,
      QUESTION_5_ANSWERS.OTHER,
      QUESTION_5_ANSWERS.NOT_SURE,
    ],
    q6Answer: QUESTION_6_ANSWERS.NO,
  },
  {
    ac: 'AC12',
    description:
      'Combination including not sure (defined benefit & defined contribution & hybrid pension) + No to Q6 shows no guidance',
    q5Answer: [
      QUESTION_5_ANSWERS.DEFINED_BENEFIT,
      QUESTION_5_ANSWERS.DEFINED_CONTRIBUTION,
      QUESTION_5_ANSWERS.OTHER,
    ],
    q6Answer: QUESTION_6_ANSWERS.NO,
  },
  {
    ac: 'AC12',
    description:
      'Combination including not sure (defined benefit & defined contribution & not sure) + No to Q6 shows no guidance',
    q5Answer: [
      QUESTION_5_ANSWERS.DEFINED_BENEFIT,
      QUESTION_5_ANSWERS.DEFINED_CONTRIBUTION,
      QUESTION_5_ANSWERS.NOT_SURE,
    ],
    q6Answer: QUESTION_6_ANSWERS.NO,
  },
  {
    ac: 'AC12',
    description:
      'Combination including not sure (defined benefit & hybrid pension & not sure) + No to Q6 shows no guidance',
    q5Answer: [
      QUESTION_5_ANSWERS.DEFINED_BENEFIT,
      QUESTION_5_ANSWERS.OTHER,
      QUESTION_5_ANSWERS.NOT_SURE,
    ],
    q6Answer: QUESTION_6_ANSWERS.NO,
  },
  {
    ac: 'AC12',
    description:
      'Combination including not sure (defined contribution & hybrid pension & not sure) + No to Q6 shows no guidance',
    q5Answer: [
      QUESTION_5_ANSWERS.DEFINED_CONTRIBUTION,
      QUESTION_5_ANSWERS.OTHER,
      QUESTION_5_ANSWERS.NOT_SURE,
    ],
    q6Answer: QUESTION_6_ANSWERS.NO,
  },
  {
    ac: 'AC12',
    description:
      'Combination including not sure (state pension & defined benefit & defined contribution & hybrid pension) + No to Q6 shows no guidance',
    q5Answer: [
      QUESTION_5_ANSWERS.STATE_PENSION,
      QUESTION_5_ANSWERS.DEFINED_BENEFIT,
      QUESTION_5_ANSWERS.DEFINED_CONTRIBUTION,
      QUESTION_5_ANSWERS.OTHER,
    ],
    q6Answer: QUESTION_6_ANSWERS.NO,
  },
  {
    ac: 'AC12',
    description:
      'Combination including not sure (state pension & defined benefit & defined contribution & not sure) + No to Q6 shows no guidance',
    q5Answer: [
      QUESTION_5_ANSWERS.STATE_PENSION,
      QUESTION_5_ANSWERS.DEFINED_BENEFIT,
      QUESTION_5_ANSWERS.DEFINED_CONTRIBUTION,
      QUESTION_5_ANSWERS.NOT_SURE,
    ],
    q6Answer: QUESTION_6_ANSWERS.NO,
  },
  {
    ac: 'AC12',
    description:
      'Combination including not sure (state pension & defined benefit & hybrid pension & not sure) + No to Q6 shows no guidance',
    q5Answer: [
      QUESTION_5_ANSWERS.STATE_PENSION,
      QUESTION_5_ANSWERS.DEFINED_BENEFIT,
      QUESTION_5_ANSWERS.OTHER,
      QUESTION_5_ANSWERS.NOT_SURE,
    ],
    q6Answer: QUESTION_6_ANSWERS.NO,
  },
  {
    ac: 'AC12',
    description:
      'Combination including not sure (state pension & defined contribution & hybrid pension & not sure) + No to Q6 shows no guidance',
    q5Answer: [
      QUESTION_5_ANSWERS.STATE_PENSION,
      QUESTION_5_ANSWERS.DEFINED_CONTRIBUTION,
      QUESTION_5_ANSWERS.OTHER,
      QUESTION_5_ANSWERS.NOT_SURE,
    ],
    q6Answer: QUESTION_6_ANSWERS.NO,
  },
  {
    ac: 'AC12',
    description:
      'Combination including not sure (defined benefit & defined contribution & hybrid pension & not sure) + No to Q6 shows no guidance',
    q5Answer: [
      QUESTION_5_ANSWERS.DEFINED_BENEFIT,
      QUESTION_5_ANSWERS.DEFINED_CONTRIBUTION,
      QUESTION_5_ANSWERS.OTHER,
      QUESTION_5_ANSWERS.NOT_SURE,
    ],
    q6Answer: QUESTION_6_ANSWERS.NO,
  },
  {
    ac: 'AC12',
    description:
      'Combination including not sure (state pension & defined benefit & defined contribution & hybrid pension & not sure) + No to Q6 shows no guidance',
    q5Answer: [
      QUESTION_5_ANSWERS.STATE_PENSION,
      QUESTION_5_ANSWERS.DEFINED_BENEFIT,
      QUESTION_5_ANSWERS.DEFINED_CONTRIBUTION,
      QUESTION_5_ANSWERS.OTHER,
      QUESTION_5_ANSWERS.NOT_SURE,
    ],
    q6Answer: QUESTION_6_ANSWERS.NO,
  },
];

async function assertOnlyExpectedConsolidationGuidance(
  page: Page,
  visibleSection?: ConsolidationSectionTestId,
): Promise<void> {
  const sections: ConsolidationSectionTestId[] = [
    CONSOLIDATION_SECTION_IDS.PACKAGE_22,
    CONSOLIDATION_SECTION_IDS.PACKAGE_01,
    CONSOLIDATION_SECTION_IDS.PACKAGE_01A,
    CONSOLIDATION_SECTION_IDS.PACKAGE_01B,
    CONSOLIDATION_SECTION_IDS.PACKAGE_01C,
  ];

  for (const section of sections) {
    const locator = resultsPage.getGuidanceSection(page, section);
    if (visibleSection && section === visibleSection) {
      await expect(locator).toBeVisible();
    }
  }
}

const goToResultsWithConsolidationScenario = async (
  page: Page,
  scenario: Pick<ConsolidationScenario, 'q5Answer' | 'q6Answer'>,
) => {
  const { q5Answer, q6Answer } = scenario;

  await questionnaireNavigator.skipToResults(page, {
    q2Answer: QUESTION_2_ANSWERS.YES,
    q5Answer,
    q6Answer,
    q7Answer: QUESTION_7_ANSWERS.NO,
    q8Answer: QUESTION_8_ANSWERS.NO,
  });
};

/**
 * @tests User Story 50894
 * @tests User Story 57135
 * @test AC1   State Pension only + Yes/No/Not sure to Q6 shows no guidance
 * @test AC2   Defined benefit only + Yes/Not sure to Q6 shows guidance package 01a
 * @test AC3   Defined benefit only + No to Q6 shows no guidance package
 * @test AC4   Defined contribution only + Yes/Not sure to Q6 shows guidance package 01
 * @test AC5   Defined contribution only + No to Q6 shows no guidance package
 * @test AC6   Hybrid pension only + Yes/Not sure to Q6 shows guidance package 01
 * @test AC7   Hybrid pension only + No to Q6 shows no guidance package
 * @test AC8   Not sure pension type + Yes/No/Not sure to Q6 shows guidance package 22
 * @test AC9   Combination with defined benefit + Yes/Not sure to Q6 shows guidance package 01a
 * @test AC10  Combination with defined benefit and defined contribution + Yes/Not sure to Q6 shows guidance package 01c
 * @test AC11  Combination without defined benefit + Yes/Not sure to Q6 shows guidance package 01
 * @test AC12  Combination including not sure + No to Q6 shows no guidance package
 */
test.describe
  .serial('Retirement Guidance - Results - Variable Guidance (Consolidation)', () => {
  for (const scenario of scenarios) {
    test(`${scenario.ac}: ${scenario.description}`, async ({ page }) => {
      await goToResultsWithConsolidationScenario(page, scenario);

      await expect(page).toHaveURL(/\/en\/results/);
      await assertOnlyExpectedConsolidationGuidance(
        page,
        scenario.visibleSection,
      );
    });
  }
});
