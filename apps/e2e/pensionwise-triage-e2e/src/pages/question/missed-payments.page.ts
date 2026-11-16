import { PageFactory } from '@lib/page-factory.lib';

export const MissedPaymentsPage = PageFactory.createQuestionPage({
  title:
    'Have you missed more than one payment on your bills or debts, and haven’t caught up yet?',
  endpoint: '/pension-wise-triage/debts',
  options: ['Yes', 'No'],
  accordion: {
    title: 'Why are we asking?',
    description:
      "If you've missed more than one bill or debt repayment and you're struggling, you may need debt advice before drawing your pension.",
  },
});
