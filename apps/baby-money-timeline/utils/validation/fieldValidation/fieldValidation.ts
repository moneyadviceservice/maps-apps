export type FieldValidation = {
  day?: boolean;
  month?: boolean;
  year?: boolean;
};

const isValidDay = (day: string): boolean => {
  const dayNum = parseInt(day, 10);
  return !isNaN(dayNum) && dayNum >= 1 && dayNum <= 31;
};

const isValidMonth = (month: string): boolean => {
  const monthNum = parseInt(month, 10);
  return !isNaN(monthNum) && monthNum >= 1 && monthNum <= 12;
};

const isValidYear = (year: string): boolean => {
  const yearNum = parseInt(year, 10);
  // Year must be 4 digits and a valid number
  return !isNaN(yearNum) && year.length === 4;
};

export const fieldValidation = (values: {
  day?: string;
  month?: string;
  year?: string;
}): FieldValidation => {
  const day = values.day?.trim();
  const month = values.month?.trim();
  const year = values.year?.trim();

  return {
    day: !day || !isValidDay(day),
    month: !month || !isValidMonth(month),
    year: !year || !isValidYear(year),
  };
};
