import { expect, test } from '@lib/test.lib';
import { BasePage } from '@pages/Base.page';
import { FamilyFriendsComponent } from '@pages/components/family-and-friends.component';
import { FinanceComponent } from '@pages/components/finance-and-insurance.component';
import { HouseholdComponent } from '@pages/components/household-bills.component';
import { LeisureComponent } from '@pages/components/leisure.component';
import { LivingCostComponent } from '@pages/components/living-costs.component';
import { ProgressComponent } from '@pages/components/progress.component';
import { SummaryComponent } from '@pages/components/summary.component';
import { IncomeComponent } from '@pages/components/your-income.component';
import { TravelComponent } from '@pages/components/your-travel.component';

import budget from '../data/emailBudgetPlanner.json';

export enum tabs {
  'Income' = 'tabpanel-0',
  'Household bills' = 'tabpanel-1',
  'Living costs' = 'tabpanel-2',
  'Finance & insurance' = 'tabpanel-3',
  'Family & friends' = 'tabpanel-4',
  'Travel' = 'tabpanel-5',
  'Leisure' = 'tabpanel-6',
  'Summary' = 'tabpanel-7',
}
export type TabsKey = keyof typeof tabs;

const languages = ['en', 'cy'];

//Check correct tab is highlighted - tabIndex=0 is the highlighted tab
async function validateTab(component: BasePage, tab: tabs) {
  const selected = await component.getTab(tab);
  await expect(selected).toHaveAttribute('tabindex', '0');
}

async function testOneIncomeInput(incomeComponent: IncomeComponent) {
  await incomeComponent.fillInput('pay', budget.TestOne.Income.Pay.PayAfterTax);
  await incomeComponent.fillInput(
    'universalCredit',
    budget.TestOne.Income.BenefitsTaxCredit['income-universal-credit'],
  );
  await incomeComponent.fillInput(
    'rent',
    budget.TestOne.Income.OtherIncome['income-rent-or-board'],
  );
  await incomeComponent.continueButton.click();
}

async function testOneHouseholdInput(householdComponent: HouseholdComponent) {
  await householdComponent.fillInput(
    'mortgageRepayment',
    budget.TestOne['Household bills']['Mortgage & rent'][
      'household-bills-mortgage'
    ],
  );
  await householdComponent.fillInput(
    'buildingInsurance',
    budget.TestOne['Household bills']['Buildings insurance'][
      'household-bills-buildings-insurance'
    ],
  );
  await householdComponent.fillInput(
    'contentInsurance',
    budget.TestOne['Household bills']['Buildings insurance'][
      'household-bills-contents-insurance'
    ],
  );
  await householdComponent.fillInput(
    'councilTax',
    budget.TestOne['Household bills'].Utilities['household-bills-council-tax'],
  );
  await householdComponent.fillInput(
    'gas',
    budget.TestOne['Household bills'].Utilities['household-bills-gas'],
  );
  await householdComponent.fillInput(
    'electricity',
    budget.TestOne['Household bills'].Utilities['household-bills-electricity'],
  );
  await householdComponent.continueButton.click();
}

async function testOneLivingInput(livingCostComponent: LivingCostComponent) {
  await livingCostComponent.fillInput(
    'grocery',
    budget.TestOne['Living costs']['Grocery shopping']['living-costs-grocery'],
  );
  await livingCostComponent.fillFactorInput(
    'grocery',
    budget.TestOne['Living costs']['Grocery shopping'][
      'living-costs-grocery-factor'
    ],
  );
  await livingCostComponent.fillInput(
    'lunches',
    budget.TestOne['Living costs']['Work']['living-costs-lunches-snacks'],
  );
  await livingCostComponent.fillFactorInput(
    'lunches',
    budget.TestOne['Living costs']['Work']['living-costs-lunches-factor'],
  );
  await livingCostComponent.continueButton.click();
}

