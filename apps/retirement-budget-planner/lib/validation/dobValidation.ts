import { differenceInYears, isValid } from 'date-fns';
import z from 'zod';

export const getAge = (dob: {
  day?: string;
  month?: string;
  year?: string;
}): number | null => {
  const { day, month, year } = dob;
  if (!day || !month || !year) return null;

  const birthDate = new Date(Number(year), Number(month) - 1, Number(day));
  if (!isValid(birthDate)) return null;

  return differenceInYears(new Date(), birthDate);
};
type Dob = { day?: string; month?: string; year?: string };

export const isDobEmpty = (dob: Dob): boolean =>
  !dob.day && !dob.month && !dob.year;

export const validateDobEmpty = (dob: Dob, ctx: z.RefinementCtx): boolean => {
  if (isDobEmpty(dob)) {
    ctx.addIssue({
      code: 'custom',
      message: 'dob-empty',
      path: [],
    });
    return true;
  }
  return false;
};

export const validateDobFieldPresence = (
  dob: Dob,
  ctx: z.RefinementCtx,
): boolean => {
  const { day, month, year } = dob;
  if (!day || Number(day.trim()) < 1 || Number(day.trim()) > 31) {
    ctx.addIssue({
      code: 'custom',
      message: 'day-invalid',
      path: ['day'],
    });
    return true;
  }

  if (!month || Number(month.trim()) < 1 || Number(month.trim()) > 12) {
    ctx.addIssue({
      code: 'custom',
      message: 'month-invalid',
      path: ['month'],
    });
    return true;
  }

  if (!year || Number(year.trim()) < 1920) {
    ctx.addIssue({
      code: 'custom',
      message: 'year-invalid',
      path: ['year'],
    });
    return true;
  }

  return false;
};
export const validateDobInvalidDate = (
  dob: Dob,
  ctx: z.RefinementCtx,
): boolean => {
  const { day, month, year } = dob;
  const birthDate = new Date(Number(year), Number(month) - 1, Number(day));

  if (
    !isValid(birthDate) ||
    birthDate.getDate() !== Number(day) ||
    birthDate.getMonth() !== Number(month) - 1 ||
    birthDate.getFullYear() !== Number(year)
  ) {
    ctx.addIssue({
      code: 'custom',
      message: 'dob-invalid',
    });
    return true;
  }
  return false;
};
export const validateDobAgeRange = (
  dob: Dob,
  ctx: z.RefinementCtx,
): boolean => {
  const age = getAge(dob);
  if (age === null || age < 18) {
    ctx.addIssue({
      code: 'custom',
      message: 'dob-age-range',
    });
    return true;
  }
  return false;
};
