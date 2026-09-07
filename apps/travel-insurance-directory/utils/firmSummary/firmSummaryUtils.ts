import { firmSummary } from 'data/components/firmSummary/firmSummary';
import { OpeningTimes } from 'types/travel-insurance-firm';

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
  openingTimes: OpeningTimes,
  z: Z,
): string => {
  const weekday = openingTimes?.weekday;
  const weekend = openingTimes?.weekend;
  const parts: string[] = [];
  if (weekday?.opening_time || weekday?.closing_time) {
    parts.push(
      `${firmSummary.openingTimes.mondayFriday(z)}, ${formatTimeAmPm(
        weekday.opening_time,
      )}-${formatTimeAmPm(weekday.closing_time)}`,
    );
  }
  if (weekend?.saturday_opening_time || weekend?.saturday_closing_time) {
    parts.push(
      `${firmSummary.openingTimes.saturday(z)}, ${formatTimeAmPm(
        weekend.saturday_opening_time,
      )}-${formatTimeAmPm(weekend.saturday_closing_time)}`,
    );
  }
  if (weekend?.sunday_opening_time || weekend?.sunday_closing_time) {
    parts.push(
      `${firmSummary.openingTimes.sunday(z)}, ${formatTimeAmPm(
        weekend.sunday_opening_time,
      )}-${formatTimeAmPm(weekend.sunday_closing_time)}`,
    );
  }
  return parts.join(' / ');
};
