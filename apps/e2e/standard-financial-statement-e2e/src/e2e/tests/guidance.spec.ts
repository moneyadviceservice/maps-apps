import { appUrl } from '@lib/env.lib';
import { expect, test } from '@lib/test.lib';

import { NAV_LINK } from '../../data/nav.data';
import { verifyDataLayer } from '../../utils/verifyDataLayer';

test.describe('Use the SFS - Guidance', () => {
  test.setTimeout(50_000);

  test.beforeEach(async ({ extendedPage, homePage }) => {
    await extendedPage.goto('/en/use-the-sfs', {
      waitUntil: 'domcontentloaded',
    });
    await expect(homePage.heading).toHaveText('Use the SFS');
  });

  test('Using SFS', async ({ extendedPage: page, homePage }) => {
    await homePage.clickNavLink(NAV_LINK.guidanceForUsingTheSfs);
    await page.waitForResponse(
      '**/en/use-the-sfs/guidance-for-using-the-sfs.json**',
      {
        timeout: 20000,
      },
    );
    await page.waitForURL('**/en/use-the-sfs/guidance-for-using-the-sfs');
    await expect(homePage.heading).toHaveText('Guidance for using the SFS');
    await verifyDataLayer(
      page,
      'pageLoadReact',
      appUrl('/en/use-the-sfs/guidance-for-using-the-sfs'),
      {
        page: {
          pageName: 'Guidance for using the SFS',
          pageTitle: 'Guidance for using the SFS | SFS',
          lang: 'en',
          site: 'moneyhelper',
          pageType: 'Sub Category',
          source: 'direct',
          categoryL1: 'Use the SFS',
          categoryL2: 'Guidance for using the SFS',
          url: appUrl('/en/use-the-sfs/guidance-for-using-the-sfs'),
        },
      },
    );
  });

  test('FAQ', async ({ extendedPage: page, homePage }) => {
    await homePage.clickNavLink(NAV_LINK.frequentlyAskedQuestions);
    await page.waitForResponse(
      '**/en/use-the-sfs/frequently-asked-questions.json**',
      {
        timeout: 20000,
      },
    );
    await page.waitForURL('**/en/use-the-sfs/frequently-asked-questions');
    await expect(homePage.heading).toHaveText('Frequently asked questions');
    await verifyDataLayer(
      page,
      'pageLoadReact',
      appUrl('/en/use-the-sfs/frequently-asked-questions'),
      {
        page: {
          pageName: 'Frequently asked questions',
          pageTitle: 'Frequently asked questions | SFS',
          lang: 'en',
          site: 'moneyhelper',
          pageType: 'Sub Category',
          source: 'direct',
          categoryL1: 'Use the SFS',
          categoryL2: 'Frequently asked questions',
          url: appUrl('/en/use-the-sfs/frequently-asked-questions'),
        },
      },
    );
  });

  test('Governence terms', async ({ extendedPage: page, homePage }) => {
    await homePage.clickNavLink(NAV_LINK.governanceGroupTor);
    await page.waitForResponse(
      '**/en/use-the-sfs/governance-group-tor.json**',
      {
        timeout: 20000,
      },
    );
    await page.waitForURL('**/en/use-the-sfs/governance-group-tor');
    await expect(homePage.heading).toHaveText(
      'Governance Group Terms of Reference',
    );
    await verifyDataLayer(
      page,
      'pageLoadReact',
      appUrl('/en/use-the-sfs/governance-group-tor'),
      {
        page: {
          pageName: 'Governance Group Terms of Reference',
          pageTitle: 'Governance Group Terms of Reference | SFS',
          lang: 'en',
          site: 'moneyhelper',
          pageType: 'Sub Category',
          source: 'direct',
          categoryL1: 'Use the SFS',
          categoryL2: 'Governance Group Terms of Reference',
          url: appUrl('/en/use-the-sfs/governance-group-tor'),
        },
      },
    );
  });

  test('Encouraging debt advice', async ({ extendedPage: page, homePage }) => {
    await homePage.clickNavLink(NAV_LINK.encouragingDebtAdvice);
    await page.waitForResponse(
      '**/en/use-the-sfs/encouraging-debt-advice.json**',
      {
        timeout: 20000,
      },
    );
    await page.waitForURL('**/en/use-the-sfs/encouraging-debt-advice');
    await expect(homePage.heading).toHaveText(
      'Encouraging debt advice clients to save using behavioural science',
    );
    await verifyDataLayer(
      page,
      'pageLoadReact',
      appUrl('/en/use-the-sfs/encouraging-debt-advice'),
      {
        page: {
          pageName:
            'Encouraging debt advice clients to save using behavioural science',
          pageTitle:
            'Encouraging debt advice clients to save using behavioural science | SFS',
          lang: 'en',
          site: 'moneyhelper',
          pageType: 'Sub Category',
          source: 'direct',
          categoryL1: 'Use the SFS',
          categoryL2:
            'Encouraging debt advice clients to save using behavioural science',
          url: appUrl('/en/use-the-sfs/encouraging-debt-advice'),
        },
      },
    );
  });
});
