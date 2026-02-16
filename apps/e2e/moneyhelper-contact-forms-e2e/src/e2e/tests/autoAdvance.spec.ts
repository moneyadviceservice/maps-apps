/* eslint-disable playwright/expect-expect */
import { expect, test } from '@playwright/test';

import { BasePage } from '../pages/BasePage';

test.describe('Auto Advance Logic', () => {
  let basePage: BasePage;

  test.beforeEach(async ({ page }) => {
    await page.context().clearCookies();
  });

  test('auto advances to the correct flow based on the query parameter', async ({
    page,
  }) => {
    basePage = new BasePage(page);
    // Navigate to the root page with the auto advance query parameter to trigger the auto advance logic
    await basePage.gotoHome('?aa=mhpd');
    await page.getByTestId('guidance-continue-button').click();
    await page.waitForURL(/\/en\/about-mhpd/, { timeout: 20000 });

    // Assert
    await expect(page.getByTestId('about-mhpd-title')).toBeVisible();
  });

  test('follows the default flow when an invalid auto advance query parameter is provided', async ({
    page,
  }) => {
    basePage = new BasePage(page);
    // Navigate to the root page with an invalid auto advance query parameter
    await basePage.gotoHome('?aa=invalid');
    await page.getByTestId('guidance-continue-button').click();
    await page.waitForURL(/\/en\/enquiry-type/, { timeout: 20000 });

    // Assert
    await expect(page.getByTestId('enquiry-type-title')).toBeVisible();
  });
});
