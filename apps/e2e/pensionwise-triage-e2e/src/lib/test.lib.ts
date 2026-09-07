/* eslint-disable no-restricted-imports */
import { FreeDebtAdvicePage } from 'pages/ineligible/freeDebtAdvice.page';
import { NoDCPage } from 'pages/ineligible/noDC.page';
import { Over75Page } from 'pages/ineligible/over75.page';
import { TerminallyIllConfirmationPage } from 'pages/ineligible/terminallyIllConfirmation.page';
import { Under50Page } from 'pages/ineligible/under50.page';
import { AnnuityPaymentPage } from 'pages/question/annuity-payment.page';
import { DebtAdvicePage } from 'pages/question/debt-advice.page';
import { DefinedContributionsPage } from 'pages/question/defined-contribution.page';
import { MissedPaymentsPage } from 'pages/question/missed-payments.page';
import { TerminallyIllPage } from 'pages/question/terminally-ill.page';
import { FiftytoFiftyFourPage } from 'pages/transitional/50-54.page';
import { HomePage } from 'pages/transitional/home.page';
import { LifetimeAnnuityConfirmationPage } from 'pages/transitional/lifetime-annuity-confirmation.page';
import { test as base } from '@playwright/test';

import { AgePage } from '../pages/question/age.page';
export * from '@playwright/test';

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
