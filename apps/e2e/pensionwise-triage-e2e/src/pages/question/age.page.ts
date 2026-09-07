import { PageFactory } from '@lib/page-factory.lib';

export const AgePage = PageFactory.createQuestionPage({
  title: 'How old are you?',
  endpoint: '/pension-wise-triage/age',
  options: ['Under 50', '50 - 54', '55 - 74', '75 and over'],
  accordion: {
    title: 'Why are we asking?',
    description:
      'We want to make sure the guidance we give you is relevant to your age.',
  },
});
