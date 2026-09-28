import { expect, test } from '@lib/test.lib';
import { AnswersComponent } from '@pages/components/answers.component';
import { DateOfBirthComponent } from '@pages/components/date-of-birth.component';
import { EmployerDateComponent } from '@pages/components/employer-date.component';
import { IncomeComponent } from '@pages/components/income.component';
import { LocationComponent } from '@pages/components/location.component';
import { RedundancyOptionComponent } from '@pages/components/redundancy-option.component';
import { RedundantComponent } from '@pages/components/redundant-date.component';
import { ResultsComponent } from '@pages/components/results.component';

import testData from '../data/redundancyData.json';
import {
  getRedundancyDate,
  type RedundancyDate,
} from '../helpers/date-generator';

const data = testData.results;
type StandardScenario =
  | (typeof data.noRedundancy)[number]
  | typeof data.zeroRedundancy;

async function locationInput(
  locationComponent: LocationComponent,
  location: string,
) {
  await (await locationComponent.locationCheckbox(location)).click();
  await locationComponent.continueButton.click();
}

async function dateOfBirthInput(
  dateOfBirthComponent: DateOfBirthComponent,
  dateOfBirth: { day: string; month: string; year: string },
) {
  await dateOfBirthComponent.dayInput.fill(dateOfBirth.day);
  await dateOfBirthComponent.monthInput.fill(dateOfBirth.month);
  await dateOfBirthComponent.yearInput.fill(dateOfBirth.year);
  await dateOfBirthComponent.continueButton.click();
}

async function redundantDateInput(
  redundantComponent: RedundantComponent,
  date: { month: string; year: string },
) {
  await redundantComponent.monthInput.fill(date.month);
  await redundantComponent.yearInput.fill(date.year);
  await redundantComponent.continueButton.click();
}

async function employerDateInput(
  employerDateComponent: EmployerDateComponent,
  date: { month: string; year: string },
) {
  await employerDateComponent.monthInput.fill(date.month);
  await employerDateComponent.yearInput.fill(date.year);
  await employerDateComponent.continueButton.click();
}

async function incomeInput(
  incomeComponent: IncomeComponent,
  income: { salary: string; frequency: string },
) {
  await incomeComponent.salaryInput.fill(income.salary);
  await incomeComponent.frequency.selectOption(income.frequency);
  await incomeComponent.continueButton.click();
}

async function redundancyOptionInput(
  redundancyOptionComponent: RedundancyOptionComponent,
  redundancyOption: string,
) {
  await (
    await redundancyOptionComponent.redundancySelect(redundancyOption)
  ).click();
  await redundancyOptionComponent.continueButton.click();
}

async function validateAnswers(
  answersComponent: AnswersComponent,
  answers: {
    location: string;
    dateOfBirth: string;
    employerDate: string;
    income: string;
    redundancy: string;
  },
  redundancyDate: string,
) {
  await expect(answersComponent.location).toContainText(answers.location);
  await expect(answersComponent.dateOfBirth).toContainText(answers.dateOfBirth);
  await expect(answersComponent.redundantDate).toContainText(redundancyDate);
  await expect(answersComponent.employerDate).toContainText(
    answers.employerDate,
  );
  await expect(answersComponent.income).toContainText(answers.income);
  await expect(answersComponent.redundancyOption).toContainText(
    answers.redundancy,
  );
  await answersComponent.continueButton.click();
}

async function validateResults(
  resultsComponent: ResultsComponent,
  results: { redundancy: string; salary: string; months: string },
) {
  await expect(
    resultsComponent.statutoryPayValue(results.redundancy),
  ).toBeVisible();
  await expect(resultsComponent.salary).toContainText(results.salary);
  await expect(resultsComponent.months).toContainText(results.months);
}

async function completeStandardScenario(
  scenario: StandardScenario,
  locationComponent: LocationComponent,
  dateOfBirthComponent: DateOfBirthComponent,
  redundantComponent: RedundantComponent,
  employerDateComponent: EmployerDateComponent,
  incomeComponent: IncomeComponent,
  redundancyOptionComponent: RedundancyOptionComponent,
  answersComponent: AnswersComponent,
  resultsComponent: ResultsComponent,
  redundancyDate: RedundancyDate,
) {
  await locationInput(locationComponent, scenario.inputs.location);
  await dateOfBirthInput(dateOfBirthComponent, scenario.inputs.dateOfBirth);
  await redundantDateInput(redundantComponent, redundancyDate);
  await employerDateInput(
    employerDateComponent,
    scenario.inputs.employmentDate,
  );
  await incomeInput(incomeComponent, scenario.inputs.income);
  await redundancyOptionInput(
    redundancyOptionComponent,
    scenario.inputs.redundancy.redundancyOption,
  );
  await validateAnswers(
    answersComponent,
    scenario.inputs.answers,
    redundancyDate.display,
  );
  await validateResults(resultsComponent, scenario.inputs.results);
}

