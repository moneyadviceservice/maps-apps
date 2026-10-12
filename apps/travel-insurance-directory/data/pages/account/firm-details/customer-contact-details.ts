import { InputField } from 'types/register';

export const customerContactDetailsPage = {
  title: 'Customer contact details',
  description: 'Enter the contact details you want customers to use.',
  backLink: '/account',
  formKey: 'customer-contact-details',
  submitApi: '/api/account/firm-details/customer-contact-details',
  nextStep: '/account/firm-details/principle-place-of-business',
  currentRoute: '/account/firm-details/customer-contact-details',
};

export const emailField: InputField = {
  key: 'email_address',
  title: 'Customer contact email address',
  type: 'email',
  dataPath: 'office/contact',
  required: true,
};

export const telephoneNumberField: InputField = {
  key: 'telephone_number',
  title: 'Customer contact telephone number',
  type: 'phone',
  dataPath: 'office/contact',
  required: true,
};

export const websiteAddressField: InputField = {
  key: 'website',
  title: 'Website address',
  type: 'url',
  dataPath: 'office/contact',
  required: false,
};
