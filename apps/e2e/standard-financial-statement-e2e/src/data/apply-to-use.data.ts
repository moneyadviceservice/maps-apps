import type { FormFieldData, ValidationErrorOption } from './types';

export const PART1_FORM_FIELDS: FormFieldData[] = [
  {
    id: 'field-organisationName',
    selector: 'input[type="text"]',
  },
  {
    id: 'field-organisationStreet',
    selector: 'input[type="text"]',
  },
  {
    id: 'field-organisationCity',
    selector: 'input[type="text"]',
  },
  {
    id: 'field-organisationPostcode',
    selector: 'input[type="text"]',
  },
  {
    id: 'field-organisationType',
    selector: 'select',
  },
  {
    id: 'field-geoRegions',
    selector: 'fieldset',
  },
  {
    id: 'field-organisationUse',
    selector: 'select',
  },
  {
    id: 'field-debtAdvice',
    selector: 'fieldset',
  },
  {
    id: 'field-sfslive',
    selector: 'fieldset',
  },
  {
    id: 'field-sfsLaunchDate',
    selector: 'input[type="date"]',
  },
  {
    id: 'field-fcaReg',
    selector: 'fieldset',
  },
  {
    id: 'field-memberships',
    selector: 'fieldset',
  },
];

export const PART1_REQUIRED_ERRORS: ValidationErrorOption[] = [
  {
    fieldName: 'field-organisationName',
    message: 'Organisation name - This value is required.',
    fieldLevelMessage: 'This value is required.',
  },
  {
    fieldName: 'field-organisationStreet',
    message: 'Organisation street address - This value is required.',
    fieldLevelMessage: 'This value is required.',
  },
  {
    fieldName: 'field-organisationCity',
    message: 'Organisation town/city - This value is required.',
    fieldLevelMessage: 'This value is required.',
  },
  {
    fieldName: 'field-organisationPostcode',
    message: 'Organisation postcode - This value is required.',
    fieldLevelMessage: 'This value is required.',
  },
  {
    fieldName: 'field-organisationType',
    message: 'What type of organisation are you? - This value is required.',
    fieldLevelMessage: 'This value is required.',
  },
  {
    fieldName: 'field-geoRegions',
    message:
      'What geographical regions does your services cover? - This value is required.',
    fieldLevelMessage: 'This value is required.',
  },
  {
    fieldName: 'field-organisationUse',
    message: 'What is your intended use of SFS? - This value is required.',
    fieldLevelMessage: 'This value is required.',
  },
  {
    fieldName: 'field-debtAdvice',
    message: 'How do you deliver advice? - This value is required.',
    fieldLevelMessage: 'This value is required.',
  },
  {
    fieldName: 'field-sfslive',
    message: 'Are you live with the SFS? - This value is required.',
    fieldLevelMessage: 'This value is required.',
  },
  {
    fieldName: 'field-sfsLaunchDate',
    message:
      'SFS Launch date (or estimated launch date) - Please enter a valid date.',
    fieldLevelMessage: 'Please enter a valid date.',
  },
  {
    fieldName: 'field-fcaReg',
    message:
      'Is your organisation registered with the Financial Conduct Authority? - This value is required.',
    fieldLevelMessage: 'This value is required.',
  },
  {
    fieldName: 'field-memberships',
    message:
      'If you belong to a trade or membership body, please select from the list below: - This value is required.',
    fieldLevelMessage: 'This value is required.',
  },
];

export const PART1_WEBSITE_URL_ERROR: ValidationErrorOption[] = [
  {
    fieldName: 'field-organisationWebsite',
    message:
      'Organisation website address (optional) - Please enter a valid URL.',
    fieldLevelMessage: 'Please enter a valid URL.',
  },
];

export const PART2_FORM_FIELDS: FormFieldData[] = [
  {
    id: 'field-firstName',
    selector: 'input[type="text"]',
  },
  {
    id: 'field-lastName',
    selector: 'input[type="text"]',
  },
  {
    id: 'field-emailAddress',
    selector: 'input[type="email"]',
  },
  {
    id: 'field-tel',
    selector: 'input[type="text"]',
  },
  {
    id: 'field-jobTitle',
    selector: 'input[type="text"]',
  },
  {
    id: 'field-password',
    selector: 'input[type="password"]',
  },
  {
    id: 'field-confirmPassword',
    selector: 'input[type="password"]',
  },
  {
    id: 'field-codeOfConduct',
    selector: 'input[type="checkbox"]',
  },
];

export const PART2_REQUIRED_ERRORS: ValidationErrorOption[] = [
  {
    fieldName: 'field-firstName',
    message: 'First name - This value is required.',
    fieldLevelMessage: 'This value is required.',
  },
  {
    fieldName: 'field-lastName',
    message: 'Surname - This value is required.',
    fieldLevelMessage: 'This value is required.',
  },
  {
    fieldName: 'field-emailAddress',
    message: 'Email address - This value is required.',
    fieldLevelMessage: 'This value is required.',
  },
  {
    fieldName: 'field-tel',
    message: 'Telephone Number - This value is required.',
    fieldLevelMessage: 'This value is required.',
  },
  {
    fieldName: 'field-jobTitle',
    message: 'Job Title - This value is required.',
    fieldLevelMessage: 'This value is required.',
  },
  {
    fieldName: 'field-password',
    message: 'Password - This value is required.',
    fieldLevelMessage: 'This value is required.',
  },
  {
    fieldName: 'field-confirmPassword',
    message: 'Confirm Password - This value is required.',
    fieldLevelMessage: 'This value is required.',
  },
  {
    fieldName: 'field-codeOfConduct',
    message: 'Code of Conduct agreement - This value is required.',
    fieldLevelMessage: 'This value is required.',
  },
];

export const PASSWORD_MISMATCH_ERRORS: ValidationErrorOption[] = [
  {
    fieldName: 'field-password',
    message:
      'Password - Please ensure your password and password confirmation are identical.',
    fieldLevelMessage:
      'Please ensure your password and password confirmation are identical.',
  },
  {
    fieldName: 'field-confirmPassword',
    message:
      'Confirm Password - Please ensure your password and password confirmation are identical.',
    fieldLevelMessage:
      'Please ensure your password and password confirmation are identical.',
  },
];

export const CONFIRMATION_MESSAGE =
  'Thank you for your applicationWe will review the application in the next 10 working days. Once your application has been reviewed you will receive one of the following:An email confirming that your application was successful. This email will also include your SFS Membership NumberAn email request for additional informationAn email confirming rejection of applicationIf you have any questions, please contact us at sfs.support@maps.org.uk';
