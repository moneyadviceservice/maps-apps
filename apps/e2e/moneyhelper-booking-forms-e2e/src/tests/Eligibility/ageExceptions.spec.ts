import { StepName } from '@app/lib/constants';
import { AgeExceptionsAnswer, AgeExceptionsPage } from '@pages/Eligibility';

import { expect, test } from '../../fixtures/test.fixtures';
import { assertErrorSummary, assertInlineError } from '../../helpers';

let ageExceptionsPage: AgeExceptionsPage;

test.describe('Age Exceptions', () => {
  /**
   * @tests 59547 - Leave all radio buttons unselected and click "Continue"
   * @tests 59547 - Select the "You have inherited someone else’s pension" radio button and click "Continue"
   * @tests 59547 - Select the "You are retiring early due to poor health" radio button and click "Continue"
   * @tests 59547 - Select the "Your pension scheme allows early access (protected pension age)" radio button and click "Continue"
   * @tests 59547 - Select the "None of these apply" radio button and click "Continue"
   * @tests 59547 - Click the "Back" link
   */

  test.beforeEach(async ({ page }) => {
    ageExceptionsPage = new AgeExceptionsPage(page);
  });

  test('shows errors for empty age exceptions selection', async ({ page }) => {
    // Arrange
    await ageExceptionsPage.goToEligibilityAgeExceptions();

    // Act
    await ageExceptionsPage.submitForm();

    // Assert
    await page.waitForURL(`/en/${StepName.ELIGIBILITY_AGE_EXCEPTIONS}`, {
      timeout: 20000,
    });
    await expect(page).toHaveURL(
      new RegExp(`/en/${StepName.ELIGIBILITY_AGE_EXCEPTIONS}`),
    );
    await assertErrorSummary(page);
    await assertInlineError(page, 'question-radio');
  });

  test(`routes to UK Pension page when ${AgeExceptionsAnswer.InheritedPension} is selected`, async ({
    page,
  }) => {
    // Arrange
    await ageExceptionsPage.goToEligibilityAgeExceptions();

    // Act
    await ageExceptionsPage.selectAnswerAndContinue(
      AgeExceptionsAnswer.InheritedPension,
    );

    // Assert
    await page.waitForURL(`/en/${StepName.ELIGIBILITY_UK_PENSIONS}`, {
      timeout: 20000,
    });
    await expect(page).toHaveURL(`/en/${StepName.ELIGIBILITY_UK_PENSIONS}`);
    await expect(
      page.getByTestId(`${StepName.ELIGIBILITY_UK_PENSIONS}-title`),
    ).toBeVisible();
  });

  test(`routes to UK Pension page when ${AgeExceptionsAnswer.PoorHealth} is selected`, async ({
    page,
  }) => {
    // Arrange
    await ageExceptionsPage.goToEligibilityAgeExceptions();

    // Act
    await ageExceptionsPage.selectAnswerAndContinue(
      AgeExceptionsAnswer.PoorHealth,
    );

    // Assert
    await page.waitForURL(`/en/${StepName.ELIGIBILITY_UK_PENSIONS}`, {
      timeout: 20000,
    });
    await expect(page).toHaveURL(`/en/${StepName.ELIGIBILITY_UK_PENSIONS}`);
    await expect(
      page.getByTestId(`${StepName.ELIGIBILITY_UK_PENSIONS}-title`),
    ).toBeVisible();
  });

  test(`routes to UK Pension page when ${AgeExceptionsAnswer.ProtectedPensionAge} is selected`, async ({
    page,
  }) => {
    // Arrange
    await ageExceptionsPage.goToEligibilityAgeExceptions();

    // Act
    await ageExceptionsPage.selectAnswerAndContinue(
      AgeExceptionsAnswer.ProtectedPensionAge,
    );

    // Assert
    await page.waitForURL(`/en/${StepName.ELIGIBILITY_UK_PENSIONS}`, {
      timeout: 20000,
    });
    await expect(page).toHaveURL(`/en/${StepName.ELIGIBILITY_UK_PENSIONS}`);
    await expect(
      page.getByTestId(`${StepName.ELIGIBILITY_UK_PENSIONS}-title`),
    ).toBeVisible();
  });

  test(`routes to Pension Wise Not Eligible when ${AgeExceptionsAnswer.None} is selected`, async ({
    page,
  }) => {
    // Arrange
    await ageExceptionsPage.goToEligibilityAgeExceptions();

    // Act
    await ageExceptionsPage.selectAnswerAndContinue(AgeExceptionsAnswer.None);

    // Assert
    await page.waitForURL(`/en/${StepName.PENSION_WISE_NOT_ELIGIBLE}`, {
      timeout: 20000,
    });
    await expect(page).toHaveURL(`/en/${StepName.PENSION_WISE_NOT_ELIGIBLE}`);
    await expect(
      page.getByTestId(`${StepName.PENSION_WISE_NOT_ELIGIBLE}-title`),
    ).toBeVisible();
  });

  test('routes to the Over 50 page when back is clicked', async ({ page }) => {
    // Arrange
    await ageExceptionsPage.goToEligibilityAgeExceptions();

    // Act
    await ageExceptionsPage.clickBack();

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
});
