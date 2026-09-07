import { expect, test } from '@lib/test.lib';
import { YourContributionsComponent } from '@pages/components/YourContributions.component';
import { YourDetailsComponent } from '@pages/components/YourDetails.component';
import { YourResultsComponent } from '@pages/components/YourResults.component';

import testData from '../data/genericPensionCalculatorData.json';

const data = testData.belowThreshold;

async function inputAndValidateYourDetails(
  yourDetailsComponent: YourDetailsComponent,
) {
  await yourDetailsComponent.ageInput.fill(data.testData.age);
  await expect(yourDetailsComponent.ageMessage).toContainText(
    data.messages.ageMessage,
  );

  await yourDetailsComponent.salaryInput.fill(data.testData.salary);
  await yourDetailsComponent.salaryFrequencyDropdown.selectOption(
    data.testData.frequency,
  );
  await expect(yourDetailsComponent.salaryPrimaryMessage).toContainText(
    data.messages.salaryMessages.primaryMessage,
  );
  await expect(yourDetailsComponent.salarySecondaryMessage).toContainText(
    data.messages.salaryMessages.secondaryMessage,
  );
  await expect(
    yourDetailsComponent.fullSalaryContributionCheckbox,
  ).toBeChecked();
  await expect(
    yourDetailsComponent.partSalaryContributionCheckbox,
  ).not.toBeChecked();
  await expect(
    yourDetailsComponent.partSalaryContributionCheckbox,
  ).toBeDisabled();
}

async function editAndValidateContributions(
  yourContributionsComponent: YourContributionsComponent,
) {
  await yourContributionsComponent.employeeContribution.fill('1');
  await expect(yourContributionsComponent.totalContributionError).toContainText(
    data.messages.contributionsMessages.totalContributionError,
  );
  await yourContributionsComponent.employeeContribution.fill('5');
  await expect(yourContributionsComponent.totalContributionError).toBeHidden();

  await yourContributionsComponent.employerContribution.fill('2');

  await expect(
    yourContributionsComponent.employerContributionError,
  ).toContainText(
    data.messages.contributionsMessages.employerContributionError,
  );

  await yourContributionsComponent.employerContribution.fill('3');
  await expect(
    yourContributionsComponent.employerContributionError,
  ).toBeHidden();
}

async function validateResultsTableData(
  yourResultsComponent: YourResultsComponent,
) {
  await expect(yourResultsComponent.resultsMessage).toContainText(
    data.messages.contributionsMessages.resultMessage,
  );

  await expect(yourResultsComponent.frequencyDropdown).toHaveValue('12');

  await expect(
    yourResultsComponent.employeeContributionTableHeader,
  ).toContainText(`Your ${data.contributionValues.duration} contribution`);

  await expect(yourResultsComponent.employeeContributionPrice).toContainText(
    data.contributionValues.employeeContribution,
  );
  await expect(yourResultsComponent.employeeContributionTaxValue).toContainText(
    `(includes tax relief ${data.contributionValues.employeeTaxContribution})`,
  );
  await expect(
    yourResultsComponent.employerContributionTableHeader,
  ).toContainText(`Employers ${data.contributionValues.duration} contribution`);
  await expect(yourResultsComponent.employerContributionPrice).toContainText(
    data.contributionValues.employerContribution,
  );
  await expect(yourResultsComponent.totalContributionTableHeader).toContainText(
    `Total ${data.contributionValues.duration} contributions`,
  );
  await expect(yourResultsComponent.totalContributionPrice).toContainText(
    data.contributionValues.totalContribution,
  );
}

test.describe('Workplace Pension Calculator', () => {
  test.beforeEach(async ({ startCalculatorPage, setCookieControl }) => {
    await setCookieControl();
    await startCalculatorPage.goto('/en/workplace-pension-calculator');
    await startCalculatorPage.startCalculatorButton.click();
  });

  /**
   * @tests 55879 - Should show contributions for whole salary below threshold
   */
  test(`Should Show Contributions For Whole Salary Below Threshold`, async ({
    yourDetailsComponent,
    yourContributionsComponent,
    yourResultsComponent,
  }) => {
    await inputAndValidateYourDetails(yourDetailsComponent);
    await yourDetailsComponent.submitButton.click();

    await expect(
      yourContributionsComponent.yourContributionsMessage,
    ).toContainText(data.messages.contributionsMessages.contributionMessage);
    await editAndValidateContributions(yourContributionsComponent);
    await yourContributionsComponent.submitButton.click();

    await validateResultsTableData(yourResultsComponent);
  });
});
