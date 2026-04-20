import { expect, test } from '@maps/playwright';

import { avcAllChannels } from '../data/scenarioDetails';
import pendingPensionsPage from '../pages/PendingPensionsPage';
import pensionBreakdownPage from '../pages/PensionsBreakdownPage';
import pensionsFoundPage from '../pages/PensionsFoundPage';
import pensionsThatNeedActionPage from '../pages/PensionsThatNeedActionPage';
import commonHelpers from '../utils/commonHelpers';

const detailsButtonText = 'See details';

/**
 * @tests User Story 41961: Single and multiple Linked AVC - Pension Details Page
 * @tests User Story 41960: FE - Single and multiple linked AVC- Pension Card
 * @tests User Story 41651: FE - Non-linked AVC - Pension Card
 * @tests User Story 41652: FE - Non-linked AVC - Pensions Details Page
 * @tests User Story 41903: FE - Non-linked AVC - Summary Sentence
 */

test.describe('AVC Pension', () => {
  test.beforeEach(async ({ page }) => {
    await commonHelpers.navigateToEmulator(page);
  });

  test('expected content is displayed on pensions breakdown page for AVC pensions in all channels - AVC Pensions', async ({
    page,
  }) => {
    // Green Channel
    const scenarioName = avcAllChannels.option;
    await commonHelpers.navigatetoPensionsFoundPage(page, scenarioName);
    await pensionsFoundPage.clickSeeYourPensions(page);
    expect(page.url()).toContain('/your-pension-breakdown');
    await expect(page.getByTestId('page-title')).toHaveText('Your pensions');
    await expect(
      page.locator(`h2:text-is("Pensions in your estimate (1)")`),
    ).toBeVisible();
    const schemeNames = ['AVC Active Green'];
    for (const schemeName of schemeNames) {
      const pension = avcAllChannels.pensions.find(
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
      ).toContainText(pension.aboutPensionTab.employerNameRecent);
      await expect(
        pensionBreakdownPage.getAdministratorName(page, schemeName),
      ).toContainText(pension.pensionAdministrator);
      await expect(
        pensionBreakdownPage.getRetirementDate(page, schemeName),
      ).toContainText(pension.expectedRetirementDate);
      await expect(
        pensionBreakdownPage.getEstimatedIncome(page, schemeName),
      ).toContainText(pension.estimatedIncome);
      await expect(
        pensionBreakdownPage.getSeeDetailsButton(page, schemeName),
      ).toContainText(detailsButtonText);
    }

    await expect(
      page.locator(`h2:text-is("Pensions without estimated incomes (2)")`),
    ).toBeVisible();
    const schemeNamesWithoutEstimateIncome = [
      'AVC Magpie Inactive',
      'AVC Active Robin',
    ];
    for (const schemeName of schemeNamesWithoutEstimateIncome) {
      const pension = avcAllChannels.pensions.find(
        (p) => p.schemeName === schemeName,
      );
      await expect(
        pensionBreakdownPage.getActiveStatus(page, schemeName),
      ).toContainText(pension.summaryTab.pensionStatus);
      await expect(
        pensionBreakdownPage.getPensionCardType(page, schemeName),
      ).toContainText(pension.pensionCardType);
      await expect(
        pensionBreakdownPage.getEmployerName(page, schemeName),
      ).toContainText(pension.aboutPensionTab.employerNameRecent);
      await expect(
        pensionBreakdownPage.getSeeDetailsButton(page, schemeName),
      ).toContainText(detailsButtonText);
      await expect(
        pensionBreakdownPage.getRetirementDate(page, schemeName),
      ).toContainText(pension.expectedRetirementDate);
      await expect(
        pensionBreakdownPage.getEstimatedIncome(page, schemeName),
      ).toBeHidden();
    }

    //no income text
    const whyPensionsMightNotShowText = page.getByTestId(
      'pensions-no-income-description',
    );
    await expect(whyPensionsMightNotShowText).toContainText(
      pensionBreakdownPage.notIncludedText,
    );
    await commonHelpers.clickBackLink(page);
    // yellow avc
    await pensionsFoundPage.clickSeePendingPensions(page);
    await pendingPensionsPage.assertPendingPensions(
      page,
      avcAllChannels.pensions,
    );
    expect(page.url()).toContain('/pending-pensions');
    const pendingSchemeNames = ['AVC Inactive Renewables'];
    for (const schemeName of pendingSchemeNames) {
      const pension = avcAllChannels.pensions.find(
        (p) => p.schemeName === schemeName,
      );
      await pendingPensionsPage.viewTextOnPensionCard(page, schemeName);
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
      ).toContainText(pension.aboutPensionTab.employerNameRecent);
      await expect(
        pensionBreakdownPage.getAdministratorName(page, schemeName),
      ).toContainText(pension.pensionAdministrator);
      await expect(
        pensionBreakdownPage.getPendingMessage(page, schemeName),
      ).toContainText('Pending');
      await expect(
        pensionBreakdownPage.getSeeDetailsButton(page, schemeName),
      ).toContainText(detailsButtonText);
    }

    await commonHelpers.clickBackLink(page);
    await pensionsFoundPage.clickReviewPensions(page);
    await pensionsThatNeedActionPage.assertPensionsThatNeedAction(
      page,
      avcAllChannels.pensions,
    );
  });
});
