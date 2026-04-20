import { PensionType } from '../../constants';
import { BuiltIllustration } from '../../types';

export const sortByBarAmountDesc = (
  a: BuiltIllustration,
  b: BuiltIllustration,
) =>
  (b.bar?.eri?.annualAmount ?? b.bar?.ap?.annualAmount ?? 0) -
  (a.bar?.eri?.annualAmount ?? a.bar?.ap?.annualAmount ?? 0);

export const sortByDonutAmountDesc = (
  a: BuiltIllustration,
  b: BuiltIllustration,
) =>
  (b.donut?.eri?.amount ?? b.donut?.ap?.amount ?? 0) -
  (a.donut?.eri?.amount ?? a.donut?.ap?.amount ?? 0);

export const sortAndCombine = (
  items: BuiltIllustration[],
  calcType: PensionType,
) => {
  const recurring = items.filter((i) => i.calcType === calcType && i.bar);
  const lumpSums = items.filter((i) => i.calcType === calcType && i.donut);

  const sortByAmountType = (
    list: BuiltIllustration[],
    amountTypes: string[],
    isBar: boolean,
  ) =>
    amountTypes.flatMap((type) =>
      list
        .filter((i) => {
          const amountType = isBar
            ? i.bar?.eri?.amountType ?? i.bar?.ap?.amountType
            : i.donut?.eri?.amountType ?? i.donut?.ap?.amountType;

          // treat undefined as 'INC' for recurring
          return type === 'INC'
            ? amountType === 'INC' || amountType === undefined
            : amountType === type;
        })
        .sort(isBar ? sortByBarAmountDesc : sortByDonutAmountDesc),
    );

  const recurringOrder = ['INC', 'INCL', 'INCN'];
  const lumpOrder = ['CSH', 'CSHL', 'CSHN'];

  return [
    ...sortByAmountType(recurring, recurringOrder, true),
    ...sortByAmountType(lumpSums, lumpOrder, false),
  ];
};
