/* eslint-disable playwright/expect-expect */
import { test } from '@playwright/test';

import {
  assertErrorSummary,
  assertInlineError,
  assertSidebar,
} from '../helpers';
import { SidebarType } from '../lib/constants';
import { BasePage } from '../pages/BasePage';

test.describe('Appointment Type Page', () => {
  test('shows the correct sidebar for the page', async ({ page }) => {
    await page.context().clearCookies();
    const basePage = new BasePage(page);

    await basePage.gotoHome();

    // assert the corrrect sidebar is shown for the page, using helper to avoid duplication (DRY)
    await assertSidebar(page, SidebarType.HELP);
  });

  test('shows errors for empty appointment type', async ({ page }) => {
    await page.context().clearCookies();
    const basePage = new BasePage(page);

    await basePage.gotoHome();
    await basePage.submitForm();

    // Wait for page to reload with validation errors
    await page.waitForURL(`/en`, {
      timeout: 20000,
    });

    // Use helpers to avoid duplication (DRY)
    await assertErrorSummary(page);
    await assertInlineError(page, 'question-radio');
  });
});
