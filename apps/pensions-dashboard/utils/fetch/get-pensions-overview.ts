import { PensionsOverviewModel } from '../types';
import { getConfirmedPensions } from './get-confirmed-pensions';
import { getIncompletePensions } from './get-incomplete-pensions';
import { getUnconfirmedPensions } from './get-unconfirmed-pensions';

export const getPensionsOverview = async () => {
  const confirmedPensions = await getConfirmedPensions();
  const unconfirmedPensions = await getUnconfirmedPensions();
  const incompletePensions = await getIncompletePensions();

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
