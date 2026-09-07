import { expect, test } from '@playwright/test';

import { QUESTION_2_ANSWERS } from '../pages/question2Page';
import {
  QUESTION_5_ANSWERS,
  type Question5Answer,
} from '../pages/question5Page';
import { QUESTION_9_ANSWERS } from '../pages/question9Page';
import questionnaireNavigator from '../pages/questionnaireNavigator';
import resultsPage, { HOUSING_SECTION_IDS } from '../pages/resultsPage';

/**
 * @tests User Story 55640
 * @test AC1  GP09 content is displayed with correct title and downsize link text
 * @test AC2  GP09 'Should I downsize my home to fund my retirement?' link opens correct URL in new tab
 * @test AC3a GP09 is displayed when more than 10 years + DC pension (not State Pension) + None or other housing costs
 * @test AC3b GP09 is displayed when more than 10 years + Not sure pension type + None or other housing costs
 * @test AC3c GP09 is displayed when more than 10 years + combination of pension types + None or other housing costs
 */

const GP09_TITLE =
  'Consider using the value of your home to boost your retirement income';

const GP09_DOWNSIZE_LINK_TEXT =
  'Should I downsize my home to fund my retirement?';

const GP09_DOWNSIZE_LINK_URL =
  'https://www.moneyhelper.org.uk/en/pensions-and-retirement/taking-your-pension/downsizing-in-retirement';

const GP09_DOWNSIZE_LINK_HREF_FRAGMENT = 'downsizing-in-retirement';

type GP09DisplayScenario = {
  ac: string;
  description: string;
  q5Answer: Question5Answer[];
};

const displayScenarios: GP09DisplayScenario[] = [
  {
    ac: 'AC3a',
    description:
      'More than 10 years + DC pension (not State Pension only) + None or other housing costs',
    q5Answer: [QUESTION_5_ANSWERS.DEFINED_CONTRIBUTION],
  },
  {
    ac: 'AC3b',
    description:
      'More than 10 years + Not sure pension type + None or other housing costs',
    q5Answer: [QUESTION_5_ANSWERS.NOT_SURE],
  },
  {
    ac: 'AC3c',
    description:
      'More than 10 years + combination of pension types + None or other housing costs',
    q5Answer: [
      QUESTION_5_ANSWERS.DEFINED_CONTRIBUTION,
      QUESTION_5_ANSWERS.DEFINED_BENEFIT,
    ],
  },
];

test.describe('Retirement Guidance - Results – Variable Guidance Housing GP09 (Own Outright)', () => {
  test.describe('Content and link verification', () => {
    test.beforeEach(async ({ page }) => {
      await questionnaireNavigator.skipToResults(page, {
        q2Answer: QUESTION_2_ANSWERS.NO,
        q5Answer: [QUESTION_5_ANSWERS.DEFINED_CONTRIBUTION],
        q9Answer: QUESTION_9_ANSWERS.NONE,
      });
    });

    test('AC1: GP09 displays correct title and content', async ({ page }) => {
      const section = resultsPage.getGuidanceSection(
        page,
        HOUSING_SECTION_IDS.HOUSING_09_SECTION,
      );
      await expect(section).toBeVisible();
      await expect(section).toContainText(GP09_TITLE);
      await expect(section).toContainText(GP09_DOWNSIZE_LINK_TEXT);
    });

    test("AC2: GP09 'Should I downsize my home to fund my retirement?' link has correct href and opens in a new tab", async ({
      page,
    }) => {
      const link = resultsPage.getSectionLinkByHref(
        page,
        HOUSING_SECTION_IDS.HOUSING_09_SECTION,
        GP09_DOWNSIZE_LINK_HREF_FRAGMENT,
      );
      await expect(link).toHaveAttribute('href', GP09_DOWNSIZE_LINK_URL);
      await expect(link).toHaveAttribute('target', '_blank');
    });
  });

  test.describe('Display conditions', () => {
    for (const scenario of displayScenarios) {
      test(`${scenario.ac}: GP09 is displayed when ${scenario.description}`, async ({
        page,
      }) => {
        await questionnaireNavigator.skipToResults(page, {
          q2Answer: QUESTION_2_ANSWERS.NO,
          q5Answer: scenario.q5Answer,
          q9Answer: QUESTION_9_ANSWERS.NONE,
        });
        await expect(
          resultsPage.getGuidanceSection(
            page,
            HOUSING_SECTION_IDS.HOUSING_09_SECTION,
          ),
        ).toBeVisible();
      });
    }
  });
});
