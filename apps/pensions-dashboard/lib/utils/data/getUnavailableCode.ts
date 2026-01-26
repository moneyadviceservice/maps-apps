import { MatchType } from '../../constants';
import {
  AmountNotProvidedDetails,
  BenefitIllustrationComponent,
} from '../../types';

/**
 * Gets the unavailable reason code - from the illustration unavailableReason
 * or the AmountNotProvided reason code
 * @param component
 * @returns the unavailable reason code or undefined
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

/**
 * *Returns the unavailable reason code based on the matchType and unavailableCode
 * @param matchType
 * @param unavailableCode
 * @param matchType
 * @returns a string representing the unavailable reason code or empty string
 */
export const filterUnavailableCode = (
  matchType: MatchType,
  unavailableCode: string | undefined,
): string => {
  return matchType === MatchType.SYS
    ? 'SYS_MATCHTYPE'
    : matchType === MatchType.NEW
    ? 'NEW_MATCHTYPE'
    : unavailableCode ?? '';
};
