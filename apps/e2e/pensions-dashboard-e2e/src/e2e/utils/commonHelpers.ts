import { ENV } from '@env';
import { expect, Locator, Page } from '@maps/playwright';

import basePage from '../pages/BasePage';
import homePage from '../pages/HomePage';
import loadingPage from '../pages/LoadingPage';
import { netlifyPasswordPage } from '../pages/NetlifyPasswordPage';
import pensionsFoundPage from '../pages/PensionsFoundPage';
import scenarioSelectionPage from '../pages/ScenarioSelectionPage';
import welcomePage from '../pages/WelcomePage';
import youHaveExitedTheDashboardPage from '../pages/YouHaveExitedTheDashboardPage';
import {
  clearAllCookies,
  type CookieConsentOptions,
  setCookieConsent,
  setCookieConsentAccepted,
  setCookieConsentWithAnalytics,
} from './cookieConsent';

type CSSStyleKeys = {
  [K in keyof CSSStyleDeclaration]: K extends `${string}` ? K : never;
}[keyof CSSStyleDeclaration];

interface CommonHelpers {
  metaRobots: string;
  backToTopLink: string;
  pageTitle(page: Page): Locator;
  openAllAccordions(page: Page): Promise<void>;
  navigateToStartPage(page: Page): Promise<void>;
  navigateToEmulator(page: Page): Promise<void>;
  logoutOfApplication(page: Page): Promise<void>;
  waitAndClickElement(locator: Locator): Promise<void>;
  clickButton(page: Page, text: string): Promise<void>;
  clickLink(page: Page, text: string): Promise<void>;
  clickBackLink(page: Page): Promise<void>;
  assertMetaRobotsTag(page: Page): Promise<void>;
  waitForPageToLoad(page: Page, locator: string): Promise<void>;
  clickAccordion(
    Page: Page,
    accordion: any,
    accordionText: string,
  ): Promise<void>;
  navigatetoPensionsFoundPage(page: Page, dataScenario: string): Promise<void>;
  navigateToPensionsFoundPageTest(
    page: Page,
    dataScenario: string,
  ): Promise<void>;
  navigateToLoadingPage(page: Page, dataScenario: string): Promise<void>;
  navigateToLoadingPageNonJs(page: Page, dataScenario: string): Promise<void>;

  getStyle(locator: Locator, style: CSSStyleKeys): Promise<unknown>;
  cleanCurrency(currencyString: string): number;
  buildExpectedChartLabel(monthly: string, yearly: string): string;
  clickLinkAndReturnNewPage(page: Page, linkLocator: Locator): Promise<Page>;
  navigateToPensionsFoundPageJSDisabled(
    page: Page,
    dataScenario: string,
  ): Promise<void>;
  setCookieConsent(
    page: Page,
    options?: CookieConsentOptions,
    url?: string,
  ): Promise<void>;
  setCookieConsentWithAnalytics(page: Page, url?: string): Promise<void>;
  setCookieConsentAccepted(page: Page, url?: string): Promise<void>;
  clearAllCookies(page: Page): Promise<void>;
}

const netlifyPassword = ENV.NETLIFY_PASSWORD;
const baseURL = ENV.BASE_URL;

