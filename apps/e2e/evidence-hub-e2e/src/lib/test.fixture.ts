import { test as base } from '@playwright/test';

import { HomepagePage } from '../pages/HomepagePage';
import { ResearchLibraryPage } from '../pages/ResearchLibraryPage';

type EvidenceHubFixtures = {
  homepagePage: HomepagePage;
  researchLibraryPage: ResearchLibraryPage;
};

export const test = base.extend<EvidenceHubFixtures>({
  homepagePage: async ({ page }, provideFixture) => {
    await provideFixture(new HomepagePage(page));
  },

  researchLibraryPage: async ({ page }, provideFixture) => {
    await provideFixture(new ResearchLibraryPage(page));
  },
});

test.beforeEach(async ({ homepagePage }) => {
  await homepagePage.gotoHome();
  await homepagePage.expectHubTitleVisible();
});

export { expect } from '@playwright/test';
