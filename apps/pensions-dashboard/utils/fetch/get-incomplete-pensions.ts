import { sortPensions } from '../sortPensions';
import { getPensionData } from './get-pensions-data';

export const getIncompletePensions = async () => {
  const data = await getPensionData();

  const excludedReasons = ['DBC', 'DCC', 'NEW', 'DCHA'];
  // get all incomplete pensions
  const items = data.pensionPolicies
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
