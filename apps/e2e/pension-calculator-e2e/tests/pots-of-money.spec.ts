import { YourIncomePage } from 'pages/YourIncomePage';
import { expect, test } from '@playwright/test';

import { PotsOfMoneyPage } from '../pages/PotsOfMoneyPage';

let potsOfMoneyPage: PotsOfMoneyPage;
let yourIncomePage: YourIncomePage;

test.beforeEach(async ({ page }) => {
  potsOfMoneyPage = new PotsOfMoneyPage(page);
  await potsOfMoneyPage.goto();
  await potsOfMoneyPage.acceptCookiesIfVisible();
});

test.describe('Pots of money', () => {
  /**
   * @tests 60076 - Back button functionality
   */
  test('Back button navigates to Your Income page', async ({ page }) => {
    yourIncomePage = new YourIncomePage(page);
    await potsOfMoneyPage.clickBackButton();

    await expect(yourIncomePage.page).toHaveURL(/.your-income/);
    await expect(yourIncomePage.grossPay()).toHaveValue('50,000');
    await expect(yourIncomePage.otherIncomeName(0)).toHaveValue('Savings');
    await expect(yourIncomePage.otherIncomeAmount(0)).toHaveValue('1,000');

    await expect(yourIncomePage.otherIncomeName(1)).toHaveValue('Investments');
    await expect(yourIncomePage.otherIncomeAmount(1)).toHaveValue('2,500');
  });

  /**
   * @tests 60077 - Accordion functionality
   */
  test('Accordion functionality', async () => {
    await potsOfMoneyPage.clickNotSureAccordion();

    await expect(
      potsOfMoneyPage.notSureAccordion().locator('..'),
    ).toHaveAttribute('open', '');
  });

  /**
   * @tests 60078 - Yes and No page routing
   */
  test('Selecting Yes navigates to Your pension details page', async () => {
    await potsOfMoneyPage.checkYesRadio();
    await expect(potsOfMoneyPage.yesRadioButton()).toBeChecked();
    await potsOfMoneyPage.clickContinueButton();
    await expect(potsOfMoneyPage.page).toHaveURL(/.details/);
  });

  test('Selecting No navigates to Pensions that provide an income page', async () => {
    await potsOfMoneyPage.checkNoRadio();
    await expect(potsOfMoneyPage.noRadioButton()).toBeChecked();
    await potsOfMoneyPage.clickContinueButton();
    await expect(potsOfMoneyPage.page).toHaveURL(/.income-pensions/);
  });
});

/**
 * @tests 60079 - Validation
 */
test.describe('Validation', () => {
  test('Empty inputs trigger validation', async () => {
    await test.step('Error is displayed', async () => {
      await potsOfMoneyPage.clickContinueButton();

      await expect(potsOfMoneyPage.errorSummary()).toBeVisible();
      await expect(
        potsOfMoneyPage.errorSummary().getByRole('listitem'),
      ).toHaveCount(1);
      await expect(potsOfMoneyPage.potOfMoneyError()).toBeVisible();
    });

    await test.step('Errors are cleared on valid input', async () => {
      await potsOfMoneyPage.checkYesRadio();
      await potsOfMoneyPage.clickContinueButton();
      await expect(potsOfMoneyPage.page).toHaveURL(/.details/);
    });
  });
});
