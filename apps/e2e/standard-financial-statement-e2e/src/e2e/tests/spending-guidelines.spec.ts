import { appUrl } from '@lib/env.lib';
import { expect, test } from '@lib/test.lib';

import { NAV_LINK } from '../../data/nav.data';
import { verifyDataLayer } from '../../utils/verifyDataLayer';

test.describe('spending-guidelines', () => {
  test.setTimeout(50_000);

  test.beforeEach(async ({ extendedPage, homePage }) => {
    await extendedPage.goto('/en/use-the-sfs', {
      waitUntil: 'domcontentloaded',
    });
    await expect(homePage.heading).toHaveText('Use the SFS');
  });

  test('Spending Guidelines - Current year', async ({
    extendedPage: page,
    homePage,
  }) => {
    await homePage.clickNavLink(NAV_LINK.spendingGuidelines);
    await page.waitForResponse('**/en/use-the-sfs/spending-guidelines.json**', {
      timeout: 20000,
    });
    await page.waitForURL('**/en/use-the-sfs/spending-guidelines');
    await expect(homePage.heading).toHaveText('Spending guidelines');
    await verifyDataLayer(
      page,
      'pageLoadReact',
      appUrl('/en/use-the-sfs/spending-guidelines'),
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
          url: appUrl('/en/use-the-sfs/spending-guidelines'),
        },
      },
    );
  });

  test('Spending Guidelines - Commentary', async ({
    extendedPage: page,
    homePage,
  }) => {
    await homePage.clickNavLink(NAV_LINK.spendingGuidelinesCommentary);
    await page.waitForResponse(
      '**/en/use-the-sfs/spending-guidelines-commentary.json**',
      {
        timeout: 20000,
      },
    );
    await page.waitForURL('**/en/use-the-sfs/spending-guidelines-commentary');
    await expect(homePage.heading).toHaveText(
      'Spending Guidelines Commentary 2025/26',
    );
    await verifyDataLayer(
      page,
      'pageLoadReact',
      appUrl('/en/use-the-sfs/spending-guidelines-commentary'),
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
          url: appUrl('/en/use-the-sfs/spending-guidelines-commentary'),
        },
      },
    );
  });

  test('Spending Guidelines - Commentary past years', async ({
    extendedPage: page,
    homePage,
  }) => {
    await homePage.clickNavLink(NAV_LINK.commentaryForPastYears);
    await page.waitForResponse(
      '**/en/use-the-sfs/commentary-for-past-years.json**',
      {
        timeout: 20000,
      },
    );
    await page.waitForURL('**/en/use-the-sfs/commentary-for-past-years');
    await expect(homePage.heading).toHaveText(
      'Spending Guidelines Commentary for past years',
    );
    await verifyDataLayer(
      page,
      'pageLoadReact',
      appUrl('/en/use-the-sfs/commentary-for-past-years'),
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
          url: appUrl('/en/use-the-sfs/commentary-for-past-years'),
        },
      },
    );
  });

  test('Spending Guidelines - Methodology', async ({
    extendedPage: page,
    homePage,
  }) => {
    await homePage.clickNavLink(NAV_LINK.methodology);
    await page.waitForResponse(
      '**/en/use-the-sfs/spending-guidelines-methodology.json**',
      {
        timeout: 20000,
      },
    );
    await page.waitForURL('**/en/use-the-sfs/spending-guidelines-methodology');
    await expect(homePage.heading).toHaveText(
      'Spending guidelines methodology',
    );
    await verifyDataLayer(
      page,
      'pageLoadReact',
      appUrl('/en/use-the-sfs/spending-guidelines-methodology'),
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
          url: appUrl('/en/use-the-sfs/spending-guidelines-methodology'),
        },
      },
    );
  });
});
