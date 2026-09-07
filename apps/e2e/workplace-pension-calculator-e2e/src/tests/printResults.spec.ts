import { expect, test } from '@lib/test.lib';

import testData from '../data/genericPensionCalculatorData.json';

const data = testData.printEmailReset;

test.describe('Workplace Pension Calculator', () => {
  test.beforeEach(async ({ startCalculatorPage, setCookieControl, page }) => {
    await setCookieControl();

    // Add a listener to check if 'print' is called.
    await page.addInitScript(() => {
      let printCalled = false;
      window.print = () => {
        printCalled = true;
      };
      (window as any).__printCalled = () => printCalled;
    });

    await startCalculatorPage.goto('/en/workplace-pension-calculator');
    await startCalculatorPage.startCalculatorButton.click();
  });

  /**
   * @tests 55893 - Should call print on click to print
   */
  test('Validate print called when selected', async ({
    page,
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
    await yourResultsComponent.printResultsButton.click();
    await expect
      .poll(() => page.evaluate(() => (window as any).__printCalled()))
      .toBe(true);
  });
});
