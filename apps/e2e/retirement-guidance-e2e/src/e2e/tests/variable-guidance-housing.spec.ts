import { expect, type Page, test } from '@playwright/test';

import {
  QUESTION_2_ANSWERS,
  type Question2Answer,
} from '../pages/question2Page';
import {
  QUESTION_5_ANSWERS,
  type Question5Answer,
} from '../pages/question5Page';
import { QUESTION_7_ANSWERS } from '../pages/question7Page';
import { QUESTION_8_ANSWERS } from '../pages/question8Page';
import {
  QUESTION_9_ANSWERS,
  type Question9Answer,
} from '../pages/question9Page';
import questionnaireNavigator from '../pages/questionnaireNavigator';
import resultsPage, {
  HOUSING_SECTION_IDS,
  type HousingGuidanceSectionTestId,
} from '../pages/resultsPage';

const ALL_HOUSING_SECTIONS: HousingGuidanceSectionTestId[] = [
  HOUSING_SECTION_IDS.HOUSING_09_SECTION,
  HOUSING_SECTION_IDS.HOUSING_09A_SECTION,
  HOUSING_SECTION_IDS.HOUSING_10_SECTION,
  HOUSING_SECTION_IDS.HOUSING_10A_SECTION,
  HOUSING_SECTION_IDS.HOUSING_11_SECTION,
  HOUSING_SECTION_IDS.HOUSING_12_SECTION,
  HOUSING_SECTION_IDS.HOUSING_12A_SECTION,
  HOUSING_SECTION_IDS.HOUSING_13_SECTION,
  HOUSING_SECTION_IDS.HOUSING_14_SECTION,
  HOUSING_SECTION_IDS.HOUSING_14A_SECTION,
  HOUSING_SECTION_IDS.HOUSING_14B_SECTION,
  HOUSING_SECTION_IDS.HOUSING_15_SECTION,
  HOUSING_SECTION_IDS.HOUSING_15A_SECTION,
  HOUSING_SECTION_IDS.HOUSING_16_SECTION,
  HOUSING_SECTION_IDS.HOUSING_16A_SECTION,
  HOUSING_SECTION_IDS.HOUSING_16B_SECTION,
];

const assertOnlyExpectedHousingGuidance = async (
  page: Page,
  visibleSection?: HousingGuidanceSectionTestId,
) => {
  for (const section of ALL_HOUSING_SECTIONS) {
    const locator = resultsPage.getGuidanceSection(page, section);
    if (visibleSection && section === visibleSection) {
      await expect(locator).toBeVisible();
    } else {
      await expect(locator).toBeHidden();
    }
  }
};

type HousingScenario = {
  ac: string;
  description: string;
  q2Answer: Question2Answer;
  q5Answer: Question5Answer[];
  q9Answer: Question9Answer;
  visibleSection: HousingGuidanceSectionTestId;
};

