import { expect, test } from '@playwright/test';

import gp10Page, { GP10_CONTENT } from '../pages/gp10Page';
import { QUESTION_2_ANSWERS } from '../pages/question2Page';
import {
  QUESTION_5_ANSWERS,
  type Question5Answer,
} from '../pages/question5Page';
import { QUESTION_9_ANSWERS } from '../pages/question9Page';
import questionnaireNavigator from '../pages/questionnaireNavigator';

/**
 * @tests User Story 55642
 * @test AC1  GP10 content is displayed with correct title and paragraph text
 * @test AC2  GP10 downsizing link opens correct URL in new tab
 * @test AC3  GP10 retirement interest-only (RIO) mortgage link opens correct URL in new tab
 * @test AC4  GP10 equity release link opens correct URL in new tab
 * @test AC5  GP10 use equity release scheme to fund care link opens correct URL in new tab
 * @test AC6a GP10 is displayed when less than 10 years + any pension type (not State Pension) + None or other housing costs
 * @test AC6b GP10 is displayed when less than 10 years + not sure pension type + None or other housing costs
 * @test AC6c GP10 is displayed when less than 10 years + combination of pension types + None or other housing costs
 * @test AC7a GP10 is displayed when already retired + any pension type (not State Pension) + None or other housing costs
 * @test AC7b GP10 is displayed when already retired + not sure pension type + None or other housing costs
 */

type GP10DisplayScenario = {
  ac: string;
  description: string;
  q2Answer: (typeof QUESTION_2_ANSWERS)[keyof typeof QUESTION_2_ANSWERS];
  q5Answer: Question5Answer[];
};

const displayScenarios: GP10DisplayScenario[] = [
  // ── Less than 10 years from retirement scenarios ────────────────────
  {
    ac: 'AC6a',
    description:
      'Less than 10 years from retirement + DC pension (not State Pension) + None housing costs',
    q2Answer: QUESTION_2_ANSWERS.YES,
    q5Answer: [QUESTION_5_ANSWERS.DEFINED_CONTRIBUTION],
  },
  {
    ac: 'AC6a',
    description:
      'Less than 10 years from retirement + DB pension (not State Pension) + None housing costs',
    q2Answer: QUESTION_2_ANSWERS.YES,
    q5Answer: [QUESTION_5_ANSWERS.DEFINED_BENEFIT],
  },
  {
    ac: 'AC6a',
    description:
      'Less than 10 years from retirement + Other pension (not State Pension) + None housing costs',
    q2Answer: QUESTION_2_ANSWERS.YES,
    q5Answer: [QUESTION_5_ANSWERS.OTHER],
  },
  {
    ac: 'AC6b',
    description:
      'Less than 10 years from retirement + Not sure pension type + None housing costs',
    q2Answer: QUESTION_2_ANSWERS.YES,
    q5Answer: [QUESTION_5_ANSWERS.NOT_SURE],
  },
  {
    ac: 'AC6c',
    description:
      'Less than 10 years from retirement + combination of pension types + None housing costs',
    q2Answer: QUESTION_2_ANSWERS.YES,
    q5Answer: [
      QUESTION_5_ANSWERS.DEFINED_CONTRIBUTION,
      QUESTION_5_ANSWERS.DEFINED_BENEFIT,
    ],
  },
  // ── Already retired scenarios ────────────────────────────────────────
  {
    ac: 'AC7a',
    description:
      'Already retired + DC pension (not State Pension) + None housing costs',
    q2Answer: QUESTION_2_ANSWERS.ALREADY_RETIRED,
    q5Answer: [QUESTION_5_ANSWERS.DEFINED_CONTRIBUTION],
  },
  {
    ac: 'AC7a',
    description:
      'Already retired + DB pension (not State Pension) + None housing costs',
    q2Answer: QUESTION_2_ANSWERS.ALREADY_RETIRED,
    q5Answer: [QUESTION_5_ANSWERS.DEFINED_BENEFIT],
  },
  {
    ac: 'AC7a',
    description:
      'Already retired + Other pension (not State Pension) + None housing costs',
    q2Answer: QUESTION_2_ANSWERS.ALREADY_RETIRED,
    q5Answer: [QUESTION_5_ANSWERS.OTHER],
  },
  {
    ac: 'AC7b',
    description: 'Already retired + Not sure pension type + None housing costs',
    q2Answer: QUESTION_2_ANSWERS.ALREADY_RETIRED,
    q5Answer: [QUESTION_5_ANSWERS.NOT_SURE],
  },
];

