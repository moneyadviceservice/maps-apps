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

type ErrorItem = Record<string, string> | undefined | null;
export type ErrorMap = Record<string, (string | undefined)[]>;

const getDobErrorKey = (dobError: string): string | null => {
  if (dayErrorKeys.includes(dobError)) return `day`;
  if (monthErrorKeys.includes('month-invalid')) return `month`;
  if (yearErrorKeys.includes('year-invalid')) return `year`;
  return null;
};

const getCustomErrorKey = (field: string): string => {
  switch (field) {
    case 'retireAge':
      return `retire_age`;
    case 'gender':
      return `gender-male`;
    default:
      return field;
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
      errorKey = getDobErrorKey(dobError) ?? 'dob';
    } else {
      errorKey = getCustomErrorKey(field);
    }

    if (!acc[errorKey]) acc[errorKey] = [];
    acc[errorKey].push(message);
  }

  return acc;
};

export const getErrors = (
  errors: (Record<string, string> | undefined) | null,
): ErrorMap | null => {
  if (!errors) return null;
  return [errors].reduce<ErrorMap>(
    (acc, item) => processErrorItem(item, acc),
    {},
  );
};