async function testOneFinanceInput(financeComponent: FinanceComponent) {
  await financeComponent.fillInput(
    'lifeInsurance',
    budget.TestOne['Finance & insurance']['Insurance'][
      'finance-insurance-life-insurance'
    ],
  );
  await financeComponent.fillInput(
    'incomeProtection',
    budget.TestOne['Finance & insurance']['Insurance'][
      'finance-insurance-income-protection-insurance'
    ],
  );
  await financeComponent.fillFactorInput(
    'incomeProtection',
    budget.TestOne['Finance & insurance']['Insurance'][
      'finance-insurance-income-protection-insurance-factor'
    ],
  );
  await financeComponent.fillInput(
    'isas',
    budget.TestOne['Finance & insurance']['Savings and investments'][
      'finance-insurance-payments-isa'
    ],
  );
  await financeComponent.fillFactorInput(
    'isas',
    budget.TestOne['Finance & insurance']['Savings and investments'][
      'finance-insurance-payments-isa-factor'
    ],
  );
  await financeComponent.continueButton.click();
}

async function testOneFamilyFriendsInput(
  familyFreindsComponent: FamilyFriendsComponent,
) {
  await familyFreindsComponent.fillInput(
    'pocketMoney',
    budget.TestOne['Family & friends']['Children'][
      'family-friends-pocket-money'
    ],
  );
  await familyFreindsComponent.fillFactorInput(
    'pocketMoney',
    budget.TestOne['Family & friends']['Children'][
      'family-friends-pocket-money-factor'
    ],
  );
  await familyFreindsComponent.fillInput(
    'petInsurance',
    budget.TestOne['Family & friends'].Pets['family-friends-pet-insurance'],
  );
  await familyFreindsComponent.continueButton.click();
}

async function testOneTravelInput(travelComponent: TravelComponent) {
  await travelComponent.fillInput(
    'insurance',
    budget.TestOne.Travel['Car insurance']['travel-car-insurance'],
  );
  await travelComponent.fillFactorInput(
    'insurance',
    budget.TestOne.Travel['Car insurance']['travel-car-insurance-factor'],
  );
  await travelComponent.continueButton.click();
}

async function testOneLeisureInput(leisureComponent: LeisureComponent) {
  await leisureComponent.fillInput(
    'cinema',
    budget.TestOne.Leisure.Entertainment['leisure-cinema-theatre-trips'],
  );
  await leisureComponent.fillFactorInput(
    'cinema',
    budget.TestOne.Leisure.Entertainment['leisure-cinema-theatre-trips-factor'],
  );
  await leisureComponent.fillInput(
    'holidays',
    budget.TestOne.Leisure.Holidays['leisure-holidays'],
  );
  await leisureComponent.fillFactorInput(
    'holidays',
    budget.TestOne.Leisure.Holidays['leisure-holidays-factor'],
  );
  await leisureComponent.continueButton.click();
}

async function testOneSummaryResults(summaryComponent: SummaryComponent) {
  await expect(
    await summaryComponent.tableRowPrice('householdBills'),
  ).toContainText(budget.TestOne.SummaryValues.Breakdown['household-bills']);
  await expect(
    await summaryComponent.tableRowPrice('livingCosts'),
  ).toContainText(budget.TestOne.SummaryValues.Breakdown['living-costs']);
  await expect(await summaryComponent.tableRowPrice('finance')).toContainText(
    budget.TestOne.SummaryValues.Breakdown['finance-insurance'],
  );
  await expect(
    await summaryComponent.tableRowPrice('familyFriends'),
  ).toContainText(budget.TestOne.SummaryValues.Breakdown['family-friends']);
  await expect(await summaryComponent.tableRowPrice('travel')).toContainText(
    budget.TestOne.SummaryValues.Breakdown['travel'],
  );
  await expect(await summaryComponent.tableRowPrice('leisure')).toContainText(
    budget.TestOne.SummaryValues.Breakdown['leisure'],
  );
}

async function testOneProgressResults(progressComponent: ProgressComponent) {
  await expect(await progressComponent.incomeRowPrice()).toContainText(
    budget.TestOne.SummaryValues.TotalComponent.income,
  );
  await expect(await progressComponent.spendingRowPrice()).toContainText(
    budget.TestOne.SummaryValues.TotalComponent.spending,
  );
  await expect(await progressComponent.balanceRowPrice()).toContainText(
    budget.TestOne.SummaryValues.TotalComponent['spare-cash'],
  );
}

