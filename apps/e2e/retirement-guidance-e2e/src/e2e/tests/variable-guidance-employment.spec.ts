import { expect, type Page, test } from '@playwright/test';

import {
  QUESTION_3_ANSWERS,
  type Question3Answer,
} from '../pages/question3Page';
import {
  QUESTION_4_ANSWERS,
  type Question4Answer,
} from '../pages/question4Page';
import {
  QUESTION_5_ANSWERS,
  type Question5Answer,
} from '../pages/question5Page';
import { QUESTION_7_ANSWERS } from '../pages/question7Page';
import { QUESTION_8_ANSWERS } from '../pages/question8Page';
import questionnaireNavigator from '../pages/questionnaireNavigator';
import resultsPage, {
  EMPLOYMENT_SECTION_IDS,
  type EmploymentGuidanceSectionTestId,
} from '../pages/resultsPage';

const ALL_EMPLOYMENT_SECTIONS: EmploymentGuidanceSectionTestId[] = [
  EMPLOYMENT_SECTION_IDS.EMPLOYMENT_02_SECTION,
  EMPLOYMENT_SECTION_IDS.EMPLOYMENT_02A_SECTION,
  EMPLOYMENT_SECTION_IDS.EMPLOYMENT_02B_SECTION,
  EMPLOYMENT_SECTION_IDS.EMPLOYMENT_03_SECTION,
  EMPLOYMENT_SECTION_IDS.EMPLOYMENT_04_SECTION,
  EMPLOYMENT_SECTION_IDS.EMPLOYMENT_05_SECTION,
  EMPLOYMENT_SECTION_IDS.EMPLOYMENT_06_SECTION,
  EMPLOYMENT_SECTION_IDS.EMPLOYMENT_07_SECTION,
];

const assertOnlyExpectedEmploymentGuidance = async (
  page: Page,
  visibleSection?: EmploymentGuidanceSectionTestId,
) => {
  for (const section of ALL_EMPLOYMENT_SECTIONS) {
    const locator = resultsPage.getGuidanceSection(page, section);
    if (visibleSection && section === visibleSection) {
      await expect(locator).toBeVisible();
    } else {
      await expect(locator).toBeHidden();
    }
  }
};

type EmploymentScenario = {
  ac: string;
  description: string;
  q3Answer: Question3Answer;
  q4Answer: Question4Answer;
  q5Answer: Question5Answer[];
  visibleSection?: EmploymentGuidanceSectionTestId;
};

