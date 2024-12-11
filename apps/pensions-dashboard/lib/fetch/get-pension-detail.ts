import { v4 as uuidv4 } from 'uuid';

import { PensionArrangement } from '../types';
import { getPensionData, UserSession } from './get-pensions-data';

export const getPensionDetail = async (
  id: string,
  userSession: UserSession,
) => {
  // generate a correlation ID
  const mhpdCorrelationId = uuidv4();

  const data = await getPensionData({ userSession, mhpdCorrelationId });

  // if data retrieval is not complete, return null
  if (!data.pensionsDataRetrievalComplete) {
    return null;
  }

  // get a pension by id
  const item = data.pensionPolicies
    .flatMap((policy) => policy.pensionArrangements)
    .find((pension) => pension.externalAssetId === id);

  return item as PensionArrangement;
};
