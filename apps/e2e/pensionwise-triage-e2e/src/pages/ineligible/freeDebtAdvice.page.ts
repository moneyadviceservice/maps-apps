import { PageFactory } from '@lib/page-factory.lib';

export const FreeDebtAdvicePage = PageFactory.createIneligiblePage({
  title: 'Get free debt advice first',
  endpoint: '/pension-wise-triage/debt-advice/have-not-received-debt-advice',
});
