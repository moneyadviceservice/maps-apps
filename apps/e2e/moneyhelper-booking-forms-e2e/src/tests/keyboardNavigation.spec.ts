/* eslint-disable playwright/expect-expect */
import { test } from '@playwright/test';

import { assertErrorSummary, assertInlineError } from '../helpers';
import { BasePage } from '../pages/BasePage';

test.describe('Keyboard Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.context().clearCookies();
  });

  test('shows validation errors when submitting appointment type with keyboard and no selection', async ({
    page,
  }) => {
    const basePage = new BasePage(page);
    const submitButton = page.getByTestId('form-button');

    await basePage.gotoHome();

    await submitButton.focus();
    await page.keyboard.press('Enter');

    await page.waitForURL(`/en`, { timeout: 20000 });

    // Use helpers to avoid duplication (DRY)
    await assertErrorSummary(page);
    await assertInlineError(page, 'question-radio');
  });
});
