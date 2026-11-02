import { PageFactory } from '@lib/page-factory.lib';

export const DefinedContributionsPage = PageFactory.createQuestionPage({
  title: 'Do you have a UK-based defined contribution pension?',
  endpoint: '/pension-wise-triage/pension-type',
  options: ['Yes', 'No'],
  accordion: {
    title: 'Why are we asking?',
    description:
      'This service can only give guidance on UK-based defined contribution pensions.',
  },
});
