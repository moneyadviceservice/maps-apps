import { DEFAULT_LOAD_TIME } from '../constants';
import { PensionsDataLoadTimes } from '../types';
import { getPensionData, UserSession } from './get-pensions-data';

export const getLoadTimes = async (userSession: UserSession) => {
  const data = await getPensionData({
    userSession,
  });

  // if predictedTotalDataRetrievalTime is undefined, use default time
  const predictedTotalDataRetrievalTime =
    data?.predictedTotalDataRetrievalTime ?? DEFAULT_LOAD_TIME;

  // if predictedRemainingDataRetrievalTime is undefined, use default time
  const predictedRemainingDataRetrievalTime =
    data?.predictedRemainingDataRetrievalTime ?? DEFAULT_LOAD_TIME;

  // if remaining time is greater than total expected time, use remaining time as the total  time
  const expectedTime =
    predictedRemainingDataRetrievalTime > predictedTotalDataRetrievalTime
      ? predictedRemainingDataRetrievalTime
      : predictedTotalDataRetrievalTime;

  const remainingTime = predictedRemainingDataRetrievalTime;

  return {
    expectedTime,
    remainingTime,
  } as PensionsDataLoadTimes;
};
