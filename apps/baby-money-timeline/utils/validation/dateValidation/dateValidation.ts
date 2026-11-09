import { isValid, parse, startOfYear, subYears } from 'date-fns';

export const isValidDate = (dateString: string): boolean => {
  const parts = dateString.split('-');
  if (parts.length !== 3) return false;

  const year = parts[2];
  if (!/^\d{4}$/.test(year)) return false;

  const parsedDate = parse(dateString, 'dd-MM-yyyy', new Date());
  return isValid(parsedDate);
};

export const isBeforeMinDate = (dateString: string): boolean => {
  if (!isValidDate(dateString)) return false;

  const parsedDate = parse(dateString, 'dd-MM-yyyy', new Date());
  const minDate = startOfYear(subYears(new Date(), 5));

  return parsedDate < minDate;
};
