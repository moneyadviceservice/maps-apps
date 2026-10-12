import { CheckYourAnswersComponent } from '@pages/components/check-your-answers.component';
import { CommonComponent } from '@pages/components/common-component.component';
import { ResultsComponent } from '@pages/components/results.component';
import { LandingPage } from '@pages/landing.page';
import { ProviderQuestionPage } from '@pages/provider-question.page';
import { Question1Page } from '@pages/question1.page';

import { test as base } from '@maps-react/playwright/fixtures/default.fixtures';

export * from '@maps-react/playwright/fixtures/default.fixtures';

interface CustomFixtures {
  commonComponent: CommonComponent;
  checkYourAnswersComponent: CheckYourAnswersComponent;
  resultsComponent: ResultsComponent;
  landingPage: LandingPage;
  question1Page: Question1Page;
  providerQuestionPage: ProviderQuestionPage;
}

export const test = base.extend<CustomFixtures>({
  commonComponent: async ({ page }, provideFixture) => {
    await provideFixture(new CommonComponent(page));
  },
  checkYourAnswersComponent: async ({ page }, provideFixture) => {
    await provideFixture(new CheckYourAnswersComponent(page));
  },
  resultsComponent: async ({ page }, provideFixture) => {
    await provideFixture(new ResultsComponent(page));
  },
  landingPage: async ({ page }, provideFixture) => {
    await provideFixture(new LandingPage(page));
  },
  question1Page: async ({ page }, provideFixture) => {
    await provideFixture(new Question1Page(page));
  },
  providerQuestionPage: async ({ page }, provideFixture) => {
    await provideFixture(new ProviderQuestionPage(page));
  },
});
