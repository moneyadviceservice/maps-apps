import { PageFactory } from '@lib/page-factory.lib';

export const TelephoneCallbackPage = PageFactory.createQuestionPage({
  pageTitle: 'Debt Advice Referral',
  sectionTitle: 'When would the customer like to speak to someone?',
  content:
    'Please ensure the customer:Is available to speak for up to one hourHas details of all their debts to handCan outline their income and expenditure',
  endpoint: '/telephone/t-4',
  options: [
    {
      text: 'Get an immediate call back',
      hint: 'This service is only available on Monday - Friday between 9.00am and 3.30pm. Before confirming, ensure that the customer is able to answer the call within the next few minutes.',
    },
    {
      text: 'Schedule a call for later',
      hint: 'This service has slots available over the next four working days in the Morning (9am to 12pm) or Afternoon (1pm to 4pm).',
    },
  ],
});

export type TelephoneCallbackPageInstance = InstanceType<
  typeof TelephoneCallbackPage
>;
