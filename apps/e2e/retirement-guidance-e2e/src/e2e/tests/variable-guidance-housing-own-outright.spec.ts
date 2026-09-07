import { expect, test } from '@playwright/test';

import { QUESTION_2_ANSWERS } from '../pages/question2Page';
import { QUESTION_5_ANSWERS } from '../pages/question5Page';
import { QUESTION_9_ANSWERS } from '../pages/question9Page';
import questionnaireNavigator from '../pages/questionnaireNavigator';
import resultsPage, { HOUSING_SECTION_IDS } from '../pages/resultsPage';

/**
 * @tests User Story 55641
 * @test AC1  GP09a content is displayed with correct title and paragraph text
 * @test AC2  GP09a 'Should I downsize my home to fund my retirement?' link opens correct URL in new tab
 * @test AC3  GP09a is displayed when more than 10 years from retirement + State Pension only + None or other housing costs
 */

const GP09A_TITLE =
  'Consider using the value of your home to boost your retirement income';

const GP09A_DOWNSIZE_LINK_TEXT =
  'Should I downsize my home to fund my retirement?';

const GP09A_DOWNSIZE_LINK_URL =
  'https://www.moneyhelper.org.uk/en/pensions-and-retirement/taking-your-pension/downsizing-in-retirement';

const GP09A_DOWNSIZE_LINK_HREF_FRAGMENT = 'downsizing-in-retirement';

const navigateToGP09a = async (page: Parameters<typeof test>[1]) => {
  await questionnaireNavigator.skipToResults(page, {
    q2Answer: QUESTION_2_ANSWERS.NO,
    q5Answer: [QUESTION_5_ANSWERS.STATE_PENSION],
    q9Answer: QUESTION_9_ANSWERS.NONE,
  });
};

test.describe('Retirement Guidance - Results – Variable Guidance Housing GP09a (Own Outright)', () => {
  test.beforeEach(async ({ page }) => {
    await navigateToGP09a(page);
  });

  test('AC3: GP09a is displayed when more than 10 years from retirement + State Pension only + None or other housing costs', async ({
    page,
  }) => {
    await expect(
      resultsPage.getGuidanceSection(
        page,
        HOUSING_SECTION_IDS.HOUSING_09A_SECTION,
      ),
    ).toBeVisible();
  });

  test('AC1: GP09a displays correct title and content', async ({ page }) => {
    const section = resultsPage.getGuidanceSection(
      page,
      HOUSING_SECTION_IDS.HOUSING_09A_SECTION,
    );
    await expect(section).toBeVisible();
    await expect(section).toContainText(GP09A_TITLE);
    await expect(section).toContainText(GP09A_DOWNSIZE_LINK_TEXT);
  });

  test("AC2: GP09a 'Should I downsize my home to fund my retirement?' link has correct href and opens in a new tab", async ({
    page,
  }) => {
    const link = resultsPage.getSectionLinkByHref(
      page,
      HOUSING_SECTION_IDS.HOUSING_09A_SECTION,
      GP09A_DOWNSIZE_LINK_HREF_FRAGMENT,
    );
    await expect(link).toHaveAttribute('href', GP09A_DOWNSIZE_LINK_URL);
    await expect(link).toHaveAttribute('target', '_blank');
  });
});
