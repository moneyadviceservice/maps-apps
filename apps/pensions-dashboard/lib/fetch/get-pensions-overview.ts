import { PensionsOverviewModel } from '../types';
import { getAllPensions } from './get-all-pensions';
import { UserSession } from './get-pensions-data';

export const getPensionsOverview = async (userSession: UserSession) => {
  const data = await getAllPensions(userSession);

  // If no data, return null
  if (!data) {
    return null;
  }

  const {
    greenPensions,
    yellowPensions,
    redPensions,
    greenPensionsNoIncome,
    unsupportedPensions,
  } = data;
  const totalPensions =
    greenPensions.length +
    greenPensionsNoIncome.length +
    yellowPensions.length +
    redPensions.length;

  return {
    totalPensions,
    greenPensions,
    greenPensionsNoIncome,
    yellowPensions,
    redPensions,
    unsupportedPensions,
  } as PensionsOverviewModel;
};
