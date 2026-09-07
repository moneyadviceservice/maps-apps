import { expect, type Page, test } from '@playwright/test';

import gp15To16RentPrivatePage, {
  GP15_TO_16_RENT_PRIVATE_CONTENT,
  GP15_TO_16_RENT_PRIVATE_SECTION_IDS,
  type GP15To16RentPrivateSectionId,
} from '../pages/gp15To16RentPrivatePage';
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
import { QUESTION_9_ANSWERS } from '../pages/question9Page';
import questionnaireNavigator from '../pages/questionnaireNavigator';

/**
 * @tests Activity 55373
 * @test AC1  GP15 content reflects updated copy
 * @test AC2  GP15a content reflects updated copy
 * @test AC3  GP16a content reflects updated copy
 * @test AC4  GP16b content reflects updated copy
 * @test AC5  <10 years + State Pension only + rent private -> GP16b
 * @test AC6  <10 years + DB only + rent private -> GP16a
 * @test AC7  <10 years + DB combination + rent private -> GP16a
 * @test AC8  >10 years + State Pension only + rent private -> GP15a
 * @test AC9  >10 years + non-State pension + rent private -> GP15
 * @test AC10 >10 years + not sure pension type + rent private -> GP15
 * @test AC11 >10 years + pension combination + rent private -> GP15
 * @test AC12 retired + State Pension only + rent private -> GP16b
 * @test AC13 retired + DB only + rent private -> GP16a
 * @test AC14 retired + DB combination + rent private -> GP16a
 */

const navigateToPrivateRentResults = async (
  page: Page,
  q2Answer: Question2Answer,
  q5Answer: Question5Answer[],
) => {
  await questionnaireNavigator.skipToResults(page, {
    q2Answer,
    q5Answer,
    q7Answer: QUESTION_7_ANSWERS.NO,
    q8Answer: QUESTION_8_ANSWERS.NO,
    q9Answer: QUESTION_9_ANSWERS.RENT_PRIVATE_LANDLORD,
  });
};

type RentPrivateScenario = {
  ac: string;
  description: string;
  q2Answer: Question2Answer;
  q5Answer: Question5Answer[];
  visibleSection: GP15To16RentPrivateSectionId;
};

type RentPrivateContentScenarioWithLink = {
  ac: string;
  description: string;
  q2Answer: Question2Answer;
  q5Answer: Question5Answer[];
  visibleSection: GP15To16RentPrivateSectionId;
  expectedTextSnippets: string[];
  linkToCheck: {
    hrefFragment: string;
    url: string;
  };
};

type RentPrivateContentScenarioNoLink = {
  ac: string;
  description: string;
  q2Answer: Question2Answer;
  q5Answer: Question5Answer[];
  visibleSection: GP15To16RentPrivateSectionId;
  expectedTextSnippets: string[];
};

const rentPrivateContentScenariosWithLinks: RentPrivateContentScenarioWithLink[] =
  [
    {
      ac: 'AC1',
      description:
        'GP15 content is displayed for >10 years + non-State pension + private rent',
      q2Answer: QUESTION_2_ANSWERS.NO,
      q5Answer: [QUESTION_5_ANSWERS.DEFINED_CONTRIBUTION],
      visibleSection: GP15_TO_16_RENT_PRIVATE_SECTION_IDS.GP15,
      expectedTextSnippets: [
        GP15_TO_16_RENT_PRIVATE_CONTENT.TEXT.GP15_DOWNSIZE,
        GP15_TO_16_RENT_PRIVATE_CONTENT.TEXT.SOCIAL_HOUSING_CRITERIA,
      ],
      linkToCheck: {
        hrefFragment:
          GP15_TO_16_RENT_PRIVATE_CONTENT.LINKS.RENT_AFFORDABILITY
            .HREF_FRAGMENT,
        url: GP15_TO_16_RENT_PRIVATE_CONTENT.LINKS.RENT_AFFORDABILITY.URL,
      },
    },
    {
      ac: 'AC2',
      description:
        'GP15a content is displayed for >10 years + State Pension only + private rent',
      q2Answer: QUESTION_2_ANSWERS.NO,
      q5Answer: [QUESTION_5_ANSWERS.STATE_PENSION],
      visibleSection: GP15_TO_16_RENT_PRIVATE_SECTION_IDS.GP15A,
      expectedTextSnippets: [
        GP15_TO_16_RENT_PRIVATE_CONTENT.TEXT.GP15A_RENT_INCREASE_NOTICE,
      ],
      linkToCheck: {
        hrefFragment:
          GP15_TO_16_RENT_PRIVATE_CONTENT.LINKS.MARKET_RENT_DETERMINATION
            .HREF_FRAGMENT,
        url: GP15_TO_16_RENT_PRIVATE_CONTENT.LINKS.MARKET_RENT_DETERMINATION
          .URL,
      },
    },
  ];

