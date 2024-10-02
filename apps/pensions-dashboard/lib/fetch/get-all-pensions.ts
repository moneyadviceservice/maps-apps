import { sortPensions } from '../utils/sortPensions';
import { PensionArrangement, PensionData } from '../types';
import { getPensionData, UserSession } from './get-pensions-data';

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
          illustration.illustrationComponents.every((illustration) => {
            // Ensure there is no unavailableReason
            return !illustration.unavailableReason;
          }),
        );
      }
      // If benefitIllustrations is not defined, include the policy
      return true;
    });

  sortPensions(items);
  return items;
};

const filterIncompletePensions = (data: PensionData) => {
  const excludedReasons = ['DBC', 'DCC', 'NEW', 'DCHA'];
  // get all incomplete pensions
  const items: PensionArrangement[] = data.pensionPolicies
    .flatMap((policy) => policy.pensionArrangements)
    // Business rules
    // matchType is “DEFN”
    // AND
    // it has illustrationUnavailable reason codes:
    // “DBC”, “DCC”, “NEW” or “DCHA”
    .filter((pension) => {
      if (pension.matchType !== 'DEFN') {
        return false;
      }

      // Check if any benefitIllustrations have excluded reasons
      if (pension.benefitIllustrations) {
        for (const illustration of pension.benefitIllustrations) {
          for (const component of illustration.illustrationComponents) {
            const unavailableReason = component.unavailableReason ?? '';
            if (excludedReasons.includes(unavailableReason)) {
              return true;
            } else {
              return false;
            }
          }
        }
      } else {
        return false;
      }
    });

  sortPensions(items);

  return items;
};

const filterUnconfirmedPensions = (data: PensionData) => {
  const items: PensionArrangement[] = data.pensionPolicies
    .flatMap((policy) => policy.pensionArrangements)
    .filter((pension) => pension.matchType === 'POSS');

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