const scenarios: EmploymentScenario[] = [
  // ── Employer (q3=Yes) + paying into pension (q4=Yes) ──────────────────────
  {
    ac: 'AC01',
    description:
      'Employer + paying into pension + State Pension only → package 03',
    q3Answer: QUESTION_3_ANSWERS.YES,
    q4Answer: QUESTION_4_ANSWERS.YES,
    q5Answer: [QUESTION_5_ANSWERS.STATE_PENSION],
    visibleSection: EMPLOYMENT_SECTION_IDS.EMPLOYMENT_03_SECTION,
  },
  {
    ac: 'AC02',
    description: 'Employer + paying into pension + DB only → package 02a',
    q3Answer: QUESTION_3_ANSWERS.YES,
    q4Answer: QUESTION_4_ANSWERS.YES,
    q5Answer: [QUESTION_5_ANSWERS.DEFINED_BENEFIT],
    visibleSection: EMPLOYMENT_SECTION_IDS.EMPLOYMENT_02A_SECTION,
  },
  {
    ac: 'AC03',
    description:
      'Employer + paying into pension + DB in combination with DC → package 02b',
    q3Answer: QUESTION_3_ANSWERS.YES,
    q4Answer: QUESTION_4_ANSWERS.YES,
    q5Answer: [
      QUESTION_5_ANSWERS.DEFINED_BENEFIT,
      QUESTION_5_ANSWERS.DEFINED_CONTRIBUTION,
    ],
    visibleSection: EMPLOYMENT_SECTION_IDS.EMPLOYMENT_02B_SECTION,
  },
  {
    ac: 'AC04',
    description:
      'Employer + paying into pension + DB in combination with State Pension → package 02b',
    q3Answer: QUESTION_3_ANSWERS.YES,
    q4Answer: QUESTION_4_ANSWERS.YES,
    q5Answer: [
      QUESTION_5_ANSWERS.DEFINED_BENEFIT,
      QUESTION_5_ANSWERS.STATE_PENSION,
    ],
    visibleSection: EMPLOYMENT_SECTION_IDS.EMPLOYMENT_02B_SECTION,
  },
  {
    ac: 'AC05',
    description:
      'Employer + paying into pension + not sure about pension type → package 02b',
    q3Answer: QUESTION_3_ANSWERS.YES,
    q4Answer: QUESTION_4_ANSWERS.YES,
    q5Answer: [QUESTION_5_ANSWERS.NOT_SURE],
    visibleSection: EMPLOYMENT_SECTION_IDS.EMPLOYMENT_02B_SECTION,
  },
  {
    ac: 'AC06',
    description:
      'Employer + paying into pension + DC only (no DB) → package 02',
    q3Answer: QUESTION_3_ANSWERS.YES,
    q4Answer: QUESTION_4_ANSWERS.YES,
    q5Answer: [QUESTION_5_ANSWERS.DEFINED_CONTRIBUTION],
    visibleSection: EMPLOYMENT_SECTION_IDS.EMPLOYMENT_02_SECTION,
  },
  {
    ac: 'AC07',
    description:
      'Employer + paying into pension + combination without DB (DC + State Pension) → package 02',
    q3Answer: QUESTION_3_ANSWERS.YES,
    q4Answer: QUESTION_4_ANSWERS.YES,
    q5Answer: [
      QUESTION_5_ANSWERS.DEFINED_CONTRIBUTION,
      QUESTION_5_ANSWERS.STATE_PENSION,
    ],
    visibleSection: EMPLOYMENT_SECTION_IDS.EMPLOYMENT_02_SECTION,
  },
  // ── Employer (q3=Yes) + NOT paying into pension ────────────────────────────
  {
    ac: 'AC08',
    description:
      'Employer + not paying into pension + any pension type → package 03',
    q3Answer: QUESTION_3_ANSWERS.YES,
    q4Answer: QUESTION_4_ANSWERS.NO,
    q5Answer: [QUESTION_5_ANSWERS.DEFINED_CONTRIBUTION],
    visibleSection: EMPLOYMENT_SECTION_IDS.EMPLOYMENT_03_SECTION,
  },
  {
    ac: 'AC09',
    description:
      'Employer + not sure about pension contributions + any pension type → package 03',
    q3Answer: QUESTION_3_ANSWERS.YES,
    q4Answer: QUESTION_4_ANSWERS.NOT_SURE,
    q5Answer: [QUESTION_5_ANSWERS.DEFINED_BENEFIT],
    visibleSection: EMPLOYMENT_SECTION_IDS.EMPLOYMENT_03_SECTION,
  },
  // ── Self-employed (q3=No, self-employed) + paying into pension ─────────────
  {
    ac: 'AC10',
    description: 'Self-employed + paying into pension + DC only → package 04',
    q3Answer: QUESTION_3_ANSWERS.NO_SELF_EMPLOYED,
    q4Answer: QUESTION_4_ANSWERS.YES,
    q5Answer: [QUESTION_5_ANSWERS.DEFINED_CONTRIBUTION],
    visibleSection: EMPLOYMENT_SECTION_IDS.EMPLOYMENT_04_SECTION,
  },
  {
    ac: 'AC11',
    description:
      'Self-employed + paying into pension + not sure about pension type → package 04',
    q3Answer: QUESTION_3_ANSWERS.NO_SELF_EMPLOYED,
    q4Answer: QUESTION_4_ANSWERS.YES,
    q5Answer: [QUESTION_5_ANSWERS.NOT_SURE],
    visibleSection: EMPLOYMENT_SECTION_IDS.EMPLOYMENT_04_SECTION,
  },
  {
    ac: 'AC12',
    description:
      'Self-employed + paying into pension + combination without DB → package 04',
    q3Answer: QUESTION_3_ANSWERS.NO_SELF_EMPLOYED,
    q4Answer: QUESTION_4_ANSWERS.YES,
    q5Answer: [
      QUESTION_5_ANSWERS.DEFINED_CONTRIBUTION,
      QUESTION_5_ANSWERS.STATE_PENSION,
    ],
    visibleSection: EMPLOYMENT_SECTION_IDS.EMPLOYMENT_04_SECTION,
  },
  {
    ac: 'AC13',
    description:
      'Self-employed + paying into pension + DB only → no employment guidance',
    q3Answer: QUESTION_3_ANSWERS.NO_SELF_EMPLOYED,
    q4Answer: QUESTION_4_ANSWERS.YES,
    q5Answer: [QUESTION_5_ANSWERS.DEFINED_BENEFIT],
    visibleSection: undefined,
  },
  // ── Self-employed (q3=No, self-employed) + NOT paying into pension ─────────
  {
    ac: 'AC14',
    description:
      'Self-employed + not paying into pension + any pension type → package 05',
    q3Answer: QUESTION_3_ANSWERS.NO_SELF_EMPLOYED,
    q4Answer: QUESTION_4_ANSWERS.NO,
    q5Answer: [QUESTION_5_ANSWERS.DEFINED_CONTRIBUTION],
    visibleSection: EMPLOYMENT_SECTION_IDS.EMPLOYMENT_05_SECTION,
  },
  {
    ac: 'AC15',
    description:
      'Self-employed + not sure about pension contributions + any pension type → package 05',
    q3Answer: QUESTION_3_ANSWERS.NO_SELF_EMPLOYED,
    q4Answer: QUESTION_4_ANSWERS.NOT_SURE,
    q5Answer: [QUESTION_5_ANSWERS.STATE_PENSION],
    visibleSection: EMPLOYMENT_SECTION_IDS.EMPLOYMENT_05_SECTION,
  },
  // ── Not employed (q3=No, not employed) + paying into pension ──────────────
  {
    ac: 'AC16',
    description: 'Not employed + paying into pension + DC only → package 06',
    q3Answer: QUESTION_3_ANSWERS.NO_NOT_EMPLOYED,
    q4Answer: QUESTION_4_ANSWERS.YES,
    q5Answer: [QUESTION_5_ANSWERS.DEFINED_CONTRIBUTION],
    visibleSection: EMPLOYMENT_SECTION_IDS.EMPLOYMENT_06_SECTION,
  },
  {
    ac: 'AC17',
    description:
      'Not employed + paying into pension + not sure about pension type → package 06',
    q3Answer: QUESTION_3_ANSWERS.NO_NOT_EMPLOYED,
    q4Answer: QUESTION_4_ANSWERS.YES,
    q5Answer: [QUESTION_5_ANSWERS.NOT_SURE],
    visibleSection: EMPLOYMENT_SECTION_IDS.EMPLOYMENT_06_SECTION,
  },
  {
    ac: 'AC18',
    description:
      'Not employed + paying into pension + combination without DB → package 06',
    q3Answer: QUESTION_3_ANSWERS.NO_NOT_EMPLOYED,
    q4Answer: QUESTION_4_ANSWERS.YES,
    q5Answer: [
      QUESTION_5_ANSWERS.DEFINED_CONTRIBUTION,
      QUESTION_5_ANSWERS.OTHER,
    ],
    visibleSection: EMPLOYMENT_SECTION_IDS.EMPLOYMENT_06_SECTION,
  },
  {
    ac: 'AC19',
    description:
      'Not employed + paying into pension + DB only → no employment guidance',
    q3Answer: QUESTION_3_ANSWERS.NO_NOT_EMPLOYED,
    q4Answer: QUESTION_4_ANSWERS.YES,
    q5Answer: [QUESTION_5_ANSWERS.DEFINED_BENEFIT],
    visibleSection: undefined,
  },
  // ── Not employed (q3=No, not employed) + NOT paying into pension ──────────
  {
    ac: 'AC20',
    description:
      'Not employed + not paying into pension + any pension type → package 07',
    q3Answer: QUESTION_3_ANSWERS.NO_NOT_EMPLOYED,
    q4Answer: QUESTION_4_ANSWERS.NO,
    q5Answer: [QUESTION_5_ANSWERS.STATE_PENSION],
    visibleSection: EMPLOYMENT_SECTION_IDS.EMPLOYMENT_07_SECTION,
  },
  {
    ac: 'AC21',
    description:
      'Not employed + not sure about pension contributions + any pension type → package 07',
    q3Answer: QUESTION_3_ANSWERS.NO_NOT_EMPLOYED,
    q4Answer: QUESTION_4_ANSWERS.NOT_SURE,
    q5Answer: [QUESTION_5_ANSWERS.DEFINED_CONTRIBUTION],
    visibleSection: EMPLOYMENT_SECTION_IDS.EMPLOYMENT_07_SECTION,
  },
];

