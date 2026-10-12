import { Locator, Page } from '@playwright/test';

import { PRIMARY_GOAL_SECTION_IDS } from './resultsPage';

export const GP24B_SECTION_ID =
  PRIMARY_GOAL_SECTION_IDS.PRIMARY_GOAL_24B_SECTION;

export const GP24B_CONTENT = {
  ENGLISH: {
    title: 'Check if you’re eligible for a Pension Wise appointment',
    paragraph1: 'Our step-by-step guide explains How to take your pension.',
    paragraph2:
      'We also offer free Pension Wise appointments to explain the options for taking a UK-based defined contribution pension.',
    links: {
      takePension: {
        text: 'How to take your pension',
        url: 'https://www.moneyhelper.org.uk/en/pensions-and-retirement/taking-your-pension/how-to-take-your-pension',
      },
      pensionWise: {
        text: 'free Pension Wise appointments',
        url: 'https://www.moneyhelper.org.uk/en/pensions-and-retirement/pension-wise',
      },
    },
  },
  WELSH: {
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

const MAX_TAB_PRESSES = 100;

interface GP24bPage {
  getGuidanceSection(page: Page): Locator;
  getLink(page: Page, linkText: string): Locator;
  expand(page: Page): Promise<void>;
  focusLinkWithTab(page: Page, linkText: string): Promise<Locator>;
}

const gp24bPage: GP24bPage = {
  getGuidanceSection(page) {
    return page.getByTestId(GP24B_SECTION_ID);
  },

  getLink(page, linkText) {
    return gp24bPage.getGuidanceSection(page).getByRole('link', {
      name: linkText,
    });
  },

  async expand(page) {
    const section = gp24bPage.getGuidanceSection(page);
    if (!(await section.evaluate((element) => element.hasAttribute('open')))) {
      await section.locator('summary').click();
    }
  },

  async focusLinkWithTab(page, linkText) {
    const link = gp24bPage.getLink(page, linkText);
    await page.locator('body').focus();

    for (let index = 0; index < MAX_TAB_PRESSES; index++) {
      await page.keyboard.press('Tab');
      if (
        await link.evaluate((element) => element === document.activeElement)
      ) {
        break;
      }
    }

    return link;
  },
};

export default gp24bPage;
