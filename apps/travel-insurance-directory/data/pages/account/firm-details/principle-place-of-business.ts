import { InputField } from 'types/register';

export const principlePlaceOfBusinessPage = {
  title: 'Principle place of business',
  description: 'Enter the contact details you want customers to use.',
  backLink: '/account/firm-details/customer-contact-details',
  formKey: 'principle-place-of-business',
  submitApi: '/api/account/firm-details/principle-place-of-business',
  nextStep: '/account/firm-details/opening-hours',
  currentRoute: '/account/firm-details/principle-place-of-business',
};

export const addressLineOneField: InputField = {
  key: 'line_one',
  title: 'Address line one ',
  type: 'text',
  dataPath: 'office/address',
  required: true,
};

export const addressLineTwoField: InputField = {
  key: 'line_two',
  title: 'Address line two ',
  type: 'text',
  dataPath: 'office/address',
  required: false,
};

export const townField: InputField = {
  key: 'town',
  title: 'Town ',
  type: 'text',
  dataPath: 'office/address',
  required: true,
};

export const countryField: InputField = {
  key: 'country',
  title: 'Country ',
  type: 'text',
  dataPath: 'office/address',
  required: true,
};

export const postcodeField: InputField = {
  key: 'postcode',
  title: 'Postcode',
  type: 'postcode',
  dataPath: 'office/address',
  required: true,
};
