import { expect, test } from '@playwright/test';

import { otherToolsToTry } from '../../data/your-results';
import aboutYouPage from '../../pages/AboutYouPage';
import homePage from '../../pages/HomePage';
import retirementIncomePage from '../../pages/RetirementIncomePage';

/**
 * @tests User Story 37068
 * @test 49960 : 37068 AC1 TEST CASE 1: Verify clicking Cymraeg loads the Welsh page and all content matches the translated copy document
 * @test 49961 : 37068 AC1 TEST CASE 2: Verify switching between Welsh and English works correctly in both directions
 * @test 49963 : 37068 AC1 TEST CASE 3: Verify the cy/essential-outgoings URL loads the Welsh page directly without switching languages
 */

test.describe('Retirement Budget Planner - Retirement costs page - Editorial review', () => {
  test.beforeEach(async ({ page }) => {
    await homePage.startRetirementBudgetPlanner(page);
  });

  test('Welsh translation Retirement Costs - RBP', async ({ page }) => {
    const { day, month, year, retireAge } = otherToolsToTry.aboutYou;
    const { pensionValue } = otherToolsToTry.income;

    await aboutYouPage.fillValuesAndContinue(page, day, month, year, retireAge);
    await retirementIncomePage.fillPersonalPensionValueAndContinue(
      page,
      'formprivatePensionId',
      pensionValue,
    );
    // AC1
    await page.getByRole('heading', { name: /Retirement costs/i }).waitFor();

    await homePage.clickWelshLink(page);

    await page.getByRole('heading', { name: /Costau ymddeoliad/i }).waitFor();

    await expect(page).toHaveURL(/\/cy\/essential-outgoings/);

    await expect(
      page.getByRole('heading', { name: /Costau ymddeoliad/i }),
    ).toBeVisible();

    await expect(
      page.getByText(
        /Nodwch yr holl gostau hanfodol rydych chi'n disgwyl eu talu ar ôl i chi ymddeol, yn seiliedig ar werthoedd heddiw\./i,
      ),
    ).toBeVisible();

    await expect(
      page.getByTestId('summary-block-title').filter({ hasText: 'Tai' }),
    ).toBeVisible();

    // AC2
    await homePage.clickEnglishLink(page);

    await page.getByRole('heading', { name: /Retirement costs/i }).waitFor();

    await expect(page).toHaveURL(/\/en\/essential-outgoings/);

    await expect(
      page.getByTestId('paragraph').filter({
        hasText:
          /Enter all the essential expenses you expect to pay after you retire, based on today’s values./i,
      }),
    ).toBeVisible();

    await expect(
      page.getByTestId('summary-block-title').filter({ hasText: 'Housing' }),
    ).toBeVisible();

    // AC3

    const current = page.url();

    const newUrl = current.replace('/cy/', '/en/');

    await page.goto(newUrl);

    const switchBack = page.url();

    const CyUrl = switchBack.replace('/en/', '/cy/');

    await page.goto(CyUrl);

    await expect(page).toHaveURL(/\/cy\/essential-outgoings/);
  });
});
