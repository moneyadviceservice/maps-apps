import { expect, test } from '@lib/test.lib';
import { HouseholdComponent } from '@pages/components/household-bills.component';
import { LivingCostComponent } from '@pages/components/living-costs.component';
import { ProgressComponent } from '@pages/components/progress.component';
import { IncomeComponent } from '@pages/components/your-income.component';

import testData from '../data/balanceEmailData.json';

const languages = ['en', 'cy'];

const balanceRed = /bg-red-600/;
const balanceGrey = /bg-slate-600/;
const balanceGreen = /bg-green-700/;
const summaryTab = 'tabpanel-7';
const incomeTab = 'tabpanel-0';
const houseHoldTab = 'tabpanel-1';

export enum factors {
  perDay = 0,
  perWeek = 1,
  per2Weeks = 2,
  per4Weeks = 3,
  perMonth = 4,
  perQuarter = 5,
  per6Months = 6,
  perYear = 7,
}

async function progressToSummary(
  progressComponent: ProgressComponent,
  incomeComponent: IncomeComponent,
  householdComponent: HouseholdComponent,
  livingCostComponent: LivingCostComponent,
) {
  await expect(await progressComponent.balanceRow()).toHaveClass(balanceGrey);
  await incomeComponent.fillInput('pay', testData.balanceTest.data.pay);
  await expect(await progressComponent.balanceRow()).toHaveClass(balanceGreen);
  await incomeComponent.continueButton.click();
  await householdComponent.fillInput(
    'mortgageRepayment',
    testData.balanceTest.data.mortgage,
  );
  await householdComponent.continueButton.click();
  await livingCostComponent.fillInput(
    'grocery',
    testData.balanceTest.data.groceries,
  );
  await expect(await progressComponent.balanceRow()).toHaveClass(balanceRed);
  await (await progressComponent.getTab(summaryTab)).click();
}

async function editSummary(
  progressComponent: ProgressComponent,
  incomeComponent: IncomeComponent,
  householdComponent: HouseholdComponent,
) {
  await expect(await progressComponent.balanceRow()).toHaveClass(balanceRed);
  await (await progressComponent.getTab(incomeTab)).click();
  await incomeComponent.fillInput(
    'sickPay',
    testData.balanceTest.data['sick-pay'],
  );
  await (await incomeComponent.getTab(summaryTab)).click();
  await expect(await progressComponent.balanceRow()).toHaveClass(balanceGreen);
  await (await incomeComponent.getTab(houseHoldTab)).click();
  await householdComponent.fillInput('rent', testData.balanceTest.data['rent']);
  await (await incomeComponent.getTab(summaryTab)).click();
  await expect(await progressComponent.balanceRow()).toHaveClass(balanceGrey);
}

async function validateSummaryPrices(
  progressComponent: ProgressComponent,
  factor: factors,
  income: string,
  spending: string,
  overspend: string,
) {
  await progressComponent.factorDropdown.selectOption({ index: factor });
  await expect(await progressComponent.incomeRowPrice()).toContainText(income);
  await expect(await progressComponent.spendingRowPrice()).toContainText(
    spending,
  );
  await expect(await progressComponent.balanceRowPrice()).toContainText(
    overspend,
  );
}

for (const language of languages) {
  test.describe('Budget Planner', () => {
    /**
     * @tests 57010 - Balance Should Change Colours
     *
     * @tests 57371 - Validate summary balance dropdown
     */
    test.beforeEach(async ({ setCookieControl }) => {
      await setCookieControl();
    });

    test(`Balance Should Change Colours - ${language}`, async ({
      page,
      incomeComponent,
      householdComponent,
      livingCostComponent,
      progressComponent,
    }) => {
      await page.goto(`${language}/income`);

      await progressToSummary(
        progressComponent,
        incomeComponent,
        householdComponent,
        livingCostComponent,
      );
      await editSummary(progressComponent, incomeComponent, householdComponent);
    });

    test(`Summary balance dropdown - ${language}`, async ({
      page,
      incomeComponent,
      householdComponent,
      livingCostComponent,
      progressComponent,
      summaryComponent,
    }) => {
      await page.goto(`${language}/income`);

      await progressToSummary(
        progressComponent,
        incomeComponent,
        householdComponent,
        livingCostComponent,
      );

      await expect(summaryComponent.summarySubtitle).toBeVisible();
      await validateSummaryPrices(
        progressComponent,
        factors.perDay,
        testData.balanceTest.factorPrices['per-day'].income,
        testData.balanceTest.factorPrices['per-day'].spending,
        testData.balanceTest.factorPrices['per-day'].overspend,
      );
      await validateSummaryPrices(
        progressComponent,
        factors.perWeek,
        testData.balanceTest.factorPrices['per-week'].income,
        testData.balanceTest.factorPrices['per-week'].spending,
        testData.balanceTest.factorPrices['per-week'].overspend,
      );
      await validateSummaryPrices(
        progressComponent,
        factors.per2Weeks,
        testData.balanceTest.factorPrices['per-2-weeks'].income,
        testData.balanceTest.factorPrices['per-2-weeks'].spending,
        testData.balanceTest.factorPrices['per-2-weeks'].overspend,
      );
      await validateSummaryPrices(
        progressComponent,
        factors.per4Weeks,
        testData.balanceTest.factorPrices['per-4-weeks'].income,
        testData.balanceTest.factorPrices['per-4-weeks'].spending,
        testData.balanceTest.factorPrices['per-4-weeks'].overspend,
      );
      await validateSummaryPrices(
        progressComponent,
        factors.perMonth,
        testData.balanceTest.factorPrices['per-month'].income,
        testData.balanceTest.factorPrices['per-month'].spending,
        testData.balanceTest.factorPrices['per-month'].overspend,
      );
      await validateSummaryPrices(
        progressComponent,
        factors.perQuarter,
        testData.balanceTest.factorPrices['per-quarter'].income,
        testData.balanceTest.factorPrices['per-quarter'].spending,
        testData.balanceTest.factorPrices['per-quarter'].overspend,
      );
      await validateSummaryPrices(
        progressComponent,
        factors.per6Months,
        testData.balanceTest.factorPrices['per-6-months'].income,
        testData.balanceTest.factorPrices['per-6-months'].spending,
        testData.balanceTest.factorPrices['per-6-months'].overspend,
      );
      await validateSummaryPrices(
        progressComponent,
        factors.perYear,
        testData.balanceTest.factorPrices['per-year'].income,
        testData.balanceTest.factorPrices['per-year'].spending,
        testData.balanceTest.factorPrices['per-year'].overspend,
      );
    });
  });
}
