import { PensionArrangement } from '../types';
import { getAllPensions } from './get-all-pensions';
import { UserSession } from './get-pensions-data';

export const getPensionDetail = async (
  id: string,
  userSession: UserSession,
) => {
  const data = await getAllPensions(userSession);

  if (!data) {
    return null;
  }

  // loop through all arrays within data and find the pension with the matching id
  const item = [
    ...data.greenPensions,
    ...data.greenPensionsNoIncome,
    ...data.yellowPensions,
    ...data.redPensions,
  ].find((pension) => pension.externalAssetId === id);

  return item as PensionArrangement;
};
