/**
 * Validates a postcode.
 * Supports both local and international formats.
 * @param value
 * @returns
 */
export const validatePostCode = (
  value: string | undefined,
): { isValid: boolean; message?: string } => {
  // Regex to validate postcodes (local and international)
  const postcodeRegex = /^[A-Za-z0-9\s-]{3,10}$/;

  if (!value || postcodeRegex.test(value)) {
    return { isValid: true }; // Empty values are valid
  }

  return { isValid: false }; // Invalid postcode
};
