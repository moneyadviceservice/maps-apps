import { expect, test } from '@playwright/test';

import gp11Page, { GP11_CONTENT } from '../pages/gp11Page';
import { QUESTION_2_ANSWERS } from '../pages/question2Page';
import { QUESTION_5_ANSWERS } from '../pages/question5Page';
import { QUESTION_9_ANSWERS } from '../pages/question9Page';
import questionnaireNavigator from '../pages/questionnaireNavigator';

/**
 * @tests User Story 55644
 * @test AC1  GP11 displays an additional section title below existing content
 * @test AC2  Should I downsize my home to fund my retirement? link opens the correct destination in a new tab
 */

test.describe('Retirement Guidance - Results – Variable Guidance Housing GP11 (Mortgage)', () => {
  test.beforeEach(async ({ page }) => {
    await questionnaireNavigator.skipToResults(page, {
      q2Answer: QUESTION_2_ANSWERS.NO,
      q5Answer: [QUESTION_5_ANSWERS.DEFINED_CONTRIBUTION],
      q9Answer: QUESTION_9_ANSWERS.MORTGAGE,
    });

    await page.getByText(GP11_CONTENT.CARD_TITLE, { exact: true }).click();
    await expect(gp11Page.getGuidanceSection(page)).toBeVisible();
  });

  test('AC1: GP11 shows additional section title below existing content', async ({
    page,
  }) => {
    const section = gp11Page.getGuidanceSection(page);
    await expect(section).toBeVisible();
    await expect(section).toContainText(GP11_CONTENT.TITLE);

    const sectionText = await section.innerText();
    const existingContentText = "Plan how you'll repay your existing mortgage";

    expect(sectionText.indexOf(existingContentText)).toBeGreaterThanOrEqual(0);
    expect(sectionText.indexOf(GP11_CONTENT.TITLE)).toBeGreaterThan(
      sectionText.indexOf(existingContentText),
    );
  });

  test('AC2: Downsizing link opens correct destination in a new tab', async ({
    page,
  }) => {
    const link = gp11Page.getLinkByHref(
      page,
      GP11_CONTENT.LINKS.DOWNSIZE.HREF_FRAGMENT,
    );

    await expect(link).toContainText(GP11_CONTENT.LINKS.DOWNSIZE.TEXT);
    await expect(link).toHaveAttribute('href', GP11_CONTENT.LINKS.DOWNSIZE.URL);
    await expect(link).toHaveAttribute('target', '_blank');

    const newTabPromise = page.context().waitForEvent('page');
    await link.click();
    const newTab = await newTabPromise;

    await newTab.waitForLoadState('domcontentloaded');
    await expect(newTab).toHaveURL(GP11_CONTENT.LINKS.DOWNSIZE.URL);
    await newTab.close();
  });
});
