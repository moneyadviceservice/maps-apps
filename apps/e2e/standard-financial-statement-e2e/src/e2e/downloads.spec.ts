import { expect, test } from '@playwright/test';

import { homePage } from '../pages/HomePage';
import { verifyDataLayer } from '../utils/verifyDataLayer';

test.describe('Use the SFS - Downloads', () => {
  test.beforeEach(async ({ page }) => {
    await homePage.disableCookieConsent(page);
    await page.goto('/');
    expect(await homePage.assertHeading(page)).toBe(true);
  });

  test('Downloads - SFS Format', async ({ page }) => {
    await page.goto('/en/use-the-sfs');
    test.setTimeout(50_000);
    await expect(await homePage.getHeading(page)).toHaveText('Use the SFS');

    await homePage.clickNavLink(page, 'SFS Format');
    await page.waitForResponse(
      '**/en/use-the-sfs/download-the-sfs-format.json**',
      {
        timeout: 20000,
      },
    );
    await page.waitForURL('**/en/use-the-sfs/download-the-sfs-format');
    await expect(await homePage.getHeading(page)).toHaveText(
      'Download the SFS format',
    );
    await verifyDataLayer(
      page,
      'pageLoadReact',
      'http://localhost:8888/en/use-the-sfs/download-the-sfs-format',
      {
        page: {
          pageName: 'Download the SFS format',
          pageTitle: 'Download the SFS format | SFS',
          lang: 'en',
          site: 'moneyhelper',
          pageType: 'Sub Category',
          source: 'direct',
          categoryL1: 'Use the SFS',
          categoryL2: 'Download the SFS format',
          url: 'http://localhost:8888/en/use-the-sfs/download-the-sfs-format',
        },
      },
    );
  });

  test('Downloads - SFS Excel Tool', async ({ page }) => {
    await page.goto('/en/use-the-sfs');
    test.setTimeout(50_000);
    await expect(await homePage.getHeading(page)).toHaveText('Use the SFS');

    await homePage.clickNavLink(page, 'SFS Excel Tool');
    await page.waitForResponse(
      '**/en/use-the-sfs/download-the-sfs-excel-tool.json**',
      {
        timeout: 20000,
      },
    );
    await page.waitForURL('**/en/use-the-sfs/download-the-sfs-excel-tool');
    await expect(await homePage.getHeading(page)).toHaveText(
      'Download the SFS Excel tool',
    );
    await verifyDataLayer(
      page,
      'pageLoadReact',
      'http://localhost:8888/en/use-the-sfs/download-the-sfs-excel-tool',
      {
        page: {
          pageName: 'Download the SFS Excel tool',
          pageTitle: 'Download the SFS Excel tool | SFS',
          lang: 'en',
          site: 'moneyhelper',
          pageType: 'Sub Category',
          source: 'direct',
          categoryL1: 'Use the SFS',
          categoryL2: 'Download the SFS Excel tool',
          url: 'http://localhost:8888/en/use-the-sfs/download-the-sfs-excel-tool',
        },
      },
    );
  });

  test('Downloads - SFS Customer Version', async ({ page }) => {
    await page.goto('/en/use-the-sfs');
    test.setTimeout(50_000);
    await expect(await homePage.getHeading(page)).toHaveText('Use the SFS');

    await homePage.clickNavLink(page, 'SFS Customer Version');
    await page.waitForResponse(
      '**/en/use-the-sfs/sfs-customer-version.json**',
      {
        timeout: 20000,
      },
    );
    await page.waitForURL('**/en/use-the-sfs/sfs-customer-version');
    await expect(await homePage.getHeading(page)).toHaveText(
      'SFS customer version',
    );
    await verifyDataLayer(
      page,
      'pageLoadReact',
      'http://localhost:8888/en/use-the-sfs/sfs-customer-version',
      {
        page: {
          pageName: 'SFS customer version',
          pageTitle: 'SFS customer version | SFS',
          lang: 'en',
          site: 'moneyhelper',
          pageType: 'Sub Category',
          source: 'direct',
          categoryL1: 'Use the SFS',
          categoryL2: 'SFS customer version',
          url: 'http://localhost:8888/en/use-the-sfs/sfs-customer-version',
        },
      },
    );
  });
});
