import { expect, test } from '@playwright/test';

/**
 * @test 57764 GRG – Redirects
 * @test 57855 - 57764 AC1, AC2, AC3 Test case 1: Verify GRG redirect
 
 */

test.describe('GRG URL Redirects', () => {
  test('AC1: Root path / redirects to /en-question-1', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/en\/question-1/);
  });

  test('AC2: English root /en redirects to /en-question-1', async ({
    page,
  }) => {
    await page.goto('/en');
    await expect(page).toHaveURL(/\/en\/question-1/);
  });

  test('AC3: Welsh root /cy redirects to /cy-question-1', async ({ page }) => {
    await page.goto('/cy');
    await expect(page).toHaveURL(/\/cy\/question-1/);
  });
});
