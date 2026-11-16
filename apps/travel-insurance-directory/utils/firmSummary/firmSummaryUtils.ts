import { firmSummary } from 'data/components/firmSummary/firmSummary';
import type {
  MedicalSpecialismCover,
  MedicalSpecialisms,
  OpeningTimes,
} from 'types/travel-insurance-firm';

import useTranslation from '@maps-react/hooks/useTranslation';

import { formatCurrency, formatTimeAmPm } from './formatting';

export type DayTimes = { opening: string | null; closing: string | null };
export type Z = ReturnType<typeof useTranslation>['z'];

function getSpecialismLabel(cover: string, z: Z): string {
  const specialisms = firmSummary.medicalConditions.specialisms;
  if (cover in specialisms) {
    const condition = specialisms[cover as MedicalSpecialismCover](z);
    return `${firmSummary.medicalConditions.specialisesInPrefix(
      z,
    )} ${condition}`;
  }

  return cover;
}

export const getMedicalConditionsText = (
  medicalSpecialisms: MedicalSpecialisms | null | undefined,
  coverage: string | null | undefined,
  z: Z,
): string | null => {
  if (medicalSpecialisms?.specialised_medical_conditions_covers_all === true) {
    return firmSummary.medicalConditions.mostConditions(z);
  }

  if (medicalSpecialisms?.specialised_medical_conditions_covers_all === false) {
    const cover = medicalSpecialisms.specialised_medical_conditions_cover;
    if (cover) {
      return getSpecialismLabel(cover, z);
    }
  }

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
