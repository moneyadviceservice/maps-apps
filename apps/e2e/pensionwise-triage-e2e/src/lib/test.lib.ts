import { FreeDebtAdvicePage } from '@pages/ineligible/free-debt-advice.page';
import { NoDCPage } from '@pages/ineligible/no-dc.page';
import { Over75Page } from '@pages/ineligible/over-75.page';
import { TerminallyIllConfirmationPage } from '@pages/ineligible/terminally-ill-confirmation.page';
import { Under50Page } from '@pages/ineligible/under-50.page';
import { AgePage } from '@pages/question/age.page';
import { AnnuityPaymentPage } from '@pages/question/annuity-payment.page';
import { DebtAdvicePage } from '@pages/question/debt-advice.page';
import { DefinedContributionsPage } from '@pages/question/defined-contribution.page';
import { MissedPaymentsPage } from '@pages/question/missed-payments.page';
import { TerminallyIllPage } from '@pages/question/terminally-ill.page';
import { FiftytoFiftyFourPage } from '@pages/transitional/50-54.page';
import { HomePage } from '@pages/transitional/home.page';
import { LifetimeAnnuityConfirmationPage } from '@pages/transitional/lifetime-annuity-confirmation.page';

import { test as base } from '@maps-react/playwright/fixtures/default.fixtures';

export * from '@maps-react/playwright/fixtures/default.fixtures';

interface CustomFixtures {
  pages: {
    ineligible: {
      under50Page: InstanceType<typeof Under50Page>;
      over75Page: InstanceType<typeof Over75Page>;
      noDCPage: InstanceType<typeof NoDCPage>;
      terminallyIllConfirmationPage: InstanceType<
        typeof TerminallyIllConfirmationPage
      >;
      freeDebtAdvicePage: InstanceType<typeof FreeDebtAdvicePage>;
    };
    questions: {
      agePage: InstanceType<typeof AgePage>;
      annuityPage: InstanceType<typeof AnnuityPaymentPage>;
      definedContributionPage: InstanceType<typeof DefinedContributionsPage>;
      terminallyIllPage: InstanceType<typeof TerminallyIllPage>;
      missedPayments: InstanceType<typeof MissedPaymentsPage>;
      debtAdvice: InstanceType<typeof DebtAdvicePage>;
    };
    transitional: {
      homePage: InstanceType<typeof HomePage>;
      fiftyToFiftyFourPage: InstanceType<typeof FiftytoFiftyFourPage>;
      lifetimeAnnuityConfirmationPage: InstanceType<
        typeof LifetimeAnnuityConfirmationPage
      >;
    };
  };
}

export const test = base.extend<CustomFixtures>({
  pages: async ({ page }, provideFixture) => {
    await provideFixture({
      ineligible: {
        under50Page: new Under50Page(page),
        over75Page: new Over75Page(page),
        noDCPage: new NoDCPage(page),
        terminallyIllConfirmationPage: new TerminallyIllConfirmationPage(page),
        freeDebtAdvicePage: new FreeDebtAdvicePage(page),
      },
      questions: {
        agePage: new AgePage(page),
        annuityPage: new AnnuityPaymentPage(page),
        definedContributionPage: new DefinedContributionsPage(page),
        terminallyIllPage: new TerminallyIllPage(page),
        missedPayments: new MissedPaymentsPage(page),
        debtAdvice: new DebtAdvicePage(page),
      },
      transitional: {
        homePage: new HomePage(page),
        fiftyToFiftyFourPage: new FiftytoFiftyFourPage(page),
        lifetimeAnnuityConfirmationPage: new LifetimeAnnuityConfirmationPage(
          page,
        ),
      },
    });
  },
});
