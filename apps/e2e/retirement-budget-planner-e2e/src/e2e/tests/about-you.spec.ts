import { expect, test } from '@playwright/test';

import { basePage } from '../pages/basePage';

test.describe('Budget Planner', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/en/landing');
    expect(
      await basePage.assertHeading(page, 'Retirement budget planner'),
    ).toBe(true);

    // Accept cookies if banner is visible
    await page
      .getByRole('button', { name: 'Accept all cookies' })
      .click({ timeout: 10000 })
      .catch(() => {
        console.log('Cookie banner not found');
      });

    await page.getByTestId('rbp-link-from-heading').click();
    await page.waitForURL('/en/about-you');
  });

  test('About You', async ({ page }) => {
    expect(
      await basePage.assertHeading(page, 'Retirement Budget Planner'),
    ).toBe(true);

    expect(page.getByTestId('title')).toHaveText('About you');
    expect(page.getByTestId('title')).toBeVisible();
    expect(page.getByTestId('about-you')).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await page.getByRole('button', { name: 'Continue' }).click();

    expect(await basePage.assertHeading(page, 'There is a problem')).toBe(true);
    expect(
      await basePage.checkValidationErrors(page, [
        {
          message: 'Enter a valid day, month and year',
          fieldLevelMessage: 'Enter a valid day, month and year',
          fieldName: 'dob',
        },
        {
          message: 'Please enter your gender',
          fieldLevelMessage: 'Please enter your gender',
          fieldName: 'gender',
        },
        {
          message: "Enter the age you'd like to retire",
          fieldLevelMessage: "Enter the age you'd like to retire",
          fieldName: 'retireAge',
        },
      ]),
    ).toBe(true);

    await basePage.fillInput(page, 'day', '20');
    await basePage.fillInput(page, 'month', '02');
    await basePage.fillInput(page, 'year', '1976');
    await basePage.selectRadioButton(page, 'gender-male');
    await basePage.fillInput(page, 'retireAge', '55');
    await page.getByRole('button', { name: 'Continue' }).click({ force: true });

    await page.waitForURL('/en/income?**', { timeout: 2000 });
    expect(
      await basePage.assertHeading(page, 'Retirement Budget Planner'),
    ).toBe(true);
  });
});
