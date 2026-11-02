/**
 * Helper functions to convert entry values to string or string array.
 */
type EntryValue = string | string[] | undefined;

export const asString = (value: EntryValue): string =>
  Array.isArray(value) ? value[0] ?? '' : value ?? '';

export const asStringArray = (value: EntryValue): string[] =>
  Array.isArray(value) ? value : value ? [value] : [];
