import { test } from '@playwright/test';

export function setupLocaleTest(
  locales: string[],
  pathSegment: string,
  runTests: (locale: string) => void,
) {
  for (const locale of locales) {
    test.describe(`Land & Buildings Transaction Tax - ${locale.toUpperCase()}`, () => {
      test.beforeEach(async ({ page }) => {
        await page.goto(`/${locale}/${pathSegment}`);
        await page
          .locator('button', {
            hasText: /Accept all cookies|Derbyn pob cwci/i,
          })
          .click()
          .catch(() => {
            console.log('Cookie banner not found');
          });

        await page.setViewportSize({ width: 1440, height: 900 });
      });

      runTests(locale); // Run locale-specific tests inside the describe block
    });
  }
}
