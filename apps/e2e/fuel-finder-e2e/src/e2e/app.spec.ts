import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/en');
});

test('should display the landing page title', async ({ page }) => {
  await expect(page).toHaveTitle(/Find cheap fuel/);
});
