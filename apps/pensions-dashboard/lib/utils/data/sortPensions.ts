import { PensionsSummaryArrangement } from '../../api/pension-data-service';
import { PensionType } from '../../constants';
import { PensionArrangement } from '../../types';

type SortablePension = PensionArrangement | PensionsSummaryArrangement;

const getAdminName = (pension: SortablePension): string => {
  return 'administratorName' in pension
    ? pension.administratorName
    : pension.pensionAdministrator.name;
};

export const sortPensions = <T extends SortablePension>(items: T[]): T[] => {
  if (items.length === 0) return items;

  // sort the array by pension name and then scheme name
  items.sort((a, b) => {
    const adminComparison = getAdminName(a).localeCompare(
      getAdminName(b),
      undefined,
      { sensitivity: 'base' },
    );
    if (adminComparison !== 0) {
      return adminComparison;
    }
    return a.schemeName.localeCompare(b.schemeName, undefined, {
      sensitivity: 'base',
    });
  });

  // if any of the pensions are a State Pension...move it to the top
  const index = items.findIndex((item) => item.pensionType === PensionType.SP);
  if (index > -1) {
    items.unshift(...items.splice(index, 1));
  }

  return items;
};
