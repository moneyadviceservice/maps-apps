/* eslint-disable playwright/expect-expect */
import { expect, test } from '@playwright/test';

import { BasePage } from '../pages/BasePage';
import { PensionTypePage } from '../pages/PensionTypePage';

test.describe('Back Navigation Logic', () => {
  let basePage: BasePage;
  let pensionTypePage: PensionTypePage;

  test.beforeEach(async ({ page }) => {
    await page.context().clearCookies();
  });

  test('goes back to the previous page when the back button is clicked', async ({
    page,
  }) => {
    basePage = new BasePage(page);
    pensionTypePage = new PensionTypePage(page);

    await basePage.gotoHome();
    await pensionTypePage.goToPensionType();

    // Act
    await page.getByTestId('back-link').locator('a').click();

    // Assert
    await expect(page).toHaveURL(/\/en\/enquiry-type/);
    await expect(page.getByTestId('enquiry-type-title')).toBeVisible();
  });

  test('goes back to the previous page when the browsers back button is used', async ({
    page,
  }) => {
    basePage = new BasePage(page);
    pensionTypePage = new PensionTypePage(page);

    await basePage.gotoHome();
    await pensionTypePage.goToPensionType();

    // Act
    await page.goBack();

    // Assert
    await expect(page).toHaveURL(/\/en\/enquiry-type/);
    await expect(page.getByTestId('enquiry-type-title')).toBeVisible();
  });
});
