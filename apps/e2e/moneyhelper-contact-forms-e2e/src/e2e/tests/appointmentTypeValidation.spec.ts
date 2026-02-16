/* eslint-disable playwright/expect-expect */
import { test } from '@playwright/test';

import { assertErrorSummary, assertInlineError } from '../helpers';
import { AppointmentTypePage } from '../pages/AppointmentTypePage';

test.describe('Appointment Type Validation', () => {
  test('shows errors for empty appointment type', async ({ page }) => {
    await page.context().clearCookies();
    const appointmentTypePage = new AppointmentTypePage(page);

    await appointmentTypePage.goToAppointmentType();
    await appointmentTypePage.submitForm();

    // Wait for appointment type page to reload with validation errors
    await page.waitForURL(/\/en\/appointment-type/, {
      timeout: 20000,
    });

    // Use helpers to avoid duplication (DRY)
    await assertErrorSummary(page);
    await assertInlineError(page, 'question-radio');
  });
});
