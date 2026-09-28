import testData from '../data/mortgageData.json';
import { expect, test } from '../lib/test.lib';
import { CalculatorInput } from '../pages/components/calculator-input.component';
import { ResultsComponent } from '../pages/components/results.component';

const languages = ['en', 'cy'] as const;

async function inputMortgageValues(
  calculatorInput: CalculatorInput,
  propertyPrice: string,
  deposit: string,
  term: string,
  interest: string,
) {
  await calculatorInput.propertyPrice.fill(propertyPrice);
  await calculatorInput.deposit.fill(deposit);
  await calculatorInput.mortgageTerm.selectOption(term);
  await calculatorInput.interestRate.fill(interest);
  await calculatorInput.calculateButton.click();
}

async function checkResults(
  resultsComponent: ResultsComponent,
  monthlyPayment: string,
  repayCost: string,
  capitalAmount: string,
  interestAmount: string,
  interestRiseCost: string,
) {
  await expect(resultsComponent.monthlyPayment).toContainText(monthlyPayment);
  await expect(resultsComponent.repayCost).toContainText(repayCost);
  await expect(resultsComponent.capitalAmount).toContainText(capitalAmount);
  await expect(resultsComponent.interestAmount).toContainText(interestAmount);
  await expect(resultsComponent.intrestRiseCost).toContainText(
    interestRiseCost,
  );
}

for (const language of languages) {
  test.describe('Mortgage Calculator', () => {
    /**
     * @tests 58327 - Calculates repayment mortgage
     * @tests 58367 - Calculates interest only mortgage
     * @tests 58372 - Displays zero when deposit is higher than property price
     */
    test.beforeEach(async ({ setCookieControl }) => {
      await setCookieControl();
    });

    test(`Calculates repayment mortgage - ${language}`, async ({
      page,
      calculatorInput,
      resultsComponent,
    }) => {
      await page.goto(`${language}`);

      await inputMortgageValues(
        calculatorInput,
        testData.calculatesRepayment.input.propertyPrice,
        testData.calculatesRepayment.input.depositPrice,
        testData.calculatesRepayment.input.mortgageTerm,
        testData.calculatesRepayment.input.interestRate,
      );

      await expect(resultsComponent.resultsTitle).toContainText(
        testData.calculatesRepayment.heading[language],
      );
      await expect(resultsComponent.breakdownDropdownButton).toHaveClass(
        /underline/,
      );
      await expect(resultsComponent.breakdownDropdown).not.toHaveAttribute(
        'open',
      );
      await resultsComponent.breakdownDropdownButton.click();
      await expect(resultsComponent.breakdownDropdown).toHaveAttribute('open');
      await checkResults(
        resultsComponent,
        testData.calculatesRepayment.results.monthlyPayment,
        testData.calculatesRepayment.results.repayCost,
        testData.calculatesRepayment.results.capital,
        testData.calculatesRepayment.results.interest,
        testData.calculatesRepayment.results.interestRise,
      );

      for (const [year, remainingDebt] of Object.entries(
        testData.calculatesRepayment.results.breakDownTable,
      )) {
        const row = Number(year);
        await expect(await resultsComponent.yearRow(row)).toContainText(year);
        await expect(
          await resultsComponent.remainingDebtRow(row),
        ).toContainText(remainingDebt);
      }
    });

    test(`Calculates interest only mortgage - ${language}`, async ({
      page,
      calculatorInput,
      resultsComponent,
    }) => {
      await page.goto(`${language}`);

      await calculatorInput.interestOnlyCheckbox.click();

      await inputMortgageValues(
        calculatorInput,
        testData.calulatesInterest.input.propertyPrice,
        testData.calulatesInterest.input.depositPrice,
        testData.calulatesInterest.input.mortgageTerm,
        testData.calulatesInterest.input.interestRate,
      );
      await resultsComponent.breakdownDropdownButton.click();
      await checkResults(
        resultsComponent,
        testData.calulatesInterest.results.monthlyPayment,
        testData.calulatesInterest.results.repayCost,
        testData.calulatesInterest.results.capital,
        testData.calulatesInterest.results.interest,
        testData.calulatesInterest.results.interestRise,
      );

      //Repayment year list starts at 'Year 0', but this interest list starts at 'Year 1'
      let row = 0;
      for (const [year, remainingDebt] of Object.entries(
        testData.calulatesInterest.results.breakDownTable,
      )) {
        await expect(await resultsComponent.yearRow(row)).toContainText(year);
        await expect(
          await resultsComponent.remainingDebtRow(row),
        ).toContainText(remainingDebt);
        row++;
      }
    });

    test(`Displays zero when deposit is higher than property price - ${language}`, async ({
      page,
      calculatorInput,
      resultsComponent,
    }) => {
      await page.goto(`${language}`);

      await inputMortgageValues(
        calculatorInput,
        testData.displaysZero.propertyPrice,
        testData.displaysZero.depositPrice,
        testData.displaysZero.mortgageTerm,
        testData.displaysZero.interestRate,
      );
      await resultsComponent.breakdownDropdownButton.click();
      await checkResults(
        resultsComponent,
        testData.displaysZero.zeroResult,
        testData.displaysZero.zeroResult,
        testData.displaysZero.zeroResult,
        testData.displaysZero.zeroResult,
        testData.displaysZero.zeroResult,
      );

      for (let year = 0; year <= 25; year++) {
        await expect(await resultsComponent.yearRow(year)).toContainText(
          String(year),
        );
        await expect(
          await resultsComponent.remainingDebtRow(year),
        ).toContainText(testData.displaysZero.zeroResult);
      }
    });
  });
}
