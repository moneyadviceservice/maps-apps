import { differenceInMonths, isValid } from 'date-fns';
import { Band, PensionBand } from 'lib/types/summary.type';
import pensionBandsAsJson from 'public/data/state-pension-bands.json';

export function getStatePensionAge(dateOfBirth: {
  day?: string;
  month?: string;
  year?: string;
}): string {
  const { day, month, year } = dateOfBirth;
  const dob = new Date(Number(year), Number(month) - 1, Number(day));
  const pensionBands: PensionBand[] = pensionBandsAsJson.map((band: Band) => ({
    start: new Date(band.start),
    end: band.end ? new Date(band.end) : null,
    pensionAge: band.pensionAge,
  }));
  const match = pensionBands.find((band) => {
    const afterStart = dob >= band.start;
    const beforeEnd = band.end ? dob <= band.end : true;
    return afterStart && beforeEnd;
  });

  if (!match) {
    return '71';
  }

  return match.pensionAge;
}

export function parsePensionAge(age: string) {
  const str = age.toLowerCase().trim();

  if (/^\d+$/.test(str)) {
    return Number(str) * 12;
  }

  const parts = str.split(' ');

  let years = 0;
  let months = 0;

  for (let i = 0; i < parts.length; i++) {
    const value = Number(parts[i]);
    if (Number.isNaN(value)) continue;

    const next = parts[i + 1];

    if (next === 'year' || next === 'years') {
      years = value;
    } else if (next === 'month' || next === 'months') {
      months = value;
    }
  }

  return years * 12 + months;
}

export const getCurrentAgeInYearsAndMonths = (dob: {
  day?: string;
  month?: string;
  year?: string;
}) => {
  const { day, month, year } = dob;
  if (!day || !month || !year) return null;

  const birthDate = new Date(Number(year), Number(month) - 1, Number(day));
  if (!isValid(birthDate)) return null;

  const months = differenceInMonths(new Date(), birthDate);
  return Math.max(0, months);
};
