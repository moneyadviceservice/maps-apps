import { Locator, Page } from '@playwright/test';

import { HOUSING_SECTION_IDS } from './resultsPage';

export const GP11_CONTENT = {
  TITLE:
    'Consider using the value of your home to boost your retirement income',
  CARD_TITLE:
    "Check the mortgage options available after you retire and plan how you'll repay the debt",
  LINKS: {
    DOWNSIZE: {
      TEXT: 'Should I downsize my home to fund my retirement?',
      URL: 'https://www.moneyhelper.org.uk/en/pensions-and-retirement/taking-your-pension/downsizing-in-retirement',
      HREF_FRAGMENT: 'downsizing-in-retirement',
    },
  },
} as const;

interface GP11Page {
  getGuidanceSection(page: Page): Locator;
  getLinkByHref(page: Page, hrefFragment: string): Locator;
}

const gp11Page: GP11Page = {
  getGuidanceSection(page: Page) {
    return page.getByTestId(HOUSING_SECTION_IDS.HOUSING_11_SECTION);
  },

  getLinkByHref(page: Page, hrefFragment: string) {
    return gp11Page
      .getGuidanceSection(page)
      .locator(`a[href*="${hrefFragment}"]`);
  },
};

export default gp11Page;
