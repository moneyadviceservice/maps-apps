import { FORM_FIELDS, FORM_GROUPS } from '../../data/questions/types';
import { FLOW } from '../../utils/getQuestions';

export const questionMapper = (questionNumber: number, currentFlow: FLOW) => {
  if (currentFlow === FLOW.ONLINE) {
    switch (questionNumber) {
      case 1:
        return FORM_GROUPS.consentOnline;
      case 2:
        return FORM_GROUPS.reference;
      case 3:
        return FORM_GROUPS.customerDetails;
    }
  }
  if (currentFlow === FLOW.TELEPHONE) {
    switch (questionNumber) {
      case 1:
        return FORM_FIELDS.consentDetails;
      case 2:
        return FORM_GROUPS.consentReferral;
      case 3:
        return FORM_GROUPS.reference;
      case 4:
        return FORM_GROUPS.whenToSpeak;
      case 5:
        return FORM_GROUPS.timeSlot;
      case 6:
        return FORM_GROUPS.customerDetails;
      case 7:
        return FORM_GROUPS.securityQuestions;
    }
  }
  return `q-${questionNumber}`;
};
