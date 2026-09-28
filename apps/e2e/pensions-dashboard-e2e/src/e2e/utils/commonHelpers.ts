import { ENV } from '@env';
import { expect, Locator, Page } from '@maps/playwright';

import BasePage from '../pages/BasePage';
import HomePage from '../pages/HomePage';
import LoadingPage from '../pages/LoadingPage';
import NetlifyPasswordPage from '../pages/NetlifyPasswordPage';
import PensionsFoundPage from '../pages/PensionsFoundPage';
import ScenarioSelectionPage from '../pages/ScenarioSelectionPage';
import WelcomePage from '../pages/WelcomePage';
import { Locale, LocaleMap } from '../types/common.types';
import CookieConsent, { type CookieConsentOptions } from './cookieConsent';

type CSSStyleKeys = {
  [K in keyof CSSStyleDeclaration]: K extends `${string}` ? K : never;
}[keyof CSSStyleDeclaration];

const netlifyPassword = ENV.NETLIFY_PASSWORD;
const baseURL = ENV.BASE_URL;

class CommonHelpers {
  private readonly homePage: HomePage;
  private readonly loadingPage: LoadingPage;
  private readonly netlifyPasswordPage: NetlifyPasswordPage;
  private readonly pensionsFoundPage: PensionsFoundPage;
  private readonly scenarioSelectionPage: ScenarioSelectionPage;
  private readonly welcomePage: WelcomePage;

  readonly metaRobots = 'meta[name="robots"]';
  readonly backToTopLink = 'back-to-top';

  constructor(
    private readonly page: Page,
    private readonly cookieConsent: CookieConsent,
  ) {
    this.homePage = new HomePage(page);
    this.loadingPage = new LoadingPage(page);
    this.netlifyPasswordPage = new NetlifyPasswordPage(page);
    this.pensionsFoundPage = new PensionsFoundPage(page);
    this.scenarioSelectionPage = new ScenarioSelectionPage(page);
    this.welcomePage = new WelcomePage(page);
  }

  async navigateToStartPage(): Promise<void> {
    // Set cookie consent before navigation to prevent banner interference
    await this.setCookieConsentAccepted(baseURL);
    await this.page.goto(baseURL);

    const passwordField = this.netlifyPasswordPage.passwordField();

    if (await passwordField.isVisible().catch(() => false)) {
      await this.netlifyPasswordPage.enterPassword(netlifyPassword);
      await this.netlifyPasswordPage.clickSubmit();
    }

    await this.homePage.checkHomePageLoads();
    await this.homePage.assertCookiesCleared();
  }

  async navigateToStartPageWithoutCookieConsent(): Promise<void> {
    await this.page.goto(baseURL);

    const passwordField = this.netlifyPasswordPage.passwordField();
    if (await passwordField.isVisible().catch(() => false)) {
      await this.netlifyPasswordPage.enterPassword(netlifyPassword);
      await this.netlifyPasswordPage.clickSubmit();
    }

    await this.homePage.checkHomePageLoads();
  }

  /**
   * Finds all accordions on the page using the 'summary-block-title' test ID.
   * Only attempts to open accordions that are currently visible and clickable.
   */
  async openAllAccordions(): Promise<void> {
    const accordionTriggers = this.page.getByTestId('summary-block-title');
    const count = await accordionTriggers.count();
    if (count === 0) {
      return;
    }
    for (let i = 0; i < count; i++) {
      const trigger = accordionTriggers.nth(i);
      if (await trigger.isVisible()) {
        await trigger.click();
        await this.page.waitForTimeout(50);
      }
    }
  }

  async navigateToEmulator(locale: Locale = 'en'): Promise<void> {
    // Set cookie consent before navigation to prevent banner interference
    await this.setCookieConsentAccepted(baseURL);
    await this.page.goto(baseURL);

    const passwordField = this.netlifyPasswordPage.passwordField();

    if (await passwordField.isVisible().catch(() => false)) {
      await this.netlifyPasswordPage.enterPassword(netlifyPassword);
      await this.netlifyPasswordPage.clickSubmit();
    }

    if (locale === 'cy') {
      const welshUrl = this.page.url().replace(/\/(en)(\/|$)/, '/cy$2');
      await this.page.goto(welshUrl);
    }

    await this.homePage.checkHomePageLoads(locale);
    await this.homePage.assertCookiesCleared();
    await this.homePage.clickStart(locale);

    await this.page.locator('h1:text-is("CDA Emulator")').waitFor();
  }

