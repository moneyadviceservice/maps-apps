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
  const day = Number.parseInt(String(data.day), 10);
  const month = Number.parseInt(String(data.month), 10);
  const year = Number.parseInt(String(data.year), 10);

  const now = new Date();
  const date = new Date(year, month - 1, day);

  const isValidDate =
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day;

  if (!isValidDate || date > now || year < 1900) {
    ctx.addIssue({
      code: 'custom',
      path: ['dateOfBirth'], // Attach the error to the "date-of-birth" key, this groups the errors and returns a single error message if any of the fields are invalid, exactly what we want in the UI
      message: 'date-of-birth', // Naming path used in the content file to hold the error message (see en.json)
    });
  }
};
