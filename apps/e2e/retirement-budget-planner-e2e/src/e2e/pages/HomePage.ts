import { Page } from '@playwright/test';

import aboutYouPage from './AboutYouPage';
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
    await page.getByRole('link', { name: 'Cymraeg' }).click();
  },

  async clickEnglishLink(page) {
    await page.getByRole('link', { name: 'English' }).click();
  },
};

export default homePage;
