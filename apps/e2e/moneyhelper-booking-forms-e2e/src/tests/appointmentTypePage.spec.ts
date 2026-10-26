import { SidebarType } from '@app/lib/constants';
import { expect, test } from '@mhbf-e2e/lib/test.lib';
import { BasePage } from '@mhbf-e2e/pages/BasePage';

test.describe('Appointment Type Page', () => {
  test('shows the correct sidebar for the page', async ({ page }) => {
    const basePage = new BasePage(page);

    await basePage.gotoHome();

    // Assert using POM locator instead of unmonitored custom helper
    await expect(basePage.sidebar(SidebarType.HELP)).toBeVisible();
  });

  test('shows errors for empty appointment type', async ({ page }) => {
    const basePage = new BasePage(page);

    await basePage.gotoHome();
    await basePage.submitForm();

    // Wait for page to reload with validation errors
    await page.waitForURL('/en', {
      timeout: 20000,
    });

    // Explicit assertions on POM getters/methods
    await expect(basePage.errorSummary).toBeVisible();
    await expect(basePage.inlineError('question-radio')).toBeVisible();
  });
});
