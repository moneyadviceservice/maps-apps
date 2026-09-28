export const FORM_FIELDS = {
  day: 'day',
  month: 'month',
  year: 'year',
  salary: 'salary',
  additionalRedundancyPay: 'additionalRedundancyPay',
  userAtLeast15YearsOld: 'userAtLeast15YearsOld',
  employmentStartDateAfterRedundancyDate:
    'employmentStartDateAfterRedundancyDate',
  employmentStartDateInFuture: 'employmentStartDateInFuture',
  redundancyDateMin: 'redundancyDateMin',
  redundancyDateMax: 'redundancyDateMax',
  invalidDate: 'invalidDate',
  underAge: 'underAge',
} as const;

export type Fields = {
  [Key in keyof typeof FORM_FIELDS]: string;
};
