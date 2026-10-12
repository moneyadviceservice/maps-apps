import { StepName } from '@app/lib/constants';
import { UKPensionPage } from '@pages/Eligibility';

import { expect, test } from '../../fixtures/test.fixtures';
import { assertErrorSummary, assertInlineError } from '../../helpers';

let ukPensionsPage: UKPensionPage;

test.describe('UK Pensions', () => {
  /**
   * @tests 59446 - Leave all radio buttons unselected and click "Continue"
   * @tests 59446 - Select the "Yes" radio button and click "Continue"
   * @tests 59446 - Select the "No, I have a different type of pension" radio button and click "Continue"
   */

  test.beforeEach(async ({ page }) => {
    ukPensionsPage = new UKPensionPage(page);
  });

  test('shows errors for empty uk pensions selection', async ({ page }) => {
    // Arrange
    await ukPensionsPage.goToUKPension();

    // Act
    await ukPensionsPage.submitForm();

    // Assert
    await page.waitForURL(`/en/${StepName.ELIGIBILITY_UK_PENSIONS}`, {
      timeout: 20000,
    });
    await expect(page).toHaveURL(
      new RegExp(`/en/${StepName.ELIGIBILITY_UK_PENSIONS}`),
    );
    await assertErrorSummary(page);
    await assertInlineError(page, 'question-radio');
  });

  test('routes to Eligibility Over 50 when "Yes" is selected', async ({
    page,
  }) => {
    // Arrange
    await ukPensionsPage.goToUKPension();

    // Act
    await ukPensionsPage.selectAnswerAndContinue('Yes');

    // Assert
    await page.waitForURL(`/en/${StepName.ACCESS_SUPPORT}`, {
      timeout: 20000,
    });
    await expect(page).toHaveURL(`/en/${StepName.ACCESS_SUPPORT}`);
    await expect(
      page.getByTestId(`${StepName.ACCESS_SUPPORT}-title`),
    ).toBeVisible();
  });

  test('routes to Pension Wise Not Eligible when "No, I have a different type of pension" is selected', async ({
    page,
  }) => {
    // Arrange
    await ukPensionsPage.goToUKPension();

    // Act
    await ukPensionsPage.selectAnswerAndContinue('No');

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
    await ukPensionsPage.goToUKPension();

    // Act
    await ukPensionsPage.clickBack();

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
