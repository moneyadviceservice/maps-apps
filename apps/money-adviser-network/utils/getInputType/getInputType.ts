import { FORM_FIELDS } from '../../data/questions/types';

const specialFieldTypes: Partial<Record<keyof typeof FORM_FIELDS, string>> = {
  [FORM_FIELDS.email]: 'Email field',
  [FORM_FIELDS.telephone]: 'Telephone field',
  [FORM_FIELDS.postcode]: 'Postcode field',
  [FORM_FIELDS.securityQuestion]: 'Drop down',
  [FORM_FIELDS.consentOnline]: 'Radio button',
  [FORM_FIELDS.consentDetails]: 'Radio button',
  [FORM_FIELDS.consentReferral]: 'Radio button',
  [FORM_FIELDS.timeSlot]: 'Radio button',
  [FORM_FIELDS.whenToSpeak]: 'Radio button',
};

export const getInputType = (fieldName: string) =>
  specialFieldTypes[fieldName as keyof typeof FORM_FIELDS] ??
  (fieldName in FORM_FIELDS ? 'Text field' : 'Radio button');