async function testTwoHouseholdInput(householdComponent: HouseholdComponent) {
  await householdComponent.fillInput(
    'mortgageRepayment',
    budget.TestTwo['Household bills'].mortgage,
  );
  await householdComponent.fillInput(
    'buildingInsurance',
    budget.TestTwo['Household bills']['building-insurance'],
  );
  await householdComponent.fillInput(
    'contentInsurance',
    budget.TestTwo['Household bills']['contents-insurance'],
  );
  await householdComponent.fillInput(
    'councilTax',
    budget.TestTwo['Household bills']['contents-insurance'],
  );
  await householdComponent.fillInput(
    'gas',
    budget.TestTwo['Household bills']['council-tax'],
  );
  await householdComponent.fillInput(
    'electricity',
    budget.TestTwo['Household bills'].electricty,
  );
  await householdComponent.continueButton.click();
}

async function testTwoIncomeInput(incomeComponent: IncomeComponent) {
  await incomeComponent.fillInput('pay', budget.TestTwo.Income.PayAfterTax);
  await incomeComponent.fillInput(
    'universalCredit',
    budget.TestTwo.Income.UniversalCredit,
  );
  await incomeComponent.fillInput(
    'rent',
    budget.TestTwo.Income['income-rent-or-board'],
  );
  await incomeComponent.continueButton.click();
}

async function testTwoLivingInput(livingCostComponent: LivingCostComponent) {
  await livingCostComponent.fillInput(
    'grocery',
    budget.TestTwo['Living costs'].grocery,
  );
  await livingCostComponent.fillFactorInput(
    'grocery',
    budget.TestTwo['Living costs']['grocery-factor'],
  );
  await livingCostComponent.fillInput(
    'lunches',
    budget.TestTwo['Living costs']['lunches-snacks'],
  );
  await livingCostComponent.fillFactorInput(
    'lunches',
    budget.TestTwo['Living costs']['lunches-snacks-factor'],
  );
  await livingCostComponent.continueButton.click();
}

async function testTwoFinanceInput(financeComponent: FinanceComponent) {
  await financeComponent.fillInput(
    'lifeInsurance',
    budget.TestTwo['Finance & insurance']['life-insurance'],
  );
  await financeComponent.fillFactorInput(
    'lifeInsurance',
    budget.TestTwo['Finance & insurance']['life-insurance-factor'],
  );
  await financeComponent.fillInput(
    'incomeProtection',
    budget.TestTwo['Finance & insurance']['protection-insurance'],
  );
  await financeComponent.fillFactorInput(
    'incomeProtection',
    budget.TestTwo['Finance & insurance']['protection-insurance-factor'],
  );
  await financeComponent.fillInput(
    'isas',
    budget.TestTwo['Finance & insurance'].isa,
  );
  await financeComponent.fillFactorInput(
    'isas',
    budget.TestTwo['Finance & insurance']['isa-factor'],
  );
  await financeComponent.continueButton.click();
}

async function testTwoFamilyFriendsInput(
  familyFreindsComponent: FamilyFriendsComponent,
) {
  await familyFreindsComponent.fillInput(
    'pocketMoney',
    budget.TestTwo['Family & friends']['pocket-money'],
  );
  await familyFreindsComponent.fillFactorInput(
    'petInsurance',
    budget.TestTwo['Family & friends']['pocket-money-factor'],
  );
  await familyFreindsComponent.fillInput(
    'petInsurance',
    budget.TestTwo['Family & friends']['pet-insurance'],
  );
  await familyFreindsComponent.continueButton.click();
}

async function testTwoTravelInput(travelComponent: TravelComponent) {
  await travelComponent.fillInput(
    'insurance',
    budget.TestTwo.Travel['car-insurance'],
  );
  await travelComponent.fillFactorInput(
    'insurance',
    budget.TestTwo.Travel['car-insurance-factor'],
  );
  await travelComponent.continueButton.click();
}

async function testTwoLeisureInput(leisureComponent: LeisureComponent) {
  await leisureComponent.fillInput(
    'cinema',
    budget.TestTwo.Leisure['cinema-trips'],
  );
  await leisureComponent.fillFactorInput(
    'cinema',
    budget.TestTwo.Leisure['cinema-trips-factor'],
  );
  await leisureComponent.continueButton.click();
}

