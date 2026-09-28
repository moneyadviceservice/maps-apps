import { expect, type Page, test } from '@playwright/test';

import gp24bPage, { GP24B_CONTENT } from '../pages/gp24bPage';
import { QUESTION_1_ANSWERS } from '../pages/question1Page';
import { QUESTION_2_ANSWERS } from '../pages/question2Page';
import { QUESTION_5_ANSWERS } from '../pages/question5Page';
import questionnaireNavigator from '../pages/questionnaireNavigator';

const GP24B_ANSWERS = {
  q1Answer: QUESTION_1_ANSWERS.WHEN_AND_HOW_I_CAN_TAKE_MY_PENSION,
  q2Answer: QUESTION_2_ANSWERS.YES,
  q5Answer: [QUESTION_5_ANSWERS.DEFINED_CONTRIBUTION],
} as const;

type Language = 'ENGLISH' | 'WELSH';

type LinkScenario = {
  ac: string;
  language: Language;
  link: { text: string; url: string };
};

const linkScenarios: LinkScenario[] = [
  {
    ac: 'AC2',
    language: 'ENGLISH',
    link: GP24B_CONTENT.ENGLISH.links.takePension,
  },
  {
    ac: 'AC3',
    language: 'ENGLISH',
    link: GP24B_CONTENT.ENGLISH.links.pensionWise,
  },
  {
    ac: 'AC5',
    language: 'WELSH',
    link: GP24B_CONTENT.WELSH.links.takePension,
  },
  {
    ac: 'AC6',
    language: 'WELSH',
    link: GP24B_CONTENT.WELSH.links.pensionWise,
  },
];

const keyboardLinkScenarios: LinkScenario[] = [
  {
    ac: 'AC7',
    language: 'ENGLISH',
    link: GP24B_CONTENT.ENGLISH.links.takePension,
  },
  {
    ac: 'AC8',
    language: 'ENGLISH',
    link: GP24B_CONTENT.ENGLISH.links.pensionWise,
  },
  {
    ac: 'AC9',
    language: 'WELSH',
    link: GP24B_CONTENT.WELSH.links.takePension,
  },
  {
    ac: 'AC10',
    language: 'WELSH',
    link: GP24B_CONTENT.WELSH.links.pensionWise,
  },
];

async function goToGp24bResults(page: Page, language: Language): Promise<void> {
  const answers = questionnaireNavigator.buildAnswersQuery(GP24B_ANSWERS);
  const path = language === 'ENGLISH' ? '/en/results' : '/cy/results';

  await page.goto(`${path}?${answers}`);
  await expect(gp24bPage.getGuidanceSection(page)).toBeVisible();
  await gp24bPage.expand(page);
}

async function expectLinkOpensInNewTab(
  page: Page,
  link: { text: string; url: string },
): Promise<void> {
  const linkLocator = gp24bPage.getLink(page, link.text);

  await expect(linkLocator).toHaveAttribute('href', link.url);
  await expect(linkLocator).toHaveAttribute('target', '_blank');

  const popupPromise = page.waitForEvent('popup');
  await linkLocator.click();
  const popup = await popupPromise;

  await expect(popup).toHaveURL(link.url);
  await popup.close();
}

async function expectKeyboardLinkOpensInNewTab(
  page: Page,
  link: { text: string; url: string },
): Promise<void> {
  const linkLocator = await gp24bPage.focusLinkWithTab(page, link.text);

  await expect(linkLocator).toBeFocused();
  await expect(
    linkLocator.evaluate((element) => element.matches(':focus-visible')),
  ).resolves.toBe(true);

  const popupPromise = page.waitForEvent('popup');
  await page.keyboard.press('Enter');
  const popup = await popupPromise;

  await expect(popup).toHaveURL(link.url);
  await popup.close();
}

test.describe('Retirement Guidance - GP 24B copy and links', () => {
  /**
   * @test 58031 AC 1 Test Case 1 : Verify English GP 24B content is displayed correctly
   * @test 58031 AC 2 Test Case 2  : Validate "How to take your pension" link destination
   * @test 58031 AC 3 Test Case 3  : Validate "free Pension Wise appointments" link destination
   * @test 58031 AC 4 Test Case 4 : Verify Welsh GP 24B content is displayed correctly
   * @test 58031 AC 5 Test Case 5 : Verify "Sut i gymryd eich pensiwn" Welsh link
   * @test 58031 AC 6 Test Case 6 : Verify "apwyntiadau Pension Wise am ddim" Welsh link
   * @test 58031 AC 7 Test Case 7 : Verify keyboard accessibility of GP 24B links
   * @test 58031 AC 8 Test Case 8 : English GP 24B has the correct section ID
   * @test 58031 AC 9 Test Case 9 : Welsh GP 24B has the correct section ID
   * @test 58031 AC 10 Test Case 10 : English GP 24B has the correct links
   */
  test('AC1: English GP 24B displays the expected copy and links', async ({
    page,
  }) => {
    // Given I am on the English GRG results page with a defined-contribution pension.
    await goToGp24bResults(page, 'ENGLISH');
    const section = gp24bPage.getGuidanceSection(page);

    // When GP 24B is displayed.
    // Then the English copy and links match the expected content.
    await expect(section).toContainText(GP24B_CONTENT.ENGLISH.title);
    await expect(section).toContainText(GP24B_CONTENT.ENGLISH.paragraph1);
    await expect(section).toContainText(GP24B_CONTENT.ENGLISH.paragraph2);
    await expect(
      gp24bPage.getLink(page, GP24B_CONTENT.ENGLISH.links.takePension.text),
    ).toBeVisible();
    await expect(
      gp24bPage.getLink(page, GP24B_CONTENT.ENGLISH.links.pensionWise.text),
    ).toBeVisible();
  });

  for (const scenario of linkScenarios) {
    // eslint-disable-next-line playwright/expect-expect
    test(`${scenario.ac}: ${scenario.language} ${scenario.link.text} opens in a new tab`, async ({
      page,
    }) => {
      await goToGp24bResults(page, scenario.language);
      await expectLinkOpensInNewTab(page, scenario.link);
    });
  }

  test('AC4: Welsh GP 24B displays the expected copy and links', async ({
    page,
  }) => {
    await goToGp24bResults(page, 'WELSH');
    const section = gp24bPage.getGuidanceSection(page);

    await expect(section).toContainText(
      GP24B_CONTENT.WELSH.links.takePension.text,
    );
    await expect(section).toContainText(
      GP24B_CONTENT.WELSH.links.pensionWise.text,
    );
  });

  for (const scenario of keyboardLinkScenarios) {
    // eslint-disable-next-line playwright/expect-expect
    test(`${scenario.ac}: ${scenario.language} ${scenario.link.text} is keyboard accessible`, async ({
      page,
    }) => {
      await goToGp24bResults(page, scenario.language);
      await expectKeyboardLinkOpensInNewTab(page, scenario.link);
    });
  }
});
