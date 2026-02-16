/* eslint-disable playwright/expect-expect */
import { test } from '@playwright/test';

import { assertErrorSummary, assertInlineError } from '../helpers';
import { InsuranceTypePage } from '../pages/InsuranceTypePage';

test.describe('Insurance Type Validation', () => {
  test('shows errors for empty insurance type', async ({ page }) => {
    await page.context().clearCookies();
    const insuranceTypePage = new InsuranceTypePage(page);

    await insuranceTypePage.goToInsuranceType();
    await insuranceTypePage.submitForm();

    // Wait for insurance type page to reload with validation errors
    await page.waitForURL(/\/en\/insurance-type/, {
      timeout: 20000,
    });

    // Use helpers to avoid duplication (DRY)
    await assertErrorSummary(page);
    await assertInlineError(page, 'question-radio');
  });
});
