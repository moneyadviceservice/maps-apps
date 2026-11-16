import { PageFactory } from '@lib/page-factory.lib';

export const CreditScorePage = PageFactory.createQuestionPage({
  endpoint: '/question-6',
  options: [
    {
      text: 'Good or excellent',
    },
    {
      text: 'Fair or ok',
    },
    {
      text: 'Poor',
    },
    {
      text: 'Not sure',
    },
  ],
});

export type CreditScorePageInstance = InstanceType<typeof CreditScorePage>;
