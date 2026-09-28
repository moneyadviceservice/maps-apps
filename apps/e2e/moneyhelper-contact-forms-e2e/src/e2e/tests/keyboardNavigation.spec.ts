/* eslint-disable playwright/expect-expect */
import { expect, Page, test } from '@playwright/test';

import { assertErrorSummary, assertInlineError } from '../helpers';
import { StepName } from '../lib/constants';
import { EnquiryTypePage } from '../pages/EnquiryTypePage';

let enquiryTypePage: EnquiryTypePage;
let submitButton: ReturnType<Page['getByTestId']>;

test.describe('Keyboard Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.context().clearCookies();
    enquiryTypePage = new EnquiryTypePage(page);
    submitButton = page.getByTestId('form-button');
  });

  test('shows validation errors when submitting enquiry type with keyboard and no selection', async ({
    page,
  }) => {
    await enquiryTypePage.goToEnquiryType();

    await submitButton.focus();
    await page.keyboard.press('Enter');

    await page.waitForURL(`/en/${StepName.ENQUIRY_TYPE}`, { timeout: 20000 });

    // Use helpers to avoid duplication (DRY)
    await assertErrorSummary(page);
    await assertInlineError(page, 'question-radio');
  });

  test('supports keyboard-only selection and submit on enquiry type page', async ({
    page,
  }) => {
    // Assert
    await enquiryTypePage.goToEnquiryType();

    const scamsOption = page.getByRole('radio', {
      name: 'Worries about financial scams, fraud or mis-selling',
    });

    await scamsOption.focus();
    await page.keyboard.press('Space');
    await expect(scamsOption).toBeChecked();

    await submitButton.focus();
    await page.keyboard.press('Enter');

    await page.waitForURL(`/en/${StepName.ABOUT_SCAMS}`, { timeout: 20000 });

    // Expect
    await expect(page.getByTestId('about-scams-title')).toBeVisible();
  });
});
