import { PageFactory } from '@lib/page-factory.lib';

export const HaveYouBeenRefusedCreditPage = PageFactory.createQuestionPage({
  endpoint: '/question-5',
  options: [
    {
      text: 'Yes',
    },
    {
      text: 'No',
    },
  ],
});

export type HaveYouBeenRefusedCreditPageInstance = InstanceType<
  typeof HaveYouBeenRefusedCreditPage
>;
