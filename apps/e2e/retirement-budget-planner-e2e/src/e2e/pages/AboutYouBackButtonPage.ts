import { Locator, Page } from '@playwright/test';

import homePage from './HomePage';

type Language = 'en' | 'cy';

interface AboutYouBackButtonPage {
  startNonEmbeddedJourney(page: Page, language: Language): Promise<void>;
  startEmbeddedJourney(page: Page, language: Language): Promise<void>;
  backLink(page: Page): Locator;
  expectedAemLandingUrl(language: Language): string;
  expectedEmbeddedLandingPrefix(language: Language): string;
  backLinkHref(page: Page): Promise<string | null>;
  clickBackAndWaitForAem(page: Page, language: Language): Promise<void>;
  clickBackAndWaitForEmbeddedLanding(
    page: Page,
    language: Language,
  ): Promise<void>;
}

const aboutYouBackButtonPage: AboutYouBackButtonPage = {
  async startNonEmbeddedJourney(page, language) {
    await page.goto(`/${language}/landing`);
    await homePage.handleCookies(page);

    await page.getByTestId('rbp-link-from-heading').click();
    await page.waitForURL((url) => url.pathname === `/${language}/about-you`);
  },

  async startEmbeddedJourney(page, language) {
    await page.goto(`/${language}/landing?isEmbedded=true`);
    await homePage.handleCookies(page);

    await page.getByTestId('rbp-link-from-heading').click();
    await page.waitForURL(
      (url) =>
        url.pathname === `/${language}/about-you` &&
        url.searchParams.get('isEmbedded') === 'true',
    );
  },

  backLink(page) {
    return page.getByTestId('tool-nav-prev');
  },

  expectedAemLandingUrl(language) {
    return `https://www.moneyhelper.org.uk/${language}/pensions-and-retirement/pensions-basics/retirement-budget-planner`;
  },

  expectedEmbeddedLandingPrefix(language) {
    return `/${language}/landing?`;
  },

  async backLinkHref(page) {
    return aboutYouBackButtonPage.backLink(page).getAttribute('href');
  },

  async clickBackAndWaitForAem(page, language) {
    await Promise.all([
      page.waitForURL(aboutYouBackButtonPage.expectedAemLandingUrl(language)),
      aboutYouBackButtonPage.backLink(page).click(),
    ]);
  },

  async clickBackAndWaitForEmbeddedLanding(page, language) {
    await Promise.all([
      page.waitForURL((url) => url.pathname === `/${language}/landing`),
      aboutYouBackButtonPage.backLink(page).click(),
    ]);
  },
};

export default aboutYouBackButtonPage;
