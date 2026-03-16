import { expect, test } from '@playwright/test';

import { basePage } from '../pages/basePage';
import homePage from '../pages/HomePage';

test.describe('Budget Planner', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/en/landing');
    expect(
      await basePage.assertHeading(page, 'Retirement budget planner'),
    ).toBe(true);

    await homePage.handleCookies(page);

    await page.getByTestId('rbp-link-from-heading').click();
    await page.waitForURL('/en/about-you');
  });

  test('About You', async ({ page }) => {
    //Verify Retirement budget plan title - awaiting bug fix

    await expect(page.getByTestId('title')).toHaveText('About you');
    await expect(page.getByTestId('title')).toBeVisible();
    await expect(page.getByTestId('about-you')).toHaveAttribute(
      'aria-selected',
      'true',
    );

    await page.getByRole('button', { name: 'Continue' }).click();

    expect(await basePage.errorHeading(page, 'There is a problem')).toBe(true);

    await basePage.fillInput(page, 'day', '20');
    await basePage.fillInput(page, 'month', '02');
    await basePage.fillInput(page, 'year', '1976');
    await basePage.selectRadioButton(page, 'gender-male');
    await basePage.fillInput(page, 'retireAge', '55');

    await page.getByRole('button', { name: 'Continue' }).click();
    await page.locator('h1:text-is("Retirement income")').waitFor();
    await expect(page).toHaveURL(/\/en\/income/);

    //Verify Retirement budget plan title - awaiting bug fix

    await expect(page.getByTestId('title')).toHaveText('Retirement income');
    await expect(page.getByTestId('title')).toBeVisible();
    await expect(page.getByTestId('income')).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await page.getByRole('button', { name: 'Continue' }).click();
    expect(await basePage.errorHeading(page, 'There is a problem')).toBe(true);

    await basePage.fillInput(page, 'formprivatePension', '2000');
    await basePage.selectOption(
      page,
      'formprivatePensionFrequency',
      'fourweeks',
    );
    await page.getByRole('button', { name: 'Add Pension Pot' }).click();

    expect(page.getByTestId('formprivatePension1Id')).toBeVisible();
    expect(page.getByTestId('formprivatePension1Frequency')).toBeVisible();
    expect(page.getByRole('button', { name: 'Remove' })).toBeVisible();

    await page.getByRole('button', { name: 'Remove' }).click();

    expect(page.getByTestId('formprivatePension1Id')).not.toBeVisible();
    expect(page.getByTestId('formprivatePension1Frequency')).not.toBeVisible();

    await page.getByText('Workplace Pensions', { exact: true }).click();
    await basePage.fillInput(page, 'formdefinedContribution', '2000');
    await basePage.selectOption(
      page,
      'formprivatePensionFrequency',
      'fourweeks',
    );
    await basePage.fillInput(page, 'formdefinedBenefit', '736');

    await basePage.selectOption(
      page,
      'formdefinedBenefitFrequency',
      'twoweeks',
    );

    await page.getByText('State Pension', { exact: true }).click();

    await basePage.fillInput(page, 'formstatePension', '500');
    await basePage.selectOption(page, 'formstatePensionFrequency', 'year');

    await page.getByRole('button', { name: 'Continue' }).click();
  });
});
