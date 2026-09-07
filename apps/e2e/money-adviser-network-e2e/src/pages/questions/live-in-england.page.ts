import { PageFactory } from '@lib/page-factory.lib';

export const DoesCustomerLiveInEnglandPage = PageFactory.createQuestionPage({
  pageTitle: 'Debt Advice Referral',
  sectionTitle: 'Does the customer live in England?',
  endpoint: '/start/q-2?q-1=1',
  options: [
    {
      text: 'Yes',
    },
    {
      text: 'No',
    },
  ],
});

export type DoesCustomerLiveInEnglandPageInstance = InstanceType<
  typeof DoesCustomerLiveInEnglandPage
>;
