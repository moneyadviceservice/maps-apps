import { EntryData } from '@maps-react/mhf/types';

import { routeFlow } from '../routes/routeFlow';

/**
 * Validates that the phone number requirement is satisfied for the current flow.
 *
 * Different contact flows have different phone number requirements. This validator checks:
 * - If the flow does NOT require a phone number → validation passes (returns true)
 * - If the flow DOES require a phone number → checks that the field is filled with non-empty content
 *
 * Used in Zod schema refinement where returning true means validation passes.
 * The flow type must be passed in the form (typically as a hidden field) to determine requirements.
 *
 * @param data - Form entry data containing the flow type and phone-number field
 * @returns boolean - true if phone number requirement is satisfied, false if validation fails
 */
export function validatePhoneNumberRequirement(data: EntryData): boolean {
  if (!data.flow) {
    console.warn(
      'Flow type is missing in the data object which is required to determine if phone number is needed.',
    );
    return false;
  }
  const flowConfig = routeFlow.get(data.flow);

  // If phone number is not required for this flow, validation passes
  if (!flowConfig?.phoneNumberRequired) {
    return true;
  }

  // If required, check that the phone number exists and is not empty/whitespace
  return (
    typeof data['phone-number'] === 'string' &&
    data['phone-number'].trim() !== ''
  );
}
