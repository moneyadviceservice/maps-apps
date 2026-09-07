import { PageFactory } from '@lib/page-factory.lib';

export const OutcomeShareConsentPage = PageFactory.createQuestionPage({
  pageTitle: 'Debt Advice Referral',
  sectionTitle: 'Consent to share the outcome of the referral with MoneyHelper',
  content: 'Placeholder...',
  endpoint: '/telephone/t-2',
  options: [
    {
      text: 'Yes',
    },
    {
      text: 'No',
    },
  ],
});

export type OutcomeShareConsentPageInstance = InstanceType<
  typeof OutcomeShareConsentPage
>;
