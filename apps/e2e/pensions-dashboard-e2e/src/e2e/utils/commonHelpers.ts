import { Locator, Page } from '@playwright/test';

import basePage from '../pages/BasePage';
import homePage from '../pages/HomePage';
import loadingPage from '../pages/LoadingPage';
import pensionsFoundPage from '../pages/PensionsFoundPage';
import scenarioSelectionPage from '../pages/ScenarioSelectionPage';
import welcomePage from '../pages/WelcomePage';
import youHaveExitedTheDashboardPage from '../pages/YouHaveExitedTheDashboardPage';

type CSSStyleKeys = {
  [K in keyof CSSStyleDeclaration]: K extends `${string}` ? K : never;
}[keyof CSSStyleDeclaration];

interface CommonHelpers {
  metaRobots: string;
  backToTopLink: string;
  navigateToStartPage(page: Page): Promise<void>;
  navigateToEmulator(page: Page): Promise<void>;
  logoutOfApplication(page: Page): Promise<void>;
  waitAndClickElement(locator: Locator): Promise<void>;
  clickButton(page: Page, text: string): Promise<void>;
  clickLink(page: Page, text: string): Promise<void>;
  assertMetaRobotsTag(page: Page): Promise<void>;
  waitForPageToLoad(page: Page, locator: string): Promise<void>;
  clickAccordion(
    Page: Page,
    accordion: any,
    accordionText: string,
  ): Promise<void>;
  navigatetoPensionsFoundPage(page: Page, dataScenario: string): Promise<void>;
  navigateToLoadingPage(page: Page, dataScenario: string): Promise<void>;
  getStyle(locator: Locator, style: CSSStyleKeys): Promise<unknown>;
}

const commonHelpers: CommonHelpers = {
  metaRobots: 'meta[name="robots"]',
  backToTopLink: 'back-to-top',

  async navigateToStartPage(page: Page): Promise<void> {
    await page.goto('/');
    await page
      .locator(`h1:has-text("MoneyHelper Pensions Dashboard")`)
      .waitFor();
    await homePage.assertCookiesCleared(page);
  },

  async navigateToEmulator(page: Page): Promise<void> {
    await page.goto('/');
    await page
      .locator(`h1:has-text("MoneyHelper Pensions Dashboard")`)
      .waitFor();
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

  async navigatetoPensionsFoundPage(page, dataScenario): Promise<void> {
    await scenarioSelectionPage.selectScenarioComposerDev(page, dataScenario);
    await welcomePage.welcomePageLoads(page);
    await page.waitForTimeout(500);
    await welcomePage.clickWelcomeButton(page);
    await loadingPage.waitForPensionsToLoad(page);
    await pensionsFoundPage.waitForPensionsFound(page);
  },

  async navigateToLoadingPage(page, dataScenario): Promise<void> {
    await scenarioSelectionPage.selectScenarioComposerDev(page, dataScenario);
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
};

export default commonHelpers;