  async logoutOfApplication(locale: Locale = 'en'): Promise<void> {
    const basePage = new BasePage(this.page, this.cookieConsent);
    const headingMap: LocaleMap = {
      cy: 'h1:text-is("Rydych chi wedi gadael y Dangosfwrdd Pensiynau")',
      en: 'h1:text-is("You’ve exited the Pensions Dashboard")',
    };
    await basePage.clickBurgerIcon();
    await basePage.logoutSuccessfully(locale);
    await this.waitForPageToLoad(headingMap[locale]);
  }

  async waitAndClickElement(locator: Locator): Promise<void> {
    await locator.waitFor();
    await locator.click();
  }

  async clickButton(text: string): Promise<void> {
    const button = this.page.locator(`button:has-text("${text}"):visible`);
    await this.waitAndClickElement(button);
  }

  async clickLink(text: string): Promise<void> {
    const link = this.page.locator(`a:text-is("${text}"):visible`);
    await this.waitAndClickElement(link);
  }

  async navigateToPensionsFoundPageJSDisabled(
    dataScenario: string,
  ): Promise<void> {
    await this.scenarioSelectionPage.selectScenario(dataScenario);
    await this.welcomePage.welcomePageLoads();
    await this.welcomePage.clickWelcomeButton();
    await this.loadingPage.waitForPensionsToLoadJSDisabled();
    await this.pensionsFoundPage.waitForPensionsFound();
  }

  async assertMetaRobotsTag(): Promise<void> {
    const metaRobotsElement = this.page.locator(this.metaRobots);
    const content = await metaRobotsElement.getAttribute('content');
    if (content !== 'noindex, nofollow') {
      throw new Error(
        `Expected meta robots content to be 'noindex, nofollow' but got '${content}'`,
      );
    }
  }

  async waitForPageToLoad(locator: string): Promise<void> {
    await this.page.locator(locator).waitFor();
  }

  async clickAccordion(accordion: any, accordionText: string): Promise<void> {
    await accordion
      .getByTestId('summary-block-title')
      .filter({ hasText: accordionText })
      .click();
  }

  async navigatetoPensionsFoundPage(
    dataScenario: string,
    commonHelpers: CommonHelpers,
  ): Promise<void> {
    await this.scenarioSelectionPage.selectScenarioComposerDev(dataScenario);
    await this.welcomePage.welcomePageLoads();
    await this.page.waitForTimeout(4_000);
    await this.welcomePage.clickWelcomeButton();
    await this.loadingPage.waitForPensionsToLoad(commonHelpers, 'en');
    await this.pensionsFoundPage.waitForPensionsFound();
  }

  async navigateToPensionsFoundPageTest(
    dataScenario: string,
    commonHelpers: CommonHelpers,
  ): Promise<void> {
    await this.scenarioSelectionPage.selectScenarioComposerTest(dataScenario);
    await this.welcomePage.welcomePageLoads();
    await this.page.waitForTimeout(500);
    await this.welcomePage.clickWelcomeButton();
    await this.loadingPage.waitForPensionsToLoad(commonHelpers, 'en');
    await this.pensionsFoundPage.waitForPensionsFound();
  }

  async navigateToLoadingPage(dataScenario: string): Promise<void> {
    await this.scenarioSelectionPage.selectScenarioComposerDev(dataScenario);
    await this.welcomePage.welcomePageLoads();
    await this.page.waitForTimeout(500);
    await this.welcomePage.clickWelcomeButton();
  }

  async navigateToLoadingPageNonJs(dataScenario: string): Promise<void> {
    await this.scenarioSelectionPage.selectScenarioNonJs(dataScenario);
    await this.welcomePage.welcomePageLoads();
    await this.page.waitForTimeout(500);
    await this.welcomePage.clickWelcomeButton();
  }

