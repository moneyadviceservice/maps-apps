import { FLOWS_WITH_REQUIRED_PHONE_NUMBER } from '../lib/constants';

/**
 * Validates if the phone number is required based on the flow type and existing data.
 * For steps that require this logic, the flow must be passed in the form as a hidden field.
 * @param data
 * @returns boolean - Returns true if the phone number is required, false otherwise.
 */
export function isPhoneNumberRequired(data: any): boolean {
  if (!data.flow) {
    console.warn(
      'Flow type is missing in the data object which is required to determine if phone number is needed.',
    );
    return false;
  }
  return (
    !FLOWS_WITH_REQUIRED_PHONE_NUMBER.includes(data.flow) ||
    (typeof data['phone-number'] === 'string' &&
      data['phone-number'].trim() !== '')
  );
}
