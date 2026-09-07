import { expect, test } from '@lib/test.lib';
import { YourDetailsComponent } from '@pages/components/YourDetails.component';

import testData from '../data/workplacePensionCalculator.json';

async function validateSalaryMessages(
  yourDetailsComponent: YourDetailsComponent,
  messages: string[],
) {
  if (messages.length > 1) {
    await expect(yourDetailsComponent.salaryPrimaryMessage).toContainText(
      messages[0],
    );

    await expect(yourDetailsComponent.salarySecondaryMessage).toContainText(
      messages[1],
    );
  } else if (messages.length === 1) {
    await expect(yourDetailsComponent.salaryPrimaryMessage).toContainText(
      messages[0],
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
   * @tests 56089 - Should show salary validation messages
   */
  for (const scenario of testData.yourDetails.salary.testCases) {
    test(`Should Display ${scenario.label}`, async ({
      yourDetailsComponent,
    }) => {
      await yourDetailsComponent.salaryInput.fill(scenario.salary);
      await yourDetailsComponent.salaryFrequencyDropdown.selectOption(
        scenario.frequency,
      );

      const msgs = scenario.messages.map(
        (message) =>
          testData.yourDetails.salary.messages[
            message as keyof typeof testData.yourDetails.salary.messages
          ],
      );
      await validateSalaryMessages(yourDetailsComponent, msgs);
    });
  }
});
