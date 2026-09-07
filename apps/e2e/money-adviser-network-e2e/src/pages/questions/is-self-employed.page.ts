import { PageFactory } from '@lib/page-factory.lib';

export const IsCustomerSelfEmployedPage = PageFactory.createQuestionPage({
  pageTitle: 'Debt Advice Referral',
  sectionTitle: 'Is the customer self-employed or are they a company director?',
  endpoint: '/start/q-3?q-1=1&q-2=0',
  options: [
    {
      text: 'Yes',
    },
    {
      text: 'No',
    },
  ],
});

export type IsCustomerSelfEmployedPageInstance = InstanceType<
  typeof IsCustomerSelfEmployedPage
>;
