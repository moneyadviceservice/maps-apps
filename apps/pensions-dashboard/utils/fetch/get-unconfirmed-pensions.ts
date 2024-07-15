import { sortPensions } from '../sortPensions';
import { getPensionData } from './get-pensions-data';

export const getUnconfirmedPensions = async () => {
  const data = await getPensionData();

  // get all unconfirmed pensions
  const items = data.pensionPolicies
    .flatMap((policy) => policy.pensionArrangements)
    .filter((pension) => pension.matchType === 'POSS');

  sortPensions(items);

  return items;
};
