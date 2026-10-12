import { Locator, Page } from '@playwright/test';

import { HOUSING_SECTION_IDS } from './resultsPage';

export const GP10A_CONTENT = {
  LIST4:
    'sell all or part of your home to a home reversion plan provider for less than its market value and stay living there as a tenant for an agreed period – with a low amount of rent to pay.',
} as const;

interface GP10aPage {
  getGuidanceSection(page: Page): Locator;
  getLinkByHref(page: Page, hrefFragment: string): Locator;
}

const gp10aPage: GP10aPage = {
  getGuidanceSection(page: Page) {
    return page.getByTestId(HOUSING_SECTION_IDS.HOUSING_10A_SECTION);
  },

  getLinkByHref(page: Page, hrefFragment: string) {
    const section = this.getGuidanceSection(page);
    return section.locator(`a[href*="${hrefFragment}"]`);
  },
};

export { GP10_CONTENT } from './gp10Page';
export default gp10aPage;
