import { IncomePensionsPage } from 'pages/IncomePensionsPage';
import { StatePensionPage } from 'pages/StatePensionPage';
import { expect, test } from '@playwright/test';

let statePensionPage: StatePensionPage;
let incomePensionsPage: IncomePensionsPage;

test.beforeEach(async ({ page }) => {
  statePensionPage = new StatePensionPage(page);
  await statePensionPage.goto();
  await statePensionPage.acceptCookiesIfVisible();
});

test.describe('State pension page', () => {
  /**
   * @tests 60048 - Back navigation
   */
  test('Back button navigates to Income Pensions with persisted data', async ({
    page,
  }) => {
    incomePensionsPage = new IncomePensionsPage(page);
    await statePensionPage.clickBackButton();
    await expect(incomePensionsPage.page).toHaveURL(/.income-pensions/);
    await expect(incomePensionsPage.noRadioButton()).toBeChecked();
  });

  /**
   * @tests 60049 - Zero value
   */
  test('Contine with a zero value', async () => {
    await statePensionPage.fillStatePensionWeeklyAmount('0');
    await statePensionPage.clickContinueButton();
    await expect(statePensionPage.page).toHaveURL(/.retirement-income/);
  });

  /**
   * @tests 60051 - Check your state pension link
   */
  test('Check your state pension link and attributes', async () => {
    await expect(statePensionPage.forecastLink()).toBeVisible();
    await expect(statePensionPage.forecastLink()).toHaveAttribute(
      'href',
      'https://www.gov.uk/check-state-pension',
    );
    await expect(statePensionPage.forecastLink()).toHaveAttribute(
      'rel',
      'noopener noreferrer',
    );
  });

  /**
   * @tests 60050 - Valid value
   */
  test('Continue with a value', async () => {
    await statePensionPage.fillStatePensionWeeklyAmount('999');
    await statePensionPage.clickContinueButton();
    await expect(statePensionPage.page).toHaveURL(/.retirement-income/);
  });

  /**
   * @tests 60050 - Blank value
   */
  test('Continue without entering a value', async () => {
    await expect(statePensionPage.statePensionWeeklyAmount()).toHaveValue('');
    await statePensionPage.clickContinueButton();
    await expect(statePensionPage.page).toHaveURL(/.retirement-income/);
  });
});

/**
 * @tests 60049 - Field behaviour
 */
test.describe('Validation', () => {
  test('Restricted to numerical chars', async () => {
    await statePensionPage.fillStatePensionWeeklyAmount('alpha100chars');
    await expect(statePensionPage.statePensionWeeklyAmount()).toHaveValue(
      '100',
    );
  });

  /**
   * @tests 60052 - invalid amounts
   */
  test('Restricted to 2 decimal places', async () => {
    await statePensionPage.fillStatePensionWeeklyAmount('50.123');
    await expect(statePensionPage.statePensionWeeklyAmount()).toHaveValue(
      '50.12',
    );
  });

  /**
   * @tests 60052 - invalid amounts
   */
  test('Values of more than 999 trigger validation', async () => {
    await test.step('Trigger validation', async () => {
      await statePensionPage.fillStatePensionWeeklyAmount('999.99');
      await statePensionPage.clickContinueButton();
      await expect(statePensionPage.errorSummary()).toBeVisible();
      await expect(
        statePensionPage.statePensionWeeklyAmountError(),
      ).toBeVisible();
      await expect(statePensionPage.statePensionWeeklyAmountError()).toHaveText(
        'Enter an amount of £999 or less',
      );
    });

    /**
     * @tests 60053 - Clear validation and continue
     */
    await test.step('Clear validation and continue', async () => {
      await statePensionPage.fillStatePensionWeeklyAmount('242.12');
      await statePensionPage.clickContinueButton();
      await expect(statePensionPage.page).toHaveURL(/.retirement-income/);
    });
  });

  test.describe('No JS', () => {
    test.use({ javaScriptEnabled: false });

    test('Three decimal places triggers validation', async () => {
      await statePensionPage.fillStatePensionWeeklyAmount('100.512');
      await statePensionPage.clickContinueButton();
      await expect(statePensionPage.errorSummary()).toBeVisible();
      await expect(
        statePensionPage.statePensionWeeklyAmountError(),
      ).toBeVisible();
      await expect(
        statePensionPage.statePensionWeeklyAmountError(),
      ).toContainText('Enter an amount in pounds, like');
    });
  });
});
