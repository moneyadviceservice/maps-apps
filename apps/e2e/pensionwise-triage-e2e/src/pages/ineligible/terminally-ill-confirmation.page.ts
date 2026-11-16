import { PageFactory } from '@lib/page-factory.lib';

export const TerminallyIllConfirmationPage = PageFactory.createIneligiblePage({
  title: "If you're living with a terminal illness",
  endpoint:
    '/pension-wise-triage/terminal-illness/coping-with-terminal-illness',
});
