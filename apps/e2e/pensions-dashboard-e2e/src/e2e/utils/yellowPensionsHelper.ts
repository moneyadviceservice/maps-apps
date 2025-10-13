import { expect, Page } from '@playwright/test';

import pensionBreakdownPage from '../pages/PensionsBreakdownPage';
import commonHelpers from './commonHelpers';

// Helper to verify all expected fields in an arrangement
function verifyArrangementFields(arr: any) {
  expect(arr).toHaveProperty('schemeName');
  expect(arr).toHaveProperty('pensionType');
  expect(arr).toHaveProperty('pensionAdministrator');
  expect(arr.pensionAdministrator).toHaveProperty('name');
  expect(Array.isArray(arr.pensionAdministrator.contactMethods)).toBe(true);
  if (arr.externalAssetId) expect(typeof arr.externalAssetId).toBe('string');
  if (arr.matchType) expect(typeof arr.matchType).toBe('string');
  if (arr.retirementDate) expect(typeof arr.retirementDate).toBe('string');
  if (arr.dateOfBirth) expect(typeof arr.dateOfBirth).toBe('string');
  if (arr.pensionOrigin) expect(typeof arr.pensionOrigin).toBe('string');
  if (arr.pensionStatus) expect(typeof arr.pensionStatus).toBe('string');
  if (arr.contactReference) expect(typeof arr.contactReference).toBe('string');
  if (arr.startDate) expect(typeof arr.startDate).toBe('string');

  // benefitIllustrations
  if (arr.benefitIllustrations) {
    expect(Array.isArray(arr.benefitIllustrations)).toBe(true);
    arr.benefitIllustrations.forEach((bi: any) => {
      if (bi.illustrationDate)
        expect(typeof bi.illustrationDate).toBe('string');
      expect(Array.isArray(bi.illustrationComponents)).toBe(true);
      bi.illustrationComponents.forEach((ic: any) => {
        expect(ic).toHaveProperty('illustrationType');
        expect(typeof ic.illustrationType).toBe('string');
        if ('survivorBenefit' in ic)
          expect(typeof ic.survivorBenefit).toBe('boolean');
        if ('safeguardedBenefit' in ic)
          expect(typeof ic.safeguardedBenefit).toBe('boolean');
        if ('unavailableReason' in ic && ic.unavailableReason !== undefined)
          expect(typeof ic.unavailableReason).toBe('string');
        if ('payableDetails' in ic && ic.payableDetails) {
          if ('reason' in ic.payableDetails) {
            expect(ic.payableDetails).toHaveProperty('reason');
          }
          expect(ic.payableDetails).toHaveProperty('payableDate');
        }
      });
    });
  }

  // additionalDataSources
  if (arr.additionalDataSources) {
    expect(Array.isArray(arr.additionalDataSources)).toBe(true);
    arr.additionalDataSources.forEach((ads: any) => {
      expect(ads).toHaveProperty('informationType');
      expect(ads).toHaveProperty('url');
    });
  }

  // employmentMembershipPeriods
  if (arr.employmentMembershipPeriods) {
    expect(Array.isArray(arr.employmentMembershipPeriods)).toBe(true);
    arr.employmentMembershipPeriods.forEach((emp: any) => {
      expect(emp).toHaveProperty('employerName');
      expect(emp).toHaveProperty('employerStatus');
      expect(emp).toHaveProperty('membershipStartDate');
      // membershipEndDate is optional
    });
  }
}

export async function verifyYellowPension(page: Page, pensionPolicies: any) {
  // Support both single and multiple pensionPolicies
  const allArrangements = Array.isArray(pensionPolicies)
    ? pensionPolicies.flatMap((p: any) => p.pensionArrangements)
    : pensionPolicies.pensionArrangements || [];

  // Only consider arrangements with a defined unavailableReason in ERI or AP
  const arrangementsWithUnavailableReason = allArrangements.filter(
    (arr: any) => {
      const eriComponent = arr.benefitIllustrations
        ?.flatMap((i: any) => i.illustrationComponents)
        ?.find((c: any) => c.illustrationType === 'ERI');
      const apComponent = arr.benefitIllustrations
        ?.flatMap((i: any) => i.illustrationComponents)
        ?.find((c: any) => c.illustrationType === 'AP');
      return (
        (eriComponent &&
          eriComponent.unavailableReason !== undefined &&
          eriComponent.unavailableReason !== null) ||
        (apComponent &&
          apComponent.unavailableReason !== undefined &&
          apComponent.unavailableReason !== null)
      );
    },
  );

  // Verify all values in each arrangement with unavailableReason
  arrangementsWithUnavailableReason.forEach(verifyArrangementFields);

  const pensionCards = await pensionBreakdownPage.pensionCards(page);
  for (const pensionCard of pensionCards) {
    const hasPensionCardType = await pensionBreakdownPage.getPensionCardType(
      page,
      pensionCard,
    );
    if (hasPensionCardType === 0) continue;
    const schemeNameOnCard = await pensionBreakdownPage.getSchemeNameOnCard(
      page,
      pensionCard,
    );
    const matchingArrangement = arrangementsWithUnavailableReason.find(
      (a: any) => a.schemeName === schemeNameOnCard,
    );
    if (!matchingArrangement) continue;

    const eriComponent = matchingArrangement.benefitIllustrations
      ?.flatMap((i: any) => i.illustrationComponents)
      ?.find((c: any) => c.illustrationType === 'ERI');
    const apComponent = matchingArrangement.benefitIllustrations
      ?.flatMap((i: any) => i.illustrationComponents)
      ?.find((c: any) => c.illustrationType === 'AP');
    const unavailableReason =
      eriComponent?.unavailableReason ?? apComponent?.unavailableReason ?? '';

    // For yellow pensions, unavailableReason should always be defined
    expect(unavailableReason).not.toBe('');
    expect(unavailableReason).not.toBeUndefined();
    expect(unavailableReason).not.toBeNull();

    // You can add more checks here as needed, e.g. verifying warning text, provider, etc.
    // Example: check warning text is visible
    const warningText = await pensionBreakdownPage.warningText(pensionCard);
    await expect(warningText).toBeVisible();

    // Optionally, check details page for unavailable reason
    await pensionBreakdownPage.clickSeeDetailsButton(page, pensionCard);
    // Click back to the pending pensions page
    await commonHelpers.clickBackLink(page);
    await page.locator('[data-testid="page-title"]').waitFor({
      state: 'visible',
    });
  }
}
