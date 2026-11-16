import { CookieData, FORM_FIELDS } from '../../data/questions/types';
import {
  phoneField,
  postcodeField,
  referenceField,
  textField,
} from './fieldValidation';

export const validateTelephoneQuestions = (
  questionNbr: number,
  data: CookieData,
) => {
  const fieldErrors: Record<string, boolean> = {};

  switch (questionNbr) {
    case 1: {
      const aConsentDetails =
        data?.[FORM_FIELDS.consentDetails]?.value?.length === 0;
      if (aConsentDetails) fieldErrors[FORM_FIELDS.consentDetails] = true;

      return fieldErrors;
    }
    case 2: {
      const aConsentReferral =
        data?.[FORM_FIELDS.consentReferral]?.value?.length === 0;
      if (aConsentReferral) fieldErrors[FORM_FIELDS.consentReferral] = true;

      return fieldErrors;
    }

    case 3: {
      const cRef = data?.reference?.[FORM_FIELDS.customerReference];
      if (cRef && !referenceField(cRef)) {
        fieldErrors[FORM_FIELDS.customerReference] = true;
      }
      const dName = data?.reference?.[FORM_FIELDS.departmentName];
      if (dName && !referenceField(dName, 40))
        fieldErrors[FORM_FIELDS.departmentName] = true;

      return fieldErrors;
    }
    case 4:
    case 5:
      return {};

    case 6: {
      if (!data?.customerDetails) return fieldErrors;

      const fName = data?.customerDetails?.[FORM_FIELDS.firstName];
      if (!fName || !textField(fName))
        fieldErrors[FORM_FIELDS.firstName] = true;

      const sName = data?.customerDetails?.[FORM_FIELDS.lastName];
      if (!sName || !textField(sName)) fieldErrors[FORM_FIELDS.lastName] = true;

      const phone = data?.customerDetails?.[FORM_FIELDS.telephone];
      if (!phone || !phoneField(phone))
        fieldErrors[FORM_FIELDS.telephone] = true;

      return fieldErrors;
    }

    case 7: {
      if (!data?.securityQuestions) return fieldErrors;
      const sPostcode = data?.securityQuestions?.[FORM_FIELDS.postcode];
      if (!sPostcode || !postcodeField(sPostcode)) {
        fieldErrors[FORM_FIELDS.postcode] = true;
        if (sPostcode) {
          fieldErrors['postcode-format'] = true;
        }
      }

      const sQuestion = data?.securityQuestions?.[FORM_FIELDS.securityQuestion];
      if (!sQuestion) fieldErrors[FORM_FIELDS.securityQuestion] = true;

      const sAnswer = data?.securityQuestions?.[FORM_FIELDS.securityAnswer];
      if (!sAnswer) fieldErrors[FORM_FIELDS.securityAnswer] = true;

      return fieldErrors;
    }
    default:
      return {};
  }
};
