import {
  hasLapsedRegistrationEmailBeenSent,
  hasRegWindowStartEmailBeenSent,
  hasReregistrationLapsed,
  isInRenewalWindow,
  RegistrationDatingFields,
} from 'lib/account/reregistrationState';
import { hasFcaVisibilityBlock } from 'lib/firms/fcaVisibility';
import { TravelInsuranceFirmDocument } from 'types/travel-insurance-firm';

export {
  HIDDEN_DUE_TO_FCA,
  HIDDEN_DUE_TO_TRADING_NAME,
  hasFcaVisibilityBlock,
} from 'lib/firms/fcaVisibility';

/** @deprecated Prefer hasFcaVisibilityBlock — status is no longer part of the check. */
export const isHiddenDueToFcaInvalidation = (
  firm: TravelInsuranceFirmDocument,
) => hasFcaVisibilityBlock(firm);

export const validateReRegistration = (firm: TravelInsuranceFirmDocument) => {
  const datingFields = firm as RegistrationDatingFields;
  return {
    isWithinRenewalWindow: isInRenewalWindow(datingFields),
    hasWindowStartEmailBeenSent: hasRegWindowStartEmailBeenSent(firm),
    reregistrationHasLapsed: hasReregistrationLapsed(datingFields),
    hasSentLapsedEmail: hasLapsedRegistrationEmailBeenSent(firm),
  };
};