const scenarios: HousingScenario[] = [
  // ── Less than 10 years + Rent – Private Landlord ───────────────────────────
  {
    ac: 'AC01',
    description:
      'Less than 10 years + Rent – private landlord + State Pension only → package 16b',
    q2Answer: QUESTION_2_ANSWERS.YES,
    q5Answer: [QUESTION_5_ANSWERS.STATE_PENSION],
    q9Answer: QUESTION_9_ANSWERS.RENT_PRIVATE_LANDLORD,
    visibleSection: HOUSING_SECTION_IDS.HOUSING_16B_SECTION,
  },
  {
    ac: 'AC02',
    description:
      'Less than 10 years + Rent – private landlord + DB only → package 16a',
    q2Answer: QUESTION_2_ANSWERS.YES,
    q5Answer: [QUESTION_5_ANSWERS.DEFINED_BENEFIT],
    q9Answer: QUESTION_9_ANSWERS.RENT_PRIVATE_LANDLORD,
    visibleSection: HOUSING_SECTION_IDS.HOUSING_16A_SECTION,
  },
  {
    ac: 'AC03',
    description:
      'Less than 10 years + Rent – private landlord + DB in combination → package 16a',
    q2Answer: QUESTION_2_ANSWERS.YES,
    q5Answer: [
      QUESTION_5_ANSWERS.DEFINED_BENEFIT,
      QUESTION_5_ANSWERS.DEFINED_CONTRIBUTION,
    ],
    q9Answer: QUESTION_9_ANSWERS.RENT_PRIVATE_LANDLORD,
    visibleSection: HOUSING_SECTION_IDS.HOUSING_16A_SECTION,
  },
  {
    ac: 'AC04',
    description:
      'Less than 10 years + Rent – private landlord + DC only → package 16',
    q2Answer: QUESTION_2_ANSWERS.YES,
    q5Answer: [QUESTION_5_ANSWERS.DEFINED_CONTRIBUTION],
    q9Answer: QUESTION_9_ANSWERS.RENT_PRIVATE_LANDLORD,
    visibleSection: HOUSING_SECTION_IDS.HOUSING_16_SECTION,
  },
  {
    ac: 'AC05',
    description:
      'Less than 10 years + Rent – private landlord + not sure → package 16',
    q2Answer: QUESTION_2_ANSWERS.YES,
    q5Answer: [QUESTION_5_ANSWERS.NOT_SURE],
    q9Answer: QUESTION_9_ANSWERS.RENT_PRIVATE_LANDLORD,
    visibleSection: HOUSING_SECTION_IDS.HOUSING_16_SECTION,
  },
  {
    ac: 'AC06',
    description:
      'Less than 10 years + Rent – private landlord + combination without DB → package 16',
    q2Answer: QUESTION_2_ANSWERS.YES,
    q5Answer: [
      QUESTION_5_ANSWERS.DEFINED_CONTRIBUTION,
      QUESTION_5_ANSWERS.STATE_PENSION,
    ],
    q9Answer: QUESTION_9_ANSWERS.RENT_PRIVATE_LANDLORD,
    visibleSection: HOUSING_SECTION_IDS.HOUSING_16_SECTION,
  },
  // ── Less than 10 years + Rent – Social Housing ─────────────────────────────
  {
    ac: 'AC07',
    description:
      'Less than 10 years + Rent – social housing + State Pension only → package 14a',
    q2Answer: QUESTION_2_ANSWERS.YES,
    q5Answer: [QUESTION_5_ANSWERS.STATE_PENSION],
    q9Answer: QUESTION_9_ANSWERS.RENT_SOCIAL_HOUSING,
    visibleSection: HOUSING_SECTION_IDS.HOUSING_14A_SECTION,
  },
  {
    ac: 'AC08',
    description:
      'Less than 10 years + Rent – social housing + DB only → package 14b',
    q2Answer: QUESTION_2_ANSWERS.YES,
    q5Answer: [QUESTION_5_ANSWERS.DEFINED_BENEFIT],
    q9Answer: QUESTION_9_ANSWERS.RENT_SOCIAL_HOUSING,
    visibleSection: HOUSING_SECTION_IDS.HOUSING_14B_SECTION,
  },
  {
    ac: 'AC09',
    description:
      'Less than 10 years + Rent – social housing + DB in combination → package 14b',
    q2Answer: QUESTION_2_ANSWERS.YES,
    q5Answer: [
      QUESTION_5_ANSWERS.DEFINED_BENEFIT,
      QUESTION_5_ANSWERS.STATE_PENSION,
    ],
    q9Answer: QUESTION_9_ANSWERS.RENT_SOCIAL_HOUSING,
    visibleSection: HOUSING_SECTION_IDS.HOUSING_14B_SECTION,
  },
  {
    ac: 'AC10',
    description:
      'Less than 10 years + Rent – social housing + DC only → package 14',
    q2Answer: QUESTION_2_ANSWERS.YES,
    q5Answer: [QUESTION_5_ANSWERS.DEFINED_CONTRIBUTION],
    q9Answer: QUESTION_9_ANSWERS.RENT_SOCIAL_HOUSING,
    visibleSection: HOUSING_SECTION_IDS.HOUSING_14_SECTION,
  },
  {
    ac: 'AC11',
    description:
      'Less than 10 years + Rent – social housing + not sure → package 14',
    q2Answer: QUESTION_2_ANSWERS.YES,
    q5Answer: [QUESTION_5_ANSWERS.NOT_SURE],
    q9Answer: QUESTION_9_ANSWERS.RENT_SOCIAL_HOUSING,
    visibleSection: HOUSING_SECTION_IDS.HOUSING_14_SECTION,
  },
  {
    ac: 'AC12',
    description:
      'Less than 10 years + Rent – social housing + combination without DB → package 14',
    q2Answer: QUESTION_2_ANSWERS.YES,
    q5Answer: [
      QUESTION_5_ANSWERS.DEFINED_CONTRIBUTION,
      QUESTION_5_ANSWERS.STATE_PENSION,
    ],
    q9Answer: QUESTION_9_ANSWERS.RENT_SOCIAL_HOUSING,
    visibleSection: HOUSING_SECTION_IDS.HOUSING_14_SECTION,
  },
  // ── Less than 10 years + Mortgage ─────────────────────────────────────────
  {
    ac: 'AC13',
    description:
      'Less than 10 years + Mortgage + State Pension only → package 12a',
    q2Answer: QUESTION_2_ANSWERS.YES,
    q5Answer: [QUESTION_5_ANSWERS.STATE_PENSION],
    q9Answer: QUESTION_9_ANSWERS.MORTGAGE,
    visibleSection: HOUSING_SECTION_IDS.HOUSING_12A_SECTION,
  },
  {
    ac: 'AC14',
    description: 'Less than 10 years + Mortgage + DC only → package 12',
    q2Answer: QUESTION_2_ANSWERS.YES,
    q5Answer: [QUESTION_5_ANSWERS.DEFINED_CONTRIBUTION],
    q9Answer: QUESTION_9_ANSWERS.MORTGAGE,
    visibleSection: HOUSING_SECTION_IDS.HOUSING_12_SECTION,
  },
  {
    ac: 'AC15',
    description: 'Less than 10 years + Mortgage + not sure → package 12',
    q2Answer: QUESTION_2_ANSWERS.YES,
    q5Answer: [QUESTION_5_ANSWERS.NOT_SURE],
    q9Answer: QUESTION_9_ANSWERS.MORTGAGE,
    visibleSection: HOUSING_SECTION_IDS.HOUSING_12_SECTION,
  },
  {
    ac: 'AC16',
    description: 'Less than 10 years + Mortgage + combination → package 12',
    q2Answer: QUESTION_2_ANSWERS.YES,
    q5Answer: [
      QUESTION_5_ANSWERS.DEFINED_CONTRIBUTION,
      QUESTION_5_ANSWERS.STATE_PENSION,
    ],
    q9Answer: QUESTION_9_ANSWERS.MORTGAGE,
    visibleSection: HOUSING_SECTION_IDS.HOUSING_12_SECTION,
  },
  // ── Less than 10 years + None ────────────────────────────────────
  {
    ac: 'AC17',
    description: 'Less than 10 years + None + State Pension only → package 10a',
    q2Answer: QUESTION_2_ANSWERS.YES,
    q5Answer: [QUESTION_5_ANSWERS.STATE_PENSION],
    q9Answer: QUESTION_9_ANSWERS.NONE,
    visibleSection: HOUSING_SECTION_IDS.HOUSING_10A_SECTION,
  },
  {
    ac: 'AC18',
    description: 'Less than 10 years + None + DC only → package 10',
    q2Answer: QUESTION_2_ANSWERS.YES,
    q5Answer: [QUESTION_5_ANSWERS.DEFINED_CONTRIBUTION],
    q9Answer: QUESTION_9_ANSWERS.NONE,
    visibleSection: HOUSING_SECTION_IDS.HOUSING_10_SECTION,
  },
  {
    ac: 'AC19',
    description: 'Less than 10 years + None + not sure → package 10',
    q2Answer: QUESTION_2_ANSWERS.YES,
    q5Answer: [QUESTION_5_ANSWERS.NOT_SURE],
    q9Answer: QUESTION_9_ANSWERS.NONE,
    visibleSection: HOUSING_SECTION_IDS.HOUSING_10_SECTION,
  },
  {
    ac: 'AC20',
    description: 'Less than 10 years + None + combination → package 10',
    q2Answer: QUESTION_2_ANSWERS.YES,
    q5Answer: [
      QUESTION_5_ANSWERS.DEFINED_CONTRIBUTION,
      QUESTION_5_ANSWERS.STATE_PENSION,
    ],
    q9Answer: QUESTION_9_ANSWERS.NONE,
    visibleSection: HOUSING_SECTION_IDS.HOUSING_10_SECTION,
  },
  // ── More than 10 years + Rent – Private Landlord ──────────────────────────
  {
    ac: 'AC21',
    description:
      'More than 10 years + Rent – private landlord + State Pension only → package 15a',
    q2Answer: QUESTION_2_ANSWERS.NO,
    q5Answer: [QUESTION_5_ANSWERS.STATE_PENSION],
    q9Answer: QUESTION_9_ANSWERS.RENT_PRIVATE_LANDLORD,
    visibleSection: HOUSING_SECTION_IDS.HOUSING_15A_SECTION,
  },
  {
    ac: 'AC22',
    description:
      'More than 10 years + Rent – private landlord + DC only → package 15',
    q2Answer: QUESTION_2_ANSWERS.NO,
    q5Answer: [QUESTION_5_ANSWERS.DEFINED_CONTRIBUTION],
    q9Answer: QUESTION_9_ANSWERS.RENT_PRIVATE_LANDLORD,
    visibleSection: HOUSING_SECTION_IDS.HOUSING_15_SECTION,
  },
  {
    ac: 'AC23',
    description:
      'More than 10 years + Rent – private landlord + not sure → package 15',
    q2Answer: QUESTION_2_ANSWERS.NO,
    q5Answer: [QUESTION_5_ANSWERS.NOT_SURE],
    q9Answer: QUESTION_9_ANSWERS.RENT_PRIVATE_LANDLORD,
    visibleSection: HOUSING_SECTION_IDS.HOUSING_15_SECTION,
  },
  {
    ac: 'AC24',
    description:
      'More than 10 years + Rent – private landlord + combination → package 15',
    q2Answer: QUESTION_2_ANSWERS.NO,
    q5Answer: [
      QUESTION_5_ANSWERS.DEFINED_CONTRIBUTION,
      QUESTION_5_ANSWERS.STATE_PENSION,
    ],
    q9Answer: QUESTION_9_ANSWERS.RENT_PRIVATE_LANDLORD,
    visibleSection: HOUSING_SECTION_IDS.HOUSING_15_SECTION,
  },
  // ── More than 10 years + Rent – Social Housing ────────────────────────────
  {
    ac: 'AC25',
    description:
      'More than 10 years + Rent – social housing + any pension type → package 13',
    q2Answer: QUESTION_2_ANSWERS.NO,
    q5Answer: [QUESTION_5_ANSWERS.DEFINED_CONTRIBUTION],
    q9Answer: QUESTION_9_ANSWERS.RENT_SOCIAL_HOUSING,
    visibleSection: HOUSING_SECTION_IDS.HOUSING_13_SECTION,
  },
  {
    ac: 'AC26',
    description:
      'More than 10 years + Rent – social housing + not sure → package 13',
    q2Answer: QUESTION_2_ANSWERS.NO,
    q5Answer: [QUESTION_5_ANSWERS.NOT_SURE],
    q9Answer: QUESTION_9_ANSWERS.RENT_SOCIAL_HOUSING,
    visibleSection: HOUSING_SECTION_IDS.HOUSING_13_SECTION,
  },
  {
    ac: 'AC27',
    description:
      'More than 10 years + Rent – social housing + combination → package 13',
    q2Answer: QUESTION_2_ANSWERS.NO,
    q5Answer: [
      QUESTION_5_ANSWERS.STATE_PENSION,
      QUESTION_5_ANSWERS.DEFINED_CONTRIBUTION,
    ],
    q9Answer: QUESTION_9_ANSWERS.RENT_SOCIAL_HOUSING,
    visibleSection: HOUSING_SECTION_IDS.HOUSING_13_SECTION,
  },
  // ── More than 10 years + Mortgage ─────────────────────────────────────────
  {
    ac: 'AC28',
    description:
      'More than 10 years + Mortgage + any pension type → package 11',
    q2Answer: QUESTION_2_ANSWERS.NO,
    q5Answer: [QUESTION_5_ANSWERS.DEFINED_CONTRIBUTION],
    q9Answer: QUESTION_9_ANSWERS.MORTGAGE,
    visibleSection: HOUSING_SECTION_IDS.HOUSING_11_SECTION,
  },
  {
    ac: 'AC29',
    description: 'More than 10 years + Mortgage + not sure → package 11',
    q2Answer: QUESTION_2_ANSWERS.NO,
    q5Answer: [QUESTION_5_ANSWERS.NOT_SURE],
    q9Answer: QUESTION_9_ANSWERS.MORTGAGE,
    visibleSection: HOUSING_SECTION_IDS.HOUSING_11_SECTION,
  },
  {
    ac: 'AC30',
    description: 'More than 10 years + Mortgage + combination → package 11',
    q2Answer: QUESTION_2_ANSWERS.NO,
    q5Answer: [
      QUESTION_5_ANSWERS.STATE_PENSION,
      QUESTION_5_ANSWERS.DEFINED_CONTRIBUTION,
    ],
    q9Answer: QUESTION_9_ANSWERS.MORTGAGE,
    visibleSection: HOUSING_SECTION_IDS.HOUSING_11_SECTION,
  },
  // ── More than 10 years + None ────────────────────────────────────
  {
    ac: 'AC31',
    description: 'More than 10 years + None + State Pension only → package 09a',
    q2Answer: QUESTION_2_ANSWERS.NO,
    q5Answer: [QUESTION_5_ANSWERS.STATE_PENSION],
    q9Answer: QUESTION_9_ANSWERS.NONE,
    visibleSection: HOUSING_SECTION_IDS.HOUSING_09A_SECTION,
  },
  {
    ac: 'AC32',
    description: 'More than 10 years + None + DC only → package 09',
    q2Answer: QUESTION_2_ANSWERS.NO,
    q5Answer: [QUESTION_5_ANSWERS.DEFINED_CONTRIBUTION],
    q9Answer: QUESTION_9_ANSWERS.NONE,
    visibleSection: HOUSING_SECTION_IDS.HOUSING_09_SECTION,
  },
  {
    ac: 'AC33',
    description: 'More than 10 years + None + not sure → package 09',
    q2Answer: QUESTION_2_ANSWERS.NO,
    q5Answer: [QUESTION_5_ANSWERS.NOT_SURE],
    q9Answer: QUESTION_9_ANSWERS.NONE,
    visibleSection: HOUSING_SECTION_IDS.HOUSING_09_SECTION,
  },
  {
    ac: 'AC34',
    description: 'More than 10 years + None + combination → package 09',
    q2Answer: QUESTION_2_ANSWERS.NO,
    q5Answer: [
      QUESTION_5_ANSWERS.DEFINED_CONTRIBUTION,
      QUESTION_5_ANSWERS.STATE_PENSION,
    ],
    q9Answer: QUESTION_9_ANSWERS.NONE,
    visibleSection: HOUSING_SECTION_IDS.HOUSING_09_SECTION,
  },
  // ── Already retired + selected scenarios ──────────────────────────────────
  {
    ac: 'AC35',
    description:
      'Already retired + Rent – private landlord + State Pension only → package 16b',
    q2Answer: QUESTION_2_ANSWERS.ALREADY_RETIRED,
    q5Answer: [QUESTION_5_ANSWERS.STATE_PENSION],
    q9Answer: QUESTION_9_ANSWERS.RENT_PRIVATE_LANDLORD,
    visibleSection: HOUSING_SECTION_IDS.HOUSING_16B_SECTION,
  },
  {
    ac: 'AC36',
    description:
      'Already retired + Rent – private landlord + DB only → package 16a',
    q2Answer: QUESTION_2_ANSWERS.ALREADY_RETIRED,
    q5Answer: [QUESTION_5_ANSWERS.DEFINED_BENEFIT],
    q9Answer: QUESTION_9_ANSWERS.RENT_PRIVATE_LANDLORD,
    visibleSection: HOUSING_SECTION_IDS.HOUSING_16A_SECTION,
  },
  {
    ac: 'AC37',
    description:
      'Already retired + Rent – private landlord + DC only → package 16',
    q2Answer: QUESTION_2_ANSWERS.ALREADY_RETIRED,
    q5Answer: [QUESTION_5_ANSWERS.DEFINED_CONTRIBUTION],
    q9Answer: QUESTION_9_ANSWERS.RENT_PRIVATE_LANDLORD,
    visibleSection: HOUSING_SECTION_IDS.HOUSING_16_SECTION,
  },
  {
    ac: 'AC38',
    description:
      'Already retired + Rent – social housing + State Pension only → package 14a',
    q2Answer: QUESTION_2_ANSWERS.ALREADY_RETIRED,
    q5Answer: [QUESTION_5_ANSWERS.STATE_PENSION],
    q9Answer: QUESTION_9_ANSWERS.RENT_SOCIAL_HOUSING,
    visibleSection: HOUSING_SECTION_IDS.HOUSING_14A_SECTION,
  },
  {
    ac: 'AC39',
    description:
      'Already retired + Rent – social housing + DB only → package 14b',
    q2Answer: QUESTION_2_ANSWERS.ALREADY_RETIRED,
    q5Answer: [QUESTION_5_ANSWERS.DEFINED_BENEFIT],
    q9Answer: QUESTION_9_ANSWERS.RENT_SOCIAL_HOUSING,
    visibleSection: HOUSING_SECTION_IDS.HOUSING_14B_SECTION,
  },
  {
    ac: 'AC40',
    description:
      'Already retired + Mortgage + State Pension only → package 12a',
    q2Answer: QUESTION_2_ANSWERS.ALREADY_RETIRED,
    q5Answer: [QUESTION_5_ANSWERS.STATE_PENSION],
    q9Answer: QUESTION_9_ANSWERS.MORTGAGE,
    visibleSection: HOUSING_SECTION_IDS.HOUSING_12A_SECTION,
  },
  {
    ac: 'AC41',
    description: 'Already retired + None + State Pension only → package 10a',
    q2Answer: QUESTION_2_ANSWERS.ALREADY_RETIRED,
    q5Answer: [QUESTION_5_ANSWERS.STATE_PENSION],
    q9Answer: QUESTION_9_ANSWERS.NONE,
    visibleSection: HOUSING_SECTION_IDS.HOUSING_10A_SECTION,
  },
  {
    ac: 'AC42',
    description: 'Already retired + None + DC only → package 10',
    q2Answer: QUESTION_2_ANSWERS.ALREADY_RETIRED,
    q5Answer: [QUESTION_5_ANSWERS.DEFINED_CONTRIBUTION],
    q9Answer: QUESTION_9_ANSWERS.NONE,
    visibleSection: HOUSING_SECTION_IDS.HOUSING_10_SECTION,
  },
];

