import { PageFactory } from '@lib/page-factory.lib';

export const TerminallyIllPage = PageFactory.createQuestionPage({
  title: 'Have you been diagnosed with a terminal illness?',
  endpoint: '/pension-wise-triage/terminal-illness',
  options: ['Yes', 'No'],
  accordion: {
    title: 'Why are we asking?',
    description:
      "If you're coping with a terminal illness, there may be easier and quicker ways to access your pension.",
  },
});
