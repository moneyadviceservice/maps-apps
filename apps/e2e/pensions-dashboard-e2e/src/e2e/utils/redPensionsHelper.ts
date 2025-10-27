import { expect, Page } from '@playwright/test';

import pensionsThatNeedActionPage from '../pages/PensionsThatNeedActionPage';
import { PensionArrangement } from '../types/pension.types';

/**
 * Remove all non-digit characters except leading "+"
 */
function normalizePhone(phone: string | undefined): string {
  if (!phone) return '';
  return phone.replace(/(?!^\+)\D/g, '');
}

/**
 * Loops through all PensionArrangements in all pensionPolicies and asserts the callout text for each red pension.
 */
export async function assertRedPensionCalloutTextFromArrangement(
  page: Page,
  pensionPolicies: Array<{ pensionArrangements: PensionArrangement[] }>,
) {
  for (const policy of pensionPolicies) {
    for (const arrangement of policy.pensionArrangements.filter(
      (a) => a.matchType === 'POSS',
    )) {
      const { schemeName, contactReference } = arrangement;
      const contactMethods = arrangement.pensionAdministrator.contactMethods;
      const email = contactMethods.find(
        (method) => method.contactMethodDetails.email,
      )?.contactMethodDetails.email;
      const phone = contactMethods.find(
        (method) => method.contactMethodDetails.number,
      )?.contactMethodDetails.number;
      const url = contactMethods.find(
        (method) => method.contactMethodDetails.url,
      )?.contactMethodDetails.url;
      const calloutTexts =
        await pensionsThatNeedActionPage.getAllInformationCalloutTexts(page);
      const normalizedPhone = normalizePhone(phone);
      const matchedCallout = calloutTexts.find(
        (calloutText) =>
          calloutText.includes(schemeName) &&
          calloutText.includes(contactReference) &&
          calloutText.includes(email ?? '') &&
          normalizePhone(calloutText).includes(normalizedPhone) &&
          (url ? calloutText.includes(url) : true),
      );
      if (matchedCallout) {
        expect(matchedCallout.includes(schemeName)).toBe(true);
        expect(matchedCallout.includes(contactReference)).toBe(true);
        expect(matchedCallout.includes(email ?? '')).toBe(true);
        expect(normalizePhone(matchedCallout).includes(normalizedPhone)).toBe(
          true,
        );
        if (url) {
          expect(matchedCallout.includes(url)).toBe(true);
        }
      }
    }
  }
}
