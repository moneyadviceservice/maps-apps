import { PageFactory } from '@lib/page-factory.lib';

export const CustomerConsentPage = PageFactory.createQuestionPage({
  pageTitle: 'Debt Advice Referral',
  sectionTitle: 'Customer consent',
  content:
    "To make an online referral, please read the following consent information to the customer:'To send you a link to an online debt advice tool, we need your permission to share your name and email address with MoneyHelper. We will receive confirmation that the link has been sent to you.Do you give consent for us to share your information with MoneyHelper?'",
  endpoint: '/online/o-1',
  options: [
    {
      text: 'Yes',
    },
    {
      text: 'No',
    },
  ],
});

export type CustomerConsentPageInstance = InstanceType<
  typeof CustomerConsentPage
>;
