import { expect, test } from '@playwright/test';

import { verifyDatalayer } from '../../utils/verifyDatalayer';
import { adobeDatalayer } from '../data/ltt-adobeDatalayer';

const basePath = '/en/ltt';
const locales = ['en', 'cy'] as const;
test.describe('LTT-Analytics', () => {
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

  test('pageLoadReact', async ({ page }) => {
    const urls = [
      'ltt?calculated=true&buyerType=firstOrNextHome&price=350%2C000',
      'ltt?isEmbedded=false&calculated=true&recalculated=true&buyerType=firstOrNextHome&price=9%2C999%2C567.89',
      'ltt?isEmbedded=false&calculated=true&recalculated=true&buyerType=additionalHome&price=9%2C999%2C567.89',
      'ltt?isEmbedded=false&calculated=true&recalculated=false&buyerType=additionalHome&price=1%2C290%2C000.45',
    ];

    for (const locale of locales) {
      for (const urlTemplate of urls) {
        const expectedUrl = `/${locale}/${urlTemplate}`;
        const values = adobeDatalayer(locale)[urlTemplate];

        await test.step(`Verifying datalayer at ${expectedUrl}`, async () => {
          await page.goto(expectedUrl);
          await page.waitForLoadState('domcontentloaded');
          await verifyDatalayer(page, 'pageLoadReact', locale, values);

          expect(true).toBe(true);
        });
      }
    }
  });

  test('toolStart', async ({ page }) => {
    const urls = ['ltt?buyerType=firstOrNextHome'];

    for (const locale of locales) {
      for (const urlTemplate of urls) {
        const expectedUrl = `/${locale}/${urlTemplate}`;
        const values = adobeDatalayer(locale)[urlTemplate];
        await page.goto(expectedUrl);
        const priceInput = page.locator('#price');
        await priceInput.fill('450000');
        await priceInput.press('Tab');
        await verifyDatalayer(page, 'toolStart', locale, values);
        expect(values).toBeDefined();
      }
    }
  });
  test('toolCompletion', async ({ page }) => {
    const urls = [
      'ltt?isEmbedded=false&calculated=false&recalculated=false&buyerType=additionalHome&price=3%2C29%2C000&day=30&month=10&year=2025',
    ];

    for (const locale of locales) {
      for (const urlTemplate of urls) {
        const expectedUrl = `/${locale}/${urlTemplate}`;
        const values = adobeDatalayer(locale)[urlTemplate];

        await page.goto(expectedUrl);
        await verifyDatalayer(page, 'toolCompletion', locale, values);
        expect(values).toBeDefined();
      }
    }
  });

  test('errorMessage', async ({ page }) => {
    const urls = [
      'ltt?isEmbedded=false&calculated=true&recalculated=true&buyerType=additionalHome&price=',
    ];

    for (const locale of locales) {
      for (const urlTemplate of urls) {
        const expectedUrl = `/${locale}/${urlTemplate}`;
        const values = adobeDatalayer(locale)[urlTemplate];
        await page.goto(expectedUrl);
        await verifyDatalayer(page, 'errorMessage', locale, values);
        expect(values).toBeDefined();
      }
    }
  });

  test('toolInteraction', async ({ page }) => {
    const urls = ['ltt'];

    for (const locale of locales) {
      for (const urlTemplate of urls) {
        const expectedUrl = `/${locale}/${urlTemplate}`;
        const values = adobeDatalayer(locale)[urlTemplate];
        await page.selectOption('#buyerType', 'firstOrNextHome');
        await page.locator('#buyerType').press('Tab');
        await page.goto(expectedUrl);
        expect(values).toBeDefined();
      }
    }
  });
});
