import { DataFromQuery } from '@maps-react/utils/pageFilter';

import { FORM_FIELDS } from '../../data/questions/types';
import { emailField, referenceField, textField } from './fieldValidation';

export const validateOnlineQuestions = (
  questionNbr: number,
  data: DataFromQuery,
) => {
  const fieldErrors: Record<string, boolean> = {};

  switch (questionNbr) {
    case 1: {
      const aConsentOnline =
        data?.[FORM_FIELDS.consentOnline]?.value?.length === 0;
      if (aConsentOnline) fieldErrors[FORM_FIELDS.consentOnline] = true;

      break;
    }
    case 2: {
      const cRef = data?.reference?.[FORM_FIELDS.customerReference];
      if (cRef && !referenceField(cRef))
        fieldErrors[FORM_FIELDS.customerReference] = true;

      const dName = data?.reference?.[FORM_FIELDS.departmentName];
      if (dName && !referenceField(dName, 40))
        fieldErrors[FORM_FIELDS.departmentName] = true;

      break;
    }
    case 3: {
      if (!data?.customerDetails) return fieldErrors;

      const fName = data?.customerDetails?.[FORM_FIELDS.firstName];
      if (!fName || !textField(fName))
        fieldErrors[FORM_FIELDS.firstName] = true;

      const sName = data?.customerDetails?.[FORM_FIELDS.lastName];
      if (!sName || !textField(sName)) fieldErrors[FORM_FIELDS.lastName] = true;

      const email = data?.customerDetails?.[FORM_FIELDS.email];
      if (!email || !emailField(email)) fieldErrors[FORM_FIELDS.email] = true;

      break;
    }
    default:
      return {};
  }
  return fieldErrors;
};
