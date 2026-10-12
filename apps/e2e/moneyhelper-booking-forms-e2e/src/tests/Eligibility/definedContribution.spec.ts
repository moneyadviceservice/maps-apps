import { StepName } from '@app/lib/constants';
import { DefinedContributionPage } from '@pages/Eligibility';

import { expect, test } from '../../fixtures/test.fixtures';
import { assertErrorSummary, assertInlineError } from '../../helpers';

let definedContributionPage: DefinedContributionPage;

test.describe('Defined Contribution', () => {
  /**
   * @tests 59290 - Leave all radio buttons unselected and click "Continue"
   * @tests 59290 - Select the "Yes" radio button and click "Continue"
   * @tests 59290 - Select the "No, I have a different type of pension" radio button and click "Continue"
   * @tests 59290 - Select the "Not sure" radio button and click "Continue"
   */

  test.beforeEach(async ({ page }) => {
    definedContributionPage = new DefinedContributionPage(page);
  });

  test('shows errors for empty defined contribution selection', async ({
    page,
  }) => {
    // Arrange
    await definedContributionPage.goToEligibilityDefinedContribution();

    // Act
    await definedContributionPage.submitForm();

    // Assert
    await page.waitForURL(`/en/${StepName.ELIGIBILITY_DEFINED_CONTRIBUTION}`, {
      timeout: 20000,
    });
    await expect(page).toHaveURL(
      new RegExp(`/en/${StepName.ELIGIBILITY_DEFINED_CONTRIBUTION}`),
    );
    await assertErrorSummary(page);
    await assertInlineError(page, 'question-radio');
  });

  test('routes to Eligibility Over 50 when "Yes" is selected', async ({
    page,
  }) => {
    // Arrange
    await definedContributionPage.goToEligibilityDefinedContribution();

    // Act
    await definedContributionPage.selectAnswerAndContinue('Yes');

    // Assert
    await page.waitForURL(`/en/${StepName.ELIGIBILITY_OVER_50}`, {
      timeout: 20000,
    });
    await expect(page).toHaveURL(
      new RegExp(`/en/${StepName.ELIGIBILITY_OVER_50}`),
    );
    await expect(
      page.getByTestId(`${StepName.ELIGIBILITY_OVER_50}-title`),
    ).toBeVisible();
  });

  test('routes to Eligibility Over 50 when "Not sure" is selected', async ({
    page,
  }) => {
    // Arrange
    await definedContributionPage.goToEligibilityDefinedContribution();

    // Act
    await definedContributionPage.selectAnswerAndContinue('Not sure');

    // Assert
    await page.waitForURL(`/en/${StepName.ELIGIBILITY_OVER_50}`, {
      timeout: 20000,
    });
    await expect(page).toHaveURL(
      new RegExp(`/en/${StepName.ELIGIBILITY_OVER_50}`),
    );
    await expect(
      page.getByTestId(`${StepName.ELIGIBILITY_OVER_50}-title`),
    ).toBeVisible();
  });

  test('routes to Pension Wise Not Eligible when "No, I have a different type of pension" is selected', async ({
    page,
  }) => {
    // Arrange
    await definedContributionPage.goToEligibilityDefinedContribution();

    // Act
    await definedContributionPage.selectAnswerAndContinue(
      'No, I have a different type of pension',
    );

    // Assert
    await page.waitForURL(`/en/${StepName.PENSION_WISE_NOT_ELIGIBLE}`, {
      timeout: 20000,
    });
    await expect(page).toHaveURL(
      new RegExp(`/en/${StepName.PENSION_WISE_NOT_ELIGIBLE}`),
    );
    await expect(
      page.getByTestId(`${StepName.PENSION_WISE_NOT_ELIGIBLE}-title`),
    ).toBeVisible();
  });
});
