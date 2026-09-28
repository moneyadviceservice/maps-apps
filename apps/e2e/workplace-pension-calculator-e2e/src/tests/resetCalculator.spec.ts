import { expect, test } from '@lib/test.lib';

import testData from '../data/genericPensionCalculatorData.json';

const data = testData.printEmailReset;

test.describe('Workplace Pension Calculator', () => {
  test.beforeEach(async ({ startCalculatorPage, setCookieControl }) => {
    await setCookieControl();
    await startCalculatorPage.goto('/en/workplace-pension-calculator');
    await startCalculatorPage.startCalculatorButton.click();
  });

  /**
   * @tests 55902 - Should reset calculator
   */
  test('Should Reset Calculator', async ({
    yourDetailsComponent,
    yourContributionsComponent,
    yourResultsComponent,
  }) => {
    await yourDetailsComponent.ageInput.fill(data.testData.age);
    await yourDetailsComponent.salaryInput.fill(data.testData.salary);
    await yourDetailsComponent.submitButton.click();

    await expect(
      yourContributionsComponent.yourContributionsMessage,
    ).toContainText(data.messages.contributionsMessage);

    await yourContributionsComponent.submitButton.click();
    await expect(yourResultsComponent.resultsMessage).toContainText(
      data.messages.resultsMessage,
    );
    await yourResultsComponent.resetCalculatorButton.click();

    await expect(yourDetailsComponent.ageInput).toBeVisible();
    expect(yourResultsComponent.url).toContain(data.messages.resetUrl);
  });
});
