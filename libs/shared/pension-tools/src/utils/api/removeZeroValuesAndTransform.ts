import { FormData } from '../../types/forms';

export const removeZeroValuesAndTransform = (
  formData: FormData,
): Record<string, string> => {
  const transformedEntries = Object.entries(formData)
    .filter(
      ([key, value]) =>
        value !== '' &&
        value !== '0.00' &&
        value !== undefined &&
        value !== '0',
    )
    .map(([key, value]) => [
      key,
      Array.isArray(value) ? value.join(',') : (value as string),
    ]);

  return Object.fromEntries(transformedEntries);
};
