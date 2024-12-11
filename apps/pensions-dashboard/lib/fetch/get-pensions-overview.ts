import { PensionsOverviewModel } from '../types';
import { getAllPensions } from './get-all-pensions';
import { UserSession } from './get-pensions-data';

export const getPensionsOverview = async (userSession: UserSession) => {
  const data = await getAllPensions(userSession);

  // If no data, return null
  if (!data) {
    return null;
  }

  const { confirmedPensions, incompletePensions, unconfirmedPensions } = data;
  const totalPensions =
    confirmedPensions.length +
    incompletePensions.length +
    unconfirmedPensions.length;

  return {
    totalPensions,
    confirmedPensions,
    incompletePensions,
    unconfirmedPensions,
  } as PensionsOverviewModel;
};
