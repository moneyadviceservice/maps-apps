import { expect, test } from '@playwright/test';

import { verifyDatalayer } from '../../utils/verifyDatalayer';
import { adobeDatalayer } from '../data/lbtt-adobeDatalayer';
const basePath = '/en/lbtt';
const locales = ['en', 'cy'] as const;

test.describe('LBTT - Analytics', () => {
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
    const urls = [
      'lbtt?isEmbedded=false&calculated=true&recalculated=false&buyerType=firstTimeBuyer&price=250%2C000',
      'lbtt?isEmbedded=false&calculated=true&recalculated=true&buyerType=firstTimeBuyer&price=350%2C000',
      'lbtt?isEmbedded=false&calculated=true&recalculated=true&buyerType=firstTimeBuyer&price=9%2C999%2C937.789',
      'lbtt?isEmbedded=false&calculated=true&recalculated=true&buyerType=nextHome&price=450%2C000',
      'lbtt?isEmbedded=false&calculated=true&recalculated=false&buyerType=nextHome&price=937%2C000',
      'lbtt?isEmbedded=false&calculated=true&recalculated=true&buyerType=additionalHome&price=550%2C000',
      'lbtt?isEmbedded=false&calculated=true&recalculated=false&buyerType=additionalHome&price=1%2C200%2C000',
    ];

    for (const locale of locales) {
      for (const urlTemplate of urls) {
        const expectedUrl = `/${locale}/${urlTemplate}`;
        const values = adobeDatalayer(locale)[urlTemplate];

        await test.step(`Verifying pageLoadReact at ${expectedUrl}`, async () => {
          await page.goto(expectedUrl);
          await page.waitForLoadState('domcontentloaded');
          await verifyDatalayer(page, 'pageLoadReact', locale, values);
          expect(values).toBeDefined();
        });
      }
    }
  });

  test('DataLayer - toolStart', async ({ page }) => {
    const urls = ['lbtt'];

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

  test('DataLayer - toolCompletion', async ({ page }) => {
    const urls = [
      'lbtt?isEmbedded=false&calculated=true&recalculated=false&buyerType=firstTimeBuyer&price=450%2C000&day=30&month=10&year=2025',
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

  test('DataLayer - errorMessage', async ({ page }) => {
    const urls = [
      'lbtt?isEmbedded=false&calculated=true&recalculated=false&buyerType=firstTimeBuyer&price=',
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

  test('DataLayer - toolInteraction', async ({ page }) => {
    const urls = [
      'lbtt?isEmbedded=false&calculated=true&recalculated=true&buyerType=firstTimeBuyer&price=750%2C000',
    ];

    for (const locale of locales) {
      for (const urlTemplate of urls) {
        const expectedUrl = `/${locale}/${urlTemplate}`;
        const values = adobeDatalayer(locale)[urlTemplate];
        await page.locator('#buyerType').press('Tab');
        await page.goto(expectedUrl);
        expect(values).toBeDefined();
      }
    }
  });
});
