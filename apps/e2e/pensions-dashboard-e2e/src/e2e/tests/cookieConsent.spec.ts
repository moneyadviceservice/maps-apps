import { expect, test } from '@maps/playwright';

import commonHelpers from '../utils/commonHelpers';

/**
 * Cookie Consent Functionality Tests
 *
 * Tests the cookie consent banner and preferences functionality.
 */

test.describe('Cookie Consent Functionality', () => {
  test('Cookie consent prevents banner when set', async ({ page }) => {
    // Navigate to page first, then set cookie consent
    await page.goto('/');
    await commonHelpers.setCookieConsentAccepted(page);
    await page.reload(); // Reload to apply cookie

    // Verify page loads without cookie banner (short timeout since banner should be immediate)
    await expect(page).toHaveTitle(/Pensions Dashboard/, { timeout: 3000 });

    // Verify cookie banner does not appear (should be fast check)
    const cookieBanner = page.locator('#ccc-notify, .cookie-banner');
    await expect(cookieBanner).not.toBeVisible({ timeout: 1000 });

    // Verify cookie is properly set
    const cookies = await page.context().cookies();
    const cookieControlCookie = cookies.find(
      (cookie) => cookie.name === 'CookieControl',
    );

    expect(cookieControlCookie).toBeDefined();
    expect(cookieControlCookie).toBeTruthy();
    const cookieValue = JSON.parse(cookieControlCookie.value);
    expect(cookieValue.optionalCookies.analytics).toBe('accepted');
    expect(cookieValue.interactedWith).toBe(true);
  });

  test('Cookie banner appears when no consent is set', async ({ page }) => {
    // Don't set any cookie consent
    await page.goto('/');

    // Cookie banner should appear quickly
    const cookieBanner = page.locator('#ccc-notify, .cookie-banner');
    await expect(cookieBanner).toBeVisible({ timeout: 2000 });

    // Banner should have accept button
    const acceptButton = cookieBanner
      .locator('button')
      .filter({ hasText: /accept|allow|agree/i })
      .first();
    await expect(acceptButton).toBeVisible({ timeout: 1000 });

    // Click accept
    await acceptButton.click();

    // Banner should disappear quickly
    await expect(cookieBanner).not.toBeVisible({ timeout: 2000 });

    // Verify analytics cookies are now accepted
    const cookies = await page.context().cookies();
    const cookieControlCookie = cookies.find(
      (cookie) => cookie.name === 'CookieControl',
    );

    expect(cookieControlCookie).toBeDefined();
    expect(cookieControlCookie).toBeTruthy();
    const cookieValue = JSON.parse(cookieControlCookie.value);
    expect(cookieValue.optionalCookies.analytics).toBe('accepted');
  });

  test('Cookie preferences link works when banner is visible', async ({
    page,
  }) => {
    // Don't set cookie consent so banner appears
    await page.goto('/');

    // Wait for cookie banner
    const cookieBanner = page.locator('#ccc-notify, .cookie-banner');
    await expect(cookieBanner).toBeVisible({ timeout: 2000 });

    // Look for "Learn more and set preferences" link
    const learnMoreLink = cookieBanner
      .locator('a, button')
      .filter({
        hasText: 'Learn more and set preferences',
      })
      .first();

    await expect(learnMoreLink).toBeVisible({ timeout: 1000 });
    await learnMoreLink.click();

    // Preferences panel should open
    const preferencesPanel = page.locator(
      '[role="dialog"], .cookie-preferences',
    );
    await expect(preferencesPanel).toBeVisible({ timeout: 2000 });

    // Should show analytics option
    const analyticsOption = page.locator('text=/analytics/i').first();
    await expect(analyticsOption).toBeVisible({ timeout: 1000 });
  });

  test('User can access analytics preferences via footer link', async ({
    page,
  }) => {
    // Start fresh, accept cookies initially via banner
    await page.goto('/');

    const cookieBanner = page.locator('#ccc-notify, .cookie-banner');
    await expect(cookieBanner).toBeVisible({ timeout: 2000 });

    const acceptButton = cookieBanner
      .locator('button')
      .filter({ hasText: /accept|allow|agree/i })
      .first();
    await acceptButton.click();
    await expect(cookieBanner).not.toBeVisible({ timeout: 2000 });

    // Scroll to footer to find cookie preferences link
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    // Find cookie preferences button using test ID
    const cookiePreferencesLink = page.locator('[data-testid="cookie-button"]');
    await expect(cookiePreferencesLink).toBeVisible({ timeout: 3000 });
    await cookiePreferencesLink.click();

    // Wait for preferences sidebar/panel to open
    const preferencesPanel = page.locator(
      '[role="dialog"], .cookie-preferences',
    );
    await expect(preferencesPanel).toBeVisible({ timeout: 2000 });

    // Verify analytics toggle is present and interactive
    const analyticsToggle = page
      .locator(
        'input[type="checkbox"], button, [role="switch"], [class*="toggle"], [class*="switch"]',
      )
      .or(page.locator('text=/On|Off/i'))
      .or(page.locator('[aria-label*="analytics" i]'))
      .first();

    await expect(analyticsToggle).toBeVisible({ timeout: 3000 });
    await expect(analyticsToggle).toBeEnabled();

    // Verify save button is present
    const saveButton = page
      .locator('button')
      .filter({ hasText: /save preferences/i })
      .first();
    await expect(saveButton).toBeVisible({ timeout: 1000 });

    // Test that we can interact with the toggle (but don't assert final state)
    await analyticsToggle.click();
    await saveButton.click();

    // Verify panel closes after saving
    await expect(preferencesPanel).not.toBeVisible({ timeout: 2000 });
  });
});
