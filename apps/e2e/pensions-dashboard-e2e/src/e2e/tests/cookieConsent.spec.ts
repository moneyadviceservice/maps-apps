import { expect, test } from '@maps/playwright';

/**
 * Cookie Consent Functionality Tests
 *
 * Tests the cookie consent banner and preferences functionality.
 */

/**
 * @tests User Story 46269: Update Cookie Policy - Combined MH
 * @tests Test Case 50223: 46269 AC1 Cookie link in footer
 * @tests Test Case 50224: 46269 AC2 Cookie link in Cookie preference side banner
 * @tests User Story 54907: Shared Civic cookie consent
 */

test.describe('Cookie Consent Functionality', () => {
  test.beforeEach(async ({ commonHelpers }) => {
    await commonHelpers.navigateToStartPageWithoutCookieConsent();
  });

  test('Cookie consent prevents banner when set', async ({
    page,
    commonHelpers,
    cookiesPreferencesSideBanner,
  }) => {
    // Navigate to page first, then set cookie consent
    await commonHelpers.setCookieConsentAccepted();
    await page.reload(); // Reload to apply cookie

    // Verify page loads without cookie banner (short timeout since banner should be immediate)
    await expect(page).toHaveTitle(/Pensions Dashboard/, { timeout: 3000 });

    // Verify cookie banner does not appear (should be fast check)
    await expect(cookiesPreferencesSideBanner.banner).not.toBeVisible({
      timeout: 1000,
    });

    // Verify cookie is properly set
    expect(
      await cookiesPreferencesSideBanner.getOptionalCookieStatus('analytics'),
    ).toBe('accepted');
    expect(
      await cookiesPreferencesSideBanner.getOptionalCookieStatus('marketing'),
    ).toBe('accepted');
  });

  test('Cookie banner appears when no consent is set', async ({
    cookiesPreferencesSideBanner,
  }) => {
    // Don't set any cookie consent

    // Cookie banner should appear quickly
    await expect(cookiesPreferencesSideBanner.banner).toBeVisible({
      timeout: 3000,
    });

    // Banner should have accept button
    await expect(cookiesPreferencesSideBanner.acceptButton).toBeVisible({
      timeout: 1000,
    });

    // Click accept
    await cookiesPreferencesSideBanner.acceptButton.click();

    // Banner should disappear quickly
    await expect(cookiesPreferencesSideBanner.banner).not.toBeVisible({
      timeout: 2000,
    });

    // Verify analytics cookies are now accepted
    expect(
      await cookiesPreferencesSideBanner.getOptionalCookieStatus('analytics'),
    ).toBe('accepted');
    expect(
      await cookiesPreferencesSideBanner.getOptionalCookieStatus('marketing'),
    ).toBe('accepted');
  });

  test('Reject marketing cookies from the banner', async ({
    cookiesPreferencesSideBanner,
  }) => {
    await expect(cookiesPreferencesSideBanner.banner).toBeVisible({
      timeout: 3000,
    });
    await expect(
      cookiesPreferencesSideBanner.rejectMarketingButton,
    ).toBeVisible();
    await expect(
      cookiesPreferencesSideBanner.rejectMarketingButton,
    ).toHaveAccessibleName('Reject marketing cookies');

    await cookiesPreferencesSideBanner.rejectMarketingButton.click();
    await expect(cookiesPreferencesSideBanner.banner).not.toBeVisible({
      timeout: 2000,
    });

    expect(
      await cookiesPreferencesSideBanner.getOptionalCookieStatus('analytics'),
    ).toBe('accepted');
    expect(
      await cookiesPreferencesSideBanner.getOptionalCookieStatus('marketing'),
    ).toBe('revoked');
  });

  test('Reject marketing cookies from the preferences panel', async ({
    cookiesPreferencesSideBanner,
  }) => {
    await expect(cookiesPreferencesSideBanner.banner).toBeVisible({
      timeout: 3000,
    });
    await cookiesPreferencesSideBanner.learnMoreLink.click();
    await expect(cookiesPreferencesSideBanner.preferencesPanel).toBeVisible({
      timeout: 2000,
    });

    await cookiesPreferencesSideBanner.preferencesRejectButton.click();
    await expect(cookiesPreferencesSideBanner.preferencesPanel).not.toBeVisible(
      { timeout: 2000 },
    );

    expect(
      await cookiesPreferencesSideBanner.getOptionalCookieStatus('analytics'),
    ).toBe('accepted');
    expect(
      await cookiesPreferencesSideBanner.getOptionalCookieStatus('marketing'),
    ).toBe('revoked');
  });

  test('Welsh cookie banner uses the translation document copy', async ({
    page,
    cookiesPreferencesSideBanner,
  }) => {
    const welshUrl = page.url().replace(/\/en(\/|$)/, '/cy$1');
    await page.goto(welshUrl);

    await expect(cookiesPreferencesSideBanner.welshBanner).toBeVisible({
      timeout: 3000,
    });
    await expect(
      cookiesPreferencesSideBanner.rejectMarketingButton,
    ).toHaveAccessibleName('Gwrthod cwcis marchnata');
  });

  test('Cookie preferences link works when banner is visible', async ({
    page,
    cookiesPreferencesSideBanner,
  }) => {
    // Don't set cookie consent so banner appears

    // Wait for cookie banner
    await expect(cookiesPreferencesSideBanner.banner).toBeVisible({
      timeout: 3000,
    });

    // Look for "Learn more and set preferences" link
    await expect(cookiesPreferencesSideBanner.learnMoreLink).toBeVisible({
      timeout: 1000,
    });
    await cookiesPreferencesSideBanner.learnMoreLink.click();

    // Preferences panel should open
    await expect(cookiesPreferencesSideBanner.preferencesPanel).toBeVisible({
      timeout: 2000,
    });

    // Should show analytics option
    const analyticsOption = page.locator('text=/analytics/i').first();
    await expect(analyticsOption).toBeVisible({ timeout: 1000 });
  });

  test('User can access analytics preferences via footer link', async ({
    page,
    cookiesPreferencesSideBanner,
  }) => {
    // Start fresh, accept cookies initially via banner
    await expect(cookiesPreferencesSideBanner.banner).toBeVisible({
      timeout: 3000,
    });
    await cookiesPreferencesSideBanner.acceptButton.click();
    await expect(cookiesPreferencesSideBanner.banner).not.toBeVisible({
      timeout: 2000,
    });

    // Scroll to footer to find cookie preferences link
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    // Find cookie preferences button using test ID
    const cookiePreferencesLink = page.locator('[data-testid="cookie-button"]');
    await expect(cookiePreferencesLink).toBeVisible({ timeout: 3000 });
    await cookiePreferencesLink.click();

    // Wait for preferences sidebar/panel to open
    await expect(cookiesPreferencesSideBanner.preferencesPanel).toBeVisible({
      timeout: 2000,
    });

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
    await expect(
      cookiesPreferencesSideBanner.savePreferencesButton,
    ).toBeVisible({ timeout: 1000 });

    // Check that cookie policy link opens in new tab
    await expect(cookiesPreferencesSideBanner.cookiePolicyLink).toBeVisible();
    const popupPromise = page.waitForEvent('popup');
    await cookiesPreferencesSideBanner.cookiePolicyLink.click();
    const newTab = await popupPromise;
    await expect(newTab).toHaveURL(/cookie-policy/);
    await newTab.close();

    // Test that we can interact with the toggle (but don't assert final state)
    await analyticsToggle.click();
    await cookiesPreferencesSideBanner.savePreferencesButton.click();

    // Verify panel closes after saving
    await expect(cookiesPreferencesSideBanner.preferencesPanel).not.toBeVisible(
      { timeout: 2000 },
    );
  });

  test('Cookie footer link directs to cookie policy page', async ({
    page,
    footer,
    cookiesPreferencesSideBanner,
  }) => {
    await expect(cookiesPreferencesSideBanner.banner).toBeVisible({
      timeout: 3000,
    });
    await cookiesPreferencesSideBanner.acceptButton.click();
    await expect(cookiesPreferencesSideBanner.banner).not.toBeVisible({
      timeout: 2000,
    });

    await footer.cookiesLink.click();
    await page.waitForURL(/cookie-policy/);
  });
});
