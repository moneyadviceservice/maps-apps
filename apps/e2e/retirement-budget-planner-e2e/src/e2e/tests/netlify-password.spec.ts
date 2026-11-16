import { expect, test } from '@playwright/test';

import { basePage } from '../pages/basePage';

test.describe('Deployment password navigation', () => {
  test('navigates directly when no password page appears', async ({ page }) => {
    await page.route('**/*', (route) =>
      route.fulfill({
        contentType: 'text/html',
        body: '<h1>Unprotected deployment</h1>',
      }),
    );

    await basePage.goto(page, '/en/landing');

    await expect(
      page.getByRole('heading', { name: 'Unprotected deployment' }),
    ).toBeVisible();
    await expect(page).toHaveURL(/\/en\/landing$/);
  });

  test('reports missing credentials for a protected deployment', async ({
    page,
  }) => {
    const originalPassword = process.env['HTTP_PASSWORD'];
    delete process.env['HTTP_PASSWORD'];
    try {
      await page.route('**/*', (route) =>
        route.fulfill({
          contentType: 'text/html',
          body: '<input placeholder="Password" type="password">',
        }),
      );

      await expect(basePage.goto(page, '/en/landing')).rejects.toThrow(
        'Set HTTP_PASSWORD',
      );
    } finally {
      if (originalPassword === undefined) delete process.env['HTTP_PASSWORD'];
      else process.env['HTTP_PASSWORD'] = originalPassword;
    }
  });

  test('submits configured credentials and loads the protected route', async ({
    page,
  }) => {
    const originalPassword = process.env['HTTP_PASSWORD'];
    process.env['HTTP_PASSWORD'] = 'mock-deployment-password';
    let submittedPassword: string | null = null;
    try {
      await page.route('**/*', (route) => {
        if (route.request().method() === 'POST') {
          submittedPassword = new URLSearchParams(
            route.request().postData() ?? '',
          ).get('password');
          return route.fulfill({
            contentType: 'text/html',
            body: '<h1>Protected deployment</h1>',
          });
        }
        return route.fulfill({
          contentType: 'text/html',
          body: '<form method="post"><input name="password" placeholder="Password" type="password"><button type="submit">Submit</button></form>',
        });
      });

      await basePage.goto(page, '/cy/landing');

      await expect(
        page.getByRole('heading', { name: 'Protected deployment' }),
      ).toBeVisible();
      expect(submittedPassword).toBe('mock-deployment-password');
      await expect(page).toHaveURL(/\/cy\/landing$/);
    } finally {
      if (originalPassword === undefined) delete process.env['HTTP_PASSWORD'];
      else process.env['HTTP_PASSWORD'] = originalPassword;
    }
  });
});
