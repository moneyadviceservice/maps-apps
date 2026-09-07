import { expect, Page } from '@playwright/test';

import { retirementIncomeHeading } from '../../data/retirement-income';
import { pageHeading, summaryTotal } from '../../data/your-results';
import aboutYouPage from '../AboutYouPage';
import { basePage } from '../basePage';
import landingPage from '../LandingPage';
import resultsPage from '../ResultsPage';
import retirementCostsPage from '../RetirementCostsPage';

const DEFAULT_ABOUT_YOU = {
  dobDay: '1',
  dobMonth: '1',
  dobYear: '1980',
  retirementAge: '68',
  sex: 'female',
} as const;

const DEFAULT_MORTGAGE_TEST_ID = 'formmortgageRepaymentId';
const DEFAULT_MINIMUM_COST = '1';

export class HomePageObject {
  constructor(private readonly page: Page) {}

  async startRetirementBudgetPlanner(
    waitForNetworkSettle = true,
  ): Promise<void> {
    await this.page.goto('/');

    const networkResponse = waitForNetworkSettle
      ? aboutYouPage.waitForNetworkToSettle(this.page)
      : undefined;

    await landingPage.waitForPageToBeReady(this.page);
    await landingPage.clickStartButton(this.page);

    await networkResponse;
  }
}

export class AboutYouPageObject {
  constructor(private readonly page: Page) {}

  async fillDefaultsAndContinue(): Promise<void> {
    await aboutYouPage.fillValuesAndContinue(
      this.page,
      DEFAULT_ABOUT_YOU.dobDay,
      DEFAULT_ABOUT_YOU.dobMonth,
      DEFAULT_ABOUT_YOU.dobYear,
      DEFAULT_ABOUT_YOU.retirementAge,
      DEFAULT_ABOUT_YOU.sex,
    );
  }
}

export class RetirementIncomePageObject {
  constructor(private readonly page: Page) {}

  async fillAnnualStatePensionAndContinue(annualIncome: number): Promise<void> {
    await basePage.waitForPageHeading(this.page, retirementIncomeHeading);
    await this.page.waitForLoadState('load');

    const statePensionInput = this.page.getByTestId('formstatePensionId');
    await statePensionInput.click();
    await statePensionInput.press('Control+a');
    await statePensionInput.fill(annualIncome.toString());

    await expect
      .poll(async () => {
        const currentValue = await statePensionInput.inputValue();
        return Number(currentValue.replace(/[^\d]/g, ''));
      })
      .toBe(annualIncome);

    const statePensionFrequency = this.page.locator(
      'select[name="formstatePensionFrequency"]',
    );
    await statePensionFrequency.selectOption(
      summaryTotal.frequencySelect.yearlyValue,
    );
    await expect(statePensionFrequency).toHaveValue(
      summaryTotal.frequencySelect.yearlyValue,
    );

    await basePage.continueButton(this.page).click();
  }
}

export class RetirementCostsPageObject {
  constructor(private readonly page: Page) {}

  async fillMinimumCostAndContinue(
    minimumCost = DEFAULT_MINIMUM_COST,
    mortgageTestId = DEFAULT_MORTGAGE_TEST_ID,
  ): Promise<void> {
    await retirementCostsPage.fillValuesAndContinue(
      this.page,
      minimumCost,
      mortgageTestId,
    );
  }
}

export class ResultsPageObject {
  constructor(private readonly page: Page) {}

  async waitForPage(): Promise<void> {
    await basePage.waitForPageHeading(this.page, pageHeading);
  }

  async selectAnnualSummary(): Promise<void> {
    const frequencySelect = resultsPage.summaryTotal.frequencySelect(this.page);
    await frequencySelect.selectOption(
      summaryTotal.frequencySelect.yearlyValue,
    );
    // Verify the selection was applied and wait for the UI to update
    await expect(frequencySelect).toHaveValue(
      summaryTotal.frequencySelect.yearlyValue,
    );
    // Wait for the value display to update after frequency change
    await this.page.waitForLoadState('domcontentloaded');
  }

  async getAnnualIncomeAfterTax(): Promise<number> {
    const incomeValueLocator = resultsPage.summaryTotal.value(this.page, {
      valueType: 'income',
    });
    // Poll to ensure we get a stable value that's been updated after frequency selection
    let annualIncomeAfterTaxText = '';
    await expect
      .poll(
        async () => {
          const text = await incomeValueLocator.innerText();
          const numValue = Number(text.replace(/[^\d.-]/g, ''));
          // Guard: if value seems implausibly large (>200k for annual income after tax),
          // it may not have updated yet; throw to retry
          if (numValue > 200_000) {
            throw new Error(
              `Income value seems incorrect (${numValue}), retrying...`,
            );
          }
          annualIncomeAfterTaxText = text;
          return numValue;
        },
        { timeout: 5000 },
      )
      .toBeGreaterThan(0);

    return Number(annualIncomeAfterTaxText.replace(/[^\d.-]/g, ''));
  }
}

export class PersonalAllowanceTaperJourneyPage {
  readonly home: HomePageObject;
  readonly aboutYou: AboutYouPageObject;
  readonly retirementIncome: RetirementIncomePageObject;
  readonly retirementCosts: RetirementCostsPageObject;
  readonly results: ResultsPageObject;

  constructor(private readonly page: Page) {
    this.home = new HomePageObject(page);
    this.aboutYou = new AboutYouPageObject(page);
    this.retirementIncome = new RetirementIncomePageObject(page);
    this.retirementCosts = new RetirementCostsPageObject(page);
    this.results = new ResultsPageObject(page);
  }

  async completeJourney(annualIncome: number): Promise<void> {
    await this.home.startRetirementBudgetPlanner();
    await this.aboutYou.fillDefaultsAndContinue();
    await this.retirementIncome.fillAnnualStatePensionAndContinue(annualIncome);
    await this.retirementCosts.fillMinimumCostAndContinue();
    await this.results.waitForPage();
    await this.results.selectAnnualSummary();
  }
}
