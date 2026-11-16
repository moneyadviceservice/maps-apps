const firstValue = (value: unknown): unknown =>
  Array.isArray(value) ? value[0] : value;

export const asString = (value: unknown): string => {
  const raw = firstValue(value);
  if (raw === undefined || raw === null) {
    return '';
  }

  return String(raw);
};

export const firstString = (value: unknown): string | undefined => {
  const text = asString(value);
  return text === '' ? undefined : text;
};

export const asIndex = (value: unknown): number => {
  const parsed = Number(firstValue(value));
  return Number.isFinite(parsed) ? parsed : Number.NaN;
};
