import { PageFactory } from '@lib/page-factory.lib';

export const HowLongCanYouWaitPage = PageFactory.createQuestionPage({
  endpoint: '/question-3',
  options: [
    {
      text: 'A few hours',
    },
    {
      text: 'A few days',
    },
    {
      text: 'A week or more',
    },
  ],
});

export type HowLongCanYouWaitPageInstance = InstanceType<
  typeof HowLongCanYouWaitPage
>;
