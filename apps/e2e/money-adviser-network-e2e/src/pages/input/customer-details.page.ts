import { PageFactory } from '@lib/page-factory.lib';

/**
 * This one is specifically if you've followed the online journey
 */
export const CustomersDetailsPageEmail = PageFactory.createInputPage({
  pageTitle: 'Debt Advice Referral',
  sectionTitle: "Customer's details",
  endpoint: '/online/o-3',
  fields: [
    {
      label: "Customer's first name",
      id: 'firstName',
    },
    {
      label: "Customer's last name",
      id: 'lastName',
    },
    {
      label: "Customer's email address",
      id: 'email',
    },
  ],
});

export type CustomersDetailsPageEmailInstance = InstanceType<
  typeof CustomersDetailsPageEmail
>;

/**
 * This one is specifically if you've followed the telephone journey
 */
export const CustomersDetailsPageTelephone = PageFactory.createInputPage({
  pageTitle: 'Debt Advice Referral',
  sectionTitle: "Customer's details",
  endpoint: '/telephone/t-6',
  fields: [
    {
      label: "Customer's first name",
      id: 'firstName',
    },
    {
      label: "Customer's last name",
      id: 'lastName',
    },
    {
      label: "Customer's telephone number",
      id: 'telephone',
    },
  ],
});

export type CustomersDetailsPageTelephoneInstance = InstanceType<
  typeof CustomersDetailsPageTelephone
>;
