/**
 * Utility function to safely retrieve translations.
 * @param t
 * @param key
 * @returns
 */
export function safeT(
  t: (key: string) => string,
  key: string,
): string | undefined {
  const value = t(key);
  // If it's empty or whitespace, treat as missing
  if (!value || value === key || value.trim() === '') {
    return undefined;
  }
  return value;
}
