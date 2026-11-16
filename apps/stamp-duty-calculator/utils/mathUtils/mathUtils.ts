export const roundToNearestHundred = (value: number): number => {
  const remainder = value % 100;
  return value - remainder;
};

export const sum = (items: number[]) => {
  let result = 0;
  for (const item of items) {
    result += item;
  }
  return result;
};

export const normalisePriceInput = (
  value: string | string[] | undefined,
): string => {
  if (value === undefined) return '';
  const raw = Array.isArray(value) ? value[0] ?? '' : value;
  if (!raw) return '';
  return String(raw).replaceAll(',', '').split('.')[0];
};
