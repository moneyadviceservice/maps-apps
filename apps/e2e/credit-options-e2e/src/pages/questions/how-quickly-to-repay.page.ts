import { PageFactory } from '@lib/page-factory.lib';

export const HowQuicklyToRepayPage = PageFactory.createQuestionPage({
  endpoint: '/question-4',
  options: [
    {
      text: 'Less than a month',
    },
    {
      text: '1 to 6 months',
    },
    {
      text: '6 months to 1 year',
    },
    {
      text: '1 to 2 years',
    },
    {
      text: 'Over 2 years',
    },
  ],
});

export type HowQuicklyToRepayPageInstance = InstanceType<
  typeof HowQuicklyToRepayPage
>;
