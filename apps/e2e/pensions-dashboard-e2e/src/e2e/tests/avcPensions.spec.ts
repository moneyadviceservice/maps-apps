import { expect, test } from '@maps/playwright';

import { avcAllChannels } from '../data/scenarioDetails';

const detailsButtonText = 'See details';

/**
 * @tests User Story 41961: Single and multiple Linked AVC - Pension Details Page
 * @tests User Story 41960: FE - Single and multiple linked AVC- Pension Card
 * @tests User Story 41651: FE - Non-linked AVC - Pension Card
 * @tests User Story 41652: FE - Non-linked AVC - Pensions Details Page
 * @tests User Story 41903: FE - Non-linked AVC - Summary Sentence
 */

test.describe('AVC Pension', () => {
  test.beforeEach(async ({ commonHelpers }) => {
    await commonHelpers.navigateToEmulator('en');
  });

  test('expected content is displayed on pensions breakdown page for AVC pensions in all channels - AVC Pensions', async ({
    page,
    commonHelpers,
    pensionBreakdownPage,
    pensionsFoundPage,
    pensionsThatNeedActionPage,
  }) => {
    // Green Channel
    const scenarioName = avcAllChannels.option;
    await commonHelpers.navigatetoPensionsFoundPage(
      scenarioName,
      commonHelpers,
    );
    await pensionsFoundPage.clickSeeYourPensions();
    await expect(page).toHaveURL(/.*\/your-pension-breakdown/);
    await expect(page.getByTestId('page-title')).toHaveText('Your pensions');
    await expect(
      page.locator(`h2:text-is("Pensions in your estimate (1)")`),
    ).toBeVisible();
    const schemeNames = ['AVC Active Green'];
    for (const schemeName of schemeNames) {
      const pension: any = avcAllChannels.pensions.find(
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
      ).toContainText(pension.aboutPensionTab.employerNameRecent);
      await expect(
        pensionBreakdownPage.getAdministratorName(schemeName),
      ).toContainText(pension.pensionAdministrator);
      await expect(
        pensionBreakdownPage.getRetirementDate(schemeName),
      ).toContainText(pension.expectedRetirementDate);
      await expect(
        pensionBreakdownPage.getEstimatedIncome(schemeName),
      ).toContainText(pension.estimatedIncome);
      await expect(
        pensionBreakdownPage.getSeeDetailsButton(schemeName),
      ).toContainText(detailsButtonText);
    }

    await expect(
      page.locator(`h2:text-is("Pensions without estimated incomes (3)")`),
    ).toBeVisible();
    const schemeNamesWithoutEstimateIncome = [
      'AVC Inactive Renewables',
      'AVC Magpie Inactive',
      'AVC Active Robin',
    ];
    for (const schemeName of schemeNamesWithoutEstimateIncome) {
      const pension: any = avcAllChannels.pensions.find(
        (p) => p.schemeName === schemeName,
      );
      await expect(
        pensionBreakdownPage.getActiveStatus(schemeName),
      ).toContainText(pension.summaryTab.pensionStatus);
      await expect(
        pensionBreakdownPage.getPensionCardType(schemeName),
      ).toContainText(pension.pensionCardType);
      await expect(
        pensionBreakdownPage.getEmployerName(schemeName),
      ).toContainText(pension.aboutPensionTab.employerNameRecent);
      await expect(
        pensionBreakdownPage.getSeeDetailsButton(schemeName),
      ).toContainText(detailsButtonText);
      await expect(
        pensionBreakdownPage.getRetirementDate(schemeName),
      ).toContainText(pension.expectedRetirementDate);
      await expect(
        pensionBreakdownPage.getEstimatedIncome(schemeName),
      ).toBeHidden();
    }

    //no income text
    const whyPensionsMightNotShowText = page.getByTestId(
      'pensions-no-income-description',
    );
    await expect(whyPensionsMightNotShowText).toContainText(
      pensionBreakdownPage.notIncludedText,
    );
    await commonHelpers.clickHomeLink();
    await pensionsFoundPage.clickReviewPensions();
    await pensionsThatNeedActionPage.assertPensionsThatNeedAction(
      avcAllChannels.pensions,
    );
  });
});
