import { PageFactory } from '@lib/page-factory.lib';

export const ReferCustomerToBusinessDebtline = PageFactory.createResourcePage({
  pageTitle: 'Debt Advice Referral',
  sectionTitle: 'Refer the customer to Business Debtline',
  endpoint: '/start/business-debtline-refer?q-1=1&q-2=0&q-3=0',
  content:
    'Ask self-employed customers, business owners or company directors to use Business Debtline - a free service where they can get impartial, non-judgmental help from business debt advice experts.https://www.businessdebtline.org (opens in a new tab)Tel: 0800 197 6026  Monday to Friday: 9am - 8pmCopy these details',
});

export type ReferCustomerToBusinessDebtlineInstance = InstanceType<
  typeof ReferCustomerToBusinessDebtline
>;
