import { expect, test } from '@lib/test.lib';
import { DateOfBirthComponent } from '@pages/components/date-of-birth.component';
import { EmployerDateComponent } from '@pages/components/employer-date.component';
import { ErrorComponent } from '@pages/components/error.component';
import { IncomeComponent } from '@pages/components/income.component';
import { LocationComponent } from '@pages/components/location.component';
import { RedundantComponent } from '@pages/components/redundant-date.component';

import testData from '../data/redundancyData.json';
import { getRedundancyDate } from '../helpers/date-generator';
const data = testData.errors;

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

async function validateError(
  errorComponent: ErrorComponent,
  errorMessage: string,
) {
  await expect(errorComponent.errorTitle).toContainText(data.errorTitle);
  await expect(errorComponent.errorMessage).toContainText(errorMessage);
  await expect(errorComponent.errorMessage).toHaveAttribute('href');
  await errorComponent.errorMessage.click();
}

test.describe('Redundancy Pay Calculator', () => {
  /**
   * @tests 58782 - Verify error message and link - When where you live in the UK is not selected
   * @tests 58789 - Verify error message and link - When date of birth is not entered
   * @tests 58793 - Verify error message - When date of birth is below 15 years
   * @tests 58794 - Verify error message - When redundant date is not entered
   * @tests 58795 - Verify error message - When employment start date is not entered
   * @tests 58799 - Verify error message - When salary is not entered
   * @tests 58800 - Verify error message - When contractual redundancy pay option is not selected
   * @tests 58801 - Verify error message - When contractual redundancy pay is not entered
   */
  test.beforeEach(async ({ setCookieControl }) => {
    await setCookieControl();
  });

  test('Verify error message and link - When where you live in the UK is not selected', async ({
    page,
    locationComponent,
    errorComponent,
  }) => {
    await page.goto(`/en/question-1`);
    await locationComponent.continueButton.click();
    await validateError(errorComponent, data.testOne.message);
    await expect(
      await locationComponent.locationHighlighted('England'),
    ).toBeFocused();
  });

  test('Verify error message and link - When date of birth is not entered', async ({
    page,
    locationComponent,
    dateOfBirthComponent,
    errorComponent,
  }) => {
    await page.goto(`/en/question-1`);
    await locationInput(locationComponent, data.testTwo.location);
    await dateOfBirthComponent.continueButton.click();
    await validateError(errorComponent, data.testTwo.message);
    await expect(await dateOfBirthComponent.dayInput).toBeFocused();
  });

  test('Verify error message - When date of birth is below 15 years', async ({
    page,
    locationComponent,
    dateOfBirthComponent,
    errorComponent,
  }) => {
    await page.goto(`/en/question-1`);
    await locationInput(locationComponent, data.testThree.location);
    await dateOfBirthInput(dateOfBirthComponent, data.testThree.dateOfBirth);
    await validateError(errorComponent, data.testThree.message);
  });

  test('Verify error message - When redundant date is not entered', async ({
    page,
    locationComponent,
    dateOfBirthComponent,
    redundantComponent,
    errorComponent,
  }) => {
    await page.goto(`/en/question-1`);
    await locationInput(locationComponent, data.testFour.location);
    await dateOfBirthInput(dateOfBirthComponent, data.testFour.dateOfBirth);
    await redundantComponent.continueButton.click();
    await validateError(errorComponent, data.testFour.message);
    await expect(await redundantComponent.monthInput).toBeFocused();
  });

  test('Verify error message - When employment start date is not entered', async ({
    page,
    locationComponent,
    dateOfBirthComponent,
    redundantComponent,
    employerDateComponent,
    errorComponent,
  }) => {
    await page.goto(`/en/question-1`);
    const redundancyDate = getRedundancyDate();
    await locationInput(locationComponent, data.testFive.location);
    await dateOfBirthInput(dateOfBirthComponent, data.testFive.dateOfBirth);
    await redundantDateInput(redundantComponent, redundancyDate);
    await employerDateComponent.continueButton.click();
    await validateError(errorComponent, data.testFive.message);
    await expect(await employerDateComponent.monthInput).toBeFocused();
  });

  test('Verify error message - When salary is not entered', async ({
    page,
    locationComponent,
    dateOfBirthComponent,
    redundantComponent,
    employerDateComponent,
    incomeComponent,
    errorComponent,
  }) => {
    await page.goto(`/en/question-1`);
    const redundancyDate = getRedundancyDate();
    await locationInput(locationComponent, data.testSix.location);
    await dateOfBirthInput(dateOfBirthComponent, data.testSix.dateOfBirth);
    await redundantDateInput(redundantComponent, redundancyDate);
    await employerDateInput(employerDateComponent, data.testSix.employmentDate);
    await incomeComponent.continueButton.click();
    await validateError(errorComponent, data.testSix.message);
    await expect(await incomeComponent.salaryInput).toBeFocused();
  });

  test('Verify error message - When contractual redundancy pay option is not selected', async ({
    page,
    locationComponent,
    dateOfBirthComponent,
    redundantComponent,
    employerDateComponent,
    incomeComponent,
    redundancyOptionComponent,
    errorComponent,
  }) => {
    await page.goto(`/en/question-1`);
    const redundancyDate = getRedundancyDate();
    await locationInput(locationComponent, data.testSeven.location);
    await dateOfBirthInput(dateOfBirthComponent, data.testSeven.dateOfBirth);
    await redundantDateInput(redundantComponent, redundancyDate);
    await employerDateInput(
      employerDateComponent,
      data.testSeven.employmentDate,
    );
    await incomeInput(incomeComponent, data.testSeven.income);
    await redundancyOptionComponent.continueButton.click();
    await validateError(errorComponent, data.testSeven.message);
    await expect(
      await redundancyOptionComponent.redundancyHighlighted(
        data.testSeven.redundancy.redundancyOption,
      ),
    ).toBeFocused();
  });

  test('Verify error message - When contractual redundancy pay is not entered', async ({
    page,
    locationComponent,
    dateOfBirthComponent,
    redundantComponent,
    employerDateComponent,
    incomeComponent,
    redundancyOptionComponent,
    redundancyAmountComponent,
    errorComponent,
  }) => {
    await page.goto(`/en/question-1`);
    const redundancyDate = getRedundancyDate();
    await locationInput(locationComponent, data.testEight.location);
    await dateOfBirthInput(dateOfBirthComponent, data.testEight.dateOfBirth);
    await redundantDateInput(redundantComponent, redundancyDate);
    await employerDateInput(
      employerDateComponent,
      data.testEight.employmentDate,
    );
    await incomeInput(incomeComponent, data.testEight.income);
    await (
      await redundancyOptionComponent.redundancySelect(
        data.testEight.redundancy.redundancyOption,
      )
    ).click();
    await redundancyOptionComponent.continueButton.click();
    await redundancyAmountComponent.continueButton.click();
    await validateError(errorComponent, data.testEight.message);
    await expect(redundancyAmountComponent.redundancyAmount).toBeFocused();
  });
});
