import { sortPensions } from '../sortPensions';
import { getPensionData } from './get-pensions-data';

export const getConfirmedPensions = async () => {
  const data = await getPensionData();

  // get all confirmed pensions
  const items = data.pensionPolicies
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