test.describe('Redundancy Pay Calculator', () => {
  /**
   * @tests 58762 - Lives in England, age is around 25 years, less than 2 years with current employer, salary £11999 per year & No contractual redundancy pay
   * @tests 57371 - Lives in Scotland, age between 25-50 years, just 2 years with current employer, salary £765 per week & No contractual redundancy pay
   * @tests 58767 - Lives in Wales, age between 50-65 years, more than 5 years with current employer, salary £1890.89 per month & contractual redundancy pay- I don't know
   * @tests 58781 - Lives in England, age is around 75 years, less than 2 years with current employer, Income before tax -£88981 Yearly & contractual redundancy pay- I do not know
   * @tests 58779 - Lives in Northern Ireland, age between 60-70 years, more than 10 years with current employer, Income before tax -£56789.56 Yearly & contractual redundancy pay- £123,456,789
   */
  test.beforeEach(async ({ setCookieControl }) => {
    await setCookieControl();
  });

  for (const scenario of data.noRedundancy) {
    test(
      scenario.testName,
      async ({
        page,
        locationComponent,
        dateOfBirthComponent,
        redundantComponent,
        employerDateComponent,
        incomeComponent,
        redundancyOptionComponent,
        answersComponent,
        resultsComponent,
      }) => {
        await page.goto(`/en/question-1`);
        const redundancyDate = getRedundancyDate();

        await completeStandardScenario(
          scenario,
          locationComponent,
          dateOfBirthComponent,
          redundantComponent,
          employerDateComponent,
          incomeComponent,
          redundancyOptionComponent,
          answersComponent,
          resultsComponent,
          redundancyDate,
        );
        await expect(
          resultsComponent.statutoryPayValue(
            scenario.inputs.results.redundancy,
          ),
        ).toBeVisible();
      },
    );
  }

  test(
    data.zeroRedundancy.testName,
    async ({
      page,
      locationComponent,
      dateOfBirthComponent,
      redundantComponent,
      employerDateComponent,
      incomeComponent,
      redundancyOptionComponent,
      answersComponent,
      resultsComponent,
    }) => {
      await page.goto(`/en/question-1`);
      const redundancyDate = getRedundancyDate();

      await completeStandardScenario(
        data.zeroRedundancy,
        locationComponent,
        dateOfBirthComponent,
        redundantComponent,
        employerDateComponent,
        incomeComponent,
        redundancyOptionComponent,
        answersComponent,
        resultsComponent,
        redundancyDate,
      );

      await expect(resultsComponent.calloutTitle).toContainText(
        data.zeroRedundancy.inputs.results.cardTitle,
      );
      await expect(resultsComponent.statutoryMessage).toContainText(
        data.zeroRedundancy.inputs.results.message,
      );
    },
  );

  test(
    data.withRedundancy.testName,
    async ({
      page,
      locationComponent,
      dateOfBirthComponent,
      redundantComponent,
      employerDateComponent,
      incomeComponent,
      redundancyOptionComponent,
      redundancyAmountComponent,
      answersComponent,
      resultsComponent,
    }) => {
      await page.goto(`/en/question-1`);
      const redundancyDate = getRedundancyDate();

      await locationInput(
        locationComponent,
        data.withRedundancy.inputs.location,
      );
      await dateOfBirthInput(
        dateOfBirthComponent,
        data.withRedundancy.inputs.dateOfBirth,
      );
      await redundantDateInput(redundantComponent, redundancyDate);
      await employerDateInput(
        employerDateComponent,
        data.withRedundancy.inputs.employmentDate,
      );
      await incomeInput(incomeComponent, data.withRedundancy.inputs.income);
      await redundancyOptionInput(
        redundancyOptionComponent,
        data.withRedundancy.inputs.redundancy.redundancyOption,
      );

      await redundancyAmountComponent.redundancyAmount.fill(
        data.withRedundancy.inputs.answers.redundancyAmount,
      );
      await redundancyAmountComponent.continueButton.click();

      await expect(answersComponent.redundancyPay).toContainText(
        data.withRedundancy.inputs.answers.redundancyAmount,
      );

      await validateAnswers(
        answersComponent,
        data.withRedundancy.inputs.answers,
        redundancyDate.display,
      );

      await validateResults(
        resultsComponent,
        data.withRedundancy.inputs.results,
      );

      await expect(resultsComponent.pageTitle).toContainText(
        data.withRedundancy.inputs.results.title,
      );
      await expect(resultsComponent.statutoryTitle).toContainText(
        data.withRedundancy.inputs.results.subtitle,
      );
    },
  );
});
