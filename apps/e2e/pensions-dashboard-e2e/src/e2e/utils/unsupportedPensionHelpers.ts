import { expect } from '@playwright/test';

/**
 * Verifies that all expected unsupported pension types are present in the response but not displayed in the UI.
 * @param pensionPolicies The pension policies array from the API response
 * @param unsupportedTypes Array of unsupported pension type codes (e.g., ['AVC', 'HYB'])
 */
export function verifyUnsupportedPensionTypes(
  pensionPolicies: any[],
  unsupportedTypes: string[],
) {
  const pensionArrangements = pensionPolicies.flatMap(
    (policy) => policy.pensionArrangements,
  );

  unsupportedTypes.forEach((type) => {
    const pension = pensionArrangements.find((arr) => arr.pensionType === type);
    expect(pension).toBeDefined();
    expect(pension?.schemeName).toBeDefined();
    expect(pension?.pensionAdministrator.name).toBeDefined();
  });
}