const rentPrivateContentScenariosNoLinks: RentPrivateContentScenarioNoLink[] = [
  {
    ac: 'AC3',
    description:
      'GP16a content is displayed for <10 years + DB only + private rent',
    q2Answer: QUESTION_2_ANSWERS.YES,
    q5Answer: [QUESTION_5_ANSWERS.DEFINED_BENEFIT],
    visibleSection: GP15_TO_16_RENT_PRIVATE_SECTION_IDS.GP16A,
    expectedTextSnippets: [
      GP15_TO_16_RENT_PRIVATE_CONTENT.TEXT.GP16A_TAX_FREE_LUMP_SUM,
      GP15_TO_16_RENT_PRIVATE_CONTENT.TEXT.GP16A_AFFORDABILITY,
      GP15_TO_16_RENT_PRIVATE_CONTENT.TEXT.SOCIAL_HOUSING_CRITERIA,
    ],
  },
  {
    ac: 'AC4',
    description:
      'GP16b content is displayed for <10 years + State Pension only + private rent',
    q2Answer: QUESTION_2_ANSWERS.YES,
    q5Answer: [QUESTION_5_ANSWERS.STATE_PENSION],
    visibleSection: GP15_TO_16_RENT_PRIVATE_SECTION_IDS.GP16B,
    expectedTextSnippets: [
      GP15_TO_16_RENT_PRIVATE_CONTENT.TEXT.GP16B_DOWNSIZE,
      GP15_TO_16_RENT_PRIVATE_CONTENT.TEXT.GP16B_RENT_INCREASE,
      GP15_TO_16_RENT_PRIVATE_CONTENT.TEXT.SOCIAL_HOUSING_CRITERIA,
    ],
  },
];

const rentPrivateDisplayScenarios: RentPrivateScenario[] = [
  {
    ac: 'AC5',
    description:
      'Less than 10 years + State Pension only + Rent private landlord shows GP16b',
    q2Answer: QUESTION_2_ANSWERS.YES,
    q5Answer: [QUESTION_5_ANSWERS.STATE_PENSION],
    visibleSection: GP15_TO_16_RENT_PRIVATE_SECTION_IDS.GP16B,
  },
  {
    ac: 'AC6',
    description:
      'Less than 10 years + Defined benefit only + Rent private landlord shows GP16a',
    q2Answer: QUESTION_2_ANSWERS.YES,
    q5Answer: [QUESTION_5_ANSWERS.DEFINED_BENEFIT],
    visibleSection: GP15_TO_16_RENT_PRIVATE_SECTION_IDS.GP16A,
  },
  {
    ac: 'AC7',
    description:
      'Less than 10 years + Defined benefit in combination + Rent private landlord shows GP16a',
    q2Answer: QUESTION_2_ANSWERS.YES,
    q5Answer: [
      QUESTION_5_ANSWERS.DEFINED_BENEFIT,
      QUESTION_5_ANSWERS.DEFINED_CONTRIBUTION,
    ],
    visibleSection: GP15_TO_16_RENT_PRIVATE_SECTION_IDS.GP16A,
  },
  {
    ac: 'AC8',
    description:
      'More than 10 years + State Pension only + Rent private landlord shows GP15a',
    q2Answer: QUESTION_2_ANSWERS.NO,
    q5Answer: [QUESTION_5_ANSWERS.STATE_PENSION],
    visibleSection: GP15_TO_16_RENT_PRIVATE_SECTION_IDS.GP15A,
  },
  {
    ac: 'AC9',
    description:
      'More than 10 years + non-State pension + Rent private landlord shows GP15',
    q2Answer: QUESTION_2_ANSWERS.NO,
    q5Answer: [QUESTION_5_ANSWERS.DEFINED_CONTRIBUTION],
    visibleSection: GP15_TO_16_RENT_PRIVATE_SECTION_IDS.GP15,
  },
  {
    ac: 'AC10',
    description:
      'More than 10 years + not sure pension type + Rent private landlord shows GP15',
    q2Answer: QUESTION_2_ANSWERS.NO,
    q5Answer: [QUESTION_5_ANSWERS.NOT_SURE],
    visibleSection: GP15_TO_16_RENT_PRIVATE_SECTION_IDS.GP15,
  },
  {
    ac: 'AC11',
    description:
      'More than 10 years + pension combination + Rent private landlord shows GP15',
    q2Answer: QUESTION_2_ANSWERS.NO,
    q5Answer: [
      QUESTION_5_ANSWERS.STATE_PENSION,
      QUESTION_5_ANSWERS.DEFINED_CONTRIBUTION,
    ],
    visibleSection: GP15_TO_16_RENT_PRIVATE_SECTION_IDS.GP15,
  },
  {
    ac: 'AC12',
    description:
      'Already retired + State Pension only + Rent private landlord shows GP16b',
    q2Answer: QUESTION_2_ANSWERS.ALREADY_RETIRED,
    q5Answer: [QUESTION_5_ANSWERS.STATE_PENSION],
    visibleSection: GP15_TO_16_RENT_PRIVATE_SECTION_IDS.GP16B,
  },
  {
    ac: 'AC13',
    description:
      'Already retired + Defined benefit only + Rent private landlord shows GP16a',
    q2Answer: QUESTION_2_ANSWERS.ALREADY_RETIRED,
    q5Answer: [QUESTION_5_ANSWERS.DEFINED_BENEFIT],
    visibleSection: GP15_TO_16_RENT_PRIVATE_SECTION_IDS.GP16A,
  },
  {
    ac: 'AC14',
    description:
      'Already retired + Defined benefit in combination + Rent private landlord shows GP16a',
    q2Answer: QUESTION_2_ANSWERS.ALREADY_RETIRED,
    q5Answer: [
      QUESTION_5_ANSWERS.DEFINED_BENEFIT,
      QUESTION_5_ANSWERS.DEFINED_CONTRIBUTION,
    ],
    visibleSection: GP15_TO_16_RENT_PRIVATE_SECTION_IDS.GP16A,
  },
];

