import testData from '@data/genericPensionCalculatorData.json';
import { expect, test } from '@lib/test.lib';

const data = testData.printEmailReset;

test.describe('Workplace Pension Calculator accessibility', () => {
  test.beforeEach(async ({ setCookieControl }) => {
    await setCookieControl();
  });

  for (const language of ['en', 'cy'] as const) {
    test.describe(`${language}`, () => {
      test.beforeEach(async ({ startCalculatorPage, yourDetailsComponent }) => {
        await startCalculatorPage.goto(
          `/${language}/workplace-pension-calculator`,
        );
        await startCalculatorPage.startCalculatorButton.click();
        await yourDetailsComponent.waitUntilReady();
      });

      test(`Should have no accessibility violations on the ${language} age and salary page`, async ({
        yourDetailsComponent,
      }) => {
        expect(await yourDetailsComponent.getAccessibilityViolations()).toEqual(
          [],
        );
      });

      test(`Should have no accessibility violations on the ${language} contributions page`, async ({
        yourDetailsComponent,
        yourContributionsComponent,
      }) => {
        await yourDetailsComponent.ageInput.fill(data.testData.age);
        await yourDetailsComponent.salaryInput.fill(data.testData.salary);
        await yourDetailsComponent.submitButton.click();
        await expect(
          yourContributionsComponent.yourContributionsMessage,
        ).toBeVisible();

        expect(
          await yourContributionsComponent.getAccessibilityViolations(),
        ).toEqual([]);
      });

      test(`Should have no accessibility violations on the ${language} results page`, async ({
        yourDetailsComponent,
        yourContributionsComponent,
        yourResultsComponent,
      }) => {
        await yourDetailsComponent.ageInput.fill(data.testData.age);
        await yourDetailsComponent.salaryInput.fill(data.testData.salary);
        await yourDetailsComponent.submitButton.click();
        await expect(
          yourContributionsComponent.yourContributionsMessage,
        ).toBeVisible();
        await yourContributionsComponent.submitButton.click();
        await expect(yourResultsComponent.resultsMessage).toBeVisible();

        expect(await yourResultsComponent.getAccessibilityViolations()).toEqual(
          [],
        );
      });
    });
  }
});