/**
 * @tests Housing variable guidance (housing category)
 * @test AC01  <10yrs + rent private + State Pension only → 16b
 * @test AC02  <10yrs + rent private + DB only → 16a
 * @test AC03  <10yrs + rent private + DB in combination → 16a
 * @test AC04  <10yrs + rent private + DC only → 16
 * @test AC05  <10yrs + rent private + not sure → 16
 * @test AC06  <10yrs + rent private + combination without DB → 16
 * @test AC07  <10yrs + rent social + State Pension only → 14a
 * @test AC08  <10yrs + rent social + DB only → 14b
 * @test AC09  <10yrs + rent social + DB in combination → 14b
 * @test AC10  <10yrs + rent social + DC only → 14
 * @test AC11  <10yrs + rent social + not sure → 14
 * @test AC12  <10yrs + rent social + combination without DB → 14
 * @test AC13  <10yrs + mortgage + State Pension only → 12a
 * @test AC14  <10yrs + mortgage + DC only → 12
 * @test AC15  <10yrs + mortgage + not sure → 12
 * @test AC16  <10yrs + mortgage + combination → 12
 * @test AC17  <10yrs + none/other + State Pension only → 10a
 * @test AC18  <10yrs + none/other + DC only → 10
 * @test AC19  <10yrs + none/other + not sure → 10
 * @test AC20  <10yrs + none/other + combination → 10
 * @test AC21  >10yrs + rent private + State Pension only → 15a
 * @test AC22  >10yrs + rent private + DC only → 15
 * @test AC23  >10yrs + rent private + not sure → 15
 * @test AC24  >10yrs + rent private + combination → 15
 * @test AC25  >10yrs + rent social + any pension → 13
 * @test AC26  >10yrs + rent social + not sure → 13
 * @test AC27  >10yrs + rent social + combination → 13
 * @test AC28  >10yrs + mortgage + any pension → 11
 * @test AC29  >10yrs + mortgage + not sure → 11
 * @test AC30  >10yrs + mortgage + combination → 11
 * @test AC31  >10yrs + none/other + State Pension only → 09a
 * @test AC32  >10yrs + none/other + DC only → 09
 * @test AC33  >10yrs + none/other + not sure → 09
 * @test AC34  >10yrs + none/other + combination → 09
 * @test AC35  retired + rent private + State Pension only → 16b
 * @test AC36  retired + rent private + DB only → 16a
 * @test AC37  retired + rent private + DC only → 16
 * @test AC38  retired + rent social + State Pension only → 14a
 * @test AC39  retired + rent social + DB only → 14b
 * @test AC40  retired + mortgage + State Pension only → 12a
 * @test AC41  retired + none/other + State Pension only → 10a
 * @test AC42  retired + none/other + DC only → 10
 */
test.describe('Retirement Guidance - Results - Variable Guidance (Housing)', () => {
  for (const scenario of scenarios) {
    test(`${scenario.ac}: ${scenario.description}`, async ({ page }) => {
      const { q2Answer, q5Answer, q9Answer } = scenario;

      await questionnaireNavigator.skipToResults(page, {
        q2Answer,
        q5Answer,
        q7Answer: QUESTION_7_ANSWERS.NO,
        q8Answer: QUESTION_8_ANSWERS.NO,
        q9Answer,
      });

      await expect(page).toHaveURL(/\/en\/results/);
      await assertOnlyExpectedHousingGuidance(page, scenario.visibleSection);
    });
  }
});
