import { Locator, Page } from '@playwright/test';
import homePage from '../pages/HomePage';
import basePage from '../pages/BasePage';
import youHaveExitedTheDashboardPage from '../pages/YouHaveExitedTheDashboardPage';

interface CommonHelpers {
  metaRobots: string;
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
}

const commonHelpers: CommonHelpers = {
  metaRobots: 'meta[name="robots"]',

  async navigateToStartPage(page: Page): Promise<void> {
    await page.goto('/');
    await page.getByTestId('start').scrollIntoViewIfNeeded();
    await page
      .locator(`h1:has-text("MoneyHelper Pensions Dashboard")`)
      .waitFor();
    await homePage.assertCookiesCleared(page);
  },

  async navigateToEmulator(page: Page): Promise<void> {
    await page.goto('/');
    await page.getByTestId('start').scrollIntoViewIfNeeded();
    await page
      .locator(`h1:has-text("MoneyHelper Pensions Dashboard")`)
      .waitFor();
    await homePage.assertCookiesCleared(page);
    await homePage.clickStart(page);
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
};

export default commonHelpers;