const goToResultsWithEmploymentScenario = async (
  page: Page,
  scenario: Pick<EmploymentScenario, 'q3Answer' | 'q4Answer' | 'q5Answer'>,
) => {
  const { q3Answer, q4Answer, q5Answer } = scenario;

  await questionnaireNavigator.skipToResults(page, {
    q3Answer,
    q4Answer,
    q5Answer,
    q7Answer: QUESTION_7_ANSWERS.NO,
    q8Answer: QUESTION_8_ANSWERS.NO,
  });
};

/**
 * @tests Employment variable guidance (contributions category)
 * @test AC01  Employer + paying + State Pension only → package 03
 * @test AC02  Employer + paying + DB only → package 02a
 * @test AC03  Employer + paying + DB combined with DC → package 02b
 * @test AC04  Employer + paying + DB combined with State Pension → package 02b
 * @test AC05  Employer + paying + not sure pension type → package 02b
 * @test AC06  Employer + paying + DC only → package 02
 * @test AC07  Employer + paying + combination without DB → package 02
 * @test AC08  Employer + not paying + any pension type → package 03
 * @test AC09  Employer + not sure contributing + any pension type → package 03
 * @test AC10  Self-employed + paying + DC only → package 04
 * @test AC11  Self-employed + paying + not sure pension type → package 04
 * @test AC12  Self-employed + paying + combination without DB → package 04
 * @test AC13  Self-employed + paying + DB only → no guidance
 * @test AC14  Self-employed + not paying + any pension type → package 05
 * @test AC15  Self-employed + not sure contributing + any pension type → package 05
 * @test AC16  Not employed + paying + DC only → package 06
 * @test AC17  Not employed + paying + not sure pension type → package 06
 * @test AC18  Not employed + paying + combination without DB → package 06
 * @test AC19  Not employed + paying + DB only → no guidance
 * @test AC20  Not employed + not paying + any pension type → package 07
 * @test AC21  Not employed + not sure contributing + any pension type → package 07
 */
test.describe
  .serial('Retirement Guidance - Results - Variable Guidance (Employment / Contributions)', () => {
  for (const scenario of scenarios) {
    test(`${scenario.ac}: ${scenario.description}`, async ({ page }) => {
      await goToResultsWithEmploymentScenario(page, scenario);

      await expect(page).toHaveURL(/\/en\/results/);
      await assertOnlyExpectedEmploymentGuidance(page, scenario.visibleSection);
    });
  }
});
