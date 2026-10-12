function getSavingsDate(yearsFromNow = 0, monthsFromNow = 0): Date {
  const date = new Date();

  date.setDate(2);
  date.setFullYear(date.getFullYear() + yearsFromNow);
  date.setMonth(date.getMonth() + monthsFromNow);

  return date;
}

export function savingsYear(yearsFromNow: number, monthsFromNow = 0): string {
  return getSavingsDate(yearsFromNow, monthsFromNow).getFullYear().toString();
}

export function savingsMonthName(monthsFromNow: number): string {
  const date = getSavingsDate(0, monthsFromNow);

  return new Intl.DateTimeFormat('en', {
    month: 'long',
  }).format(date);
}

export function savingsMonthNum(monthsFromNow: number): string {
  const date = getSavingsDate(0, monthsFromNow);

  return date.getMonth().toString();
}
