import { getErrorMessageByKey } from 'lib/validation/partner';

export const dayErrorKeys = [
  'dob-empty',
  'day-invalid',
  'dob-age-range',
  'dob-invalid',
];
export const monthErrorKeys = [
  'dob-empty',
  'month-invalid',
  'dob-age-range',
  'dob-invalid',
];
export const yearErrorKeys = [
  'dob-empty',
  'year-invalid',
  'dob-age-range',
  'dob-invalid',
];

type ErrorItem = Record<string, string> | undefined;
type ErrorMap = Record<string, (string | undefined)[]>;

const getDobErrorKey = (
  id: string | undefined,
  dobError: string,
): string | null => {
  if (dayErrorKeys.includes(dobError)) return `day_${id}`;
  if (monthErrorKeys.includes('month-invalid')) return `month_${id}`;
  if (yearErrorKeys.includes('year-invalid')) return `year_${id}`;
  return null;
};

const getCustomErrorKey = (field: string, id: string | undefined): string => {
  switch (field) {
    case 'retireAge':
      return `retire_age_${id}`;
    case 'gender':
      return `gender-male_${id}`;
    default:
      return id ? `${field}_${id}` : field;
  }
};

const processErrorItem = (item: ErrorItem, acc: ErrorMap): ErrorMap => {
  if (!item) return acc;

  const { id, ...fields } = item;
  const dobError = getErrorMessageByKey('dob', item) || '';

  for (const [field, message] of Object.entries(fields)) {
    if (!message) continue;

    let errorKey: string;

    if (field === 'dob') {
      errorKey = getDobErrorKey(id, dobError) ?? (id ? `dob_${id}` : 'dob');
    } else {
      errorKey = getCustomErrorKey(field, id);
    }

    if (!acc[errorKey]) acc[errorKey] = [];
    acc[errorKey].push(message);
  }

  return acc;
};

export const getErrors = (errors: ErrorItem[] | null): ErrorMap | null => {
  if (!errors) return null;
  return errors.reduce<ErrorMap>(
    (acc, item) => processErrorItem(item, acc),
    {},
  );
};
