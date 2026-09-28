import { expect, test } from '@lib/test.lib';

import testData from '../data/genericPensionCalculatorData.json';

const underAgeData = testData.ageValidation.underAge.testData;
const overAgeData = testData.ageValidation.overAge.testData;

test.describe('Workplace Pension Calculator', () => {
  test.beforeEach(async ({ startCalculatorPage, setCookieControl }) => {
    await setCookieControl();
    await startCalculatorPage.goto('/en/workplace-pension-calculator');
    await startCalculatorPage.startCalculatorButton.click();
  });

  /**
   * @tests 55890 - Should disable pension calculator for age below 16
   */
  test(`Should Disable Pension Calculator For Age Below ${underAgeData.age}`, async ({
    yourDetailsComponent,
  }) => {
    await yourDetailsComponent.ageInput.fill(underAgeData.age);
    await expect(yourDetailsComponent.ageMessage).toContainText(
      underAgeData.message,
    );
    await expect(yourDetailsComponent.submitButton).toBeDisabled();
  });

  /**
   * @tests 55891 - Should disable pension calculator for age 75 or above
   */
  test(`Should Disable Pension Calculator For Age ${overAgeData.age} Or Above`, async ({
    yourDetailsComponent,
  }) => {
    await yourDetailsComponent.ageInput.fill(overAgeData.age);
    await expect(yourDetailsComponent.ageMessage).toContainText(
      overAgeData.message,
    );

    await expect(yourDetailsComponent.submitButton).toBeDisabled();
    await yourDetailsComponent.ageInput.clear();
    await yourDetailsComponent.ageInput.fill(overAgeData.editAge);
    await expect(yourDetailsComponent.ageMessage).toContainText(
      overAgeData.message,
    );

    await expect(yourDetailsComponent.submitButton).toBeDisabled();
  });
});
