/* eslint-disable playwright/expect-expect */
import { test } from '@playwright/test';

import { assertErrorSummary, assertInlineError } from '../helpers';
import { EnquiryTypePage } from '../pages/EnquiryTypePage';

test.describe('Enquiry Type Validation', () => {
  test('shows errors for empty enquiry type', async ({ page }) => {
    await page.context().clearCookies();
    const enquiryTypePage = new EnquiryTypePage(page);

    await enquiryTypePage.goToEnquiryType();
    await enquiryTypePage.submitForm();

    // Wait for enquiry type page to reload with validation errors
    await page.waitForURL(/\/en\/enquiry-type/, {
      timeout: 20000,
    });

    // Use helpers to avoid duplication (DRY)
    await assertErrorSummary(page);
    await assertInlineError(page, 'question-radio');
  });
});
