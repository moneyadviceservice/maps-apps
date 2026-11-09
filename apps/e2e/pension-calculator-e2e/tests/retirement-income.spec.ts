import { RetirementIncomePage } from 'pages/RetirementIncomePage';
import { StatePensionPage } from 'pages/StatePensionPage';
import { expect, test } from '@playwright/test';

let retirementIncomePage: RetirementIncomePage;
let statePensionPage: StatePensionPage;

test.beforeEach(async ({ page }) => {
  retirementIncomePage = new RetirementIncomePage(page);
});

test.describe('Retirement income page', () => {
  test.beforeEach(async () => {
    await retirementIncomePage.goto('50,000');
    await retirementIncomePage.acceptCookiesIfVisible();
  });

  /**
   * @tests 60507 - Back button navigates to State Pension with persisted data
   */
  test('Back button navigates to State Pension with persisted data', async ({
    page,
  }) => {
    statePensionPage = new StatePensionPage(page);
    await retirementIncomePage.clickBackButton();
    await expect(statePensionPage.page).toHaveURL(/.state-pension/);
    await expect(statePensionPage.statePensionWeeklyAmount()).toHaveValue(
      '242.12',
    );
  });

  /**
   * @tests 60522 - Continue button navigates to Summary page
   */
  test('Continue button navigates to Summary page', async () => {
    await retirementIncomePage.clickContinueButton();
    await expect(retirementIncomePage.page).toHaveURL(/.check-your-answers/);
  });

  /**
   * @tests 60865 - Income plus additional incomes
   */
  test('Dymamic frequency recalculation', async () => {
    await expect(retirementIncomePage.applyButton()).toBeHidden();
    await expect(retirementIncomePage.retirementIncomeFrequency()).toHaveValue(
      'year',
    );
    await expect(retirementIncomePage.targetAmount()).toHaveText('£32,844');
    await retirementIncomePage.selectRetirementIncomeFrequency('Per month');
    await expect(retirementIncomePage.targetAmount()).toHaveText('£2,737');
    await retirementIncomePage.selectRetirementIncomeFrequency('Per week');
    await expect(retirementIncomePage.targetAmount()).toHaveText('£632');
  });

  /**
   * @tests 60520 - Target income calculation accordion behavior
   */
  test('Target income calculation accordion behavior', async () => {
    await retirementIncomePage.clickIncomeCalculationAccordion();
    await expect(
      retirementIncomePage.incomeCalculationAccordion().locator('../..'),
    ).toHaveAttribute('open', '');
    await retirementIncomePage.clickIncomeCalculationAccordion();
    await expect(
      retirementIncomePage.incomeCalculationAccordion().locator('../..'),
    ).not.toHaveAttribute('open', '');
  });

  /**
   * @tests 60521 - Living costs accordion behavior
   */
  test('Living costs accordion behavior', async () => {
    await retirementIncomePage.clickLivingCostsAccordion();
    await expect(
      retirementIncomePage.livingCostsAccordion().locator('../..'),
    ).toHaveAttribute('open', '');
    await retirementIncomePage.clickLivingCostsAccordion();
    await expect(
      retirementIncomePage.livingCostsAccordion().locator('../..'),
    ).not.toHaveAttribute('open', '');
  });

  /**
   * @tests 60519 - Dymamic frequency recalculation - Non JS
   */
  test.describe('Non JS', () => {
    test.use({ javaScriptEnabled: false });

    test('Dymamic frequency recalculation - Non JS', async () => {
      await expect(
        retirementIncomePage.retirementIncomeFrequency(),
      ).toHaveValue('year');
      await expect(retirementIncomePage.targetAmount()).toHaveText('£32,844');
      await retirementIncomePage.selectRetirementIncomeFrequency('Per month');
      await retirementIncomePage.clickApplyButton();
      await expect(retirementIncomePage.targetAmount()).toHaveText('£2,737');
      await retirementIncomePage.selectRetirementIncomeFrequency('Per week');
      await retirementIncomePage.clickApplyButton();
      await expect(retirementIncomePage.targetAmount()).toHaveText('£632');
    });
  });
});

/**
 * @tests 60518 - Verify calculation rules
 * @tests 60867 - Income plus additional incomes - banding rules
 * @tests 60868 - additioinal income can bump into next banding
 */
test.describe('Verify calculation banding rules', () => {
  //all values have additional income £3,700 per year over two additional incomes
  const bandValues = [
    { value: '10,000', target: '11,792' }, // £11,792 - 80%
    { value: '20,000', target: '17,318' }, // £17,318 - 70%
    { value: '30,000', target: '23,276' }, // £23,276 - 67% rounded
    { value: '50,000', target: '32,844' }, // £32,844 - 60%
    { value: '80,000', target: '42,370' }, // £42,370 - 50%
    { value: '15,000', target: '13,818' }, // additional income bumps into next band - 70%
  ];

  for (const { value, target } of bandValues) {
    test(`Verify calculation for band value: ${value}`, async () => {
      await retirementIncomePage.goto(value);
      await retirementIncomePage.acceptCookiesIfVisible();
      await expect(retirementIncomePage.targetAmount()).toHaveText(
        `£${target}`,
      );
    });
  }
});
