import { expect, type Locator, type Page } from '@playwright/test';

import aboutYouPage from './AboutYouPage';
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

export class RetirementBudgetPlannerFocusPage {
  constructor(private readonly page: Page) {}

  // Locators
  progressTabButton(tabName: string): Locator {
    return this.page
      .getByRole('navigation', { name: 'Progress' })
      .getByRole('button', { name: tabName });
  }

  backLink(): Locator {
    return this.page.getByTestId('main').getByRole('link', { name: 'Back' });
  }

  tabContent(): Locator {
    return this.page.locator('#tab-content');
  }

  // Navigation helpers
  async startAtAboutYou(): Promise<void> {
    await homePage.startRetirementBudgetPlanner(this.page);
    await expect(this.page).toHaveURL(
      new RegExp(`/about-you${URL_PATTERN_SUFFIX}`),
    );
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
    await expect(this.page).toHaveURL(
      new RegExp(`/income${URL_PATTERN_SUFFIX}`),
    );
  }

  async goToRetirementCosts(): Promise<void> {
    await this.goToRetirementIncome();
    await retirementIncomePage.fillValuesAndContinue(
      this.page,
      '500',
      'month',
      {
        continueWithKeyboard: true,
      },
    );
    await expect(this.page).toHaveURL(
      new RegExp(`/essential-outgoings${URL_PATTERN_SUFFIX}`),
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
    await expect(this.page).toHaveURL(
      new RegExp(`/summary${URL_PATTERN_SUFFIX}`),
    );
  }

  // Interaction helpers
  private async activateElementWithKeyboard(element: Locator): Promise<void> {
    await expect(element).toBeVisible();
    await element.focus();
    await expect(element).toBeFocused();
    await element.press('Enter');
  }

  async activateBackWithKeyboard(): Promise<void> {
    await this.activateElementWithKeyboard(this.backLink());
  }

  async activateProgressTabWithKeyboard(tabName: string): Promise<void> {
    await this.activateElementWithKeyboard(this.progressTabButton(tabName));
  }

  // Assertion helpers
  async assertTabContentFocused(activeTabName: string): Promise<void> {
    await expect(this.page).toHaveURL(
      new RegExp(`${TAB_TO_PATH[activeTabName]}${URL_PATTERN_SUFFIX}`),
    );

    const activeTab = this.progressTabButton(activeTabName);
    await expect(activeTab).toHaveAttribute('aria-current', 'step');

    const tabContent = this.tabContent();
    await expect(tabContent).toBeVisible();
    await expect(tabContent).toBeFocused();
  }

  async assertProgressTabFocused(tabName: string): Promise<void> {
    const tab = this.progressTabButton(tabName);
    await expect(tab).toBeFocused();
    await expect(tab).toHaveAttribute('aria-current', 'step');
  }
}

export default function createRetirementBudgetPlannerFocusPage(
  page: Page,
): RetirementBudgetPlannerFocusPage {
  return new RetirementBudgetPlannerFocusPage(page);
}
