import { expect, test } from '@playwright/test';

import { homePage } from '../pages/HomePage';
import { verifyDataLayer } from '../utils/verifyDataLayer';

test.describe('Use the SFS - Guidance', () => {
  test.beforeEach(async ({ page }) => {
    await homePage.disableCookieConsent(page);
    await page.goto('/');
    expect(await homePage.assertHeading(page)).toBe(true);
  });

  test('Using SFS', async ({ page }) => {
    await page.goto('/en/use-the-sfs');
    test.setTimeout(50_000);
    await expect(await homePage.getHeading(page)).toHaveText('Use the SFS');

    await homePage.clickNavLink(page, 'Guidance for using the SFS');
    await page.waitForResponse(
      '**/en/use-the-sfs/guidance-for-using-the-sfs.json**',
      {
        timeout: 20000,
      },
    );
    await page.waitForURL('**/en/use-the-sfs/guidance-for-using-the-sfs');
    await expect(await homePage.getHeading(page)).toHaveText(
      'Guidance for using the SFS',
    );
    await verifyDataLayer(
      page,
      'pageLoadReact',
      'http://localhost:8888/en/use-the-sfs/guidance-for-using-the-sfs',
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
          url: 'http://localhost:8888/en/use-the-sfs/guidance-for-using-the-sfs',
        },
      },
    );
    await expect(await page.screenshot({ fullPage: true })).toMatchSnapshot({
      name: 'Guidance-for-using-the-sfs-no-auth.png',
      maxDiffPixelRatio: 0,
    });
  });

  test('FAQ', async ({ page }) => {
    await page.goto('/en/use-the-sfs');
    test.setTimeout(50_000);
    await expect(await homePage.getHeading(page)).toHaveText('Use the SFS');

    await homePage.clickNavLink(page, 'Frequently asked questions');
    await page.waitForResponse(
      '**/en/use-the-sfs/frequently-asked-questions.json**',
      {
        timeout: 20000,
      },
    );
    await page.waitForURL('**/en/use-the-sfs/frequently-asked-questions');
    await expect(await homePage.getHeading(page)).toHaveText(
      'Frequently asked questions',
    );
    await verifyDataLayer(
      page,
      'pageLoadReact',
      'http://localhost:8888/en/use-the-sfs/frequently-asked-questions',
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
          url: 'http://localhost:8888/en/use-the-sfs/frequently-asked-questions',
        },
      },
    );
    await expect(await page.screenshot({ fullPage: true })).toMatchSnapshot({
      name: 'Frequently-asked-questions-no-auth.png',
      maxDiffPixelRatio: 0,
    });
  });

  test('Governence terms', async ({ page }) => {
    await page.goto('/en/use-the-sfs');
    test.setTimeout(50_000);
    await expect(await homePage.getHeading(page)).toHaveText('Use the SFS');

    await homePage.clickNavLink(page, 'Governance Group ToR');
    await page.waitForResponse(
      '**/en/use-the-sfs/governance-group-tor.json**',
      {
        timeout: 20000,
      },
    );
    await page.waitForURL('**/en/use-the-sfs/governance-group-tor');
    await expect(await homePage.getHeading(page)).toHaveText(
      'Governance Group Terms of Reference',
    );
    await verifyDataLayer(
      page,
      'pageLoadReact',
      'http://localhost:8888/en/use-the-sfs/governance-group-tor',
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
          url: 'http://localhost:8888/en/use-the-sfs/governance-group-tor',
        },
      },
    );
    await expect(await page.screenshot({ fullPage: true })).toMatchSnapshot({
      name: 'governance-group-tor-no-auth.png',
      maxDiffPixelRatio: 0,
    });
  });

  test('Encouraging debt advice', async ({ page }) => {
    await page.goto('/en/use-the-sfs');
    test.setTimeout(50_000);
    await expect(await homePage.getHeading(page)).toHaveText('Use the SFS');

    await homePage.clickNavLink(
      page,
      'Encouraging debt advice clients to save using behavioural science',
    );
    await page.waitForResponse(
      '**/en/use-the-sfs/encouraging-debt-advice.json**',
      {
        timeout: 20000,
      },
    );
    await page.waitForURL('**/en/use-the-sfs/encouraging-debt-advice');
    await expect(await homePage.getHeading(page)).toHaveText(
      'Encouraging debt advice clients to save using behavioural science',
    );
    await verifyDataLayer(
      page,
      'pageLoadReact',
      'http://localhost:8888/en/use-the-sfs/encouraging-debt-advice',
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
          url: 'http://localhost:8888/en/use-the-sfs/encouraging-debt-advice',
        },
      },
    );
    await expect(await page.screenshot({ fullPage: true })).toMatchSnapshot({
      name: 'encouraging-debt-advice-no-auth.png',
      maxDiffPixelRatio: 0,
    });
  });
});
