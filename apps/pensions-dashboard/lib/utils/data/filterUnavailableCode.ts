import { MatchType } from '../../constants';

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
