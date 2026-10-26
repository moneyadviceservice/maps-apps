import { AboutYouPage } from 'pages/AboutYouPage';
import { expect, test } from '@playwright/test';

import { YourIncomePage } from '../pages/YourIncomePage';

let yourIncomePage: YourIncomePage;
let aboutYouPage: AboutYouPage;

test.beforeEach(async ({ page }) => {
  yourIncomePage = new YourIncomePage(page);
  await yourIncomePage.goto();
  await yourIncomePage.acceptCookiesIfVisible();
});

test.describe('Your Income Page', () => {
  /**
   * @tests 59461 - back button navigates to About You page
   */
  test('Back button navigates to About You page', async ({ page }) => {
    aboutYouPage = new AboutYouPage(page);
    await yourIncomePage.clickBackButton();

    await expect(aboutYouPage.page).toHaveURL(/.*about-you/);
    await expect(aboutYouPage.dobDay()).toHaveValue('1');
    await expect(aboutYouPage.dobMonth()).toHaveValue('1');
    await expect(aboutYouPage.dobYear()).toHaveValue('1990');
    await expect(aboutYouPage.retirementAge()).toHaveValue('65');
  });

  /**
   * @tests 59462 - Gross pay functionality
   * @tests 59467 - Successful form submission
   */
  test('Fill gross pay only', async () => {
    await expect(yourIncomePage.headingLocator('Your income')).toBeVisible();

    await test.step('Fill gross pay', async () => {
      await yourIncomePage.grossPay().fill('5000');
      await yourIncomePage.grossPayFrequency().selectOption('Per week');
    });

    await test.step('Continue to next page', async () => {
      await yourIncomePage.clickContinueButton();
      await expect(yourIncomePage.page).toHaveURL(/.*pots-of-money/);
    });
  });

  /**
   * @tests 59463 - Other income functionality
   */
  test('Fill gross pay and other income', async () => {
    await test.step('Fill gross pay', async () => {
      await yourIncomePage.grossPay().fill('50000');
    });

    await test.step('Fill other income', async () => {
      await yourIncomePage.otherIncomeName(0).fill('Rental Income');
      await yourIncomePage.otherIncomeAmount(0).fill('1500');
      await yourIncomePage.otherIncomeFrequency(0).selectOption('Per month');
    });

    await test.step('Continue to next page', async () => {
      await yourIncomePage.clickContinueButton();
      await expect(yourIncomePage.page).toHaveURL(/.*pots-of-money/);
    });
  });

  test('Other income heading changes when more than one income is added', async () => {
    await test.step('Verify other income heading changes when more than one income is added', async () => {
      await expect(yourIncomePage.headingLocator('Other income')).toBeVisible();
      await yourIncomePage.clickAddAnotherIncomeButton();
      await expect(
        yourIncomePage.headingLocator('Other income 1'),
      ).toBeVisible();
    });
  });

  /**
   * @tests 59464 - Adding other incomes
   */
  test('Add more incomes', async () => {
    await test.step('Fill first income', async () => {
      await yourIncomePage.otherIncomeName(0).fill('Rental Income');
      await yourIncomePage.otherIncomeAmount(0).fill('1500');
      await yourIncomePage.otherIncomeFrequency(0).selectOption('Per year');
    });

    for (let i = 1; i <= 4; i++) {
      await test.step(`Fill other income ${i + 1}`, async () => {
        await yourIncomePage.clickAddAnotherIncomeButton();
        await expect(
          yourIncomePage.headingLocator(`Other income ${i + 1}`),
        ).toBeVisible();
        await yourIncomePage
          .otherIncomeName(i)
          .fill(`My other income ${i + 1}`);
        await yourIncomePage.otherIncomeAmount(i).fill('1000');
        await yourIncomePage.otherIncomeFrequency(i).selectOption('Per month');
      });
    }

    await expect(yourIncomePage.addAnotherIncomeButton()).toBeHidden();
  });

  /**
   * @tests 59465 - removing other incomes
   */
  test('Remove other incomes', async () => {
    await expect(yourIncomePage.otherIncomeName(0)).toBeVisible();
    await expect(yourIncomePage.removeOtherIncomeButton(0)).toBeHidden();

    await test.step('Add more incomes', async () => {
      for (let i = 1; i <= 4; i++) {
        await yourIncomePage.clickAddAnotherIncomeButton();
        await expect(yourIncomePage.otherIncomeName(i)).toBeVisible();
      }
    });

    await test.step('Remove other incomes', async () => {
      for (let i = 4; i >= 1; i--) {
        await yourIncomePage.clickRemoveOtherIncomeButton(i);
        await expect(yourIncomePage.otherIncomeName(i)).toBeHidden();
      }
    });
  });

  test('Removing an income retains the order of the remaining incomes', async () => {
    await test.step('Fill first income', async () => {
      await yourIncomePage.otherIncomeName(0).fill('My other income 1');
      await yourIncomePage.otherIncomeAmount(0).fill('1000');
      await yourIncomePage.otherIncomeFrequency(0).selectOption('Per year');
    });

    for (let i = 1; i <= 4; i++) {
      await test.step(`Fill other income ${i + 1}`, async () => {
        await yourIncomePage.clickAddAnotherIncomeButton();
        await expect(
          yourIncomePage.headingLocator(`Other income ${i + 1}`),
        ).toBeVisible();
        await yourIncomePage
          .otherIncomeName(i)
          .fill(`My other income ${i + 1}`);
        await yourIncomePage.otherIncomeAmount(i).fill(`${i + 1}000`);
        await yourIncomePage.otherIncomeFrequency(i).selectOption('Per month');
      });
    }

    await test.step('Remove other income 2', async () => {
      await yourIncomePage.clickRemoveOtherIncomeButton(1);
      await expect(yourIncomePage.otherIncomeName(1)).toHaveValue(
        'My other income 3',
      );
      await expect(yourIncomePage.otherIncomeAmount(1)).toHaveValue('3,000');
    });
  });
});

