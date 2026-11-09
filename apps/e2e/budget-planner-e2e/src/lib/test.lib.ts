import { BasePage } from '@pages/Base.page';
import { FamilyFriendsComponent } from '@pages/components/family-and-friends.component';
import { FinanceComponent } from '@pages/components/finance-and-insurance.component';
import { HouseholdComponent } from '@pages/components/household-bills.component';
import { LeisureComponent } from '@pages/components/leisure.component';
import { LivingCostComponent } from '@pages/components/living-costs.component';
import { ProgressComponent } from '@pages/components/progress.component';
import { SaveEmailComponent } from '@pages/components/save-email.component';
import { SummaryComponent } from '@pages/components/summary.component';
import { IncomeComponent } from '@pages/components/your-income.component';
import { TravelComponent } from '@pages/components/your-travel.component';

import { test as base } from '@maps-react/playwright/fixtures/default.fixtures';

export * from '@maps-react/playwright/fixtures/default.fixtures';

interface CustomFixtures {
  basePage: BasePage;
  familyFreindsComponent: FamilyFriendsComponent;
  incomeComponent: IncomeComponent;
  livingCostComponent: LivingCostComponent;
  financeComponent: FinanceComponent;
  householdComponent: HouseholdComponent;
  travelComponent: TravelComponent;
  leisureComponent: LeisureComponent;
  summaryComponent: SummaryComponent;
  progressComponent: ProgressComponent;
  saveEmailComponent: SaveEmailComponent;
}

export const test = base.extend<CustomFixtures>({
  basePage: async ({ page }, provideFixture) => {
    await provideFixture(new BasePage(page));
  },
  incomeComponent: async ({ page }, provideFixture) => {
    await provideFixture(new IncomeComponent(page));
  },
  livingCostComponent: async ({ page }, provideFixture) => {
    await provideFixture(new LivingCostComponent(page));
  },
  financeComponent: async ({ page }, provideFixture) => {
    await provideFixture(new FinanceComponent(page));
  },
  householdComponent: async ({ page }, provideFixture) => {
    await provideFixture(new HouseholdComponent(page));
  },
  travelComponent: async ({ page }, provideFixture) => {
    await provideFixture(new TravelComponent(page));
  },
  leisureComponent: async ({ page }, provideFixture) => {
    await provideFixture(new LeisureComponent(page));
  },
  familyFreindsComponent: async ({ page }, provideFixture) => {
    await provideFixture(new FamilyFriendsComponent(page));
  },
  summaryComponent: async ({ page }, provideFixture) => {
    await provideFixture(new SummaryComponent(page));
  },
  progressComponent: async ({ page }, provideFixture) => {
    await provideFixture(new ProgressComponent(page));
  },
  saveEmailComponent: async ({ page }, provideFixture) => {
    await provideFixture(new SaveEmailComponent(page));
  },
});
