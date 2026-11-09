import testData from '@data/savingsCalculator.json';
import { expect, test } from '@lib/test.lib';
import { NextSteps } from '@pages/components/next-steps.component';
import { Results } from '@pages/components/results.component';
import { savingsMonthName, savingsYear } from '@utils/date-generator';

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
   * @tests 59182 - How long to save for target
   * @tests 59183 - How long to save for target, recalculate
   * @tests 59184 - How long to save for target, validation messages
   * @tests 59189 - Decimal place values for all money input fields (How long)
   */

  test(`How long to save for target`, async ({
    page,
    calculatorType,
    calculatorInput,
    results,
    nextSteps,
  }) => {
    await page.goto(`/en/`);
    await expect(calculatorType.pageTitle).toContainText(
      testData.howLong.heading,
    );
    await calculatorType.howLong.click();
    await expect(calculatorInput.pageTitle).toContainText(
      testData.howLong.title,
    );
    await expect(calculatorInput.savingsGoalTitle).toContainText(
      testData.howLong.savingsGoalLabel,
    );
    await expect(calculatorInput.howLongCanYouSaveDurationTitle).toContainText(
      testData.howLong.selectDropdown,
    );
    await expect(calculatorInput.alreadySavedTitle).toContainText(
      testData.howLong.savedAmount,
    );
    await expect(calculatorInput.interestTitle).toContainText(
      testData.howLong.grossInterest,
    );
    await calculatorInput.inputHowLong({
      savingsGoal: testData.howLong.inputs.savingGoal,
      howLongAmount: testData.howLong.inputs.howLongAmount,
      howLongMonth: testData.howLong.inputs.duration,
      alreadySaved: testData.howLong.inputs.saved,
      interestRate: testData.howLong.inputs.interest,
    });
    await calculatorInput.calculate.click();

    await validateResults({
      results,
      // December 2031 (as of October 2026)
      monthlyAmount: `${savingsMonthName(2)} ${savingsYear(5, 2)}${
        testData.howLongRecalculate.recalculateResult.dateAppendageTwo
      }`,
      targetDate: testData.howLong.results.goal,
      saveTotal: testData.howLong.results.save,
      reachGoalText: testData.howLong.results.reachGoalText,
    });

    await validateNextSteps({
      nextSteps,
      note: testData.howLong.note,
      stepOne: testData.howLong.nextSteps.stepOne,
      stepTwo: testData.howLong.nextSteps.stepTwo,
      stepThree: testData.howLong.nextSteps.stepThree,
    });

    await expect(nextSteps.shareToolTitle).toContainText(
      testData.howLong.shareToolTitle,
    );
  });

  test(`How long to save for target, recalculate`, async ({
    page,
    calculatorType,
    calculatorInput,
    results,
  }) => {
    await page.goto(`/en/`);
    await calculatorType.howLong.click();
    await expect(calculatorInput.pageTitle).toContainText(
      testData.howLongRecalculate.title,
    );
    await calculatorInput.inputHowLong({
      savingsGoal: testData.howLongRecalculate.inputs.savingGoal,
      howLongAmount: testData.howLongRecalculate.inputs.howLongAmount,
      howLongMonth: testData.howLongRecalculate.inputs.duration,
      alreadySaved: testData.howLongRecalculate.inputs.saved,
      interestRate: testData.howLongRecalculate.inputs.interest,
    });
    await calculatorInput.calculate.click();

    await expect(calculatorInput.warningMessage).toContainText(
      testData.core.lowInterestMsg,
    );

    await validateResults({
      results,
      // January 2034 (as of October 2026)
      monthlyAmount: `${savingsMonthName(3)} ${savingsYear(7, 3)}${
        testData.howLongRecalculate.results.dateAppendage
      }`,
      targetDate: testData.howLongRecalculate.results.goal,
      saveTotal: testData.howLongRecalculate.results.save,
      reachGoalText: testData.howLongRecalculate.results.reachGoalText,
    });

    await calculatorInput.interestRate.fill(
      testData.howLongRecalculate.recalculateInputs.interestOne,
    );
    await calculatorInput.calculate.click();
    await expect(calculatorInput.warningMessage).toContainText(
      testData.core.highInterestMsg,
    );

    await validateResults({
      results,
      // September 2030 (as of October 2026)
      monthlyAmount: `${savingsMonthName(11)} ${savingsYear(3, 11)}${
        testData.howLongRecalculate.recalculateResult.dateAppendageOne
      }`,
      targetDate: testData.howLongRecalculate.results.goal,
      saveTotal: testData.howLongRecalculate.results.save,
      reachGoalText:
        testData.howLongRecalculate.recalculateResult.reachGoalTextOne,
    });

    await calculatorInput.inputHowLong({
      howLongAmount:
        testData.howLongRecalculate.recalculateInputs.howLongAmount,
      howLongMonth: testData.howLongRecalculate.recalculateInputs.duration,
      interestRate: testData.howLongRecalculate.recalculateInputs.interestTwo,
    });
    await calculatorInput.calculate.click();

    await validateResults({
      results,
      // December 2031 (as of October 2026)
      monthlyAmount: `${savingsMonthName(2)} ${savingsYear(5, 2)}${
        testData.howLong.results.dateAppendage
      }`,
      targetDate: testData.howLongRecalculate.results.goal,
      saveTotal: testData.howLongRecalculate.recalculateResult.save,
      reachGoalText:
        testData.howLongRecalculate.recalculateResult.reachGoalTextTwo,
    });
  });

  test(`How long to save for target, validation messages`, async ({
    page,
    calculatorType,
    calculatorInput,
    error,
  }) => {
    await page.goto(`/en/`);
    await calculatorType.howLong.click();
    await expect(calculatorInput.pageTitle).toContainText(
      testData.howLong.title,
    );
    await calculatorInput.calculate.click();
    await expect(error.errorMessage(0)).toContainText(
      testData.validationMessages.savingsGoal,
    );
    await expect(error.errorMessage(1)).toContainText(
      testData.validationMessages.amountToSave,
    );
    await calculatorInput.savingsGoal.fill(
      testData.validationMessages.input.savingGoal,
    );
    await calculatorInput.calculate.click();
    await expect(error.errorMessage(1)).toBeHidden();
    await expect(error.errorMessage(0)).toContainText(
      testData.validationMessages.amountToSave,
    );
  });

  test(`can handle decimal place values for all money input fields (how long)`, async ({
    page,
    calculatorType,
    calculatorInput,
    results,
  }) => {
    await page.goto(`/en/`);
    await calculatorType.howLong.click();

    await calculatorInput.inputHowLong({
      savingsGoal: testData.howLongDecimal.inputs.savingGoal,
      howLongAmount: testData.howLongDecimal.inputs.howLongAmount,
      howLongMonth: testData.howLongDecimal.inputs.duration,
      alreadySaved: testData.howLongDecimal.inputs.saved,
      interestRate: testData.howLongDecimal.inputs.interest,
    });
    await calculatorInput.calculate.click();

    await validateResults({
      results,
      // July 2032 (as of October 2026)
      monthlyAmount: `${savingsMonthName(9)} ${savingsYear(5, 9)}${
        testData.howLongDecimal.results.dateAppendage
      }`,
      targetDate: testData.howLongDecimal.results.goal,
      saveTotal: testData.howLongDecimal.results.save,
      reachGoalText: testData.howLongDecimal.results.reachGoalText,
    });
  });
});
