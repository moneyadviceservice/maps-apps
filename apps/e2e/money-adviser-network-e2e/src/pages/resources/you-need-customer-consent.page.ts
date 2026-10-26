import { PageFactory } from '@lib/page-factory.lib';

export const YouNeedCustomerConsentPage = PageFactory.createResourcePage({
  pageTitle: 'Debt Advice Referral',
  sectionTitle: "You need the customer's consent to make a referral",
  endpoint: '/online/consent-rejected',
  content:
    'Advise the customer that it is not possible to proceed without consentTell the customer they can still access help outside the Money Adviser Network:https://www.moneyhelper.org.uk/en/money-troubles/dealing-with-debt/debt-advice-locatorCopy these details',
});

export type YouNeedCustomerConsentPageInstance = InstanceType<
  typeof YouNeedCustomerConsentPage
>;
