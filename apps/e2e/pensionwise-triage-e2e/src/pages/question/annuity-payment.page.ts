import { PageFactory } from '@lib/page-factory.lib';

export const AnnuityPaymentPage = PageFactory.createQuestionPage({
  title: 'Have you already got a lifetime annuity in payment?',
  endpoint: '/pension-wise-triage/lifetime-annuity',
  options: ['Yes', 'No'],
  accordion: {
    title: 'Why are we asking?',
    description:
      'Penson Wise does not provide guidance on lifetime annuities in payment. This is because they cannot be changed once you’ve bought one. Please call our helpline if you need any other guidance.',
  },
});
