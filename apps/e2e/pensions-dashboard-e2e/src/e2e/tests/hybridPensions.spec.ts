import { expect, test } from '@maps/playwright';

import {
  hybridPensions_AllChannels,
  hybridPensionsWithSP,
} from '../data/scenarioDetails';

const detailsButtonText = 'See details';

/**
 * @tests User Story 42713: FE - Hybrid MVP - Timeline Page for DC and DB benefitTypes
 * @tests User Story 42710: FE - Hybrid MVP - Pension Card
 * @tests User Story 42712: FE - Hybrid MVP - Summary Sentence  for DC and DB benefitTypes
 * @tests User Story 42711: FE - Hybrid MVP - Pension Details page for DC and DB benefitTypes
 */

test.describe('Hybrid Pensions', () => {
  test.beforeEach(async ({ commonHelpers }) => {
    await commonHelpers.navigateToEmulator('en');
  });

  test('verify correct content is displayed on pensions breakdown page for hybrid DC and DB pensions in all channels', async ({
    page,
    commonHelpers,
    pendingPensionsPage,
    pensionBreakdownPage,
    pensionDetailsPage,
    pensionsFoundPage,
    pensionsThatNeedActionPage,
  }) => {
    // Green Channel
    const scenarioName = hybridPensions_AllChannels.option;
    await commonHelpers.navigatetoPensionsFoundPage(
      scenarioName,
      commonHelpers,
    );
    await pensionsFoundPage.clickSeeYourPensions();
    await expect(page).toHaveURL(/.*\/your-pension-breakdown/);
    await expect(page.getByTestId('page-title')).toHaveText('Your pensions');
    await expect(
      page.locator(`h2:text-is("Pensions in your estimate (8)")`),
    ).toBeVisible();
    const schemeNames = [
      'Fry & Tingle Pension Scheme (DB)',
      'Pasture Pension Scheme (DC)',
    ];
    for (const schemeName of schemeNames) {
      const pension: any = hybridPensions_AllChannels.pensions.find(
        (p) => p.schemeName === schemeName,
      );
      if (!pension) {
        throw new Error(`No pension found for schemeName: ${schemeName}`);
      }

      await expect(
        pensionBreakdownPage.getPensionCard(schemeName),
      ).toBeVisible();
      await expect(
        pensionBreakdownPage.getActiveStatus(schemeName),
      ).toContainText(pension.pensionStatus);
      await expect(
        pensionBreakdownPage.getPensionCardType(schemeName),
      ).toContainText(pension.pensionCardType);
      await expect(
        pensionBreakdownPage.getEmployerName(schemeName),
      ).toContainText(pension.employerName);
      await expect(
        pensionBreakdownPage.getAdministratorName(schemeName),
      ).toContainText(pension.pensionProvider);
      await expect(
        pensionBreakdownPage.getRetirementDate(schemeName),
      ).toContainText(pension.retirementDate);
      await expect(
        pensionBreakdownPage.getEstimatedIncome(schemeName),
      ).toContainText(pension.estimatedIncome);
      await expect(
        pensionBreakdownPage.getSeeDetailsButton(schemeName),
      ).toContainText(detailsButtonText);
      await pensionBreakdownPage.viewDetailsOfPension(schemeName);
      await pensionDetailsPage.assertHeading(schemeName);
      expect(page.url()).toContain('/pension-details/your-pension-summary');
      expect(
        await pensionDetailsPage.verifyCommonHeaderAndIllustrationDate(
          pension.referenceNumber,
          pension.payableDateERI,
        ),
      ).toBe(true);
      await commonHelpers.clickBackLink();
    }
    await expect(
      page.locator(`h2:text-is("Pensions without estimated incomes (3)")`),
    ).toBeVisible();
    const schemeNamesWithoutEstimateIncome = [
      'Reliable Motors Pension Scheme',
      'Generalismo Pension Scheme',
      'Greener Pasture Pension Scheme',
    ];
    for (const schemeName of schemeNamesWithoutEstimateIncome) {
      const pension: any = hybridPensions_AllChannels.pensions.find(
        (p) => p.schemeName === schemeName,
      );

      await expect(
        pensionBreakdownPage.getPensionCardType(schemeName),
      ).toContainText(pension.pensionCardType);
      await expect(
        pensionBreakdownPage.getActiveStatus(schemeName),
      ).toContainText(pension.pensionStatus);
      await expect(
        pensionBreakdownPage.getAdministratorName(schemeName),
      ).toContainText(pension.pensionProvider);
      await expect(
        pensionBreakdownPage.getEmployerName(schemeName),
      ).toContainText(pension.employerName);
      await expect(
        pensionBreakdownPage.getSeeDetailsButton(schemeName),
      ).toContainText(detailsButtonText);
      await expect(
        pensionBreakdownPage.getRetirementDate(schemeName),
      ).toContainText(pension.retirementDate);
      await expect(
        pensionBreakdownPage.getEstimatedIncome(schemeName),
      ).toBeHidden();

      await pensionBreakdownPage.viewDetailsOfPension(schemeName);
      await pensionDetailsPage.assertHeading(schemeName);
      //Summary Tab
      expect(page.url()).toContain('/pension-details/your-pension-summary');
      //plan reference number & tooltip text, Retirement date, information last updated & tooltip text
      expect(
        await pensionDetailsPage.verifyCommonHeaderAndIllustrationDate(
          pension.referenceNumber,
          pension.payableDateERI,
          // pension.dataIllustrationDate,
        ),
      ).toBe(true);
      await commonHelpers.clickBackLink();
    }
    await commonHelpers.clickHomeLink();
    await pensionsFoundPage.clickReviewPensions();
    await pensionsThatNeedActionPage.assertPensionsThatNeedAction(
      hybridPensions_AllChannels.pensions,
    );
  });

  test('Verify Hybrid Pensions that have State Pension', async ({
    page,
    commonHelpers,
    pensionsFoundPage,
    pensionBreakdownPage,
  }) => {
    const scenarioName = hybridPensionsWithSP.option;
    await commonHelpers.navigatetoPensionsFoundPage(
      scenarioName,
      commonHelpers,
    );
    await pensionsFoundPage.clickSeeYourPensions();
    await expect(page).toHaveURL(/.*\/your-pension-breakdown/);
    await expect(page.getByTestId('page-title')).toHaveText('Your pensions');
    await expect(
      page.locator(`h2:text-is("Pensions in your estimate (3)")`),
    ).toBeVisible();
    const stateSchemeNames = ['State Pension'];
    for (const schemeName of stateSchemeNames) {
      const pension: any = hybridPensionsWithSP.pensions.find(
        (p) => p.schemeName === schemeName,
      );
      await expect(
        pensionBreakdownPage.getPensionCard(schemeName),
      ).toBeVisible();
      await expect(
        pensionBreakdownPage.getPensionCardType(schemeName),
      ).toContainText(pension.pensionCardType);
      await expect(
        pensionBreakdownPage.getRetirementDate(schemeName),
      ).toContainText(pension.retirementDate);
      await expect(
        pensionBreakdownPage.getEstimatedIncome(schemeName),
      ).toContainText(pension.estimatedIncome);
      await expect(
        pensionBreakdownPage.getSeeDetailsButton(schemeName),
      ).toContainText(detailsButtonText);
    }
    const schemeNames = [
      'Fry & Tingle Pension Scheme (DB)',
      'Reliable Motors Pension Scheme (DC)',
    ];
    for (const schemeName of schemeNames) {
      const pension: any = hybridPensionsWithSP.pensions.find(
        (p) => p.schemeName === schemeName,
      );
      await expect(
        pensionBreakdownPage.getPensionCard(schemeName),
      ).toBeVisible();
      await expect(
        pensionBreakdownPage.getActiveStatus(schemeName),
      ).toContainText(pension.summaryTab.pensionStatus);
      await expect(
        pensionBreakdownPage.getPensionCardType(schemeName),
      ).toContainText(pension.pensionCardType);
      await expect(
        pensionBreakdownPage.getEmployerName(schemeName),
      ).toContainText(pension.employerName);
      await expect(
        pensionBreakdownPage.getAdministratorName(schemeName),
      ).toContainText(pension.pensionProvider);
      await expect(
        pensionBreakdownPage.getRetirementDate(schemeName),
      ).toContainText(pension.retirementDate);
      await expect(
        pensionBreakdownPage.getEstimatedIncome(schemeName),
      ).toContainText(pension.estimatedIncome);
      await expect(
        pensionBreakdownPage.getSeeDetailsButton(schemeName),
      ).toContainText(detailsButtonText);
    }
  });
});
