import { CheckAnswersPage } from '@pages/check-answers.page';
import { QuestionPage } from '@pages/question.page';
import { ResultsPage } from '@pages/results.page';

import { test as base } from '@maps-react/playwright/fixtures/default.fixtures';

export * from '@maps-react/playwright/fixtures/default.fixtures';

interface CustomFixtures {
  checkAnswersPage: CheckAnswersPage;
  questionPage: QuestionPage;
  resultsPage: ResultsPage;
}

export const test = base.extend<CustomFixtures>({
  questionPage: async ({ page }, provideFixture) => {
    await provideFixture(new QuestionPage(page));
  },
  checkAnswersPage: async ({ page }, provideFixture) => {
    await provideFixture(new CheckAnswersPage(page));
  },
  resultsPage: async ({ page }, provideFixture) => {
    await provideFixture(new ResultsPage(page));
  },
});
