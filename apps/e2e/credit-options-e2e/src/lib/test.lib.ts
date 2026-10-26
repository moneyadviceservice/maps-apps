import { CheckYourAnswersPage } from '@pages/check-your-answers.page';
import { StartPage, type StartPageInstance } from '@pages/input';
import {
  CreditScorePage,
  type CreditScorePageInstance,
  HaveYouBeenRefusedCreditPage,
  type HaveYouBeenRefusedCreditPageInstance,
  HowLongCanYouWaitPage,
  type HowLongCanYouWaitPageInstance,
  HowQuicklyToRepayPage,
  type HowQuicklyToRepayPageInstance,
  WhatsTheMoneyForPage,
  type WhatsTheMoneyForPageInstance,
} from '@pages/questions';
import { ResultsPage } from '@pages/results.page';

import { test as base } from '@maps-react/playwright/fixtures/default.fixtures';

export * from '@maps-react/playwright/fixtures/default.fixtures';

interface CustomFixtures {
  pages: {
    startPage: StartPageInstance;
    howMuchToBorrowPage: StartPageInstance;
    creditScore: CreditScorePageInstance;
    haveYouBeenRefusedCredit: HaveYouBeenRefusedCreditPageInstance;
    howLongCanYouWait: HowLongCanYouWaitPageInstance;
    howQuicklyCanYouRepay: HowQuicklyToRepayPageInstance;
    whatsTheMoneyFor: WhatsTheMoneyForPageInstance;
    checkYourAnswers: CheckYourAnswersPage;
    resultsPage: ResultsPage;
  };
}

export const test = base.extend<CustomFixtures>({
  pages: async ({ page }, provideFixture) => {
    await provideFixture({
      howMuchToBorrowPage: new StartPage(page),
      creditScore: new CreditScorePage(page),
      haveYouBeenRefusedCredit: new HaveYouBeenRefusedCreditPage(page),
      howLongCanYouWait: new HowLongCanYouWaitPage(page),
      howQuicklyCanYouRepay: new HowQuicklyToRepayPage(page),
      whatsTheMoneyFor: new WhatsTheMoneyForPage(page),
      checkYourAnswers: new CheckYourAnswersPage(page),
      resultsPage: new ResultsPage(page),

      /**
       * Intentional duplication to make tests more readable.
       */
      startPage: new StartPage(page),
    });
  },
});
