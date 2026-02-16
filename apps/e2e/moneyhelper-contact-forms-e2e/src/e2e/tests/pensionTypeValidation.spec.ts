/* eslint-disable playwright/expect-expect */
import { test } from '@playwright/test';

import { assertErrorSummary, assertInlineError } from '../helpers';
import { PensionTypePage } from '../pages/PensionTypePage';

test.describe('Pension Type Validation', () => {
  test('shows errors for empty pension type', async ({ page }) => {
    await page.context().clearCookies();
    const pensionTypePage = new PensionTypePage(page);

    await pensionTypePage.goToPensionType();
    await pensionTypePage.submitForm();

    // Wait for pension type page to reload with validation errors
    await page.waitForURL(/\/en\/pension-type/, {
      timeout: 20000,
    });

    // Use helpers to avoid duplication (DRY)
    await assertErrorSummary(page);
    await assertInlineError(page, 'question-radio');
  });
});
