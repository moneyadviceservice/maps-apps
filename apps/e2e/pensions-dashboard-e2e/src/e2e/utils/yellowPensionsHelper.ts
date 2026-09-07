import { expect, Page } from '@maps/playwright';

import pensionBreakdownPage from '../pages/PensionsBreakdownPage';
import commonHelpers from './commonHelpers';
import { BackendUiAssertion } from './detailTabsBackendUIAssertion';
import { RequestHelper } from './request';
import { UnknownPensionTypeDetailsHelper } from './unknownPensionTypeHelper';

// Helper to verify all expected fields in an arrangement
function verifyArrangementFields(arr: any) {
  expect(arr).toHaveProperty('schemeName');
  expect(arr).toHaveProperty('pensionAdministrator');
  expect(arr.pensionAdministrator).toHaveProperty('name');
  expect(Array.isArray(arr.pensionAdministrator.contactMethods)).toBe(true);
  if (arr.pensionType) expect(typeof arr.pensionType).toBe('string');
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

// Helper to get eri and ap illustration components from an arrangement
function getIllustrationComponents(arrangement) {
  const components =
    arrangement.benefitIllustrations?.flatMap(
      (i) => i.illustrationComponents,
    ) ?? [];
  const eri = components.find((c) => c.illustrationType === 'ERI');
  const ap = components.find((c) => c.illustrationType === 'AP');
  return { eri, ap };
}

// Helper to check if an illustration component has a valid unavailableReason
function hasValidUnavailableReason(component) {
  return (
    component?.unavailableReason !== undefined &&
    component?.unavailableReason !== null
  );
}

// Helper to assert that an arrangement has a valid unavailableReason if applicable
function assertUnavailableReason(arrangement) {
  const isSysOrNew = ['SYS', 'NEW'].includes(arrangement?.matchType);
  if (isSysOrNew) return; // SYS and NEW matchTypes don't require this assertion

  const { eri, ap } = getIllustrationComponents(arrangement);
  if (!eri && !ap) return;

  const unavailableReason =
    eri?.unavailableReason ?? ap?.unavailableReason ?? '';
  expect(unavailableReason).not.toBe('');
  expect(unavailableReason).not.toBeUndefined();
  expect(unavailableReason).not.toBeNull();
}

export async function verifyYellowPension(page: Page, request: any) {
  const response = await RequestHelper.getPensionCategory(
    page,
    request,
    'PENDING',
  );
  const { arrangements: pendingArrangements = [] } = await response.json();

  // 1. Filter arrangements
  const arrangementsWithUnavailableReason = pendingArrangements.filter(
    (arr) => {
      if (['SYS', 'NEW'].includes(arr.matchType)) return true;

      const { eri, ap } = getIllustrationComponents(arr);
      return hasValidUnavailableReason(eri) || hasValidUnavailableReason(ap);
    },
  );

  // 2. Verify all filtered arrangements
  arrangementsWithUnavailableReason.forEach(verifyArrangementFields);

  // 3. Process UI Pension Cards
  const pensionCards = await pensionBreakdownPage.pensionCards(page);
  for (const pensionCard of pensionCards) {
    const hasPensionCardType = await pensionBreakdownPage.getPensionCardType(
      page,
      pensionCard,
    );
    if (hasPensionCardType === 0) continue;
    const schemeNameOnCard = await pensionBreakdownPage.getschemeNameOnCard(
      page,
      pensionCard,
    );
    const matchingArrangement = arrangementsWithUnavailableReason.find(
      (a) => a.schemeName === schemeNameOnCard,
    );

    if (!matchingArrangement) continue;

    // Assert unavailable reason based on extracted logic
    assertUnavailableReason(matchingArrangement);

    const cardData = await BackendUiAssertion.getValidPensionCardData(
      page,
      request,
      pensionCard,
      pendingArrangements,
    );

    // If this card isn't a valid pension card (no pension type), skip it
    if (!cardData) continue;

    // 4. Combined UI Actions (Replaces the deeply nested if/else chains)
    const isSysOrNew = ['SYS', 'NEW'].includes(matchingArrangement.matchType);

    // If it's NOT a SYS/NEW match without a pension type, we skip the rest of the UI checks
    if (!isSysOrNew || matchingArrangement.pensionType) {
      continue;
    }
    // Process SYS/NEW Unknown Pension Type logic
    await BackendUiAssertion.verifyPensionTypeUnknownPensionCard(
      page,
      pensionCard,
    );
    // Optionally, check details page for unavailable reason
    await pensionBreakdownPage.clickSeeDetailsButton(page, pensionCard);
    await UnknownPensionTypeDetailsHelper.verifyPensionDetailsTabs(
      page,
      matchingArrangement,
    );
    await page.getByTestId('back').click();
    page.getByTestId('page-title').filter({ hasText: 'Pending pensions' });
  }

  // After iterating through the pensions, go back to the dashboard.
  await commonHelpers.clickHomeLink(page);
  await page
    .getByTestId('page-title')
    .filter({ hasText: 'Pensions found' })
    .waitFor({ state: 'visible' });
}
