import {
  AmountNotProvidedDetails,
  BenefitIllustrationComponent,
} from '../types';

/**
 * *Checks two different values to get the unavailable reason code - unavailableReason and reason
 * @param illustration
 * @returns
 */
export const getUnavailableCode = (
  component: BenefitIllustrationComponent,
): string | undefined => {
  if (component.unavailableReason) {
    return component.unavailableReason;
  }
  const payableDetails = component.payableDetails as AmountNotProvidedDetails;
  if (payableDetails.reason) {
    return payableDetails.reason;
  }
  return undefined;
};
