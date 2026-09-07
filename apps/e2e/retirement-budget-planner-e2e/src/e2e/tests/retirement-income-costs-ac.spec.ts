import { expect, type Page, test } from '@playwright/test';

import { retirementCostsHeading } from '../data/retirement-costs';
import {
  otherRetirementIncomeTitle,
  personalPensionsTitle,
  retirementIncomeHeading,
} from '../data/retirement-income';
import aboutYouPage from '../pages/AboutYouPage';
import { basePage } from '../pages/basePage';
import homePage from '../pages/HomePage';
import retirementCostsPage from '../pages/RetirementCostsPage';
import retirementIncomePage from '../pages/RetirementIncomePage';

const REMOVE_BUTTON_TEXT = 'Remove';
const PRIVATE_PENSION_TYPE = 'privatePension' as const;
const DEFAULT_PRIVATE_PENSION_COUNT = 1;

const personalPensionInputFields = (page: Page) =>
  page.locator('[data-testid^="formprivatePension"][data-testid$="Id"]');

const personalPensionRemoveButtons = (page: Page) =>
  retirementIncomePage
    .getAccordionByTitle(page, personalPensionsTitle)
    .getByRole('button', { name: REMOVE_BUTTON_TEXT });

const expectPersonalPensionCount = async (
  page: Page,
  expectedCount: number,
) => {
  await expect(personalPensionInputFields(page)).toHaveCount(expectedCount, {
    timeout: 10000,
  });
};

const openPersonalPensions = async (page: Page) => {
  await retirementIncomePage.openAccordionByTitle(page, personalPensionsTitle);
};

const addSinglePersonalPension = async (page: Page) => {
  await retirementIncomePage.clickAddPensionButton(page, {
    type: PRIVATE_PENSION_TYPE,
  });
};

const addPersonalPensions = async (page: Page, count: number) => {
  for (let index = 0; index < count; index++) {
    await addSinglePersonalPension(page);
  }
};

const getNormalizedPersonalPensionValues = async (page: Page) =>
  personalPensionInputFields(page).evaluateAll((inputs: Element[]) =>
    inputs.map((input: Element) =>
      (input as HTMLInputElement).value.trim().replaceAll(',', ''),
    ),
  );

const fillPersonalPensionValueAndBlur = async (
  page: Page,
  index: number,
  value: string,
) => {
  const field = personalPensionInputFields(page).nth(index);
  await field.fill(value);
  await field.press('Tab');
};

const expectPensionValuesToContainOnlyRemaining = (
  values: string[],
  removedValue: string,
  expectedRemaining: string[],
) => {
  expectedRemaining.forEach((value) => {
    expect(values).toContain(value);
  });
  expect(values).not.toContain(removedValue);
};

/**
 * @tests User Story 51059
 * @test AC1 Retirement income section order after Workplace pension(s)
 * @test AC2 Pay from work (before tax) more information copy
 * @test AC3 Income from other household members more information copy
 * @test AC4 Credit card repayments more information copy on Retirement costs
 */
