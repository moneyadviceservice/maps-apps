import { PageFactory } from '@lib/page-factory.lib';

export const TelephoneConsentPage = PageFactory.createQuestionPage({
  pageTitle: 'Debt Advice Referral',
  sectionTitle: "Consent to share customer's contact details with MoneyHelper",
  content: 'Placeholder...',
  endpoint: '/telephone/t-1',
  options: [
    {
      text: 'Yes',
    },
    {
      text: 'No',
    },
  ],
});

export type TelephoneConsentPageInstance = InstanceType<
  typeof TelephoneConsentPage
>;
