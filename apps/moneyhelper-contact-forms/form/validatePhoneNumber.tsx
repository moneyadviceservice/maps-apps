/**
 * Validates a phone number.
 * The phone number can be empty or must match the regex pattern.
 * @param value
 * @returns
 */
export const validatePhoneNumber = (
  value: string | undefined,
): { isValid: boolean } => {
  const phoneRegex =
    /^(\+?\d{1,4}[\s.]?)?(\d{2,4}[\s.]?)?\d{3,4}[\s.]?\d{3,4}$/;

  if (!value || phoneRegex.test(value)) {
    return { isValid: true }; // Empty values are valid
  }

  return { isValid: false }; // Invalid phone number
};
