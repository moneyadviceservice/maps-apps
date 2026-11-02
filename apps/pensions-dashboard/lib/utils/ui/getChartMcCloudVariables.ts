import { LumpSumAmountType, RecurringAmountType } from '../../constants';
import { BuiltIllustration } from '../../types';

export const getChartMcCloudVariables = (
  item: BuiltIllustration,
  type: 'bar' | 'donut',
) => {
  const { donut, bar } = item;

  const isDonutLegacy =
    type === 'donut' &&
    (donut?.eri?.amountType === LumpSumAmountType.CSHL ||
      donut?.ap?.amountType === LumpSumAmountType.CSHL);

  const isDonutAlternative =
    type === 'donut' &&
    (donut?.eri?.amountType === LumpSumAmountType.CSHN ||
      donut?.ap?.amountType === LumpSumAmountType.CSHN);

  const isBarLegacy =
    type === 'bar' &&
    (bar?.eri?.amountType === RecurringAmountType.INCL ||
      bar?.ap?.amountType === RecurringAmountType.INCL);

  const isBarAlternative =
    type === 'bar' &&
    (bar?.eri?.amountType === RecurringAmountType.INCN ||
      bar?.ap?.amountType === RecurringAmountType.INCN);

  const isMcCloud =
    isDonutLegacy || isDonutAlternative || isBarLegacy || isBarAlternative;

  const isLegacy = isDonutLegacy || isBarLegacy;
  const isAlternative = isDonutAlternative || isBarAlternative;

  return { isMcCloud, isLegacy, isAlternative };
};
