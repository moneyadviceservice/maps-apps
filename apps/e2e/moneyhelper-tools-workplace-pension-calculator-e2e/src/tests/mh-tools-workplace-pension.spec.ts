import { expect, test } from '@lib/test.lib';

/**
 * This tool was migrated to /apps/workplace-pension-calculator
 *
 * A test framework needs to exist so the old deprecated framework passes pipeline checks.
 * This will be removed in a future sprint.
 */

test.describe('Workplace Pension Calculator', () => {
  test('should load', async ({ page }) => {
    await page.goto('/en/workplace-pension-calculator');
    await expect(page).toHaveURL(/\/workplace-pension-calculator/);
  });
});
