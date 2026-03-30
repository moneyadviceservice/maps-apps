import { expect, test } from '@playwright/test';

import { basePage } from '../pages/basePage';
import homePage from '../pages/HomePage';

const retirementBudgetPlannerTitle = 'Retirement budget planner';

test.describe('Budget Planner', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/en/landing');
    await expect(
      basePage.pageHeading(page, 'Retirement budget planner'),
    ).toBeVisible();

    await homePage.handleCookies(page);

    await page.getByTestId('rbp-link-from-heading').click();
    await page.waitForURL('/en/about-you');
  });

  test('About You', async ({ page }) => {
    await expect(page.getByTestId('title')).toHaveText('About you');
    await expect(page.getByTestId('title')).toBeVisible();
    await expect(page.getByTestId('about-you')).toHaveAttribute(
      'aria-selected',
      'true',
    );

    await page.getByRole('button', { name: 'Continue' }).click();
    await basePage.waitForErrorHeading(page, 'There is a problem');

    await basePage.fillInput(page, 'day', '20');
    await basePage.fillInput(page, 'month', '02');
    await basePage.fillInput(page, 'year', '1976');
    await basePage.selectRadioButton(page, 'gender-male');
    await basePage.fillInput(page, 'retireAge', '55');

    await page.getByRole('button', { name: 'Continue' }).click();
    await page.locator('h1:text-is("Retirement income")').waitFor();
    await expect(page).toHaveURL(/\/en\/income/);

    // Verify Retirement budget planner title
    await expect(basePage.rbpTitleLocator(page)).toHaveText(
      retirementBudgetPlannerTitle,
    );

    await expect(page.getByTestId('title')).toHaveText('Retirement income');
    await expect(page.getByTestId('title')).toBeVisible();
    await expect(page.getByTestId('income')).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await page.getByRole('button', { name: 'Continue' }).click();
    await basePage.waitForErrorHeading(page, 'There is a problem');

    // State pension (open by default)
    await basePage.fillInput(page, 'formstatePension', '500');
    await basePage.selectOption(page, 'formstatePensionFrequency', 'year');

    // Workplace pensions
    await page.getByText('Workplace pension(s)', { exact: true }).click();
    await basePage.fillInput(page, 'formdefinedContribution', '2000');
    await basePage.selectOption(
      page,
      'formdefinedContributionFrequency',
      'fourweeks',
    );
    await basePage.fillInput(page, 'formdefinedBenefit', '736');

    await basePage.selectOption(
      page,
      'formdefinedBenefitFrequency',
      'twoweeks',
    );

    // Personal pensions
    await page.getByText('Personal pension(s)', { exact: true }).click();
    await basePage.fillInput(page, 'formprivatePension', '2000');
    await basePage.selectOption(
      page,
      'formprivatePensionFrequency',
      'fourweeks',
    );
    await page.getByTestId('add-privatePension-button').click();

    await expect(page.getByTestId('formprivatePension1Id')).toBeVisible();
    await expect(
      page.getByTestId('formprivatePension1Frequency'),
    ).toBeVisible();
    await expect(page.getByRole('button', { name: 'Remove' })).toBeVisible();

    await page.getByRole('button', { name: 'Remove' }).click();

    await expect(page.getByTestId('formprivatePension1Id')).toBeHidden();
    await expect(page.getByTestId('formprivatePension1Frequency')).toBeHidden();

    // Continue
    await page.getByRole('button', { name: 'Continue' }).click();
  });
});
