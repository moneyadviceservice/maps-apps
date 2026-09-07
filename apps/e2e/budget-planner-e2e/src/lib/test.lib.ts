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
import { test as base } from '@playwright/test';

export * from '@playwright/test';

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
  setCookieControl: () => Promise<void>;
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
  setCookieControl: async ({ context }, provideFixture, testInfo) => {
    const baseURL = testInfo.project.use.baseURL;

    if (!baseURL) {
      throw new Error('baseURL must be configured');
    }

    const { hostname } = new URL(baseURL);

    await provideFixture(async () => {
      await context.addCookies([
        {
          name: 'CookieControl',
          value: JSON.stringify({
            necessaryCookies: [],
            optionalCookies: {
              analytics: 'revoked',
              marketing: 'revoked',
            },
            statement: {},
            consentDate: 0,
            consentExpiry: 0,
            interactedWith: true,
            user: 'anonymous',
          }),
          domain: hostname,
          path: '/',
        },
      ]);
    });
  },
});
