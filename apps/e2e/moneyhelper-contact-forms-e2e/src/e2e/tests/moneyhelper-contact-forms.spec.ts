/* eslint-disable playwright/no-focused-test */
import { expect, test } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/en/guidance');
  await expect(
    page
      .getByTestId('layout-title')
      .getByText('Free money and pensions guidance'),
  ).toBeVisible();
});
