import { test } from '@playwright/test';

import { adobeDatalayer } from '../data/pacs-adobeDatalayer';
import { verifyDatalayer } from '../utils/verifyDatalayer';

const basePath = '/en';

test.describe('PACS-Analytics', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(basePath);

    // Accept cookies if banner is visible
    await page
      .locator('button', { hasText: 'Accept all cookies' })
      .click()
      .catch(() => {
        console.log('Cookie banner not found');
      });

    // Set desktop viewport
    await page.setViewportSize({ width: 1440, height: 900 });
  });

  test('DataLayer - pageLoadReact', async ({ page }) => {
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
        await test.step(`Verifying datalayer at ${expectedUrl}`, async () => {
          await page.goto(expectedUrl);
          await page.waitForLoadState('domcontentloaded');
          await verifyDatalayer(page, 'pageLoadReact', locale, values);
        });
      }
    }
  });
});
