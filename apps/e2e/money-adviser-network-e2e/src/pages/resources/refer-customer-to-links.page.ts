import { PageFactory } from '@lib/page-factory.lib';

export const ReferCustomerToLinksPage = PageFactory.createResourcePage({
  pageTitle: 'Debt Advice Referral',
  sectionTitle: 'Refer the customer to the following links',
  endpoint: '/start/money-management-refer?q-1=0',
  content:
    'Please inform the customer of the following:There is information on the MoneyHelper website that you might find helpful. It offers free and impartial guidance for dealing with money troubles:Would you like me to send you more details via email or text or you can just visit MoneyHelper.org.uk?There is a helpful section on benefits https://www.moneyhelper.org.uk/en/benefits (opens in a new tab)The "Money troubles" section has useful information to help with cost of living https://www.moneyhelper.org.uk/en/money-troubles (opens in a new tab)Search for budget planner for a really useful tool that will help you create a budget and see where your money is going https://www.moneyhelper.org.uk/en/everyday-money/budgeting/budget-planner (opens in a new tab)Copy these details',
});

export type ReferCustomerToLinksPageInstance = InstanceType<
  typeof ReferCustomerToLinksPage
>;
