import { FLOWS_WITH_REQUIRED_PHONE_NUMBER } from '../lib/constants';

/**
 * Checks if the phone number field is required based on the flow type as it is required for certain flows, and optional for others.
 * @param data
 * @returns boolean - Returns true if the phone number is required, false otherwise.
 */
export function isPhoneNumberRequired(data: any): boolean {
  return (
    !FLOWS_WITH_REQUIRED_PHONE_NUMBER.includes(data.flow) ||
    (typeof data['phone-number'] === 'string' &&
      data['phone-number'].trim() !== '')
  );
}
