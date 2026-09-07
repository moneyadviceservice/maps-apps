/**
 * Admin dashboard E2E — assumes CI admin fixture (`CI=true` on the Next server).
 * Firm data comes from in-memory fixture, not Cosmos.
 */
import { expect, test } from '@playwright/test';

import { adminCiE2eConstants as C } from '../../data/adminCiE2eConstants.data';
import { Pagination } from '../../pages/components/Pagination';
import { FirmsAdminPage } from '../../pages/FirmsAdminPage';

let firmsAdminPage: FirmsAdminPage;
let pagination: Pagination;

test.describe('Admin Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    firmsAdminPage = new FirmsAdminPage(page);
    pagination = new Pagination(page);
    await firmsAdminPage.goto();
    await firmsAdminPage.acceptCookiesIfVisible();
  });

  test('Pagination is present', async () => {
    await expect(pagination.paginationComponent()).toBeVisible();
  });

  /**
   * @tests 49328 - FCA search
   */
  test('Search by FCA Number', async () => {
    await firmsAdminPage.fillFcaNumber(C.mainAlpha.fca);
    await firmsAdminPage.clickFirmSearchButton();
    await firmsAdminPage.assertResultFcaNumber(C.mainAlpha.fca);
    await firmsAdminPage.assertNumberOfResults(2);
  });

  /**
   * @tests 49330 - Firm Name search
   */
  test('Search by Firm Name', async () => {
    await firmsAdminPage.fillFirmName(C.mainAlpha.registeredName);
    await firmsAdminPage.clickFirmSearchButton();
    await firmsAdminPage.assertResultFirmName(C.mainAlpha.registeredName);
    await firmsAdminPage.assertNumberOfResults(1);
  });

  /**
   * @tests 49329 - Principal search
   */
  test('Search by Principal', async () => {
    await firmsAdminPage.fillPrincipalName(C.mainAlpha.principalSearchToken);
    await firmsAdminPage.clickFirmSearchButton();
    await firmsAdminPage.assertResultPrincipalName(
      C.mainAlpha.principalFullName,
    );
    await firmsAdminPage.assertNumberOfResults(2);
  });

  /**
   * @tests 49336 - no search results
   */
  test('Search for firm - no results', async () => {
    await test.step('Return no results', async () => {
      await firmsAdminPage.fillFcaNumber(100000);
      await firmsAdminPage.clickFirmSearchButton();
      await firmsAdminPage.assertNumberOfResults(0);
      await firmsAdminPage.assertNoResultsDisplayed();
    });

    await test.step('Reset search', async () => {
      await firmsAdminPage.clickResetSearchLink();
      // First page shows 15 of 16 fixture firms (ITEMS_PER_PAGE on dashboard).
      await firmsAdminPage.assertNumberOfResults(15);
    });
  });

  /**
   * @tests 49382 - Sorting columns
   */
  test('Sort columns', async () => {
    await test.step('Sort by FCA- Ascending', async () => {
      await firmsAdminPage.clickFcaHeader('ascending');
      const fcaDataAscending = await firmsAdminPage.getFcaColumnData();
      await firmsAdminPage.assertDataSortedAscending(fcaDataAscending);
    });

    await test.step('Sort by FCA- Descending', async () => {
      await firmsAdminPage.clickFcaHeader('descending');
      const fcaDataDescending = await firmsAdminPage.getFcaColumnData();
      await firmsAdminPage.assertDataSortedDescending(fcaDataDescending);
    });

    await test.step('Sort by Firm Name - Ascending', async () => {
      await firmsAdminPage.clickFirmNameHeader('ascending');
      const firmNameDataAscending =
        await firmsAdminPage.getFirmNameColumnData();
      await firmsAdminPage.assertDataSortedAscending(firmNameDataAscending);
    });

    await test.step('Sort by Firm Name - Descending', async () => {
      await firmsAdminPage.clickFirmNameHeader('descending');
      const firmNameDataDescending =
        await firmsAdminPage.getFirmNameColumnData();
      await firmsAdminPage.assertDataSortedDescending(firmNameDataDescending);
    });

    await test.step('Sort by Principal - Ascending', async () => {
      await firmsAdminPage.clickPrincipalHeader('ascending');
      const principalDataAscending =
        await firmsAdminPage.getPrincipalColumnData();
      await firmsAdminPage.assertDataSortedAscending(principalDataAscending);
    });

    await test.step('Sort by Principal - Descending', async () => {
      await firmsAdminPage.clickPrincipalHeader('descending');
      const principalDataDescending =
        await firmsAdminPage.getPrincipalColumnData();
      await firmsAdminPage.assertDataSortedDescending(principalDataDescending);
    });
  });

  /**
   * @tests 49383 - Navigate to firm page
   */
  test('Navigate to firm page', async () => {
    await firmsAdminPage.fillFirmName(C.mainAlpha.registeredName);
    await firmsAdminPage.clickFirmSearchButton();
    await firmsAdminPage.clickFirmNameLink();
    await firmsAdminPage.assertHeading(C.mainAlpha.registeredName);
  });
});
