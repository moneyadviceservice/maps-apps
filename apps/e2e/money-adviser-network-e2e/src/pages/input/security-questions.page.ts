import { PageFactory } from '@lib/page-factory.lib';

/**
 * This one is specifically if you've followed the online journey
 */
export const SecurityQuestionsPage = PageFactory.createInputPage({
  pageTitle: 'Debt Advice Referral',
  sectionTitle: 'Security questions',
  endpoint: '/telephone/t-7',
  fields: [
    {
      label: "Customer's postcode",
      id: 'postcode',
    },
    {
      label: 'Security question',
      id: 'securityQuestion',
    },
    {
      label: 'Answer to security question',
      id: 'securityAnswer',
    },
  ],
});

export type SecurityQuestionsPageInstance = InstanceType<
  typeof SecurityQuestionsPage
>;
