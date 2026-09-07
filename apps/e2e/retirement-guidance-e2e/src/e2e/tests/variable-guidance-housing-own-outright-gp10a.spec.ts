import { expect, test } from '@playwright/test';

import gp10aPage, { GP10_CONTENT, GP10A_CONTENT } from '../pages/gp10aPage';
import { QUESTION_2_ANSWERS } from '../pages/question2Page';
import { QUESTION_5_ANSWERS } from '../pages/question5Page';
import { QUESTION_9_ANSWERS } from '../pages/question9Page';
import questionnaireNavigator from '../pages/questionnaireNavigator';

/**
 * @tests User Story 55643
 * @test AC1  GP10a content is displayed with correct title and paragraph text
 * @test AC2  GP10a downsizing link opens correct URL in new tab
 * @test AC3  GP10a retirement interest-only (RIO) mortgage link opens correct URL in new tab
 * @test AC4  GP10a equity release link opens correct URL in new tab
 * @test AC5  GP10a use equity release scheme to fund care link opens correct URL in new tab
 * @test AC6a GP10a is displayed when less than 10 years + State Pension only + None or other housing costs
 * @test AC6b GP10a is displayed when already retired + State Pension only + None or other housing costs
 */

const displayScenarios = [
  {
    ac: 'AC6a',
    description:
      'Less than 10 years from retirement + State Pension only + None housing costs',
    q2Answer: QUESTION_2_ANSWERS.YES,
  },
  {
    ac: 'AC6b',
    description: 'Already retired + State Pension only + None housing costs',
    q2Answer: QUESTION_2_ANSWERS.ALREADY_RETIRED,
  },
] as const;

test.describe('Retirement Guidance - Results – Variable Guidance Housing GP10a (Own Outright)', () => {
  test.describe('Content and link verification', () => {
    test.beforeEach(async ({ page }) => {
      await questionnaireNavigator.skipToResults(page, {
        q2Answer: QUESTION_2_ANSWERS.YES,
        q5Answer: [QUESTION_5_ANSWERS.STATE_PENSION],
        q9Answer: QUESTION_9_ANSWERS.NONE,
      });
    });

    test('AC1: GP10a displays correct title', async ({ page }) => {
      const section = gp10aPage.getGuidanceSection(page);
      await expect(section).toBeVisible();
      await expect(section).toContainText(GP10_CONTENT.TITLE);
      await expect(section).toContainText(GP10A_CONTENT.LIST4);
    });

    test('AC2: GP10a downsizing link has correct href and opens in a new tab', async ({
      page,
    }) => {
      const link = gp10aPage.getLinkByHref(
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

    test('AC3: GP10a retirement interest-only (RIO) mortgage link has correct href and opens in a new tab', async ({
      page,
    }) => {
      const link = gp10aPage.getLinkByHref(
        page,
        GP10_CONTENT.LINKS.RIO.HREF_FRAGMENT,
      );
      await expect(link).toHaveAttribute('href', GP10_CONTENT.LINKS.RIO.URL);
      await expect(link).toHaveAttribute('target', '_blank');
      await expect(link).toContainText(GP10_CONTENT.LINKS.RIO.TEXT);
    });

    test('AC4: GP10a equity release link has correct href and opens in a new tab', async ({
      page,
    }) => {
      const link = gp10aPage.getLinkByHref(
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

    test('AC5: GP10a use equity release scheme to fund care link has correct href and opens in a new tab', async ({
      page,
    }) => {
      const link = gp10aPage.getLinkByHref(
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
      test(`${scenario.ac}: GP10a is displayed when ${scenario.description}`, async ({
        page,
      }) => {
        await questionnaireNavigator.skipToResults(page, {
          q2Answer: scenario.q2Answer,
          q5Answer: [QUESTION_5_ANSWERS.STATE_PENSION],
          q9Answer: QUESTION_9_ANSWERS.NONE,
        });
        await expect(gp10aPage.getGuidanceSection(page)).toBeVisible();
      });
    }
  });
});