test.describe('Retirement Budget Planner - Retirement income and costs AC coverage', () => {
  test.beforeEach(async ({ page }) => {
    await homePage.startRetirementBudgetPlanner(page);
    await aboutYouPage.fillValuesAndContinue(page);
    await retirementIncomePage.waitForPageToBeReady(page);
  });

  test('Retirement income: section after Workplace pension(s) is Private Pensions', async ({
    page,
  }) => {
    const allSectionTitles = page.getByTestId('summary-block-title');
    const workplaceTitle = allSectionTitles
      .filter({ hasText: 'Workplace pension(s)' })
      .first();

    await workplaceTitle.scrollIntoViewIfNeeded();

    const titles = (await allSectionTitles.allTextContents()).map((text) =>
      text.trim(),
    );

    const workplaceIndex = titles.indexOf('Workplace pension(s)');

    expect(workplaceIndex).toBeGreaterThanOrEqual(0);
    expect(titles[workplaceIndex + 1]).toBe('Private pensions');
  });

  test('Retirement income: Pay from work (before tax) more information copy', async ({
    page,
  }) => {
    await retirementIncomePage.openAccordionByTitle(
      page,
      otherRetirementIncomeTitle,
    );

    const payFromWorkSection =
      await retirementIncomePage.openMoreInformationByLegend(
        page,
        'Pay from work (before tax)',
      );

    await expect(payFromWorkSection).toContainText(
      /If you're looking to phase your retirement, this is the income you plan to get from an employer or self-employment\. If you're self-employed, enter your expected trading profits \(your business income minus your expenses\)\./,
    );
  });

  test('Retirement income: Income from other household members more information copy', async ({
    page,
  }) => {
    await retirementIncomePage.openAccordionByTitle(
      page,
      otherRetirementIncomeTitle,
    );

    const householdIncomeSection =
      await retirementIncomePage.openMoreInformationByLegend(
        page,
        'Income from other household members',
      );

    await expect(householdIncomeSection).toContainText(
      'This is any income from other members of your household, like your partner or children, that will help with the household finances',
    );
  });

  test('Retirement costs: Credit card repayments more information copy', async ({
    page,
  }) => {
    await retirementIncomePage.fillValuesAndContinue(page, '5000');
    await basePage.waitForPageHeading(page, retirementCostsHeading);

    await retirementCostsPage.clickAccordionSummary(page, 'Borrowing');

    const creditCardRepaymentsSection =
      await retirementCostsPage.openMoreInformationByLegend(
        page,
        'Credit card repayments',
      );

    await expect(creditCardRepaymentsSection).toContainText(
      'Enter the estimated credit card repayments you expect to have. This might be an amount to clear or reduce the amount you owe, or the minimum payment you must make.',
    );

    await expect(creditCardRepaymentsSection).toContainText(
      'Be careful not to double count any spending you plan to make. For example, if you plan to spend £50 a month on clothes using a credit card (without clearing the balance), you should only enter the credit card repayment here.',
    );
  });

  test('Personal pensions: user can add multiple pots', async ({ page }) => {
    await openPersonalPensions(page);

    await expect(personalPensionInputFields(page)).toHaveCount(
      DEFAULT_PRIVATE_PENSION_COUNT,
    );
    await expectPersonalPensionCount(page, DEFAULT_PRIVATE_PENSION_COUNT);

    await addPersonalPensions(page, 2);

    await expectPersonalPensionCount(page, 3);
  });

  test('Personal pensions: user can remove a pot when multiple pots exist', async ({
    page,
  }) => {
    await openPersonalPensions(page);
    await addPersonalPensions(page, 2);
    await expectPersonalPensionCount(page, 3);

    await personalPensionRemoveButtons(page).first().click();

    await expectPersonalPensionCount(page, 2);

    const remainingPot = personalPensionInputFields(page).nth(1);
    await remainingPot.fill('2450');
    await expect(remainingPot).toHaveValue(/2,450|2450/);
  });

  test('Personal pensions: count updates correctly after add and remove actions', async ({
    page,
  }) => {
    await openPersonalPensions(page);
    await expect(personalPensionInputFields(page)).toHaveCount(
      DEFAULT_PRIVATE_PENSION_COUNT,
    );
    await expectPersonalPensionCount(page, DEFAULT_PRIVATE_PENSION_COUNT);

    await addSinglePersonalPension(page);
    await expectPersonalPensionCount(page, 2);

    await addSinglePersonalPension(page);
    await expectPersonalPensionCount(page, 3);

    await addSinglePersonalPension(page);
    await expectPersonalPensionCount(page, 4);

    await personalPensionRemoveButtons(page).first().click();
    await expectPersonalPensionCount(page, 3);
  });

  test('Personal pensions: data persists after adding and removing pots', async ({
    page,
  }) => {
    await openPersonalPensions(page);
    await addPersonalPensions(page, 2);
    await expectPersonalPensionCount(page, 3);

    await fillPersonalPensionValueAndBlur(page, 0, '100');
    await fillPersonalPensionValueAndBlur(page, 1, '200');
    await fillPersonalPensionValueAndBlur(page, 2, '300');

    await personalPensionRemoveButtons(page).first().click();
    await expectPersonalPensionCount(page, 2);

    const valuesBeforeSave = await getNormalizedPersonalPensionValues(page);
    expectPensionValuesToContainOnlyRemaining(valuesBeforeSave, '200', [
      '100',
      '300',
    ]);

    await basePage.fillInput(page, 'formstatePension', '965');
    await basePage.continueButton(page).click();
    await basePage.waitForPageHeading(page, retirementCostsHeading);

    await basePage.clickBackLink(page);
    await basePage.waitForPageHeading(page, retirementIncomeHeading);
    await openPersonalPensions(page);

    await expectPersonalPensionCount(page, 2);

    const remainingValues = await getNormalizedPersonalPensionValues(page);

    await expect(personalPensionInputFields(page)).toHaveCount(2);
    expectPensionValuesToContainOnlyRemaining(remainingValues, '200', [
      '100',
      '300',
    ]);
  });

  test('Personal pensions: remove option availability updates dynamically', async ({
    page,
  }) => {
    await openPersonalPensions(page);

    await expect(personalPensionRemoveButtons(page)).toHaveCount(0);

    await addSinglePersonalPension(page);

    await expect(personalPensionRemoveButtons(page)).toHaveCount(1);

    await personalPensionRemoveButtons(page).first().click();

    await expectPersonalPensionCount(page, DEFAULT_PRIVATE_PENSION_COUNT);
    await expect(personalPensionRemoveButtons(page)).toHaveCount(0);
  });
});