/**
 * @tests 59466 - Form errors on continue
 */
test.describe('Validation', () => {
  test('Empty income triggers error messages', async () => {
    await yourIncomePage.clickContinueButton();
    await expect(yourIncomePage.errorSummary()).toBeVisible();
    await expect(yourIncomePage.grossPayError()).toBeVisible();
  });

  test('Errors only appear on other incomes with impartial input (no amount)', async () => {
    await test.step('Fill gross pay', async () => {
      await yourIncomePage.grossPay().fill('5000');
    });

    await test.step('Fill first other income name only', async () => {
      await yourIncomePage.otherIncomeName(0).fill('Rental Income');
      await yourIncomePage.clickContinueButton();
      await expect(yourIncomePage.errorSummary()).toBeVisible();
      await expect(yourIncomePage.otherIncomeAmountError(0)).toBeVisible();
    });

    for (let i = 1; i <= 4; i++) {
      await test.step(`Fill other income ${i + 1} name only`, async () => {
        await yourIncomePage.clickAddAnotherIncomeButton();
        await yourIncomePage
          .otherIncomeName(i)
          .fill(`My other income ${i + 1}`);
      });

      await test.step(`Verify error messages appear for other income ${
        i + 1
      }`, async () => {
        await yourIncomePage.clickContinueButton();
        await expect(yourIncomePage.errorSummary()).toBeVisible();
        await expect(yourIncomePage.otherIncomeAmountError(i)).toBeVisible();
      });
    }
  });

  test('Errors only appear on other incomes with impartial input (no name)', async () => {
    await test.step('Fill gross pay', async () => {
      await yourIncomePage.grossPay().fill('5000');
    });

    await test.step('Fill first other income name only', async () => {
      await yourIncomePage.otherIncomeAmount(0).fill('1500');
      await yourIncomePage.clickContinueButton();
      await expect(yourIncomePage.errorSummary()).toBeVisible();
      await expect(yourIncomePage.otherIncomeNameError(0)).toBeVisible();
    });

    for (let i = 1; i <= 4; i++) {
      await test.step(`Fill other income ${i + 1} name only`, async () => {
        await yourIncomePage.clickAddAnotherIncomeButton();
        await yourIncomePage.otherIncomeAmount(i).fill('1500');
      });

      await test.step(`Verify error messages appear for other income ${
        i + 1
      }`, async () => {
        await yourIncomePage.clickContinueButton();
        await expect(yourIncomePage.errorSummary()).toBeVisible();
        await expect(yourIncomePage.otherIncomeNameError(i)).toBeVisible();
      });
    }
  });
});
