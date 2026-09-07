import { expect, test } from '@playwright/test';

import { QUESTION_2_ANSWERS } from '../pages/question2Page';
import { QUESTION_5_ANSWERS } from '../pages/question5Page';
import { QUESTION_9_ANSWERS } from '../pages/question9Page';
import questionnaireNavigator from '../pages/questionnaireNavigator';
import resultsPage, {
  HOUSING_IT_MIGHT_ALSO_AFFECT_BENEFITS,
  HOUSING_SECTION_IDS,
  HOUSING_TAX_FREE_LUMP_SUM_HEADING,
  SOCIAL_HOUSING_LINK_URL,
  SOCIAL_HOUSING_SWAP_TEXT,
} from '../pages/resultsPage';

/**
 * @tests User Story 55639
 * @test AC1  GP13 last paragraph reads correct social housing swap text
 * @test AC2  GP13 'your rights if you rent from the council or housing association' link opens correct URL in new tab
 * @test AC3  GP14 last paragraph reads correct social housing swap text
 * @test AC4  GP14 'your rights if you rent from the council or housing association' link opens correct URL in new tab
 * @test AC5  GP14a last paragraph reads correct social housing swap text
 * @test AC6  GP14a 'your rights if you rent from the council or housing association' link opens correct URL in new tab
 * @test AC7  GP14b last paragraph reads correct social housing swap text
 * @test AC8  GP14b 'your rights if you rent from the council or housing association' link opens correct URL in new tab
 */

const SOCIAL_HOUSING_RIGHTS_HREF_FRAGMENT =
  'your-legal-and-financial-responsibilities-when-renting';

test.describe('Retirement Guidance - Results – Variable Guidance Housing (Social)', () => {
  test.describe('GP13 – More than 10 years + Rent social housing', () => {
    test.beforeEach(async ({ page }) => {
      await questionnaireNavigator.skipToResults(page, {
        q2Answer: QUESTION_2_ANSWERS.NO,
        q5Answer: [QUESTION_5_ANSWERS.DEFINED_CONTRIBUTION],
        q9Answer: QUESTION_9_ANSWERS.RENT_SOCIAL_HOUSING,
      });
    });

    test('AC1: GP13 last paragraph reads social housing swap text', async ({
      page,
    }) => {
      await expect(
        resultsPage.getSectionLastParagraph(
          page,
          HOUSING_SECTION_IDS.HOUSING_13_SECTION,
        ),
      ).toHaveText(SOCIAL_HOUSING_SWAP_TEXT);
    });

    test("AC2: GP13 'your rights' link has correct href and opens in a new tab", async ({
      page,
    }) => {
      const link = resultsPage.getSectionLinkByHref(
        page,
        HOUSING_SECTION_IDS.HOUSING_13_SECTION,
        SOCIAL_HOUSING_RIGHTS_HREF_FRAGMENT,
      );
      await expect(link).toHaveAttribute('href', SOCIAL_HOUSING_LINK_URL);
      await expect(link).toHaveAttribute('target', '_blank');
    });
  });

  test.describe('GP14 – Less than 10 years + Rent social housing + DC pension', () => {
    test.beforeEach(async ({ page }) => {
      await questionnaireNavigator.skipToResults(page, {
        q2Answer: QUESTION_2_ANSWERS.YES,
        q5Answer: [QUESTION_5_ANSWERS.DEFINED_CONTRIBUTION],
        q9Answer: QUESTION_9_ANSWERS.RENT_SOCIAL_HOUSING,
      });
    });

    test('AC3: GP14 section contains social housing swap text', async ({
      page,
    }) => {
      const section = resultsPage.getGuidanceSection(
        page,
        HOUSING_SECTION_IDS.HOUSING_14_SECTION,
      );
      await expect(section).toContainText(SOCIAL_HOUSING_SWAP_TEXT);
      await expect(section).toContainText(HOUSING_TAX_FREE_LUMP_SUM_HEADING);
      await expect(section).toContainText(
        HOUSING_IT_MIGHT_ALSO_AFFECT_BENEFITS,
      );
    });

    test("AC4: GP14 'your rights' link has correct href and opens in a new tab", async ({
      page,
    }) => {
      const link = resultsPage.getSectionLinkByHref(
        page,
        HOUSING_SECTION_IDS.HOUSING_14_SECTION,
        SOCIAL_HOUSING_RIGHTS_HREF_FRAGMENT,
      );
      await expect(link).toHaveAttribute('href', SOCIAL_HOUSING_LINK_URL);
      await expect(link).toHaveAttribute('target', '_blank');
    });
  });

  test.describe('GP14a – Less than 10 years + Rent social housing + State Pension only', () => {
    test.beforeEach(async ({ page }) => {
      await questionnaireNavigator.skipToResults(page, {
        q2Answer: QUESTION_2_ANSWERS.YES,
        q5Answer: [QUESTION_5_ANSWERS.STATE_PENSION],
        q9Answer: QUESTION_9_ANSWERS.RENT_SOCIAL_HOUSING,
      });
    });

    test('AC5: GP14a last paragraph reads social housing swap text', async ({
      page,
    }) => {
      await expect(
        resultsPage.getSectionLastParagraph(
          page,
          HOUSING_SECTION_IDS.HOUSING_14A_SECTION,
        ),
      ).toHaveText(SOCIAL_HOUSING_SWAP_TEXT);
    });

    test("AC6: GP14a 'your rights' link has correct href and opens in a new tab", async ({
      page,
    }) => {
      const link = resultsPage.getSectionLinkByHref(
        page,
        HOUSING_SECTION_IDS.HOUSING_14A_SECTION,
        SOCIAL_HOUSING_RIGHTS_HREF_FRAGMENT,
      );
      await expect(link).toHaveAttribute('href', SOCIAL_HOUSING_LINK_URL);
      await expect(link).toHaveAttribute('target', '_blank');
    });
  });

  test.describe('GP14b – Less than 10 years + Rent social housing + Defined Benefit pension', () => {
    test.beforeEach(async ({ page }) => {
      await questionnaireNavigator.skipToResults(page, {
        q2Answer: QUESTION_2_ANSWERS.YES,
        q5Answer: [QUESTION_5_ANSWERS.DEFINED_BENEFIT],
        q9Answer: QUESTION_9_ANSWERS.RENT_SOCIAL_HOUSING,
      });
    });

    test('AC7: GP14b section contains social housing swap text', async ({
      page,
    }) => {
      const section = resultsPage.getGuidanceSection(
        page,
        HOUSING_SECTION_IDS.HOUSING_14B_SECTION,
      );
      await expect(section).toContainText(SOCIAL_HOUSING_SWAP_TEXT);
      await expect(section).toContainText(
        HOUSING_IT_MIGHT_ALSO_AFFECT_BENEFITS,
      );
    });

    test("AC8: GP14b 'your rights' link has correct href and opens in a new tab", async ({
      page,
    }) => {
      const link = resultsPage.getSectionLinkByHref(
        page,
        HOUSING_SECTION_IDS.HOUSING_14B_SECTION,
        SOCIAL_HOUSING_RIGHTS_HREF_FRAGMENT,
      );
      await expect(link).toHaveAttribute('href', SOCIAL_HOUSING_LINK_URL);
      await expect(link).toHaveAttribute('target', '_blank');
    });
  });
});
