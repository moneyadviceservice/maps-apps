import { Locator, Page } from '@playwright/test';

import { QUESTION_1_ANSWERS } from './question1Page';
import { QUESTION_2_ANSWERS } from './question2Page';
import questionnaireNavigator from './questionnaireNavigator';
import { PRIMARY_GOAL_SECTION_IDS } from './resultsPage';

export const GP24A_SECTION_ID =
  PRIMARY_GOAL_SECTION_IDS.PRIMARY_GOAL_24A_SECTION;

export const GP24A_CONTENT = {
  WELSH: {
    title: "Gwiriwch a ydych chi'n gymwys i gael apwyntiad Pension Wise",
    paragraph1:
      'Mae ein canllaw cam wrth gam yn esbonio Sut i gymryd eich pensiwn.',
    paragraph2:
      "Rydym hefyd yn cynnig apwyntiadau Pension Wise am ddim i esbonio'r opsiynau ar gyfer cymryd pensiwn cyfraniadau wedi’u diffinio y DU. Gallwch gael apwyntiad os ydych chi’n:",
    listItems: [
      "50 oed neu'n hŷn",
      'o dan 50 oed ac:',
      'wedi etifeddu pensiwn rhywun arall',
      'yn ymddeol yn gynnar oherwydd iechyd gwael, neu',
      'mae eich cynllun yn caniatáu i chi gymryd eich pensiwn cyn 55 oed.',
    ],
    paragraph3:
      "Gallwch ddechrau apwyntiad ar-lein unrhyw bryd neu archebu dyddiad ac amser gydag un o'n harbenigwyr pensiwn.",
    links: {
      takePension: {
        text: 'Sut i gymryd eich pensiwn',
        url: 'https://www.moneyhelper.org.uk/cy/pensions-and-retirement/taking-your-pension/how-to-take-your-pension',
      },
      pensionWise: {
        text: 'apwyntiadau Pension Wise am ddim',
        url: 'https://www.moneyhelper.org.uk/cy/pensions-and-retirement/pension-wise',
      },
    },
  },
} as const;

interface GP24aPage {
  navigateToResults(page: Page): Promise<void>;
  getGuidanceSection(page: Page): Locator;
  getLink(page: Page, linkText: string): Locator;
  expand(page: Page): Promise<void>;
  openLinkInNewTab(page: Page, linkText: string): Promise<Page>;
}

const gp24aPage: GP24aPage = {
  async navigateToResults(page) {
    const answers = questionnaireNavigator.buildAnswersQuery({
      q1Answer: QUESTION_1_ANSWERS.WHEN_AND_HOW_I_CAN_TAKE_MY_PENSION,
      q2Answer: QUESTION_2_ANSWERS.ALREADY_RETIRED,
    });

    await page.goto(`/cy/results?${answers}`);
    await gp24aPage.getGuidanceSection(page).waitFor();
    await gp24aPage.expand(page);
  },

  getGuidanceSection(page) {
    return page.getByTestId(GP24A_SECTION_ID);
  },

  getLink(page, linkText) {
    return gp24aPage.getGuidanceSection(page).getByRole('link', {
      name: linkText,
    });
  },

  async expand(page) {
    const section = gp24aPage.getGuidanceSection(page);
    if (!(await section.evaluate((element) => element.hasAttribute('open')))) {
      await section.locator('summary').click();
    }
  },

  async openLinkInNewTab(page, linkText) {
    const popupPromise = page.waitForEvent('popup');
    await gp24aPage.getLink(page, linkText).click();
    return popupPromise;
  },
};

export default gp24aPage;
