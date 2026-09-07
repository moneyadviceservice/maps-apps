/* eslint-disable no-restricted-imports */
import { ConfirmDetailsPage } from '@pages/confirm-details.page';
import {
  CustomersDetailsPageEmail,
  CustomersDetailsPageEmailInstance,
  CustomersDetailsPageTelephone,
  CustomersDetailsPageTelephoneInstance,
} from '@pages/input/customer-details.page';
import {
  SecurityQuestionsPage,
  SecurityQuestionsPageInstance,
} from '@pages/input/security-questions.page';
import {
  YourReferencesForUpdatesPage,
  YourReferencesForUpdatesPageInstance,
} from '@pages/input/your-references-for-updates.page';
import { LoginPage } from '@pages/login.page';
import {
  CustomerConsentPage,
  CustomerConsentPageInstance,
} from '@pages/questions/customer-consent.page';
import {
  CustomerNeedsPage,
  CustomerNeedsPageInstance,
} from '@pages/questions/customer-needs.page';
import {
  IsCustomerSelfEmployedPage,
  IsCustomerSelfEmployedPageInstance,
} from '@pages/questions/is-self-employed.page';
import {
  DoesCustomerLiveInEnglandPage,
  DoesCustomerLiveInEnglandPageInstance,
} from '@pages/questions/live-in-england.page';
import {
  OutcomeShareConsentPage,
  OutcomeShareConsentPageInstance,
} from '@pages/questions/outcome-share-consent.page';
import {
  PreferredContactMethodPage,
  PreferredContactMethodPageInstance,
} from '@pages/questions/preferred-contact-method.page';
import {
  TelephoneCallbackPage,
  TelephoneCallbackPageInstance,
} from '@pages/questions/telephone-callback.page';
import {
  TelephoneConsentPage,
  TelephoneConsentPageInstance,
} from '@pages/questions/telephone-consent.page';
import {
  TimeBookingPage,
  TimeBookingPageInstance,
} from '@pages/questions/time-booking.page';
import {
  ReferCustomerToBusinessDebtline,
  ReferCustomerToBusinessDebtlineInstance,
} from '@pages/resources/refer-customer-to-business-debtline';
import {
  ReferCustomerToDaltPage,
  ReferCustomerToDaltPageInstance,
} from '@pages/resources/refer-customer-to-dalt.page';
import {
  ReferCustomerToLinksPage,
  ReferCustomerToLinksPageInstance,
} from '@pages/resources/refer-customer-to-links.page';
import {
  YouNeedCustomerConsentPage,
  YouNeedCustomerConsentPageInstance,
} from '@pages/resources/you-need-customer-consent.page';
import { BrowserContext, test as base } from '@playwright/test';
import { MockServerUtils } from '@utils/mock.utils';

export { expect } from '@lib/expect.lib';
export * from '@playwright/test';

interface CustomFixtures {
  loginPage: LoginPage;
  confirmDetailsPage: ConfirmDetailsPage;
  questions: {
    customerNeedsPage: CustomerNeedsPageInstance;
    doesCustomerLiveInEnglandPage: DoesCustomerLiveInEnglandPageInstance;
    isSelfEmployedPage: IsCustomerSelfEmployedPageInstance;
    preferredContactMethodPage: PreferredContactMethodPageInstance;
    customerConsentPage: CustomerConsentPageInstance;
    telephoneConsentPage: TelephoneConsentPageInstance;
    outcomeShareConsentPage: OutcomeShareConsentPageInstance;
    telephoneCallbackPage: TelephoneCallbackPageInstance;
    timeBookingPage: TimeBookingPageInstance;
  };
  resources: {
    referCustomerToLinksPage: ReferCustomerToLinksPageInstance;
    referCustomerToDaltPage: ReferCustomerToDaltPageInstance;
    referCustomerToBusinessPage: ReferCustomerToBusinessDebtlineInstance;
    youNeedCustomerConsentPage: YouNeedCustomerConsentPageInstance;
  };
  inputs: {
    yourReferencesForUpdatesPage: YourReferencesForUpdatesPageInstance;
    customersEmailDetailsPage: CustomersDetailsPageEmailInstance;
    customersTelephoneDetailsPage: CustomersDetailsPageTelephoneInstance;
    securityQuestionsPage: SecurityQuestionsPageInstance;
  };
  mockServerUtils: MockServerUtils;
  setCookieControl: () => Promise<void>;
}

async function setCookieControl(context: BrowserContext, hostname: string) {
  await context.addCookies([
    {
      name: 'CookieControl',
      value: JSON.stringify({
        necessaryCookies: [],
        optionalCookies: {
          analytics: 'revoked',
          marketing: 'revoked',
        },
        statement: {},
        consentDate: 0,
        consentExpiry: 0,
        interactedWith: true,
        user: 'anonymous',
      }),
      domain: hostname,
      path: '/',
    },
  ]);
}

export const test = base.extend<CustomFixtures>({
  loginPage: async ({ page }, provideFixture) => {
    await provideFixture(new LoginPage(page));
  },

  confirmDetailsPage: async ({ page }, provideFixture) => {
    await provideFixture(new ConfirmDetailsPage(page));
  },

  questions: async ({ page }, provideFixture) => {
    await provideFixture({
      customerNeedsPage: new CustomerNeedsPage(page),
      doesCustomerLiveInEnglandPage: new DoesCustomerLiveInEnglandPage(page),
      isSelfEmployedPage: new IsCustomerSelfEmployedPage(page),
      preferredContactMethodPage: new PreferredContactMethodPage(page),
      customerConsentPage: new CustomerConsentPage(page),
      telephoneConsentPage: new TelephoneConsentPage(page),
      outcomeShareConsentPage: new OutcomeShareConsentPage(page),
      telephoneCallbackPage: new TelephoneCallbackPage(page),
      timeBookingPage: new TimeBookingPage(page),
    });
  },

  resources: async ({ page }, provideFixture) => {
    await provideFixture({
      referCustomerToLinksPage: new ReferCustomerToLinksPage(page),
      referCustomerToDaltPage: new ReferCustomerToDaltPage(page),
      referCustomerToBusinessPage: new ReferCustomerToBusinessDebtline(page),
      youNeedCustomerConsentPage: new YouNeedCustomerConsentPage(page),
    });
  },

  inputs: async ({ page }, provideFixture) => {
    await provideFixture({
      yourReferencesForUpdatesPage: new YourReferencesForUpdatesPage(page),
      customersEmailDetailsPage: new CustomersDetailsPageEmail(page),
      customersTelephoneDetailsPage: new CustomersDetailsPageTelephone(page),
      securityQuestionsPage: new SecurityQuestionsPage(page),
    });
  },

  mockServerUtils: async ({ page }, provideFixture) => {
    await provideFixture(new MockServerUtils(page));
  },

  setCookieControl: async ({ context }, provideFixture, testInfo) => {
    const baseURL = testInfo.project.use.baseURL;
    if (!baseURL) {
      throw new Error('baseURL must be configured');
    }

    const { hostname } = new URL(baseURL);
    await provideFixture(async () => setCookieControl(context, hostname));
  },
});
