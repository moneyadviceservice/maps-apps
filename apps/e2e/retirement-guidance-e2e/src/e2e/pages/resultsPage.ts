import { Locator, Page } from '@playwright/test';

const pageHeading = /Your tailored pensions and retirement guidance/i;

export const OVERSEAS_SECTION_IDS = {
  OVERSEAS_8_SECTION: 'overseas-8-section',
  OVERSEAS_8A_SECTION: 'overseas-8a-section',
  OVERSEAS_8B_SECTION: 'overseas-8b-section',
} as const;

export type OverseasGuidanceSectionTestId =
  (typeof OVERSEAS_SECTION_IDS)[keyof typeof OVERSEAS_SECTION_IDS];

export const PRIMARY_GOAL_SECTION_IDS = {
  PRIMARY_GOAL_22_SECTION: 'find-your-pension-type-22-section',
  PRIMARY_GOAL_22A_SECTION: 'primary-goal-22a-section',
  PRIMARY_GOAL_24_SECTION: 'primary-goal-24-section',
  PRIMARY_GOAL_24A_SECTION: 'primary-goal-24a-section',
  PRIMARY_GOAL_24B_SECTION: 'primary-goal-24b-section',
  PRIMARY_GOAL_24C_SECTION: 'primary-goal-24c-section',
  PRIMARY_GOAL_25_SECTION: 'primary-goal-25-section',
  PRIMARY_GOAL_25A_SECTION: 'primary-goal-25a-section',
  PRIMARY_GOAL_25B_SECTION: 'primary-goal-25b-section',
  PRIMARY_GOAL_26_SECTION: 'primary-goal-26-section',
} as const;

export type PrimaryGoalGuidanceSectionTestId =
  (typeof PRIMARY_GOAL_SECTION_IDS)[keyof typeof PRIMARY_GOAL_SECTION_IDS];

export const EMPLOYMENT_SECTION_IDS = {
  EMPLOYMENT_02_SECTION: 'employment-02-section',
  EMPLOYMENT_02A_SECTION: 'employment-02a-section',
  EMPLOYMENT_02B_SECTION: 'employment-02b-section',
  EMPLOYMENT_03_SECTION: 'employment-03-section',
  EMPLOYMENT_04_SECTION: 'employment-04-section',
  EMPLOYMENT_05_SECTION: 'employment-05-section',
  EMPLOYMENT_06_SECTION: 'employment-06-section',
  EMPLOYMENT_07_SECTION: 'employment-07-section',
} as const;

export type EmploymentGuidanceSectionTestId =
  (typeof EMPLOYMENT_SECTION_IDS)[keyof typeof EMPLOYMENT_SECTION_IDS];

export const HOUSING_SECTION_IDS = {
  HOUSING_09_SECTION: 'housing-09-section',
  HOUSING_09A_SECTION: 'housing-09a-section',
  HOUSING_10_SECTION: 'housing-10-section',
  HOUSING_10A_SECTION: 'housing-10a-section',
  HOUSING_11_SECTION: 'housing-11-section',
  HOUSING_12_SECTION: 'housing-12-section',
  HOUSING_12A_SECTION: 'housing-12a-section',
  HOUSING_13_SECTION: 'housing-13-section',
  HOUSING_14_SECTION: 'housing-14-section',
  HOUSING_14A_SECTION: 'housing-14a-section',
  HOUSING_14B_SECTION: 'housing-14b-section',
  HOUSING_15_SECTION: 'housing-15-section',
  HOUSING_15A_SECTION: 'housing-15a-section',
  HOUSING_16_SECTION: 'housing-16-section',
  HOUSING_16A_SECTION: 'housing-16a-section',
  HOUSING_16B_SECTION: 'housing-16b-section',
} as const;

export type HousingGuidanceSectionTestId =
  (typeof HOUSING_SECTION_IDS)[keyof typeof HOUSING_SECTION_IDS];

export const SOCIAL_HOUSING_SWAP_TEXT =
  "You can also ask to swap your home if it no longer meets your needs, perhaps because it's too large or does not meet your accessibility needs in retirement. See your rights if you rent from the council or housing association.";

export const HOUSING_TAX_FREE_LUMP_SUM_HEADING =
  'Taking a tax-free lump sum from your pension can reduce your future income';

export const HOUSING_IT_MIGHT_ALSO_AFFECT_BENEFITS =
  "it might also affect the benefits you're entitled to";

export const SOCIAL_HOUSING_LINK_URL =
  'https://www.moneyhelper.org.uk/en/homes/renting/your-legal-and-financial-responsibilities-when-renting#Your-rights-if-you-rent-from-the-council-or-housing-association';

interface ResultsPage {
  waitForPage(page: Page): Promise<void>;
  getPageHeading(page: Page): Locator;
  getChangeAnswersButton(page: Page): Locator;
  getCopyLinkButton(page: Page): Locator;
  getGuidanceSection(page: Page, sectionTestId: string): Locator;
  getSectionLastParagraph(page: Page, sectionTestId: string): Locator;
  getSectionLinkByHref(
    page: Page,
    sectionTestId: string,
    hrefFragment: string,
  ): Locator;
  getSectionHeading(page: Page, headingText: string): Locator;
  getCardByTitle(page: Page, cardTitle: string): Locator;
  getAllCards(page: Page): Locator;
  getCardLink(page: Page, cardTitle: string): Locator;
  clickContinueButton(page: Page): Promise<void>;
  clickCopyLinkButton(page: Page): Promise<void>;
}

const opensInNewWindowAccessibleNameSuffix = ' (opens in a new window)';

const resultsPage: ResultsPage = {
  async waitForPage(page: Page) {
    await page.getByRole('heading', { name: pageHeading }).waitFor();
  },

  getPageHeading(page: Page) {
    return page.getByRole('heading', { name: pageHeading });
  },

  getChangeAnswersButton(page: Page) {
    return page.getByTestId('change-answers-link');
  },

  getCopyLinkButton(page: Page) {
    return page.getByTestId('copy-url-button');
  },

  getGuidanceSection(page: Page, sectionTestId: string) {
    return page.getByTestId(sectionTestId);
  },

  getSectionLastParagraph(page: Page, sectionTestId: string) {
    return page.getByTestId(sectionTestId).locator('p').last();
  },

  getSectionLinkByHref(
    page: Page,
    sectionTestId: string,
    hrefFragment: string,
  ) {
    return page
      .getByTestId(sectionTestId)
      .locator(`a[href*="${hrefFragment}"]`);
  },

  getSectionHeading(page: Page, headingText: string) {
    return page.getByRole('heading', { name: headingText });
  },

  getCardByTitle(page: Page, cardTitle: string) {
    return page.getByRole('heading', { name: cardTitle }).locator('..');
  },

  getAllCards(page: Page) {
    return page.locator('[data-testid="results-card"]');
  },

  getCardLink(page: Page, cardTitle: string) {
    return page.getByTestId('teaserCard').getByRole('link', {
      name: `${cardTitle}${opensInNewWindowAccessibleNameSuffix}`,
    });
  },

  clickContinueButton(page: Page) {
    return page.getByTestId('next-page-button').click();
  },

  clickCopyLinkButton(page: Page) {
    return page.getByTestId('copy-url-button').click();
  },
};

export default resultsPage;