test.describe('Retirement Guidance - Results – Variable Guidance Housing GP10 (Own Outright)', () => {
  test.describe('Content and link verification', () => {
    test.beforeEach(async ({ page }) => {
      await questionnaireNavigator.skipToResults(page, {
        q2Answer: QUESTION_2_ANSWERS.YES,
        q5Answer: [QUESTION_5_ANSWERS.DEFINED_CONTRIBUTION],
        q9Answer: QUESTION_9_ANSWERS.NONE,
      });
    });

    test('AC1: GP10 displays correct title', async ({ page }) => {
      const section = gp10Page.getGuidanceSection(page);
      await expect(section).toBeVisible();
      await expect(section).toContainText(GP10_CONTENT.TITLE);
    });

    test('AC2: GP10 downsizing link has correct href and opens in a new tab', async ({
      page,
    }) => {
      const link = gp10Page.getLinkByHref(
        page,
        GP10_CONTENT.LINKS.DOWNSIZE.HREF_FRAGMENT,
      );
      await expect(link).toHaveAttribute(
        'href',
        GP10_CONTENT.LINKS.DOWNSIZE.URL,
      );
      await expect(link).toHaveAttribute('target', '_blank');
      await expect(link).toContainText(GP10_CONTENT.LINKS.DOWNSIZE.TEXT);
    });

    test('AC3: GP10 retirement interest-only (RIO) mortgage link has correct href and opens in a new tab', async ({
      page,
    }) => {
      const link = gp10Page.getLinkByHref(
        page,
        GP10_CONTENT.LINKS.RIO.HREF_FRAGMENT,
      );
      await expect(link).toHaveAttribute('href', GP10_CONTENT.LINKS.RIO.URL);
      await expect(link).toHaveAttribute('target', '_blank');
      await expect(link).toContainText(GP10_CONTENT.LINKS.RIO.TEXT);
    });

    test('AC4: GP10 equity release link has correct href and opens in a new tab', async ({
      page,
    }) => {
      const link = gp10Page.getLinkByHref(
        page,
        GP10_CONTENT.LINKS.EQUITY_RELEASE.HREF_FRAGMENT,
      );
      await expect(link).toHaveAttribute(
        'href',
        GP10_CONTENT.LINKS.EQUITY_RELEASE.URL,
      );
      await expect(link).toHaveAttribute('target', '_blank');
      await expect(link).toContainText(GP10_CONTENT.LINKS.EQUITY_RELEASE.TEXT);
    });

    test('AC5: GP10 use equity release scheme to fund care link has correct href and opens in a new tab', async ({
      page,
    }) => {
      const link = gp10Page.getLinkByHref(
        page,
        GP10_CONTENT.LINKS.EQUITY_RELEASE_CARE.HREF_FRAGMENT,
      );
      await expect(link).toHaveAttribute(
        'href',
        GP10_CONTENT.LINKS.EQUITY_RELEASE_CARE.URL,
      );
      await expect(link).toHaveAttribute('target', '_blank');
      await expect(link).toContainText(
        GP10_CONTENT.LINKS.EQUITY_RELEASE_CARE.TEXT,
      );
    });
  });

  test.describe('Display conditions', () => {
    for (const scenario of displayScenarios) {
      test(`${scenario.ac}: GP10 is displayed when ${scenario.description}`, async ({
        page,
      }) => {
        await questionnaireNavigator.skipToResults(page, {
          q2Answer: scenario.q2Answer,
          q5Answer: scenario.q5Answer,
          q9Answer: QUESTION_9_ANSWERS.NONE,
        });
        await expect(gp10Page.getGuidanceSection(page)).toBeVisible();
      });
    }
  });
});
