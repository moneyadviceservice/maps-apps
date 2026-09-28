import { PageFactory } from '@lib/page-factory.lib';

export const CustomerNeedsPage = PageFactory.createQuestionPage({
  pageTitle: 'Debt Advice Referral',
  sectionTitle: 'What does the customer need?',
  endpoint: '/start/q-1',
  options: [
    {
      text: 'Money management help',
      hint: 'Help with day-to-day money management through online tools and guidance.',
    },
    {
      text: 'Debt advice',
      hint: 'Get personalised help on how to manage debt.',
    },
  ],
  expandableSection: {
    title: 'How to find out what help the customer needs',
    text: "Ask these questions:Have you already missed a payment?Are you likely to miss an upcoming payment?Are you taking on new debt to pay existing debt?If the answer is 'yes' to any of these, your customer could benefit from debt advice.",
  },
});

export type CustomerNeedsPageInstance = InstanceType<typeof CustomerNeedsPage>;
