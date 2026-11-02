import { Locator, Page } from '@playwright/test';

import { QUESTION_1_ANSWERS } from './question1Page';
import { QUESTION_2_ANSWERS } from './question2Page';
import { QUESTION_5_ANSWERS } from './question5Page';
import questionnaireNavigator from './questionnaireNavigator';
import resultsPage, { PRIMARY_GOAL_SECTION_IDS } from './resultsPage';

export const GP22_SECTION_ID = PRIMARY_GOAL_SECTION_IDS.PRIMARY_GOAL_22_SECTION;

export const GP22_CY_COPY = {
  title: 'Darganfyddwch pa fathau o bensiwn sydd gennych',
  paragraph1:
    "Os oes gennych bensiynau nad ydych wedi'u cymryd eto, mae'r ffordd maen nhw'n gweithio a'ch opsiynau'n dibynnu ar y math sydd gennych.",
  paragraph2Introduction:
    'Gallwch ddysgu mwy am y gwahanol fathau o bensiynau yn ein canllaw',
  paragraph2GuideTitle: "Mathau o bensiynau a sut maen nhw'n gweithio",
  paragraph2ProviderText:
    "Gall eich darparwr pensiwn hefyd gadarnhau'n union pa fath a nodweddion sydd gennych.",
  paragraph3Introduction:
    'I gael rhagor o gymorth a gwybodaeth am y gwahanol fathau o bensiynau, gweler ein hadran',
  paragraph3GuideTitle: 'esbonio pensiynau',
} as const;

interface GP22Page {
  navigateToAlreadyRetiredNotSureCombination(page: Page): Promise<void>;
  getGuidanceSection(page: Page): Locator;
  getAccordionTitle(page: Page): Locator;
  getAccordionParagraphs(page: Page): Locator;
  expandAccordion(page: Page): Promise<void>;
}

const gp22Page: GP22Page = {
  async navigateToAlreadyRetiredNotSureCombination(page) {
    const answers = questionnaireNavigator.buildAnswersQuery({
      q1Answer: QUESTION_1_ANSWERS.HOW_MY_PENSION_WORKS,
      q2Answer: QUESTION_2_ANSWERS.ALREADY_RETIRED,
      q5Answer: [
        QUESTION_5_ANSWERS.DEFINED_BENEFIT,
        QUESTION_5_ANSWERS.NOT_SURE,
      ],
    });

    await page.goto(`/cy/results?${answers.toString()}`);
    await resultsPage.waitForPage(page, 'cy');
  },

  getGuidanceSection(page) {
    return resultsPage.getGuidanceSection(page, GP22_SECTION_ID);
  },

  getAccordionTitle(page) {
    return gp22Page
      .getGuidanceSection(page)
      .locator('[data-testid="summary-block-title"]');
  },

  getAccordionParagraphs(page) {
    return gp22Page
      .getGuidanceSection(page)
      .locator('p[data-testid="paragraph"]');
  },

  async expandAccordion(page) {
    const section = gp22Page.getGuidanceSection(page);
    const isExpanded = await section.evaluate((element) =>
      element.hasAttribute('open'),
    );

    if (!isExpanded) {
      await section.locator('summary').click();
    }
  },
};

export default gp22Page;
