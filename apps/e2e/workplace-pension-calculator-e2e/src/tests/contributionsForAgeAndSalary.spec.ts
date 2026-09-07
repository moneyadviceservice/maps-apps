import { expect, test } from '@lib/test.lib';
import { YourDetailsComponent } from '@pages/components/YourDetails.component';
import { YourResultsComponent } from '@pages/components/YourResults.component';

import testData from '../data/workplacePensionCalculator.json';

type Scenario = (typeof testData.testCases)[number];

async function inputAndValidateDetails(
  yourDetailsComponent: YourDetailsComponent,
  scenario: Scenario,
) {
  await yourDetailsComponent.ageInput.fill(scenario.age);
  if (scenario.ageValidationMessage) {
    await expect(
      yourDetailsComponent.getLocatorByText(scenario.ageValidationMessage),
    ).toBeVisible();
  }

  await yourDetailsComponent.salaryInput.fill(scenario.salary);
  await yourDetailsComponent.salaryFrequencyDropdown.selectOption(
    scenario.salaryFrequency,
  );
}

async function validateContributionsTable(
  yourResultsComponent: YourResultsComponent,
  scenario: Scenario,
) {
  for (const contribution of scenario.contributions) {
    const {
      duration,
      durationType,
      employeeContribution,
      taxRelief,
      employerContribution,
      totalContribution,
    } = contribution;

    await yourResultsComponent.frequencyDropdown.selectOption(duration);
    await expect(
      yourResultsComponent.employeeContributionTableHeader,
    ).toContainText(`Your ${durationType} contribution`);
    await expect(yourResultsComponent.employeeContributionPrice).toContainText(
      employeeContribution,
    );
    await expect(
      yourResultsComponent.employeeContributionTaxValue,
    ).toContainText(`(includes tax relief ${taxRelief})`);
    await expect(
      yourResultsComponent.employerContributionTableHeader,
    ).toContainText(`Employers ${durationType} contribution`);
    await expect(yourResultsComponent.employerContributionPrice).toContainText(
      employerContribution,
    );
    await expect(
      yourResultsComponent.totalContributionTableHeader,
    ).toContainText(`Total ${durationType} contributions`);
    await expect(yourResultsComponent.totalContributionPrice).toContainText(
      totalContribution,
    );
  }
}

test.describe('Workplace Pension Calculator', () => {
  test.beforeEach(async ({ startCalculatorPage, setCookieControl }) => {
    await setCookieControl();
    await startCalculatorPage.goto('/en/workplace-pension-calculator');
    await startCalculatorPage.startCalculatorButton.click();
  });

  /**
   * @tests 55886 - Should show contributions for each age and salary
   */
  for (const scenario of testData.testCases as Scenario[]) {
    test(`Should Show Contributions For ${scenario.label}`, async ({
      yourDetailsComponent,
      yourContributionsComponent,
      yourResultsComponent,
    }) => {
      await inputAndValidateDetails(yourDetailsComponent, scenario);
      await yourDetailsComponent
        .salaryContributionCheckbox(scenario.contributionType)
        .click();
      await yourDetailsComponent.submitButton.click();
      await expect(
        yourContributionsComponent.yourContributionsMessage,
      ).toContainText(scenario.contributionsMessage);
      await yourContributionsComponent.employeeContribution.fill(
        scenario.employeeContribution,
      );
      await yourContributionsComponent.employerContribution.fill(
        scenario.employerContribution,
      );
      await yourContributionsComponent.submitButton.click();
      await expect(yourResultsComponent.resultsMessage).toContainText(
        scenario.resultsMessage,
      );

      await validateContributionsTable(yourResultsComponent, scenario);
    });
  }
});
