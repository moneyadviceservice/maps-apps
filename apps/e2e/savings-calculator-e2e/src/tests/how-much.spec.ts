import testData from '@data/savingsCalculator.json';
import { expect, test } from '@lib/test.lib';
import { NextSteps } from '@pages/components/next-steps.component';
import { Results } from '@pages/components/results.component';
import {
  savingsMonthName,
  savingsMonthNum,
  savingsYear,
} from '@utils/date-generator';

async function validateNextSteps({
  nextSteps,
  note,
  stepOne,
  stepTwo,
  stepThree,
}: {
  nextSteps: NextSteps;
  note?: string;
  stepOne?: string;
  stepTwo?: string;
  stepThree?: string;
}) {
  if (note != null) {
    await expect(nextSteps.note).toContainText(note);
  }
  if (stepOne != null) {
    await expect(nextSteps.stepOne).toContainText(stepOne);
  }
  if (stepTwo != null) {
    await expect(nextSteps.stepTwo).toContainText(stepTwo);
  }
  if (stepThree != null) {
    await expect(nextSteps.stepThree).toContainText(stepThree);
  }
}

async function validateResults({
  results,
  monthlyAmount,
  targetDate,
  saveTotal,
  reachGoalText,
}: {
  results: Results;
  monthlyAmount?: string;
  targetDate?: string;
  saveTotal?: string;
  reachGoalText?: string;
}) {
  if (monthlyAmount != null) {
    await expect(results.monthlyAmount).toContainText(monthlyAmount);
  }
  if (targetDate != null) {
    await expect(results.targetDate).toContainText(targetDate);
  }
  if (saveTotal != null) {
    await expect(results.saveTotal).toContainText(saveTotal);
  }
  if (reachGoalText != null) {
    await expect(results.reachGoalText).toContainText(reachGoalText);
  }
}

