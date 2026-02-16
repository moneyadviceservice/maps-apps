import { expect, test } from '@playwright/test';

import { homePage } from '../pages/HomePage';
import { verifyDataLayer } from '../utils/verifyDataLayer';

test.describe('spending-guidelines', () => {
  test.beforeEach(async ({ page }) => {
    await homePage.disableCookieConsent(page);
    await page.goto('/');
    expect(await homePage.assertHeading(page)).toBe(true);
  });

  test('Spending Guidelines - Current year', async ({ page }) => {
    await page.goto('/en/use-the-sfs');
    test.setTimeout(50_000);
    await expect(await homePage.getHeading(page)).toHaveText('Use the SFS');

    await homePage.clickNavLink(page, 'Spending Guidelines 2025/26');
    await page.waitForResponse('**/en/use-the-sfs/spending-guidelines.json**', {
      timeout: 20000,
    });
    await page.waitForURL('**/en/use-the-sfs/spending-guidelines');
    await expect(await homePage.getHeading(page)).toHaveText(
      'Spending guidelines',
    );
    await verifyDataLayer(
      page,
      'pageLoadReact',
      'http://localhost:8888/en/use-the-sfs/spending-guidelines',
      {
        page: {
          pageName: 'Spending guidelines',
          pageTitle: 'Spending guidelines | SFS',
          lang: 'en',
          site: 'moneyhelper',
          pageType: 'Sub Category',
          source: 'direct',
          categoryL1: 'Use the SFS',
          categoryL2: 'Spending guidelines',
          url: 'http://localhost:8888/en/use-the-sfs/spending-guidelines',
        },
      },
    );
  });

  test('Spending Guidelines - Commentary', async ({ page }) => {
    await page.goto('/en/use-the-sfs');
    test.setTimeout(50_000);
    await expect(await homePage.getHeading(page)).toHaveText('Use the SFS');

    await homePage.clickNavLink(page, 'Commentary for 2025/26');
    await page.waitForResponse(
      '**/en/use-the-sfs/spending-guidelines-commentary.json**',
      {
        timeout: 20000,
      },
    );
    await page.waitForURL('**/en/use-the-sfs/spending-guidelines-commentary');
    await expect(await homePage.getHeading(page)).toHaveText(
      'Spending Guidelines Commentary 2025/26',
    );
    await verifyDataLayer(
      page,
      'pageLoadReact',
      'http://localhost:8888/en/use-the-sfs/spending-guidelines-commentary',
      {
        page: {
          pageName: 'Spending Guidelines Commentary 2025/26',
          pageTitle: 'Spending Guidelines Commentary 2025/26 | SFS',
          lang: 'en',
          site: 'moneyhelper',
          pageType: 'Sub Category',
          source: 'direct',
          categoryL1: 'Use the SFS',
          categoryL2: 'Spending Guidelines Commentary 2025/26',
          url: 'http://localhost:8888/en/use-the-sfs/spending-guidelines-commentary',
        },
      },
    );
  });

  test('Spending Guidelines - Commentary past years', async ({ page }) => {
    await page.goto('/en/use-the-sfs');
    test.setTimeout(50_000);
    await expect(await homePage.getHeading(page)).toHaveText('Use the SFS');

    await homePage.clickNavLink(page, 'Commentary for past years');
    await page.waitForResponse(
      '**/en/use-the-sfs/commentary-for-past-years.json**',
      {
        timeout: 20000,
      },
    );
    await page.waitForURL('**/en/use-the-sfs/commentary-for-past-years');
    await expect(await homePage.getHeading(page)).toHaveText(
      'Spending Guidelines Commentary for past years',
    );
    await verifyDataLayer(
      page,
      'pageLoadReact',
      'http://localhost:8888/en/use-the-sfs/commentary-for-past-years',
      {
        page: {
          pageName: 'Spending Guidelines Commentary for past years',
          pageTitle: 'Spending Guidelines Commentary for past years | SFS',
          lang: 'en',
          site: 'moneyhelper',
          pageType: 'Sub Category',
          source: 'direct',
          categoryL1: 'Use the SFS',
          categoryL2: 'Spending Guidelines Commentary for past years',
          url: 'http://localhost:8888/en/use-the-sfs/commentary-for-past-years',
        },
      },
    );
  });

  test('Spending Guidelines - Methodology', async ({ page }) => {
    await page.goto('/en/use-the-sfs');
    test.setTimeout(50_000);
    await expect(await homePage.getHeading(page)).toHaveText('Use the SFS');

    await homePage.clickNavLink(page, 'Methodology');
    await page.waitForResponse(
      '**/en/use-the-sfs/spending-guidelines-methodology.json**',
      {
        timeout: 20000,
      },
    );
    await page.waitForURL('**/en/use-the-sfs/spending-guidelines-methodology');
    await expect(await homePage.getHeading(page)).toHaveText(
      'Spending guidelines methodology',
    );
    await verifyDataLayer(
      page,
      'pageLoadReact',
      'http://localhost:8888/en/use-the-sfs/spending-guidelines-methodology',
      {
        page: {
          pageName: 'Spending guidelines methodology',
          pageTitle: 'Spending guidelines methodology | SFS',
          lang: 'en',
          site: 'moneyhelper',
          pageType: 'Sub Category',
          source: 'direct',
          categoryL1: 'Use the SFS',
          categoryL2: 'Spending guidelines methodology',
          url: 'http://localhost:8888/en/use-the-sfs/spending-guidelines-methodology',
        },
      },
    );
  });
});
