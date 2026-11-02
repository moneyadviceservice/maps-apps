import { expect, test } from '@lib/test.lib';

test.describe('Lookup form', () => {
  test.beforeEach(async ({ lookupForm, setCookieControl }) => {
    await setCookieControl();
    await lookupForm.open();
  });

  test('displays urn input', async ({ lookupForm }) => {
    await expect(lookupForm.urnInput()).toHaveCount(1);
  });

  test('submits valid urn', async ({ page, lookupForm }) => {
    await page.route('**/api/find-appointment', async (route) => {
      await route.fulfill({
        status: 302,
        headers: {
          location: '/en/pension-wise-appointment/client-summary?urn=PAB1-2CDE',
        },
      });
    });

    await lookupForm.submit('PAB1-2CDE');
    await expect(page).toHaveURL(/client-summary/);
  });

  test('shows format error', async ({ page, lookupForm }) => {
    await page.route('**/api/find-appointment', async (route) => {
      await route.fulfill({
        status: 302,
        headers: {
          location:
            '/en/pension-wise-appointment/find-appointment?error=format',
        },
      });
    });

    await lookupForm.submit('INVALID');
    await expect(lookupForm.urnError()).toBeVisible();
  });
});
