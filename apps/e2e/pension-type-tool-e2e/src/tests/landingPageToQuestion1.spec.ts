import { landingPageScenarios } from '@data/landingPage.data';
import { expect, test } from '@lib/test.lib';

test.describe('Pension Type Tool landing page - US-54924', () => {
  test.beforeEach(async ({ setCookieControl }) => {
    await setCookieControl();
  });

  /** @tests 54924 AC 1 Test Case 1 */
  test('54924 AC 1 Test Case 1: Verify updated English landing page content is displayed', async ({
    landingPage,
  }) => {
    const scenario = landingPageScenarios.en;
    await landingPage.goto(scenario.path);

    await expect(landingPage.pageHeading).toHaveText(scenario.pageHeading);
    await expect(landingPage.intro).toHaveText(scenario.intro);
    await expect(landingPage.pageContent).toContainText(scenario.contentIntro);
    await expect(landingPage.contentBulletItems).toHaveText([
      ...scenario.bulletTexts,
    ]);
    await expect(landingPage.pageContent).toContainText(
      scenario.completionText,
    );
    await expect(landingPage.pageContent).toContainText(scenario.guidanceText);
    await expect(landingPage.pageContent).toContainText(scenario.guideIntro);
    await expect(landingPage.pensionsExplainedLink).toHaveText(
      scenario.guideLinkText,
    );
    await expect(landingPage.pensionsExplainedLink).toHaveAttribute(
      'href',
      scenario.guideUrl,
    );
  });

  /** @tests 54924 AC 1 Test Case 2 */
  test('54924 AC 1 Test Case 2: Verify updated Welsh landing page content is displayed', async ({
    landingPage,
  }) => {
    const scenario = landingPageScenarios.cy;
    await landingPage.goto(scenario.path);

    await expect(landingPage.pageHeading).toHaveText(scenario.pageHeading);
    await expect(landingPage.intro).toHaveText(scenario.intro);
    await expect(landingPage.pageContent).toContainText(scenario.contentIntro);
    await expect(landingPage.contentBulletItems).toHaveText([
      ...scenario.bulletTexts,
    ]);
    await expect(landingPage.pageContent).toContainText(
      scenario.completionText,
    );
    await expect(landingPage.pageContent).toContainText(scenario.guidanceText);
    await expect(landingPage.pageContent).toContainText(scenario.guideIntro);
    await expect(landingPage.pensionsExplainedLink).toHaveText(
      scenario.guideLinkText,
    );
    await expect(landingPage.pensionsExplainedLink).toHaveAttribute(
      'href',
      scenario.guideUrl,
    );
  });

  /** @tests 54924 AC 1 Test Case 3 */
  test('54924 AC 1 Test Case 3: Verify Start button functionality', async ({
    landingPage,
    question1Page,
  }) => {
    for (const scenario of Object.values(landingPageScenarios)) {
      await landingPage.goto(scenario.path);
      await expect(landingPage.startNowButton).toHaveAttribute(
        'href',
        scenario.startUrl,
      );

      await landingPage.clickStartNow();

      await expect(question1Page.title).toHaveText(scenario.questionTitle);
      const answerOptions = await question1Page.getOptionLabels();
      expect(answerOptions).toEqual(
        expect.arrayContaining([...scenario.answerOptions]),
      );
    }
  });

  /** @tests 54924 AC 1 Test Case 4 */
  test('54924 AC 1 Test Case 4: Verify accessibility of updated content', async ({
    landingPage,
  }) => {
    for (const scenario of Object.values(landingPageScenarios)) {
      await landingPage.goto(scenario.path);

      await expect(landingPage.pageHeading).toBeVisible();
      await expect(landingPage.pageHeading).toHaveAccessibleName(
        scenario.pageHeading,
      );
      await expect(landingPage.intro).toBeVisible();
      await expect(landingPage.contentBulletList).toBeVisible();
      await expect(landingPage.contentBulletItems).toHaveCount(2);
      await expect(landingPage.startNowButton).toBeVisible();
      await expect(landingPage.startNowButton).toHaveAccessibleName(
        scenario.buttonText,
      );
      await expect(landingPage.pensionsExplainedLink).toHaveAccessibleName(
        scenario.guideLinkText,
      );
    }
  });
});
