import { expect, test } from '@playwright/test';

import { CookieBanner } from '../../pages/components/CookieBanner';
import { HomePage } from '../../pages/HomePage';

let homePage: HomePage;
let cookieBanner: CookieBanner;

test.beforeEach(async ({ page }) => {
  homePage = new HomePage(page);
  cookieBanner = new CookieBanner(page);
  await homePage.goto();
});

test.describe('Cookie banner', () => {
  /**
   * @tests 54374 - banner visibility
   */
  test('Cookie banner visibility', async () => {
    await expect(cookieBanner.cookieBannerComponent()).toBeVisible();
  });

  /**
   * @tests 54379 - accept cookies
   */
  test('Accept cookies', async () => {
    await cookieBanner.clickAcceptButton();
    expect(await cookieBanner.getOptionalCookieStatus('analytics')).toBe(
      'accepted',
    );
    expect(await cookieBanner.getOptionalCookieStatus('marketing')).toBe(
      'accepted',
    );
  });

  /**
   * @tests 54381 - reject cookies
   */
  test('Reject marketing cookies', async () => {
    await cookieBanner.clickRejectButton();
    expect(await cookieBanner.getOptionalCookieStatus('analytics')).toBe(
      'accepted',
    );
    expect(await cookieBanner.getOptionalCookieStatus('marketing')).toBe(
      'revoked',
    );
  });

  test('Set preferences', async () => {
    await cookieBanner.clickSetPreferencesButton();
    await expect(cookieBanner.preferencesModule()).toBeVisible();
  });
});

/**
 * @tests 54401 - set preferences
 */
test.describe('Set preferences - module', () => {
  test('Accept all cookies', async () => {
    await cookieBanner.clickSetPreferencesButton();
    await cookieBanner.clickPreferencesAcceptButton();
    expect(await cookieBanner.getOptionalCookieStatus('analytics')).toBe(
      'accepted',
    );
    expect(await cookieBanner.getOptionalCookieStatus('marketing')).toBe(
      'accepted',
    );
  });

  test('I do not accept cookies', async () => {
    await cookieBanner.clickSetPreferencesButton();
    await cookieBanner.clickPreferencesRejectButton();
    expect(await cookieBanner.getOptionalCookieStatus('analytics')).toBe(
      'accepted',
    );
    expect(await cookieBanner.getOptionalCookieStatus('marketing')).toBe(
      'revoked',
    );
  });

  test('Manually accept all cookies', async () => {
    await cookieBanner.clickSetPreferencesButton();
    await cookieBanner.clickOptionalCookieToggle('Analytics Cookies');
    await cookieBanner.clickOptionalCookieToggle('Marketing Cookies');
    await expect(
      cookieBanner.optionalCookieInput('Analytics Cookies'),
    ).toBeChecked();
    await expect(
      cookieBanner.optionalCookieInput('Marketing Cookies'),
    ).toBeChecked();
    await cookieBanner.clickSavePreferencesButton();

    expect(await cookieBanner.getOptionalCookieStatus('analytics')).toBe(
      'accepted',
    );
    expect(await cookieBanner.getOptionalCookieStatus('marketing')).toBe(
      'accepted',
    );
  });

  test('Manually reject all cookies', async () => {
    await cookieBanner.clickSetPreferencesButton();
    await cookieBanner.clickOptionalCookieToggle('Analytics Cookies');
    await cookieBanner.clickOptionalCookieToggle('Analytics Cookies');
    await expect(
      cookieBanner.optionalCookieInput('Analytics Cookies'),
    ).not.toBeChecked();
    await expect(
      cookieBanner.optionalCookieInput('Marketing Cookies'),
    ).not.toBeChecked();
    await cookieBanner.clickSavePreferencesButton();

    expect(await cookieBanner.getOptionalCookieStatus('analytics')).toBe(
      'revoked',
    );
    expect(await cookieBanner.getOptionalCookieStatus('marketing')).toBe(
      'unknown',
    );
  });

  test('Change cookie preferences', async () => {
    await cookieBanner.clickAcceptButton();
    expect(await cookieBanner.getOptionalCookieStatus('analytics')).toBe(
      'accepted',
    );
    expect(await cookieBanner.getOptionalCookieStatus('marketing')).toBe(
      'accepted',
    );

    await cookieBanner.clickFooterCookieButton();
    await expect(cookieBanner.preferencesModule()).toBeVisible();
    await cookieBanner.clickOptionalCookieToggle('Analytics Cookies');
    await cookieBanner.clickOptionalCookieToggle('Marketing Cookies');
    await cookieBanner.clickSavePreferencesButton();
    expect(await cookieBanner.getOptionalCookieStatus('analytics')).toBe(
      'revoked',
    );
    expect(await cookieBanner.getOptionalCookieStatus('marketing')).toBe(
      'revoked',
    );
  });
});
