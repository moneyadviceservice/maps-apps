import { expect, test } from '@playwright/test';

import { adminCiE2eConstants as C } from '../../data/adminCiE2eConstants.data';
import { Pagination } from '../../pages/components/Pagination';
import { FirmsAdminPage } from '../../pages/FirmsAdminPage';

test.describe('Pagination Component Checks', () => {
  let firmsAdminPage: FirmsAdminPage;
  let pagination: Pagination;

  test.beforeEach(async ({ page }) => {
    firmsAdminPage = new FirmsAdminPage(page);
    pagination = new Pagination(page);
    await firmsAdminPage.goto();
    await firmsAdminPage.acceptCookiesIfVisible();
  });

  /**
   * @tests 51476 - pagination component visible
   */
  test('Visible on initial page load', async () => {
    await expect(pagination.paginationComponent()).toBeVisible();
  });

  /**
   * @tests 51479 - inactive pages have correct attributes
   */
  test('Inactive pages have href attributes and no aria-current tags', async () => {
    await expect(pagination.paginationComponent()).toBeVisible();
    const inactivePages = await pagination.inactivePage().all();

    for (const el of inactivePages) {
      await expect(el).toHaveAttribute('href');
      await expect(el).not.toHaveAttribute('aria-current');
    }
  });

  /**
   * @tests 51478 - current page should have correct attributes
   */
  test('Current page lacks a href attribute but has an aria-current tag', async () => {
    await expect(pagination.activePage(undefined, 1)).not.toHaveAttribute(
      'href',
    );
    await expect(pagination.activePage(undefined, 1)).toHaveAttribute(
      'aria-current',
    );
  });

  test('Previous/Next button visibility', async () => {
    await test.step('Previous button is hidden', async () => {
      await expect(pagination.activePage(undefined, 1)).toBeVisible();
      await expect(pagination.previousButton()).toBeHidden();
    });

    await test.step('Next button is hidden', async () => {
      await pagination.clickLastPage();
      await expect(pagination.nextButton()).toBeHidden();
    });
  });

  /**
   * @tests 51477 - conditionally hidden
   */
  test('Pagination hidden when search filtering yields few results', async () => {
    await firmsAdminPage.fillFcaNumber(C.mainAlpha.fca);
    await firmsAdminPage.clickFirmSearchButton();
    await expect(pagination.paginationComponent()).toBeHidden();
  });
});
