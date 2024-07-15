import { PensionArrangement } from '../types';
import { getPensionData } from './get-pensions-data';

export const getPensionDetail = async (id: string) => {
  const data = await getPensionData();

  // get a pension by id
  const item = data.pensionPolicies
    .flatMap((policy) => policy.pensionArrangements)
    .find((pension) => pension.externalAssetId === id);

  return item as PensionArrangement;
};
