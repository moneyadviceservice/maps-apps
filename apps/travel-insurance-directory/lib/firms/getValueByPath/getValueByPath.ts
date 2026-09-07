import { TravelInsuranceFirmDocument } from 'types/travel-insurance-firm';

/**
 * Safely fetches a nested value from an object using a slash-separated path string.
 * E.g., "office/contact/email_address"
 */
export const getValueByPath = (
  obj: TravelInsuranceFirmDocument | null,
  path: string,
): string | null => {
  if (!path || !obj) return null;

  const result = path.split('/').reduce<unknown>((accumulator, key) => {
    if (accumulator && typeof accumulator === 'object') {
      return (accumulator as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);

  return typeof result === 'string' ? result : null;
};
