import { expect, test } from '@maps/playwright';

test.describe('Beta banner', () => {
  test('should render and contain a link that opens in a new tab', async ({
    page,
    cookieConsent,
    baseURL,
    betaBanner,
  }) => {
    await cookieConsent.setCookieConsentAccepted(baseURL);
    await page.goto('/');

    await expect(betaBanner.banner).toBeVisible();
    await expect(betaBanner.link).toHaveAttribute('target', '_blank');
  });
});
