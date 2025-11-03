import { MatchType } from '../../constants';
import {
  AmountNotProvidedDetails,
  BenefitIllustrationComponent,
} from '../../types';

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

/**
 * *Returns the unavailable reason code based on the matchType and unavailableCode
 * @param matchType
 * @param unavailableCode
 * @param name
 * @returns
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
