import { getPensionData, UserSession } from './get-pensions-data';
import { PensionArrangement } from '../types';

export const getPensionDetail = async (
  id: string,
  userSession: UserSession,
) => {
  const data = await getPensionData(userSession);

  // get a pension by id
  const item = data.pensionPolicies
    .flatMap((policy) => policy.pensionArrangements)
    .find((pension) => pension.externalAssetId === id);

  return item as PensionArrangement;
};
