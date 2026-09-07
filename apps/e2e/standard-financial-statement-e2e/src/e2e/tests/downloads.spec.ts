import { appUrl } from '@lib/env.lib';
import { expect, test } from '@lib/test.lib';

import { NAV_LINK } from '../../data/nav.data';
import { verifyDataLayer } from '../../utils/verifyDataLayer';

test.describe('Use the SFS - Downloads', () => {
  test.setTimeout(50_000);

  test.beforeEach(async ({ extendedPage, homePage }) => {
    await extendedPage.goto('/en/use-the-sfs', {
      waitUntil: 'domcontentloaded',
    });
    await expect(homePage.heading).toHaveText('Use the SFS');
  });

  test('Downloads - SFS Format', async ({ extendedPage: page, homePage }) => {
    await homePage.clickNavLink(NAV_LINK.sfsFormat);
    await page.waitForResponse(
      '**/en/use-the-sfs/download-the-sfs-format.json**',
      {
        timeout: 20000,
      },
    );
    await page.waitForURL('**/en/use-the-sfs/download-the-sfs-format');
    await expect(homePage.heading).toHaveText('Download the SFS format');
    await verifyDataLayer(
      page,
      'pageLoadReact',
      appUrl('/en/use-the-sfs/download-the-sfs-format'),
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
          url: appUrl('/en/use-the-sfs/download-the-sfs-format'),
        },
      },
    );
  });

  test('Downloads - SFS Excel Tool', async ({
    extendedPage: page,
    homePage,
  }) => {
    await homePage.clickNavLink(NAV_LINK.sfsExcelTool);
    await page.waitForResponse(
      '**/en/use-the-sfs/download-the-sfs-excel-tool.json**',
      {
        timeout: 20000,
      },
    );
    await page.waitForURL('**/en/use-the-sfs/download-the-sfs-excel-tool');
    await expect(homePage.heading).toHaveText('Download the SFS Excel tool');
    await verifyDataLayer(
      page,
      'pageLoadReact',
      appUrl('/en/use-the-sfs/download-the-sfs-excel-tool'),
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
          url: appUrl('/en/use-the-sfs/download-the-sfs-excel-tool'),
        },
      },
    );
  });

  test('Downloads - SFS Customer Version', async ({
    extendedPage: page,
    homePage,
  }) => {
    await homePage.clickNavLink(NAV_LINK.sfsCustomerVersion);
    await page.waitForResponse(
      '**/en/use-the-sfs/sfs-customer-version.json**',
      {
        timeout: 20000,
      },
    );
    await page.waitForURL('**/en/use-the-sfs/sfs-customer-version');
    await expect(homePage.heading).toHaveText('SFS customer version');
    await verifyDataLayer(
      page,
      'pageLoadReact',
      appUrl('/en/use-the-sfs/sfs-customer-version'),
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
          url: appUrl('/en/use-the-sfs/sfs-customer-version'),
        },
      },
    );
  });
});
