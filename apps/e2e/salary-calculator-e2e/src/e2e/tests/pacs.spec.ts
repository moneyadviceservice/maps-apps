import { expect, test } from '@playwright/test';

test('Salary calculator page loads successfully', async ({ page }) => {
  await page.goto('/en');

  const heading = page.getByRole('heading', { level: 1 });
  await expect(heading).toBeVisible();
  await expect(heading).toContainText('Salary calculator');
});
