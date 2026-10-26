import { parse } from 'date-fns';
import { Band, PensionBand } from 'lib/types/summary.type';
import { getAge } from 'lib/validation/dobValidation';
import pensionBandsAsJson from 'public/data/state-pension-bands.json';

export function getStatePensionAge(dateOfBirth: {
  day?: string;
  month?: string;
  year?: string;
}): string {
  const { day, month, year } = dateOfBirth;
  const dob = parse(`${year}-${month}-${day}`, 'yyyy-MM-dd', new Date());
  const pensionBands: PensionBand[] = pensionBandsAsJson.map((band: Band) => ({
    start: parse(band.start, 'yyyy-MM-dd', new Date()),
    end: band.end ? parse(band.end, 'yyyy-MM-dd', new Date()) : null,
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

  for (let i = 0; i < parts.length; i++) {
    const value = Number(parts[i]);
    if (Number.isNaN(value)) continue;

    const next = parts[i + 1];

    if (next === 'year' || next === 'years') {
      years = value;
    }
  }

  return years * 12;
}

export const getCurrentAgeInYearsAndMonths = (dob: {
  day?: string;
  month?: string;
  year?: string;
}) => {
  const age = getAge(dob);
  if (!age) return null;
  return age * 12;
};
