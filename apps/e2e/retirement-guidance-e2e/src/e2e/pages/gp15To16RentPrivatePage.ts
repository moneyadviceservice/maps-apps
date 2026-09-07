import { Locator, Page } from '@playwright/test';

import resultsPage, { HOUSING_SECTION_IDS } from './resultsPage';

const RENT_GUIDANCE_TITLE =
  "Plan how you'll pay your rent after you retire, including future rent rises";

export const GP15_TO_16_RENT_PRIVATE_CONTENT = {
  TITLE: RENT_GUIDANCE_TITLE,
  LINKS: {
    RENT_AFFORDABILITY: {
      HREF_FRAGMENT: 'how-much-rent-can-you-afford',
      URL: 'https://www.moneyhelper.org.uk/en/homes/renting/how-much-rent-can-you-afford',
    },
    MARKET_RENT_DETERMINATION: {
      HREF_FRAGMENT: 'apply-for-an-open-market-rent-determination',
      URL: 'https://www.gov.uk/guidance/apply-for-an-open-market-rent-determination',
    },
  },
  TEXT: {
    GP15_DOWNSIZE:
      'If you cannot afford a rented home that meets your needs, consider downsizing or moving to a cheaper area.',
    GP15A_RENT_INCREASE_NOTICE:
      "Your landlord can usually only increase your rent once a year and you must be given at least 2 months' notice.",
    GP16A_TAX_FREE_LUMP_SUM:
      'Taking a tax-free lump sum from your pension can reduce your future income',
    GP16A_AFFORDABILITY:
      "If you're planning on moving to a new rented home after retirement, be aware that you'll usually still need to pass affordability checks.",
    GP16B_DOWNSIZE:
      "If you're worried you won't be able to afford a rented home that meets your needs, consider downsizing or moving to a cheaper area.",
    GP16B_RENT_INCREASE:
      'If you stay in a private rented home, be aware that your landlord can usually only increase your rent once a year',
    SOCIAL_HOUSING_CRITERIA:
      'The eligibility criteria depend on where you live',
  },
} as const;

export const GP15_TO_16_RENT_PRIVATE_SECTION_IDS = {
  GP15: HOUSING_SECTION_IDS.HOUSING_15_SECTION,
  GP15A: HOUSING_SECTION_IDS.HOUSING_15A_SECTION,
  GP16A: HOUSING_SECTION_IDS.HOUSING_16A_SECTION,
  GP16B: HOUSING_SECTION_IDS.HOUSING_16B_SECTION,
} as const;

export type GP15To16RentPrivateSectionId =
  (typeof GP15_TO_16_RENT_PRIVATE_SECTION_IDS)[keyof typeof GP15_TO_16_RENT_PRIVATE_SECTION_IDS];

const ALL_GP15_TO_16_RENT_PRIVATE_SECTIONS: GP15To16RentPrivateSectionId[] = [
  GP15_TO_16_RENT_PRIVATE_SECTION_IDS.GP15,
  GP15_TO_16_RENT_PRIVATE_SECTION_IDS.GP15A,
  GP15_TO_16_RENT_PRIVATE_SECTION_IDS.GP16A,
  GP15_TO_16_RENT_PRIVATE_SECTION_IDS.GP16B,
];

interface GP15To16RentPrivatePage {
  getSection(page: Page, sectionId: GP15To16RentPrivateSectionId): Locator;
  getLinkByHref(
    page: Page,
    sectionId: GP15To16RentPrivateSectionId,
    hrefFragment: string,
  ): Locator;
  assertOnlyExpectedSection(
    page: Page,
    expectedSectionId: GP15To16RentPrivateSectionId,
  ): Promise<void>;
}

const gp15To16RentPrivatePage: GP15To16RentPrivatePage = {
  getSection(page: Page, sectionId: GP15To16RentPrivateSectionId) {
    return resultsPage.getGuidanceSection(page, sectionId);
  },

  getLinkByHref(
    page: Page,
    sectionId: GP15To16RentPrivateSectionId,
    hrefFragment: string,
  ) {
    return resultsPage.getSectionLinkByHref(page, sectionId, hrefFragment);
  },

  async assertOnlyExpectedSection(
    page: Page,
    expectedSectionId: GP15To16RentPrivateSectionId,
  ) {
    for (const sectionId of ALL_GP15_TO_16_RENT_PRIVATE_SECTIONS) {
      const section = this.getSection(page, sectionId);
      if (sectionId === expectedSectionId) {
        await section.waitFor({ state: 'attached' });
      } else {
        await section.waitFor({ state: 'detached' });
      }
    }
  },
};

export default gp15To16RentPrivatePage;
