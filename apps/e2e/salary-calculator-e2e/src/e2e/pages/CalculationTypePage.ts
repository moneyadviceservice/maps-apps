import { Locator, Page } from '@playwright/test';

export class CalculationTypePage {
  constructor(private page: Page) {}

  // Disable cookie consent by clicking the reject button or mocking the API endpoint
  static async disableCookieConsent(page: Page): Promise<void> {
    // First, try to route/block the cookie API endpoint (works for local)
    await page.route('**/c/v**', (route) => {
      return route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: '',
      });
    });

    // Also handle cookie banner if it appears (works for remote environments)
    // Wait a moment for the banner to appear
    try {
      const cookieBanner = page.locator('#ccc-notify');
      await cookieBanner.waitFor({ state: 'visible', timeout: 3000 });

      // Click "Reject marketing cookies" button
      const rejectButton = page.locator('#ccc-notify-reject');
      await rejectButton.click();

      // Wait for the banner to disappear
      await cookieBanner.waitFor({ state: 'hidden', timeout: 3000 });
    } catch {
      // Cookie banner didn't appear or already handled - continue
      console.log('Cookie banner not detected or already dismissed');
    }
  }

  //For selecting calculation mode: 'single' or 'joint'
  async selectCalculationMode(mode: 'single' | 'joint') {
    if (mode === 'joint') {
      const label = this.page.locator(`label[for="id-1"]`);
      await label.waitFor();
      await label.click();
    } else {
      const label = this.page.locator(`label[for="id-0"]`);
      await label.waitFor();
      await label.click();
    }
  }

  //For tapping on Continue button
  async clickContinue() {
    const continueId = 'step-container-submit-button';

    const continueButtons = this.page.getByTestId(continueId);

    // Helper to find the first visible element from a locator list
    const getFirstVisible = async (
      locator: Locator,
    ): Promise<Locator | null> => {
      const count = await locator.count();
      for (let i = 0; i < count; i++) {
        const el = locator.nth(i);
        if (await el.isVisible().catch(() => false)) {
          return el;
        }
      }
      return null;
    };

    const continueVisible = await getFirstVisible(continueButtons);

    const button = continueVisible;

    if (!button) {
      throw new Error(`No visible continue button found`);
    }

    await button.waitFor({ state: 'visible' });
    await button.scrollIntoViewIfNeeded();
    await button.click();
  }
}