test.describe('Retirement Guidance - Results - Variable Guidance Housing (Private Rent GP15/15a/16a/16b)', () => {
  test.describe('Content validation against updated guidance copy', () => {
    for (const scenario of rentPrivateContentScenariosWithLinks) {
      test(`${scenario.ac}: ${scenario.description}`, async ({ page }) => {
        await navigateToPrivateRentResults(
          page,
          scenario.q2Answer,
          scenario.q5Answer,
        );

        const section = gp15To16RentPrivatePage.getSection(
          page,
          scenario.visibleSection,
        );

        await expect(section).toBeVisible();
        await expect(section).toContainText(
          GP15_TO_16_RENT_PRIVATE_CONTENT.TITLE,
        );

        for (const expectedText of scenario.expectedTextSnippets) {
          await expect(section).toContainText(expectedText);
        }

        const link = gp15To16RentPrivatePage.getLinkByHref(
          page,
          scenario.visibleSection,
          scenario.linkToCheck.hrefFragment,
        );
        await expect(link).toHaveAttribute('href', scenario.linkToCheck.url);
        await expect(link).toHaveAttribute('target', '_blank');
      });
    }

    for (const scenario of rentPrivateContentScenariosNoLinks) {
      test(`${scenario.ac}: ${scenario.description}`, async ({ page }) => {
        await navigateToPrivateRentResults(
          page,
          scenario.q2Answer,
          scenario.q5Answer,
        );

        const section = gp15To16RentPrivatePage.getSection(
          page,
          scenario.visibleSection,
        );

        await expect(section).toBeVisible();
        await expect(section).toContainText(
          GP15_TO_16_RENT_PRIVATE_CONTENT.TITLE,
        );

        for (const expectedText of scenario.expectedTextSnippets) {
          await expect(section).toContainText(expectedText);
        }
      });
    }
  });

  test.describe('Display matrix for QA scenarios', () => {
    for (const scenario of rentPrivateDisplayScenarios) {
      test(`${scenario.ac}: ${scenario.description}`, async ({ page }) => {
        await navigateToPrivateRentResults(
          page,
          scenario.q2Answer,
          scenario.q5Answer,
        );

        await gp15To16RentPrivatePage.assertOnlyExpectedSection(
          page,
          scenario.visibleSection,
        );

        await expect(
          gp15To16RentPrivatePage.getSection(page, scenario.visibleSection),
        ).toBeAttached();
      });
    }
  });
});
