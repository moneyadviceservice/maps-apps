import { expect, test } from '@mhbf-e2e/lib/test.lib';
import { BasePage } from '@mhbf-e2e/pages/BasePage';

test.describe('Keyboard Navigation', () => {
  test('shows validation errors when submitting appointment type with keyboard and no selection', async ({
    page,
  }) => {
    const basePage = new BasePage(page);

    await basePage.gotoHome();

    await basePage.submitButton.focus();
    await page.keyboard.press('Enter');

    await page.waitForURL('/en', { timeout: 20000 });

    // Native POM assertions
    await expect(basePage.errorSummary).toBeVisible();
    await expect(basePage.inlineError('question-radio')).toBeVisible();
  });
});
