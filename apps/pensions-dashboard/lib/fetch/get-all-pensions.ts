import { sortPensions } from '../utils/sortPensions';
import {
  PensionArrangement,
  PensionData,
  BenefitIllustrationComponent,
} from '../types';
import { getPensionData, UserSession } from './get-pensions-data';

const hasExcludedReason = (
  illustrationComponents: BenefitIllustrationComponent[],
  excludedReasons: string[],
) => {
  return illustrationComponents.some((illustration) =>
    excludedReasons.includes(illustration?.unavailableReason ?? ''),
  );
};

const filterConfirmedPensions = (data: PensionData) => {
  const items: PensionArrangement[] = data.pensionPolicies
    .flatMap((policy) => policy.pensionArrangements)
    // Business rules
    // matchType is “DEFN”
    // AND
    // there is no illustrationUnavailable reason
    .filter((pension) => {
      if (pension.matchType !== 'DEFN') {
        return false;
      }

      // Check if any benefitIllustrations have excluded reasons
      if (pension.benefitIllustrations) {
        return pension.benefitIllustrations.every((illustration) =>
          illustration.illustrationComponents.every(
            (illustration) =>
              // Ensure there is no unavailableReason
              !illustration.unavailableReason,
          ),
        );
      }
      // If benefitIllustrations is not defined, include the policy
      return true;
    });

  sortPensions(items);
  return items;
};

const filterIncompletePensions = (data: PensionData) => {
  const excludedReasons = ['DBC', 'DCC', 'NEW', 'DCHA', 'ANO', 'NET', 'TRN'];
  // get all incomplete pensions
  const items: PensionArrangement[] = data.pensionPolicies
    .flatMap((policy) => policy.pensionArrangements)
    // Business rules
    // matchType is “DEFN”
    // AND
    // it has illustrationUnavailable reason codes:
    // “DBC”, “DCC”, “NEW”, “DCHA”, "ANO”, “NET”, or “TRN"
    .filter(
      (pension) =>
        pension.matchType === 'DEFN' &&
        pension.benefitIllustrations?.some((illustration) =>
          hasExcludedReason(
            illustration.illustrationComponents,
            excludedReasons,
          ),
        ),
    );

  sortPensions(items);

  return items;
};

const filterUnconfirmedPensions = (data: PensionData) => {
  const excludedReasons = ['MEM', 'PPF', 'WU'];
  const items: PensionArrangement[] = data.pensionPolicies
    .flatMap((policy) => policy.pensionArrangements)
    // Business rules
    // matchType is “POSS”
    // OR
    // matchType is “DEFN” AND
    // has illustrationUnavailable reason codes:
    // “MEM”, “PPF” and “WU”
    .filter(
      (pension) =>
        pension.matchType === 'POSS' ||
        (pension.matchType === 'DEFN' &&
          pension.benefitIllustrations?.some((illustration) =>
            hasExcludedReason(
              illustration.illustrationComponents,
              excludedReasons,
            ),
          )),
    );

  sortPensions(items);

  return items;
};

export const getAllPensions = async (userSession: UserSession) => {
  const data = await getPensionData(userSession);

  // filter the pensions data
  const confirmedPensions = filterConfirmedPensions(data);
  const incompletePensions = filterIncompletePensions(data);
  const unconfirmedPensions = filterUnconfirmedPensions(data);

  return { confirmedPensions, incompletePensions, unconfirmedPensions };
};
