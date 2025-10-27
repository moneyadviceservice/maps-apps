import { PensionType } from '../constants';
import { PensionArrangement } from '../types';

export const sortPensions = (items: PensionArrangement[]) => {
  // sort the array by pension name and then scheme name
  items.sort((a, b) => {
    const adminComparison = a.pensionAdministrator.name.localeCompare(
      b.pensionAdministrator.name,
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