async function testTwoSummaryResults(summaryComponent: SummaryComponent) {
  await expect(
    await summaryComponent.tableRowPrice('householdBills'),
  ).toContainText(budget.TestTwo.SummaryValues.Breakdown['household-bills']);

  await expect(
    await summaryComponent.tableRowPrice('livingCosts'),
  ).toContainText(budget.TestTwo.SummaryValues.Breakdown['living-costs']);

  await expect(await summaryComponent.tableRowPrice('finance')).toContainText(
    budget.TestTwo.SummaryValues.Breakdown['finance-insurance'],
  );

  await expect(
    await summaryComponent.tableRowPrice('familyFriends'),
  ).toContainText(budget.TestTwo.SummaryValues.Breakdown['family-friends']);

  await expect(await summaryComponent.tableRowPrice('travel')).toContainText(
    budget.TestTwo.SummaryValues.Breakdown['travel'],
  );

  await expect(await summaryComponent.tableRowPrice('leisure')).toContainText(
    budget.TestTwo.SummaryValues.Breakdown['leisure'],
  );
}

async function testTwoProgressResults(progressComponent: ProgressComponent) {
  await expect(await progressComponent.incomeRowPrice()).toContainText(
    budget.TestTwo.SummaryValues.TotalComponent.income,
  );
  await expect(await progressComponent.spendingRowPrice()).toContainText(
    budget.TestTwo.SummaryValues.TotalComponent.spending,
  );
  await expect(await progressComponent.balanceRowPrice()).toContainText(
    budget.TestTwo.SummaryValues.TotalComponent['spare-cash'],
  );
}

for (const language of languages) {
  test.describe('Budget Planner', () => {
    /**
     * @tests 57003 - Creates a budget and presents summary
     *
     * @tests 57009 - Creates budget with different frequencies and presents summary
     */
    test.beforeEach(async ({ setCookieControl }) => {
      await setCookieControl();
    });

    test(`Creates a Budget and Presents Summary - ${language}`, async ({
      page,
      incomeComponent,
      householdComponent,
      livingCostComponent,
      financeComponent,
      familyFreindsComponent,
      travelComponent,
      leisureComponent,
      summaryComponent,
      progressComponent,
    }) => {
      await page.goto(`${language}/income`);
      await validateTab(incomeComponent, tabs.Income);
      await testOneIncomeInput(incomeComponent);

      await validateTab(householdComponent, tabs['Household bills']);
      await testOneHouseholdInput(householdComponent);

      await validateTab(householdComponent, tabs['Living costs']);
      await testOneLivingInput(livingCostComponent);

      await validateTab(financeComponent, tabs['Finance & insurance']);
      await testOneFinanceInput(financeComponent);

      await validateTab(familyFreindsComponent, tabs['Family & friends']);
      await testOneFamilyFriendsInput(familyFreindsComponent);

      await validateTab(travelComponent, tabs['Travel']);
      await testOneTravelInput(travelComponent);

      await validateTab(leisureComponent, tabs['Leisure']);
      await testOneLeisureInput(leisureComponent);

      await validateTab(summaryComponent, tabs['Summary']);
      await testOneSummaryResults(summaryComponent);
      await testOneProgressResults(progressComponent);
    });

    test(`Creates a budget with different frequencies and presents a summary - ${language}`, async ({
      page,
      incomeComponent,
      householdComponent,
      livingCostComponent,
      financeComponent,
      familyFreindsComponent,
      travelComponent,
      leisureComponent,
      summaryComponent,
      progressComponent,
    }) => {
      await page.goto(`${language}/income`);
      await validateTab(incomeComponent, tabs.Income);

      await testTwoIncomeInput(incomeComponent);
      await validateTab(householdComponent, tabs.Income);

      await testTwoHouseholdInput(householdComponent);
      await validateTab(livingCostComponent, tabs['Living costs']);

      await testTwoLivingInput(livingCostComponent);
      await validateTab(financeComponent, tabs['Finance & insurance']);

      await testTwoFinanceInput(financeComponent);
      await validateTab(familyFreindsComponent, tabs['Family & friends']);

      await testTwoFamilyFriendsInput(familyFreindsComponent);
      await validateTab(travelComponent, tabs['Travel']);

      await testTwoTravelInput(travelComponent);
      await validateTab(leisureComponent, tabs['Leisure']);

      await testTwoLeisureInput(leisureComponent);
      await validateTab(summaryComponent, tabs['Summary']);

      await testTwoSummaryResults(summaryComponent);
      await testTwoProgressResults(progressComponent);
    });
  });
}
