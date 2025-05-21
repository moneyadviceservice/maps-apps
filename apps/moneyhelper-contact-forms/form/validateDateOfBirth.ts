import { z } from 'zod';

// Custom validation function for day, month, and year
export interface DateOfBirthData {
  day: string;
  month: string;
  year: string;
}

export const validateDateOfBirth = (
  data: DateOfBirthData,
  ctx: z.RefinementCtx,
) => {
  const day = parseInt(data.day, 10);
  const month = parseInt(data.month, 10);
  const year = parseInt(data.year, 10);

  const now = new Date();
  const date = new Date(year, month - 1, day);

  const isValidDate =
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day;

  if (!isValidDate || date > now || year < 1900) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['dates'], // Attach the error to the "dates" key, this groups the errors and returns a single error message if any of the fields are invalid, exactly what we want in the UI
      message: 'generic', // Naming path used in the content file to hold the error message (see en.json)
    });
  }
};
