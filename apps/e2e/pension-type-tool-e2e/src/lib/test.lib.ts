import { CheckYourAnswersComponent } from '@pages/components/check-your-answers.component';
import { CommonComponent } from '@pages/components/common-component.component';
import { HelpAndContactComponent } from '@pages/components/help-and-contact.component';
import { ResultsComponent } from '@pages/components/results.component';
import { LandingPage } from '@pages/landing.page';
import { PensionStartDatePage } from '@pages/pension-start-date.page';
import { ProviderQuestionPage } from '@pages/provider-question.page';
import { Question1Page } from '@pages/question1.page';

import { test as base } from '@maps-react/playwright/fixtures/default.fixtures';

export * from '@maps-react/playwright/fixtures/default.fixtures';

interface CustomFixtures {
  commonComponent: CommonComponent;
  helpAndContactComponent: HelpAndContactComponent;
  checkYourAnswersComponent: CheckYourAnswersComponent;
  resultsComponent: ResultsComponent;
  landingPage: LandingPage;
  pensionStartDatePage: PensionStartDatePage;
  question1Page: Question1Page;
  providerQuestionPage: ProviderQuestionPage;
}

export const test = base.extend<CustomFixtures>({
  commonComponent: async ({ page }, provideFixture) => {
    await provideFixture(new CommonComponent(page));
  },
  helpAndContactComponent: async ({ page }, provideFixture) => {
    await provideFixture(new HelpAndContactComponent(page));
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
  pensionStartDatePage: async ({ page }, provideFixture) => {
    await provideFixture(new PensionStartDatePage(page));
  },
  question1Page: async ({ page }, provideFixture) => {
    await provideFixture(new Question1Page(page));
  },
  providerQuestionPage: async ({ page }, provideFixture) => {
    await provideFixture(new ProviderQuestionPage(page));
  },
});
