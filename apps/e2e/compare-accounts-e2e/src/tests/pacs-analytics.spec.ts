/**
 * PACS Analytics E2E Tests
 *
 * This suite validates Adobe DataLayer events across multiple PACS URLs.
 *
 * Notes:
 * - Uses the strict Page Object Model (POM) pattern; no direct Playwright selectors.
 * - Imports Playwright test utilities from @lib/test.lib to comply with ESLint rules.
 * - Includes assertions using the data layer assertion library.
 * - All navigation, cookie handling, and viewport setup are delegated to AnalyticsPage.
 */

import { adobeDatalayer } from '@data/pacs-adobeDatalayer';
import { expect, test } from '@lib/test.lib';

const basePath = '/en';

test.describe('Analytics', () => {
  test.beforeEach(async ({ analyticsPage }) => {
    await analyticsPage.goto(basePath);
    await analyticsPage.acceptCookies();
  });

  test('pageLoadReact', async ({ analyticsPage, page }) => {
    const locales = ['en', 'cy'] as const;

    const urls = [
      '?accountsPerPage=20&p=1',
      '?q=&standardcurrent=on&feefreebasicbank=on&student=on&premier=on&accountsPerPage=5&order=random',
      '?q=&chequebookavailable=on&nomonthlyfee=on&opentonewcustomers=on&overdraftfacilities=on&sevendayswitching=on&accountsPerPage=10&order=random',
      '?q=&branchbanking=on&internetbanking=on&mobileappbanking=on&postofficebanking=on&accountsPerPage=15&order=random',
      '?accountsPerPage=20&order=providerNameAZ&p=1',
      '?accountsPerPage=20&order=providerNameZA&p=1',
      '?accountsPerPage=20&order=monthlyAccountFeeLowestFirst&p=1',
      '?accountsPerPage=20&order=minimumMonthlyDepositLowestFirst&p=1',
      '?accountsPerPage=10&order=arrangedOverdraftRateLowestFirst&p=1',
      '?accountsPerPage=5&order=unarrangedMaximumMonthlyChargeLowestFirst&p=1',
    ];

    for (const locale of locales) {
      for (const urlTemplate of urls) {
        const expectedUrl = `/${locale}/${urlTemplate}`;
        const values = adobeDatalayer(locale)[urlTemplate];

        await test.step(`Verifying data layer at ${expectedUrl}`, async () => {
          await analyticsPage.goto(expectedUrl);
          await expect(page).toHavePartialDataLayerEvent({
            event: 'pageLoadReact',
            ...values,
          });
        });
      }
    }
  });
});
