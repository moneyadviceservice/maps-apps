/* eslint-disable playwright/no-focused-test */
import { expect, test } from '@maps/playwright';

import { multipleTranchesSingle } from '../data/scenarioDetails';

const estimatedIncomeText = 'See details';

/**
 * @tests User Story 44533 FE - DB with Multiple Tranches - Pension Cards
 * @tests TEST CASE 1 : Pension cards in Green With Income show See details for Estimated Income
 */

test.describe('Multiple Tranches', () => {
  test('See details text is displayed in Estimated Income', async ({
    page,
    commonSessions,
    pensionsFoundPage,
  }) => {
    const scenarioName = multipleTranchesSingle.option;
    await commonSessions.navigateToPensionsFoundPage(scenarioName);
    await pensionsFoundPage.navigateToPensionBreakdownPage();
    await expect(
      page
        .getByTestId('pension-card-monthly-amount')
        .filter({ hasText: estimatedIncomeText }),
    ).toBeVisible();
  });

  test('Income and Values Timeline shows correct number of tranches', async ({
    page,
    commonSessions,
    pensionBreakdownPage,
    pensionDetailsPage,
    pensionsFoundPage,
  }) => {
    const scenarioName = multipleTranchesSingle.option;
    await commonSessions.navigateToPensionsFoundPage(scenarioName);
    await pensionsFoundPage.navigateToPensionBreakdownPage();
    const schemeNames = ['TNN Telecomms'];
    for (const schemeName of schemeNames) {
      await pensionBreakdownPage.viewDetailsOfPension(schemeName);
      await pensionDetailsPage.assertHeading(schemeName);
      // Navigate to Income and Values  tab
      await pensionDetailsPage.checkPensionDetailsTabs(
        'tab-pension-income-and-values',
        'Income and values',
      );
      expect(page.url()).toContain(
        '/pension-details/pension-income-and-values',
      );

      // check that the income and values timeline exists
      const standardList = page.getByTestId('income-values-standard-list');
      await expect(page.getByTestId('income-values-timeline')).toBeVisible();
      await expect(
        page.getByTestId('income-values-multiplicity'),
      ).toBeVisible();
      await expect(standardList).toBeVisible();
      await expect(standardList.getByRole('listitem')).toHaveCount(3);
    }
  });
});
