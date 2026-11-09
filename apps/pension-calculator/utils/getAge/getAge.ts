const isWholeNumber = (value: string) => /^\d+$/.test(value.trim());

export const parseCalendarDate = (
  day: string,
  month: string,
  year: string,
): Date | null => {
  if (!isWholeNumber(day) || !isWholeNumber(month) || !isWholeNumber(year)) {
    return null;
  }

  const dayNumber = Number(day);
  const monthNumber = Number(month);
  const yearNumber = Number(year);
  const date = new Date(yearNumber, monthNumber - 1, dayNumber);

  if (
    date.getFullYear() !== yearNumber ||
    date.getMonth() !== monthNumber - 1 ||
    date.getDate() !== dayNumber
  ) {
    return null;
  }

  return date;
};

export const startOfToday = (now = new Date()) =>
  new Date(now.getFullYear(), now.getMonth(), now.getDate());

export const getAge = (birthDate: Date, now = new Date()): number => {
  let age = now.getFullYear() - birthDate.getFullYear();
  const monthDiff = now.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && now.getDate() < birthDate.getDate())
  ) {
    age -= 1;
  }

  return age;
};
