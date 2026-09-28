import { PageFactory } from '@lib/page-factory.lib';

export const YourReferencesForUpdatesPage = PageFactory.createInputPage({
  pageTitle: 'Debt Advice Referral',
  sectionTitle: 'Your references for updates',
  content:
    'These references will be used for confirming that the link has been sent to your customer.',
  endpoint: '/online/o-2',
  fields: [
    {
      label: 'Your Internal Customer Reference (optional)',
      id: 'customerReference',
    },
    {
      label: 'Your Name / Department name (optional)',
      id: 'departmentName',
    },
  ],
});

export type YourReferencesForUpdatesPageInstance = InstanceType<
  typeof YourReferencesForUpdatesPage
>;
