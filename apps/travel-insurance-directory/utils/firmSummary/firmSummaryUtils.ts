import { firmSummary } from 'data/components/firmSummary/firmSummary';

import useTranslation from '@maps-react/hooks/useTranslation';

import { formatCurrency, formatTimeAmPm } from './formatting';

export type DayTimes = { opening: string | null; closing: string | null };
export type Z = ReturnType<typeof useTranslation>['z'];

export const getMedicalConditionsText = (
  coverage: string | null,
  z: Z,
): string | null => {
  if (coverage === 'all') {
    return firmSummary.medicalConditions.mostConditions(z);
  }
  return coverage || null;
};

export const formatYesWithAmount = (
  value: boolean | null,
  amount: number | null,
  z: Z,
): string | null => {
  if (value === true) {
    if (amount) {
      return firmSummary.medicalEquipment.yesUpTo(z)(formatCurrency(amount));
    }
    return firmSummary.medicalEquipment.yes(z);
  }
  return null;
};

export const formatOpeningTimesInline = (
  weekday: DayTimes | undefined,
  saturday: DayTimes | undefined,
  sunday: DayTimes | undefined,
  z: Z,
): string => {
  const parts: string[] = [];
  if (weekday?.opening || weekday?.closing) {
    parts.push(
      `${firmSummary.openingTimes.mondayFriday(z)}, ${formatTimeAmPm(
        weekday.opening,
      )}-${formatTimeAmPm(weekday.closing)}`,
    );
  }
  if (saturday?.opening || saturday?.closing) {
    parts.push(
      `${firmSummary.openingTimes.saturday(z)}, ${formatTimeAmPm(
        saturday.opening,
      )}-${formatTimeAmPm(saturday.closing)}`,
    );
  }
  if (sunday?.opening || sunday?.closing) {
    parts.push(
      `${firmSummary.openingTimes.sunday(z)}, ${formatTimeAmPm(
        sunday.opening,
      )}-${formatTimeAmPm(sunday.closing)}`,
    );
  }
  return parts.join(' / ');
};
