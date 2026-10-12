import { expect, test } from '@playwright/test';

import { otherToolsToTry } from '../../data/your-results';
import aboutYouPage from '../../pages/AboutYouPage';
import homePage from '../../pages/HomePage';

/**
 * @tests User Story 37063
 * @test 37063 : 37063 AC1 TEST CASE 1: Verify clicking Cymraeg loads the Welsh page and all content matches the translated copy document
 * @test 49953 : 37063 AC1 TEST CASE 2: Verify switching between Welsh and English works correctly in both directions
 * @test 49955 : 37063 AC1 TEST CASE 3: Verify the cy/income URL loads the Welsh page directly without switching languages
 */

test.describe('Retirement Budget Planner - Retirement costs page - Editorial review', () => {
  test.beforeEach(async ({ page }) => {
    await homePage.startRetirementBudgetPlanner(page);
  });

  test('Welsh translation Retirement Income - RBP', async ({ page }) => {
    const { day, month, year, retireAge } = otherToolsToTry.aboutYou;

    await aboutYouPage.fillValuesAndContinue(page, day, month, year, retireAge);

    // AC1
    await page
      .getByRole('heading', { level: 1, name: /Retirement income/i })
      .waitFor();

    await homePage.clickWelshLink(page);

    await page
      .getByRole('heading', { level: 1, name: /Incwm ymddeoliad/i })
      .waitFor();

    await expect(page).toHaveURL(/\/cy\/income/);

    await expect(
      page.getByRole('heading', { level: 1, name: /Incwm ymddeoliad/i }),
    ).toBeVisible();

    await expect(
      page.getByText(
        /Rhowch yr holl incwm rydych yn disgwyl ei gael ar ôl i chi ymddeol, cyn treth/i,
      ),
    ).toBeVisible();

    await expect(
      page
        .getByTestId('summary-block-title')
        .filter({ hasText: 'Pensiwn y Wladwriaeth' }),
    ).toBeVisible();

    // AC2
    await homePage.clickEnglishLink(page);

    await page
      .getByRole('heading', { level: 1, name: /Retirement income/i })
      .waitFor();

    await expect(page).toHaveURL(/\/en\/income/);

    await expect(
      page.getByTestId('paragraph').filter({
        hasText: /Enter all the income you plan to have after you retire/i,
      }),
    ).toBeVisible();

    await expect(
      page
        .getByTestId('summary-block-title')
        .filter({ hasText: 'State Pension' }),
    ).toBeVisible();

    // AC3

    const current = page.url();

    const newUrl = current.replace('/cy/', '/en/');

    await page.goto(newUrl);

    const switchBack = page.url();

    const CyUrl = switchBack.replace('/en/', '/cy/');

    await page.goto(CyUrl);

    await expect(page).toHaveURL(/\/cy\/income/);
  });
});
