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
  illustration: BenefitIllustrationComponent,
): string | undefined => {
  if (illustration.unavailableReason) {
    return illustration.unavailableReason;
  }
  const payableDetails =
    illustration.payableDetails as AmountNotProvidedDetails;
  if (payableDetails.reason) {
    return payableDetails.reason;
  }
  return undefined;
};
