import { expect, test } from '@maps/playwright';

import {
  hybridPensionsWithSP,
  hybridPensions_AllChannels,
} from '../data/scenarioDetails';
import pensionBreakdownPage from '../pages/PensionsBreakdownPage';
import pensionsFoundPage from '../pages/PensionsFoundPage';
import pensionDetailsPage from '../pages/PensionDetailsPage';
import pendingPensionsPage from '../pages/PendingPensionsPage';
import pensionsThatNeedActionPage from '../pages/PensionsThatNeedActionPage';
import commonHelpers from '../utils/commonHelpers';

const detailsButtonText = 'See details';

/**
 * @tests User Story 42713: FE - Hybrid MVP - Timeline Page for DC and DB benefitTypes
 * @tests User Story 42710: FE - Hybrid MVP - Pension Card
 * @tests User Story 42712: FE - Hybrid MVP - Summary Sentence  for DC and DB benefitTypes
 * @tests User Story 42711: FE - Hybrid MVP - Pension Details page for DC and DB benefitTypes
 */

test.describe('Hybrid Pensions', () => {
  test.beforeEach(async ({ page }) => {
    await commonHelpers.navigateToEmulator(page);
  });

  test('verify correct content is displayed on pensions breakdown page for hybrid DC and DB pensions in all channels', async ({
    page,
  }) => {
    // Green Channel
    const scenarioName = hybridPensions_AllChannels.option;
    await commonHelpers.navigatetoPensionsFoundPage(page, scenarioName);
    await pensionsFoundPage.clickSeeYourPensions(page);
    expect(page.url()).toContain('/your-pension-breakdown');
    await expect(page.getByTestId('page-title')).toHaveText('Your pensions');
    await expect(
      page.locator(`h2:text-is("Pensions in your estimate (2)")`),
    ).toBeVisible();
    const schemeNames = [
      'Fry & Tingle Pension Scheme (DB)',
      'Pasture Pension Scheme (DC)',
    ];
    for (const schemeName of schemeNames) {
      const pension = hybridPensions_AllChannels.pensions.find(
        (p) => p.schemeName === schemeName,
      );
      if (!pension) {
        throw new Error(`No pension found for schemeName: ${schemeName}`);
      }

      await expect(
        pensionBreakdownPage.getPensionCard(page, schemeName),
      ).toBeVisible();
      await expect(
        pensionBreakdownPage.getActiveStatus(page, schemeName),
      ).toContainText(pension.pensionStatus);
      await expect(
        pensionBreakdownPage.getPensionCardType(page, schemeName),
      ).toContainText(pension.pensionCardType);
      await expect(
        pensionBreakdownPage.getEmployerName(page, schemeName),
      ).toContainText(pension.employerName);
      await expect(
        pensionBreakdownPage.getAdministratorName(page, schemeName),
      ).toContainText(pension.pensionProvider);
      await expect(
        pensionBreakdownPage.getRetirementDate(page, schemeName),
      ).toContainText(pension.retirementDate);
      await expect(
        pensionBreakdownPage.getEstimatedIncome(page, schemeName),
      ).toContainText(pension.estimatedIncome);
      await expect(
        pensionBreakdownPage.getSeeDetailsButton(page, schemeName),
      ).toContainText(detailsButtonText);
      await pensionBreakdownPage.viewDetailsOfPension(page, schemeName);
      await pensionDetailsPage.assertHeading(page, schemeName);
      expect(page.url()).toContain('/pension-details/your-pension-summary');
      expect(
        await pensionDetailsPage.verifyCommonHeaderAndIllustrationDate(
          page,
          pension.referenceNumber,
          pension.payableDateERI,
          // pension.dataIllustrationDate,
        ),
      ).toBe(true);
      await commonHelpers.clickBackLink(page);
    }
    await expect(
      page.locator(`h2:text-is("Not in your estimate (2)")`),
    ).toBeVisible();
    const schemeNamesWithoutEstimateIncome = [
      'Reliable Motors Pension Scheme',
      'Greener Pasture Pension Scheme',
    ];
    for (const schemeName of schemeNamesWithoutEstimateIncome) {
      const pension = hybridPensions_AllChannels.pensions.find(
        (p) => p.schemeName === schemeName,
      );

      await expect(
        pensionBreakdownPage.getPensionCardType(page, schemeName),
      ).toContainText(pension.pensionCardType);
      await expect(
        pensionBreakdownPage.getActiveStatus(page, schemeName),
      ).toContainText(pension.pensionStatus);
      await expect(
        pensionBreakdownPage.getAdministratorName(page, schemeName),
      ).toContainText(pension.pensionProvider);
      await expect(
        pensionBreakdownPage.getEmployerName(page, schemeName),
      ).toContainText(pension.employerName);
      await expect(
        pensionBreakdownPage.getWarningMessage(page, schemeName),
      ).toContainText(pension.warningMessage);
      await expect(
        pensionBreakdownPage.getSeeDetailsButton(page, schemeName),
      ).toContainText(detailsButtonText);
      await expect(
        pensionBreakdownPage.getRetirementDate(page, schemeName),
      ).toContainText(pension.retirementDate);
      await expect(
        pensionBreakdownPage.getEstimatedIncome(page, schemeName),
      ).toBeHidden();

      await pensionBreakdownPage.viewDetailsOfPension(page, schemeName);
      await pensionDetailsPage.assertHeading(page, schemeName);
      //Summary Tab
      expect(page.url()).toContain('/pension-details/your-pension-summary');
      //plan reference number & tooltip text, Retirement date, information last updated & tooltip text
      expect(
        await pensionDetailsPage.verifyCommonHeaderAndIllustrationDate(
          page,
          pension.referenceNumber,
          pension.payableDateERI,
          // pension.dataIllustrationDate,
        ),
      ).toBe(true);
      await commonHelpers.clickBackLink(page);
    }
    await commonHelpers.clickBackLink(page);
    // hybrid on yellow channels

    await pensionsFoundPage.clickSeePendingPensions(page);
    console.log('Clicked, now waiting for pending pensions page to load');
    await pendingPensionsPage.pageLoads(page);
    console.log('Pending pensions page loaded');
    await pendingPensionsPage.assertPendingPensions(
      page,
      hybridPensionsWithSP.pensions,
    );
    expect(page.url()).toContain('/pending-pensions');
    const pendingSchemeNames = ['Generalismo Pension Scheme'];
    for (const schemeName of pendingSchemeNames) {
      const pension = hybridPensions_AllChannels.pensions.find(
        (p) => p.schemeName === schemeName,
      );
      if (!pension) {
        throw new Error(`No pension found for schemeName: ${schemeName}`);
      }
      await pendingPensionsPage.viewTextOnPensionCard(page, schemeName);
      await expect(
        pensionBreakdownPage.getPensionCard(page, schemeName),
      ).toBeVisible();
      await expect(
        pensionBreakdownPage.getPensionCardType(page, schemeName),
      ).toContainText(pension.pensionCardType);
      await expect(
        pensionBreakdownPage.getActiveStatus(page, schemeName),
      ).toContainText(pension.pensionStatus);
      await expect(
        pensionBreakdownPage.getEmployerName(page, schemeName),
      ).toContainText(pension.employerName);
      await expect(
        pensionBreakdownPage.getAdministratorName(page, schemeName),
      ).toContainText(pension.pensionProvider);
      await expect(
        pensionBreakdownPage.getPendingMessage(page, schemeName),
      ).toContainText('Pending');
      await expect(
        pensionBreakdownPage.getSeeDetailsButton(page, schemeName),
      ).toContainText(detailsButtonText);

      await pendingPensionsPage.viewDetailsOfPendingPension(page, schemeName);
      await pensionDetailsPage.assertHeading(page, schemeName);
      //Summary Tab
      expect(page.url()).toContain('/pension-details/your-pension-summary');
      //plan reference number & tooltip text, Retirement date, information last updated & tooltip text
      expect(
        await pensionDetailsPage.verifyCommonHeaderAndIllustrationDate(
          page,
          pension.referenceNumber,
          pension.payableDateERI,
          // pension.dataIllustrationDate,
        ),
      ).toBe(true);
      await commonHelpers.clickBackLink(page);
      await commonHelpers.clickBackLink(page);
    }
    await pensionsFoundPage.clickReviewPensions(page);
    await pensionsThatNeedActionPage.assertPensionsThatNeedAction(
      page,
      hybridPensions_AllChannels.pensions,
    );
  });

  test('Verify Hybrid Pensions that have State Pension', async ({ page }) => {
    const scenarioName = hybridPensionsWithSP.option;
    await commonHelpers.navigatetoPensionsFoundPage(page, scenarioName);
    await pensionsFoundPage.clickSeeYourPensions(page);
    expect(page.url()).toContain('/your-pension-breakdown');
    await expect(page.getByTestId('page-title')).toHaveText('Your pensions');
    await expect(
      page.locator(`h2:text-is("Pensions in your estimate (3)")`),
    ).toBeVisible();
    const stateSchemeNames = ['State Pension'];
    for (const schemeName of stateSchemeNames) {
      const pension = hybridPensionsWithSP.pensions.find(
        (p) => p.schemeName === schemeName,
      );
      await expect(
        pensionBreakdownPage.getPensionCard(page, schemeName),
      ).toBeVisible();
      await expect(
        pensionBreakdownPage.getPensionCardType(page, schemeName),
      ).toContainText(pension.pensionCardType);
      await expect(
        pensionBreakdownPage.getRetirementDate(page, schemeName),
      ).toContainText(pension.retirementDate);
      await expect(
        pensionBreakdownPage.getEstimatedIncome(page, schemeName),
      ).toContainText(pension.estimatedIncome);
      await expect(
        pensionBreakdownPage.getSeeDetailsButton(page, schemeName),
      ).toContainText(detailsButtonText);
    }
    const schemeNames = [
      'Fry & Tingle Pension Scheme (DB)',
      'Reliable Motors Pension Scheme (DC)',
    ];
    for (const schemeName of schemeNames) {
      const pension = hybridPensionsWithSP.pensions.find(
        (p) => p.schemeName === schemeName,
      );
      await expect(
        pensionBreakdownPage.getPensionCard(page, schemeName),
      ).toBeVisible();
      await expect(
        pensionBreakdownPage.getActiveStatus(page, schemeName),
      ).toContainText(pension.summaryTab.pensionStatus);
      await expect(
        pensionBreakdownPage.getPensionCardType(page, schemeName),
      ).toContainText(pension.pensionCardType);
      await expect(
        pensionBreakdownPage.getEmployerName(page, schemeName),
      ).toContainText(pension.employerName);
      await expect(
        pensionBreakdownPage.getAdministratorName(page, schemeName),
      ).toContainText(pension.pensionProvider);
      await expect(
        pensionBreakdownPage.getRetirementDate(page, schemeName),
      ).toContainText(pension.retirementDate);
      await expect(
        pensionBreakdownPage.getEstimatedIncome(page, schemeName),
      ).toContainText(pension.estimatedIncome);
      await expect(
        pensionBreakdownPage.getSeeDetailsButton(page, schemeName),
      ).toContainText(detailsButtonText);
    }
  });
});
