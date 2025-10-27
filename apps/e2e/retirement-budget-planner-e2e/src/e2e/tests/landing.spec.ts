import { expect, test } from '@playwright/test';

test.describe('Landing Page', () => {
  test('should render Landing page heading, how it works and callout sections', async ({
    page,
  }) => {
    await page.goto('/en/landing');

    await expect(
      page.getByRole('heading', {
        name: 'Retirement budget planner',
        exact: true,
      }),
    ).toBeVisible();

    await expect(
      page.getByRole('heading', {
        name: 'How our Retirement budget planner works',
        exact: true,
      }),
    ).toBeVisible();
    await expect(page.getByTestId('rbp-link-from-how-it-works')).toBeVisible();
    await expect(page.getByTestId('urgent-callout')).toBeVisible();

    await expect(
      page.getByRole('heading', {
        name: 'Need more information on pensions?',
        exact: true,
      }),
    ).toBeVisible();
    await expect(page.getByText(/0800 011 3797/)).toBeVisible();
    await expect(
      page.getByText(/Opening times: Monday to Friday, 9am to 5pm/),
    ).toBeVisible();
  });
});