test.describe(`Savings Calculator`, () => {
  test.beforeEach(async ({ setCookieControl }) => {
    await setCookieControl();
  });

  /**
   * @tests 59181 - Landing page
   * @tests 59185 - How much to save for target
   * @tests 59187 - How much to save for target, recalculate
   * @tests 59188 - How much to save for target, validation messages
   * @tests 59190 - Decimal place values for all money input fields (How much)
   */

  test(`Landing page`, async ({ page, calculatorType }) => {
    await page.goto(`/en/`);
    await expect(calculatorType.pageTitle).toContainText(testData.core.heading);
    await expect(calculatorType.description).toContainText(testData.core.intro);
    await expect(calculatorType.howLongTitle).toContainText(
      testData.core.howLongIntro,
    );
    await expect(calculatorType.howMuchTitle).toContainText(
      testData.core.howMuchIntro,
    );
  });

  test(`How much to save for target`, async ({
    page,
    calculatorType,
    calculatorInput,
    results,
    nextSteps,
  }) => {
    await page.goto(`/en/`);
    await calculatorType.howMuch.click();
    await expect(calculatorInput.pageTitle).toContainText(
      testData.howMuch.title,
    );
    await expect(calculatorInput.savingsGoalTitle).toContainText(
      testData.howMuch.savingsGoalLabel,
    );
    await expect(calculatorInput.savingsByTitle).toContainText(
      testData.howMuch.savingDate,
    );
    await expect(calculatorInput.howMuchCanYouSaveMonthTitle).toContainText(
      testData.howMuch.month,
    );
    await expect(calculatorInput.howMuchCanYouSaveYearTitle).toContainText(
      testData.howMuch.year,
    );
    await expect(calculatorInput.alreadySavedTitle).toContainText(
      testData.howMuch.savedAmount,
    );
    await expect(calculatorInput.interestTitle).toContainText(
      testData.howMuch.grossInterest,
    );

    await calculatorInput.inputHowMuch({
      savingsGoal: testData.howMuch.inputs.savingGoal,
      //12 (as of October 2026)
      howMuchMonth: savingsMonthNum(2),
      //2029 (as of October 2026)
      howMuchYear: savingsYear(3),
      alreadySaved: testData.howMuch.inputs.saved,
      interestRate: testData.howMuch.inputs.interest,
    });

    await calculatorInput.calculate.click();

    await validateResults({
      results,
      monthlyAmount: testData.howMuch.results.monthly,
      //December 2029 (as of October 2026)
      targetDate: `${savingsMonthName(2)} ${savingsYear(3)}`,
      saveTotal: testData.howMuch.results.total,
      reachGoalText: testData.howMuch.results.reachGoalText,
    });

    await validateNextSteps({
      nextSteps,
      note: testData.howMuch.note,
      stepOne: testData.howMuch.nextSteps.stepOne,
      stepTwo: testData.howMuch.nextSteps.stepTwo,
      stepThree: testData.howMuch.nextSteps.stepThree,
    });

    await expect(nextSteps.shareToolTitle).toContainText(
      testData.howMuch.shareToolTitle,
    );
  });

  test(`How much to save for target, recalculate`, async ({
    page,
    calculatorType,
    calculatorInput,
    results,
  }) => {
    await page.goto(`/en/`);
    await calculatorType.howMuch.click();
    await expect(calculatorInput.pageTitle).toContainText(
      testData.howMuchRecalculate.title,
    );

    await calculatorInput.inputHowMuch({
      savingsGoal: testData.howMuchRecalculate.inputs.savingGoal,
      //12 (as of October 2026)
      howMuchMonth: savingsMonthNum(2),
      //2029 (as of October 2026)
      howMuchYear: savingsYear(3),
      alreadySaved: testData.howMuchRecalculate.inputs.saved,
      interestRate: testData.howMuchRecalculate.inputs.interest,
    });

    await calculatorInput.calculate.click();

    await expect(calculatorInput.warningMessage).toContainText(
      testData.core.lowInterestMsg,
    );

    await validateResults({
      results,
      monthlyAmount: testData.howMuchRecalculate.results.monthly,
      //December 2029 (as of October 2026)
      targetDate: `${savingsMonthName(2)} ${savingsYear(3)}`,
      saveTotal: testData.howMuchRecalculate.results.total,
      reachGoalText: testData.howMuchRecalculate.results.reachGoalText,
    });

    await calculatorInput.interestRate.fill(
      testData.howMuchRecalculate.recalculateInputs.interestOne,
    );
    await calculatorInput.calculate.click();

    await expect(calculatorInput.warningMessage).toContainText(
      testData.core.highInterestMsg,
    );

    await validateResults({
      results,
      monthlyAmount: testData.howMuchRecalculate.recalculateResult.monthly,
      //December 2029 (as of October 2026)
      targetDate: `${savingsMonthName(2)} ${savingsYear(3)}`,
      saveTotal: testData.howMuchRecalculate.recalculateResult.total,
      reachGoalText:
        testData.howMuchRecalculate.recalculateResult.reachGoalText,
    });

    await calculatorInput.inputHowMuch({
      savingsGoal: testData.howMuchRecalculate.recalculateInputs.savingGoal,
      //4 (as of October 2026)
      howMuchMonth: savingsMonthNum(-6),
      //2039(as of October 2026)
      howMuchYear: savingsYear(4),
      alreadySaved: testData.howMuchRecalculate.recalculateInputs.saved,
      interestRate: testData.howMuchRecalculate.recalculateInputs.interestTwo,
    });

    await calculatorInput.calculate.click();

    await validateResults({
      results,
      monthlyAmount: testData.howMuchRecalculate.recalculateResult.monthlyTwo,
      //April 2030 (as of October 2026)
      targetDate: `${savingsMonthName(-6)} ${savingsYear(4)}`,
      saveTotal: testData.howMuchRecalculate.recalculateResult.totalTwo,
      reachGoalText:
        testData.howMuchRecalculate.recalculateResult.reachGoalTextTwo,
    });
  });

  test(`How much to save for target, validation messages`, async ({
    page,
    calculatorType,
    calculatorInput,
    error,
  }) => {
    await page.goto(`/en/`);
    await calculatorType.howMuch.click();

    await expect(calculatorInput.pageTitle).toContainText(
      testData.howMuch.title,
    );

    await calculatorInput.inputHowMuch({
      savingsGoal: testData.validationMessages.input.savingGoal,
      //9 (as of October 2026)
      howMuchMonth: savingsMonthNum(-1),
      //2026 (as of October 2026)
      howMuchYear: savingsYear(0),
      alreadySaved: testData.howMuchRecalculate.recalculateInputs.saved,
      interestRate: testData.howMuchRecalculate.recalculateInputs.interestTwo,
    });

    await calculatorInput.calculate.click();

    await expect(error.errorMessage(0)).toContainText(
      testData.validationMessages.pastDate,
    );

    await calculatorInput.inputHowMuch({
      savingsGoal: testData.validationMessages.input.savingGoal,
      //10 (as of October 2026)
      howMuchMonth: savingsMonthNum(0),
      // 2026 (as of October 2026)
      howMuchYear: savingsYear(0),
      alreadySaved: testData.howMuchRecalculate.recalculateInputs.saved,
      interestRate: testData.howMuchRecalculate.recalculateInputs.interestTwo,
    });

    await calculatorInput.calculate.click();

    await expect(error.errorMessage(0)).toContainText(
      testData.validationMessages.currentDate,
    );
  });

  test(`Can handle decimal place values for all money input fields (how much)`, async ({
    page,
    calculatorType,
    calculatorInput,
    results,
  }) => {
    await page.goto(`/en/`);
    await calculatorType.howMuch.click();

    await calculatorInput.inputHowMuch({
      savingsGoal: testData.howMuchDecimal.inputs.savingGoal,
      //9 (as of October 2026)
      howMuchMonth: savingsMonthNum(-1),
      //2031 (as of October 2026)
      howMuchYear: savingsYear(5),
      alreadySaved: testData.howMuchDecimal.inputs.saved,
      interestRate: testData.howMuchDecimal.inputs.interest,
    });

    await calculatorInput.calculate.click();

    await validateResults({
      results,
      monthlyAmount: testData.howMuchDecimal.results.monthly,
      //September 2031 (as of October 2026)
      targetDate: `${savingsMonthName(-1)} ${savingsYear(5)}`,
      saveTotal: testData.howMuchDecimal.results.total,
      reachGoalText: testData.howMuchDecimal.results.reachGoalText,
    });
  });
});
