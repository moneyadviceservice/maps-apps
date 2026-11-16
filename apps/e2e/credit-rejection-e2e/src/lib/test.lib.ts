import { CheckAnswersPage } from '@pages/check-answers.page';
import { QuestionPage } from '@pages/question.page';
import { YourActionPlanPage } from '@pages/your-action-plan.page';

import { test as base } from '@maps-react/playwright/fixtures/default.fixtures';

export * from '@maps-react/playwright/fixtures/default.fixtures';

interface CustomFixtures {
  questionPage: QuestionPage;
  checkAnswersPage: CheckAnswersPage;
  yourActionPlanPage: YourActionPlanPage;
}

export const test = base.extend<CustomFixtures>({
  questionPage: async ({ page }, provideFixture) => {
    await provideFixture(new QuestionPage(page));
  },
  checkAnswersPage: async ({ page }, provideFixture) => {
    await provideFixture(new CheckAnswersPage(page));
  },
  yourActionPlanPage: async ({ page }, provideFixture) => {
    await provideFixture(new YourActionPlanPage(page));
  },
});
