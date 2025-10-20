import { PensionArrangement } from '../types';
import { logger } from '../utils';
import { getAllPensions } from './get-all-pensions';
import { UserSession } from './get-pensions-data';

export const getPensionDetail = async (
  id: string,
  userSession: UserSession,
) => {
  const data = await getAllPensions(userSession);

  if (!data) {
    logger.error({
      message: 'No pension data found from API',
      url: 'lib/fetch/get-pension-detail.ts',
      session: userSession,
      data: {
        pensionID: id,
      },
    });
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
