import { PageFactory } from '@lib/page-factory.lib';

export const ReferCustomerToDaltPage = PageFactory.createResourcePage({
  pageTitle: 'Debt Advice Referral',
  sectionTitle: 'Refer the customer to the debt advice locator',
  endpoint: '/start/debt-advice-locator?q-1=1&q-2=1',
  content:
    'The Money Adviser Network helps people living in England only. Ask the customer to use the debt advice locator tool:https://www.moneyhelper.org.uk/en/money-troubles/dealing-with-debt/debt-advice-locator (opens in a new tab)Copy these details',
});

export type ReferCustomerToDaltPageInstance = InstanceType<
  typeof ReferCustomerToDaltPage
>;