const commonHelpers: CommonHelpers = {
  metaRobots: 'meta[name="robots"]',
  backToTopLink: 'back-to-top',

  async navigateToStartPage(page: Page): Promise<void> {
    // Set cookie consent before navigation to prevent banner interference
    await this.setCookieConsentAccepted(page, baseURL);
    await page.goto(baseURL);

    if (baseURL.includes('netlify.app')) {
      await netlifyPasswordPage.enterPassword(page, netlifyPassword);
      await netlifyPasswordPage.clickSubmit(page);
    }

    await homePage.checkHomePageLoads(page);
    await homePage.assertCookiesCleared(page);
  },

  /**
   * Finds all accordions on the page using the 'summary-block-title' test ID.
   * Only attempts to open accordions that are currently visible and clickable.
   * @param page The Playwright page object.
   */
  async openAllAccordions(page: Page): Promise<void> {
    const accordionTriggers = page.getByTestId('summary-block-title');
    const count = await accordionTriggers.count();
    if (count === 0) {
      return;
    }
    for (let i = 0; i < count; i++) {
      const trigger = accordionTriggers.nth(i);
      if (await trigger.isVisible()) {
        await trigger.click();
        await page.waitForTimeout(50);
      }
    }
  },

  async navigateToEmulator(page: Page): Promise<void> {
    // Set cookie consent before navigation to prevent banner interference
    await this.setCookieConsentAccepted(page, baseURL);
    await page.goto(baseURL);

    if (baseURL.includes('netlify.app')) {
      await netlifyPasswordPage.enterPassword(page, netlifyPassword);
      await netlifyPasswordPage.clickSubmit(page);
    }
    await homePage.checkHomePageLoads(page);
    await homePage.assertCookiesCleared(page);
    await homePage.clickStart(page);
    await page.locator('h1:text-is("CDA Emulator")').waitFor();
  },

  async logoutOfApplication(page: Page): Promise<void> {
    await basePage.clickBurgerIcon(page);
    await basePage.logoutSuccessfully(page);
    await this.waitForPageToLoad(page, youHaveExitedTheDashboardPage.heading);
  },

  async waitAndClickElement(locator: Locator): Promise<void> {
    await locator.waitFor();
    await locator.click();
  },

  async clickButton(page: Page, text: string): Promise<void> {
    const button = page.locator(`button:has-text("${text}"):visible`);
    await this.waitAndClickElement(button);
  },

  async clickLink(page: Page, text: string): Promise<void> {
    const link = page.locator(`a:text-is("${text}"):visible`);
    await this.waitAndClickElement(link);
  },

  async navigateToPensionsFoundPageJSDisabled(
    page: Page,
    dataScenario: string,
  ): Promise<void> {
    await scenarioSelectionPage.selectScenario(page, dataScenario);
    await welcomePage.welcomePageLoads(page);
    await welcomePage.clickWelcomeButton(page);
    await loadingPage.waitForPensionsToLoadJSDisabled(page);
    await pensionsFoundPage.waitForPensionsFound(page);
  },

  async assertMetaRobotsTag(page: Page): Promise<void> {
    const metaRobotsElement = page.locator(this.metaRobots);
    const content = await metaRobotsElement.getAttribute('content');
    if (content !== 'noindex, nofollow') {
      throw new Error(
        `Expected meta robots content to be 'noindex, nofollow' but got '${content}'`,
      );
    }
  },

  async waitForPageToLoad(page, locator): Promise<void> {
    await page.locator(locator).waitFor();
  },

  async clickAccordion(
    Page: Page,
    accordion: any,
    accordionText: string,
  ): Promise<void> {
    await accordion
      .getByTestId('summary-block-title')
      .filter({ hasText: accordionText })
      .click();
  },

  async navigatetoPensionsFoundPage(
    page: Page,
    dataScenario: string,
  ): Promise<void> {
    await scenarioSelectionPage.selectScenarioComposerDev(page, dataScenario);
    await welcomePage.welcomePageLoads(page);
    await page.waitForTimeout(4_000);
    await welcomePage.clickWelcomeButton(page);
    await loadingPage.waitForPensionsToLoad(page);
    await pensionsFoundPage.waitForPensionsFound(page);
  },

  async navigateToPensionsFoundPageTest(
    page: Page,
    dataScenario: string,
  ): Promise<void> {
    await scenarioSelectionPage.selectScenarioComposerTest(page, dataScenario);
    await welcomePage.welcomePageLoads(page);
    await page.waitForTimeout(500);
    await welcomePage.clickWelcomeButton(page);
    await loadingPage.waitForPensionsToLoad(page);
    await pensionsFoundPage.waitForPensionsFound(page);
  },

  async navigateToLoadingPage(page: Page, dataScenario: string): Promise<void> {
    await scenarioSelectionPage.selectScenarioComposerDev(page, dataScenario);
    await welcomePage.welcomePageLoads(page);
    await page.waitForTimeout(500);
    await welcomePage.clickWelcomeButton(page);
  },
  async navigateToLoadingPageNonJs(
    page: Page,
    dataScenario: string,
  ): Promise<void> {
    await scenarioSelectionPage.selectScenarioNonJs(page, dataScenario);
    await welcomePage.welcomePageLoads(page);
    await page.waitForTimeout(500);
    await welcomePage.clickWelcomeButton(page);
  },

  async getStyle(locator: Locator, styleName: CSSStyleKeys) {
    return locator.evaluate(
      (el, style) => getComputedStyle(el)[style],
      styleName,
    );
  },

  cleanCurrency(currencyString: string): number {
    if (!currencyString) return 0;
    const cleanedString = currencyString.replaceAll(/[^0-9.]/g, '');
    return Number.parseFloat(cleanedString);
  },

  buildExpectedChartLabel(monthly: string, yearly: string): string {
    if (!monthly) return 'Unavailable';
    if (!yearly) return 'Unavailable';
    return `${yearly} a year\n${monthly} a month`;
  },

  async clickBackLink(page: Page): Promise<void> {
    const backLink = page.getByTestId('back');
    await backLink.waitFor({ state: 'visible' });

    // This has been disabled as the expect is beind used as a dyanmic wait.
    // eslint-disable-next-line playwright/no-standalone-expect
    await expect(backLink).toBeEnabled();
    const previousUrl = page.url();
    await backLink.click();
    await page.waitForURL((url) => url.toString() !== previousUrl);
  },

  async clickLinkAndReturnNewPage(
    page: Page,
    linkLocator: Locator,
  ): Promise<Page> {
    const pagePromise = page.context().waitForEvent('page');
    await linkLocator.click();
    const newPage = await pagePromise;
    await newPage.waitForLoadState();
    return newPage;
  },

  async setCookieConsent(
    page: Page,
    options?: CookieConsentOptions,
    url?: string,
  ): Promise<void> {
    await setCookieConsent(page, options, url);
  },

  async setCookieConsentWithAnalytics(page: Page, url?: string): Promise<void> {
    await setCookieConsentWithAnalytics(page, url);
  },

  async setCookieConsentAccepted(page: Page, url?: string): Promise<void> {
    await setCookieConsentAccepted(page, url);
  },

  async clearAllCookies(page: Page): Promise<void> {
    await clearAllCookies(page);
  },

  pageTitle(page: Page) {
    return page.locator('h1');
  },
};

export default commonHelpers;
