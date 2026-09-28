import { type Locator, type Page } from '@playwright/test';

import { HOUSING_SECTION_IDS } from './resultsPage';

export const GP10_CONTENT = {
  TITLE:
    'Consider using the value of your home to boost your retirement income',
  LINKS: {
    DOWNSIZE: {
      TEXT: 'downsizing',
      URL: 'https://www.moneyhelper.org.uk/en/pensions-and-retirement/taking-your-pension/downsizing-in-retirement',
      HREF_FRAGMENT: 'downsizing-in-retirement',
    },
    RIO: {
      TEXT: 'retirement interest-only (RIO) mortgage',
      URL: 'https://www.moneyhelper.org.uk/en/homes/buying-a-home/retirement-interest-only-mortgages',
      HREF_FRAGMENT: 'retirement-interest-only-mortgages',
    },
    EQUITY_RELEASE: {
      TEXT: 'equity release',
      URL: 'https://www.moneyhelper.org.uk/en/homes/buying-a-home/what-is-equity-release',
      HREF_FRAGMENT: 'what-is-equity-release',
    },
    EQUITY_RELEASE_CARE: {
      TEXT: 'use equity release scheme to fund your care',
      URL: 'https://www.moneyhelper.org.uk/en/family-and-care/long-term-care/using-an-equity-release-scheme-to-fund-your-care',
      HREF_FRAGMENT: 'using-an-equity-release-scheme-to-fund-your-care',
    },
  },
};

interface GP10Page {
  getGuidanceSection(page: Page): Locator;
  getLinkByHref(page: Page, hrefFragment: string): Locator;
}

const gp10Page: GP10Page = {
  getGuidanceSection(page: Page) {
    return page.getByTestId(HOUSING_SECTION_IDS.HOUSING_10_SECTION);
  },

  getLinkByHref(page: Page, hrefFragment: string) {
    return gp10Page
      .getGuidanceSection(page)
      .locator(`a[href*="${hrefFragment}"]`);
  },
};

export default gp10Page;
