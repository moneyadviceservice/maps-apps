import { PageFactory } from '@lib/page-factory.lib';

export const WhatsTheMoneyForPage = PageFactory.createQuestionPage({
  endpoint: '/question-2',
  options: [
    {
      text: 'Planned purchase – like a holiday, wedding, home improvements or buying a new TV',
    },
    {
      text: 'Buy a car',
    },
    {
      text: 'Pay off or combine debt',
    },
    {
      text: 'Essential items – like food and school uniform',
    },
    {
      text: 'Emergency or unplanned expense',
    },
  ],
});

export type WhatsTheMoneyForPageInstance = InstanceType<
  typeof WhatsTheMoneyForPage
>;
