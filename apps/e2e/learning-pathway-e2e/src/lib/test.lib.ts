import { LearningHubDirectoryPage } from '@pages/directory.page';
import LandingPage from '@pages/landing.page';
import UpdatePage from '@pages/update.page';
import { test as base } from '@playwright/test';

export * from '@maps-react/playwright/fixtures/default.fixtures';

interface CustomFixtures {
  landingPage: LandingPage;
  updatePage: UpdatePage;
  directoryPage: LearningHubDirectoryPage;
}

export const test = base.extend<CustomFixtures>({
  landingPage: async ({ page }, provideFixture) => {
    await provideFixture(new LandingPage(page));
  },
  updatePage: async ({ page }, provideFixture) => {
    await provideFixture(new UpdatePage(page));
  },
  directoryPage: async ({ page }, provideFixture) => {
    await provideFixture(new LearningHubDirectoryPage(page));
  },
});
