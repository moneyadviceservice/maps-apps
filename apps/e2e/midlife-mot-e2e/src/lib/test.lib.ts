import { CheckAnswersPage } from '@pages/check-answers.page';
import { QuestionPage } from '@pages/question.page';
import { ReportPage } from '@pages/report.page';
import { SummaryPage } from '@pages/summary.page';

import { test as base } from '@maps-react/playwright/fixtures/default.fixtures';

export * from '@maps-react/playwright/fixtures/default.fixtures';

interface CustomFixtures {
  checkAnswersPage: CheckAnswersPage;
  questionPage: QuestionPage;
  summaryPage: SummaryPage;
  reportPage: ReportPage;
}

export const test = base.extend<CustomFixtures>({
  questionPage: async ({ page }, provideFixture) => {
    await provideFixture(new QuestionPage(page));
  },
  checkAnswersPage: async ({ page }, provideFixture) => {
    await provideFixture(new CheckAnswersPage(page));
  },
  summaryPage: async ({ page }, provideFixture) => {
    await provideFixture(new SummaryPage(page));
  },
  reportPage: async ({ page }, provideFixture) => {
    await provideFixture(new ReportPage(page));
  },
});
