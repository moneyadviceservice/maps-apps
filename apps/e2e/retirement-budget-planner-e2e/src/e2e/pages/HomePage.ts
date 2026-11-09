import { Page } from '@playwright/test';

import aboutYouPage from './AboutYouPage';
import { basePage } from './basePage';
import landingPage from './LandingPage';

interface WaitParams {
  waitForNetworkSettle?: boolean;
}

interface HomePage {
  /**
   * Opens the Retirement Budget Planner and optionally waits for network activity
   * to settle after the planner is started.
   *
   * @param page - Playwright page instance.
   * @param waitParams - Optional configuration controlling page synchronization.
   * @param waitParams.waitForNetworkSettle - When `true` (default), waits for
   * network requests triggered during startup to complete before resolving.
   *
   * @returns A promise that resolves when the Retirement Budget Planner is ready.
   *
   * @example
   * // Wait for network activity to settle (default behavior)
   * await homePage.startRetirementBudgetPlanner(page);
   *
   * @example
   * // Explicitly wait for network activity to settle
   * await homePage.startRetirementBudgetPlanner(page, {
   *   waitForNetworkSettle: true,
   * });
   *
   * @example
   * // Skip waiting for network activity to settle
   * await homePage.startRetirementBudgetPlanner(page, {
   *   waitForNetworkSettle: false,
   * });
   */
  startRetirementBudgetPlanner(
    page: Page,
    waitParams?: WaitParams,
  ): Promise<void>;
  handleCookies(page: Page): Promise<void>;
  clickWelshLink(page: Page): Promise<void>;
  clickEnglishLink(page: Page): Promise<void>;
}

const homePage: HomePage = {
  async startRetirementBudgetPlanner(
    page: Page,
    waitParams?: WaitParams,
  ): Promise<void> {
    const { waitForNetworkSettle = true } = waitParams ?? {};

    await page.goto('/');

    const networkResponse = waitForNetworkSettle
      ? aboutYouPage.waitForNetworkToSettle(page)
      : undefined;

    await landingPage.waitForPageToBeReady(page);
    await landingPage.clickStartButton(page);
    await networkResponse;
  },

  async handleCookies(page) {
    await page
      .getByRole('button', { name: 'Accept all cookies' })
      .click({ timeout: 10000 })
      .catch(() => {
        console.log('Cookie banner not found');
      });
  },

  async clickWelshLink(page) {
    await switchLanguage(page, 'Cymraeg');
  },

  async clickEnglishLink(page) {
    await switchLanguage(page, 'English');
  },
};

/**
 * Switching language reloads the page. On About you the reload re-fetches the
 * saved partner details, which overwrite anything typed before it returns.
 */
const switchLanguage = async (page: Page, linkName: string) => {
  const reloadsPartnerDetails =
    new URL(page.url()).pathname.endsWith('/about-you') &&
    (await basePage.isJavaScriptEnabled(page));
  const partnerDetailsLoaded = reloadsPartnerDetails
    ? aboutYouPage.waitForNetworkToSettle(page)
    : undefined;

  await page.getByRole('link', { name: linkName }).click();
  await partnerDetailsLoaded;
};

export default homePage;
