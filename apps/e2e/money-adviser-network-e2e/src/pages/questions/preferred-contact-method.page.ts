import { PageFactory } from '@lib/page-factory.lib';

export const PreferredContactMethodPage = PageFactory.createQuestionPage({
  pageTitle: 'Debt Advice Referral',
  sectionTitle: 'How would the customer like to get debt advice?',
  endpoint: '/start/q-4',
  options: [
    {
      text: 'Online',
      hint: 'Get help from a trusted debt advice partner online.',
    },
    {
      text: 'Telephone',
      hint: 'Arrange a call with a specialist debt adviser.',
    },
    {
      text: 'Face to face',
      hint: 'Speak to someone in person at a debt advice service close to them.',
    },
  ],
});

export type PreferredContactMethodPageInstance = InstanceType<
  typeof PreferredContactMethodPage
>;
