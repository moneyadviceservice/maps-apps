/* eslint-disable playwright/no-focused-test */
import { expect, test } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/en/appointment-type');
  await expect(
    page.getByTestId('layout-title').getByText('Book an appointment'),
  ).toBeVisible();
});
