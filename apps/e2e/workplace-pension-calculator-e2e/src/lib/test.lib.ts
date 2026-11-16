import { YourContributionsComponent } from '@pages/components/YourContributions.component';
import { YourDetailsComponent } from '@pages/components/YourDetails.component';
import { YourResultsComponent } from '@pages/components/YourResults.component';
import { StartCalculatorPage } from '@pages/StartCalculatorPage';

import { test as base } from '@maps-react/playwright/fixtures/default.fixtures';

export * from '@maps-react/playwright/fixtures/default.fixtures';

interface CustomFixtures {
  startCalculatorPage: StartCalculatorPage;
  yourDetailsComponent: YourDetailsComponent;
  yourContributionsComponent: YourContributionsComponent;
  yourResultsComponent: YourResultsComponent;
}

export const test = base.extend<CustomFixtures>({
  startCalculatorPage: async ({ page }, provideFixture) => {
    await provideFixture(new StartCalculatorPage(page));
  },
  yourDetailsComponent: async ({ page }, provideFixture) => {
    await provideFixture(new YourDetailsComponent(page));
  },
  yourContributionsComponent: async ({ page }, provideFixture) => {
    await provideFixture(new YourContributionsComponent(page));
  },
  yourResultsComponent: async ({ page }, provideFixture) => {
    await provideFixture(new YourResultsComponent(page));
  },
});