  async getStyle(locator: Locator, styleName: CSSStyleKeys) {
    return locator.evaluate(
      (el, style) => getComputedStyle(el)[style],
      styleName,
    );
  }

  cleanCurrency(currencyString: string): number {
    if (!currencyString) return 0;
    const cleanedString = currencyString.replaceAll(/[^0-9.]/g, '');
    return Number.parseFloat(cleanedString);
  }

  buildExpectedChartLabel(monthly: string, yearly: string): string {
    if (!monthly) return 'Unavailable';
    if (!yearly) return 'Unavailable';
    return `${yearly} a year\n${monthly} a month`;
  }

  async clickBackLink(): Promise<void> {
    const backLink = this.page.getByTestId('back');
    await backLink.waitFor({ state: 'visible' });

    // This has been disabled as the expect is beind used as a dyanmic wait.
    // eslint-disable-next-line playwright/no-standalone-expect
    await expect(backLink).toBeEnabled();
    const previousUrl = this.page.url();
    await backLink.click();
    await this.page.waitForURL((url) => url.toString() !== previousUrl);
  }

  async clickHomeLink(): Promise<void> {
    const homeLink = this.page.getByTestId('home-link');
    await homeLink.waitFor({ state: 'visible' });

    // This has been disabled as the expect is beind used as a dyanmic wait.
    // eslint-disable-next-line playwright/no-standalone-expect
    await expect(homeLink).toBeEnabled();
    const previousUrl = this.page.url();
    await homeLink.click();
    await this.page.waitForURL((url) => url.toString() !== previousUrl);
  }

  async clickLinkAndReturnNewPage(linkLocator: Locator): Promise<Page> {
    const pagePromise = this.page.context().waitForEvent('page');
    await linkLocator.click();
    const newPage = await pagePromise;
    await newPage.waitForLoadState();
    return newPage;
  }

  async setCookieConsent(
    options?: CookieConsentOptions,
    url?: string,
  ): Promise<void> {
    await this.cookieConsent.setCookieConsent(options, url);
  }

  async setCookieConsentWithAnalytics(url?: string): Promise<void> {
    await this.cookieConsent.setCookieConsentWithAnalytics(url);
  }

  async setCookieConsentAccepted(url?: string): Promise<void> {
    await this.cookieConsent.setCookieConsentAccepted(url);
  }

  async clearAllCookies(): Promise<void> {
    await this.cookieConsent.clearAllCookies();
  }

  pageTitle(page: Page = this.page) {
    return page.locator('h1');
  }

  /**
   * Normally we would not accept a explicit timeout as it's bad practice.
   * If the tooltip is clicked to quickly, the tooltip occassionally doesn't load.
   * This is a matter of milliseconds, something that would not impact the end user.
   */
  async clickTooltip(parentTestId?: string): Promise<void> {
    if (parentTestId) {
      const scopedTooltip = this.page
        .getByTestId(parentTestId)
        .getByTestId('tooltip-icon')
        .first();
      await scopedTooltip.waitFor({ state: 'visible' });
      // eslint-disable-next-line playwright/no-wait-for-timeout
      await this.page.waitForTimeout(300);
      await scopedTooltip.click();
    } else {
      const globalTooltip = this.page.getByTestId('tooltip-icon').first();
      await globalTooltip.waitFor({ state: 'visible' });
      // eslint-disable-next-line playwright/no-wait-for-timeout
      await this.page.waitForTimeout(300);
      await globalTooltip.click();
    }
  }

  /**
   * Switches the Pensions Dashboard to the target language if not already active.
   * @param targetLang 'en' for English, 'cy' for Cymraeg
   */
  async switchLanguage(locale: Locale): Promise<void> {
    const switcherContainer = this.page.getByTestId('language-switcher');
    const languageLink = switcherContainer.locator(`a[hreflang="${locale}"]`);

    if (await languageLink.isVisible()) {
      await languageLink.click();
      await this.page.waitForURL(`**/${locale}/**`, { waitUntil: 'load' });
    } else {
      console.log(`Language "${locale}" is already active.`);
    }
  }
}

export default CommonHelpers;
