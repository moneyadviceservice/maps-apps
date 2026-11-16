import { BasePage } from '@pages/Base.page';
import { AnnualIncomeComponent } from '@pages/components/annual-income.component';
import { FailedResultsComponent } from '@pages/components/failed-results.component';
import { MonthlyCostsComponent } from '@pages/components/monthly-costs.component';
import { SuccessfulResultsComponent } from '@pages/components/successful-results.component';

import { test as base } from '@maps-react/playwright/fixtures/default.fixtures';

export * from '@maps-react/playwright/fixtures/default.fixtures';

interface CustomFixtures {
  basePage: BasePage;
  annualIncomeComponent: AnnualIncomeComponent;
  monthlyCostsComponent: MonthlyCostsComponent;
  successfulResultsComponent: SuccessfulResultsComponent;
  failedResultsComponent: FailedResultsComponent;
}

export const test = base.extend<CustomFixtures>({
  basePage: async ({ page }, provideFixture) => {
    await provideFixture(new BasePage(page));
  },
  annualIncomeComponent: async ({ page }, provideFixture) => {
    await provideFixture(new AnnualIncomeComponent(page));
  },
  monthlyCostsComponent: async ({ page }, provideFixture) => {
    await provideFixture(new MonthlyCostsComponent(page));
  },
  successfulResultsComponent: async ({ page }, provideFixture) => {
    await provideFixture(new SuccessfulResultsComponent(page));
  },
  failedResultsComponent: async ({ page }, provideFixture) => {
    await provideFixture(new FailedResultsComponent(page));
  },
});
