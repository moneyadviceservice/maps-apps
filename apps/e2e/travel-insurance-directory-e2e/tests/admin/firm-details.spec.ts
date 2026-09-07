/**
 * Admin firm-detail directory actions — Cosmos-backed Firms A/B/C under `CI=true`.
 * Dashboard list remains the in-memory CI fixture; these tests deep-link to Cosmos ids.
 */

import { expect, test } from '@playwright/test';

import { adminCosmosE2eConstants as firms } from '../../data/adminCosmosE2eConstants.data';
import { resetAdminCosmosFirm } from '../../helpers/resetAdminCosmosFirm';
import { FirmAdminDetailPage } from '../../pages/FirmAdminDetailPage';

let detailPage: FirmAdminDetailPage;

test.describe('Admin firm directory actions (Cosmos)', () => {
  test.describe.configure({ mode: 'serial' });

  test.beforeEach(async ({ page }) => {
    detailPage = new FirmAdminDetailPage(page);
  });

  /**
   * @tests 54769 - firm information
   */
  test('Firm page content', async ({ page }) => {
    await resetAdminCosmosFirm(page, 'A');
    await detailPage.acceptCookiesIfVisible();
    const expectedHeaders = [
      'Principal',
      'Principal Email',
      'Principal Phone',
      'Registered name',
      'FRN (FCA Firm Reference Number)',
      'Status',
      'Website Address',
      'Added',
      'Approved',
      'Reregistered',
      'Reregistration Approved',
    ];

    await test.step('Page header', async () => {
      await expect(
        detailPage.headingLocator(firms.firmA.registeredName),
      ).toBeVisible();
    });

    await test.step('Row headers', async () => {
      await expect(detailPage.rowHeaders()).toHaveText(expectedHeaders);
    });
  });

  /**
   * @tests 54886 - add to directory
   * @tests 54887 - add to directory only visible when self serve complete
   */
  test('Add to Directory', async ({ page }) => {
    await resetAdminCosmosFirm(page, 'A');
    await detailPage.acceptCookiesIfVisible();
    await expect(
      detailPage.headingLocator(firms.firmA.registeredName),
    ).toBeVisible();

    await expect(detailPage.rowValue('Status')).toHaveText('Hidden');
    await expect(detailPage.addToDirectoryButton()).toBeVisible();
    await expect(detailPage.hideFromDirectoryButton()).toBeHidden();
    await expect(detailPage.reregisterButton()).toBeVisible();

    await detailPage.clickAddToDirectory();
    await expect(
      detailPage.headingLocator(firms.firmA.registeredName),
    ).toBeVisible();
    await expect(detailPage.rowValue('Status')).toHaveText('Approved');
    await expect(detailPage.hideFromDirectoryButton()).toBeVisible();
    await expect(detailPage.addToDirectoryButton()).toBeHidden();
  });

  /**
   * @tests 54885 - Hide from directory
   */
  test('Hide from Directory', async ({ page }) => {
    await resetAdminCosmosFirm(page, 'B');
    await detailPage.acceptCookiesIfVisible();

    await expect(
      detailPage.headingLocator(firms.firmB.registeredName),
    ).toBeVisible();
    await expect(detailPage.rowValue('Status')).toHaveText('Approved');
    await expect(detailPage.hideFromDirectoryButton()).toBeVisible();
    await expect(detailPage.addToDirectoryButton()).toBeHidden();
    await expect(detailPage.reregisterButton()).toBeVisible();

    await detailPage.clickHideFromDirectory();
    await expect(
      detailPage.headingLocator(firms.firmB.registeredName),
    ).toBeVisible();
    await expect(detailPage.rowValue('Status')).toHaveText('Hidden');
    await expect(detailPage.addToDirectoryButton()).toBeVisible();
    await expect(detailPage.hideFromDirectoryButton()).toBeHidden();
  });

  /**
   * @tests 55946 - no actions visible on incomplete registration
   * @tests 54887 - add to directory only visible when self serve complete
   */
  test('No admin actions visible when registration incomplete', async ({
    page,
  }) => {
    await resetAdminCosmosFirm(page, 'C');
    await detailPage.acceptCookiesIfVisible();
    await expect(
      detailPage.headingLocator(firms.firmC.registeredName),
    ).toBeVisible();
    await expect(detailPage.rowValue('Status')).toHaveText('Hidden');
    await expect(detailPage.addToDirectoryButton()).toBeHidden();
    await expect(detailPage.hideFromDirectoryButton()).toBeHidden();
    await expect(detailPage.reregisterButton()).toBeHidden();
  });
});
