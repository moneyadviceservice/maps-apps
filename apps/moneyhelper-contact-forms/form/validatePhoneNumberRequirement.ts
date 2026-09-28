import { EntryData } from '@maps-react/mhf/types';

import { ContactFlowConfig } from '../lib/types';
import { flowConfig } from '../routes/flowConfig';

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
    return false;
  }
  const config: ContactFlowConfig | undefined = flowConfig.get(data.flow);

  // If phone number is not required for this flow, validation passes
  if (!config?.phoneNumberRequired) {
    return true;
  }

  // If required, check that the phone number exists and is not empty/whitespace
  return (
    typeof data['phone-number'] === 'string' &&
    data['phone-number'].trim() !== ''
  );
}
