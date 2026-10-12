import { PageFactory } from '@lib/page-factory.lib';

export const DebtAdvicePage = PageFactory.createQuestionPage({
  title: 'Have you received debt advice?',
  endpoint: '/pension-wise-triage/debt-advice',
  options: ['Yes', 'No'],
  accordion: {
    title: 'Why are we asking?',
    description:
      "If you haven't received debt advice, you may not benefit from getting pensions guidance right now.",
  },
});
