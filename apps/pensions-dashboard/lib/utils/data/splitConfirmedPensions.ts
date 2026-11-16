import { PensionsSummaryArrangement } from '../../api/pension-data-service';
import { PensionArrangement } from '../../types';
import { sortPensions } from './sortPensions';

type SortablePension = PensionArrangement | PensionsSummaryArrangement;

/**
 * Splits confirmed pensions into those with income and those without, sorting each group
 * @param pensions
 * @returns an object containing two arrays: greenPensions and greenPensionsNoIncome
 */
export const splitConfirmedPensions = <T extends SortablePension>(
  pensions: T[],
) => {
  const greenPensions = sortPensions(
    pensions.filter((pension) => pension.hasIncome),
  );
  const greenPensionsNoIncome = sortPensions(
    pensions.filter((pension) => !pension.hasIncome),
  );
  return { greenPensions, greenPensionsNoIncome };
};
