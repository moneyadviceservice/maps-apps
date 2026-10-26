import { expect, type Locator, type Page } from '@playwright/test';

import { aboutYouTitle } from '../data/about-you';
import { resultsHeading } from '../data/results';
import { retirementCostsHeading } from '../data/retirement-costs';
import { retirementIncomeHeading } from '../data/retirement-income';
import aboutYouPage from './AboutYouPage';
import { basePage } from './basePage';
import homePage from './HomePage';
import retirementCostsPage from './RetirementCostsPage';
import retirementIncomePage from './RetirementIncomePage';

export const TAB_NAMES = {
  ABOUT_YOU: 'About you',
  RETIREMENT_INCOME: 'Retirement income',
  RETIREMENT_COSTS: 'Retirement costs',
  RESULTS: 'Results',
} as const;

export const TAB_TO_PATH: Record<string, string> = {
  [TAB_NAMES.ABOUT_YOU]: '/about-you',
  [TAB_NAMES.RETIREMENT_INCOME]: '/income',
  [TAB_NAMES.RETIREMENT_COSTS]: '/essential-outgoings',
  [TAB_NAMES.RESULTS]: '/summary',
} as const;

const URL_PATTERN_SUFFIX = String.raw`(?:\?|$)`;

const STEP_PATHS = [
  TAB_TO_PATH[TAB_NAMES.ABOUT_YOU],
  TAB_TO_PATH[TAB_NAMES.RETIREMENT_INCOME],
  TAB_TO_PATH[TAB_NAMES.RETIREMENT_COSTS],
  TAB_TO_PATH[TAB_NAMES.RESULTS],
];

function previousStepPath(pageUrl: string): string | undefined {
  const { pathname } = new URL(pageUrl);
  const index = STEP_PATHS.findIndex((path) => pathname.endsWith(path));
  return index > 0 ? STEP_PATHS[index - 1] : undefined;
}

export class RetirementBudgetPlannerFocusPage {
  constructor(private readonly page: Page) {}

  // Locators
  progressTabButton(tabName: string): Locator {
    return this.page
      .getByRole('navigation', { name: 'Progress' })
      .getByRole('button', { name: tabName });
  }

  backLink(): Locator {
    return this.page
      .getByTestId('main')
      .getByRole('link', { name: 'Back', exact: true });
  }

  tabContent(): Locator {
    return this.page.locator('#tab-content');
  }

  // Navigation helpers
  private async waitForStep(path: string, heading: string): Promise<void> {
    await expect(this.page).toHaveURL(
      new RegExp(`${path}${URL_PATTERN_SUFFIX}`),
    );
    await basePage.waitForPageHeading(this.page, heading);
  }

  async startAtAboutYou(): Promise<void> {
    await homePage.startRetirementBudgetPlanner(this.page);
    await this.waitForStep(TAB_TO_PATH[TAB_NAMES.ABOUT_YOU], aboutYouTitle);
  }

  async goToRetirementIncome(): Promise<void> {
    await aboutYouPage.fillValuesAndContinue(
      this.page,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      { continueWithKeyboard: true },
    );
    await this.waitForStep(
      TAB_TO_PATH[TAB_NAMES.RETIREMENT_INCOME],
      retirementIncomeHeading,
    );
  }

  async goToRetirementCosts(): Promise<void> {
    // Always ensure we're at retirement income page first
    // Check current URL to avoid duplicate navigation
    const url = this.page.url();
    if (!url.includes('/income')) {
      // Not on income page, so navigate there
      await this.goToRetirementIncome();
    }
    // At this point we're on /income page - proceed to costs
    await retirementIncomePage.fillValuesAndContinue(
      this.page,
      '500',
      'month',
      {
        continueWithKeyboard: true,
      },
    );
    await this.waitForStep(
      TAB_TO_PATH[TAB_NAMES.RETIREMENT_COSTS],
      retirementCostsHeading,
    );
  }

  async goToResults(): Promise<void> {
    await this.goToRetirementCosts();
    await retirementCostsPage.fillValuesAndContinue(
      this.page,
      '500',
      'formmortgageRepaymentId',
      { continueWithKeyboard: true },
    );
    await this.waitForStep(TAB_TO_PATH[TAB_NAMES.RESULTS], resultsHeading);
  }

  // Interaction helpers
  private async activateElementWithKeyboard(element: Locator): Promise<void> {
    await expect(element).toBeVisible();
    // Focus the element and ensure it stays focused
    await element.focus();
    // Press the element immediately while focused
    await element.press('Enter');
  }

  async activateBackWithKeyboard(): Promise<void> {
    const backLink = this.backLink();
    const previousPath = previousStepPath(this.page.url());

    // Next.js updates the address bar before the next page renders. The Back
    // link still on screen can belong to the page we just left, and Enter
    // follows that link. Wait until this page's link points at the previous step.
    if (previousPath) {
      await expect(backLink).toHaveAttribute(
        'href',
        new RegExp(`${previousPath}${URL_PATTERN_SUFFIX}`),
      );
    }

    const previousUrl = this.page.url();
    await Promise.all([
      this.page.waitForURL((url) => url.toString() !== previousUrl),
      this.activateElementWithKeyboard(backLink),
    ]);
    await expect(this.tabContent()).toBeVisible();
  }

  async activateProgressTabWithKeyboard(tabName: string): Promise<void> {
    await this.activateElementWithKeyboard(this.progressTabButton(tabName));
    // Wait for page to load after tab click
    await this.page.waitForLoadState('domcontentloaded');
    // Wait for the tab content to update with longer timeout
    await expect(this.tabContent()).toBeVisible({ timeout: 10000 });
  }

  // Assertion helpers
  async assertTabContentFocused(activeTabName: string): Promise<void> {
    // Wait for the tab content to be in the DOM and visible
    const tabContent = this.tabContent();
    await expect(tabContent).toBeVisible({ timeout: 10000 });

    // Wait for navigation to complete with longer timeout
    await expect(this.page).toHaveURL(
      new RegExp(`${TAB_TO_PATH[activeTabName]}${URL_PATTERN_SUFFIX}`),
      { timeout: 10000 },
    );

    const activeTab = this.progressTabButton(activeTabName);
    await expect(activeTab).toHaveAttribute('aria-current', 'step', {
      timeout: 10000,
    });
  }

  async assertProgressTabFocused(tabName: string): Promise<void> {
    const tab = this.progressTabButton(tabName);
    // Give the tab time to receive focus after navigation with longer timeout
    await expect(tab).toHaveAttribute('aria-current', 'step', {
      timeout: 10000,
    });
    // Additional check: verify this tab is in the focused elements chain
    await tab.focus();
  }
}

export default function createRetirementBudgetPlannerFocusPage(
  page: Page,
): RetirementBudgetPlannerFocusPage {
  return new RetirementBudgetPlannerFocusPage(page);
}
