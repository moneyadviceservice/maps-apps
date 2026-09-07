/* eslint-disable no-restricted-imports */
import { BabyDueDateComponent } from '@pages/components/BabyDueDate.component';
import { EssentialItemsComponent } from '@pages/components/EssentialItems.component';
import { NonEssentialItemsComponent } from '@pages/components/NonEssentialItems.component';
import { ResultsComponent } from '@pages/components/Results.component';
import { SummaryComponent } from '@pages/components/Summary.component';
import { YourBudgetComponent } from '@pages/components/YourBudget.component';
import { SaveForLaterPage } from '@pages/SaveForLater.page';
import { test as base } from '@playwright/test';

export * from '@playwright/test';

interface CustomFixtures {
  babyDueDate: BabyDueDateComponent;
  essentialItems: EssentialItemsComponent;
  nonEssentialItems: NonEssentialItemsComponent;
  yourBudget: YourBudgetComponent;
  summary: SummaryComponent;
  results: ResultsComponent;
  saveForLater: SaveForLaterPage;
}

export const test = base.extend<CustomFixtures>({
  babyDueDate: async ({ page }, use) => {
    await use(new BabyDueDateComponent(page));
  },
  essentialItems: async ({ page }, use) => {
    await use(new EssentialItemsComponent(page));
  },
  nonEssentialItems: async ({ page }, use) => {
    await use(new NonEssentialItemsComponent(page));
  },
  yourBudget: async ({ page }, use) => {
    await use(new YourBudgetComponent(page));
  },
  summary: async ({ page }, use) => {
    await use(new SummaryComponent(page));
  },
  results: async ({ page }, use) => {
    await use(new ResultsComponent(page));
  },
  saveForLater: async ({ page }, use) => {
    await use(new SaveForLaterPage(page));
  },
});
