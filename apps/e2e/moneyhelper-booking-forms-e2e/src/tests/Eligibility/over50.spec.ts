import { StepName } from '@app/lib/constants';
import { Over50Page } from '@pages/Eligibility';

import { expect, test } from '../../fixtures/test.fixtures';
import { assertErrorSummary, assertInlineError } from '../../helpers';

let over50Page: Over50Page;

test.describe('Over 50', () => {
  /**
   * @tests 59411 - Leave all radio buttons unselected and click "Continue"
   * @tests 59411 - Select the "Yes" radio button and click "Continue"
   * @tests 59411 - Select the "No" radio button and click "Continue"
   * @tests 59411 - Click the "Back" link
   */

  test.beforeEach(async ({ page }) => {
    over50Page = new Over50Page(page);
  });

  test('shows errors for empty over 50 selection', async ({ page }) => {
    // Arrange
    await over50Page.goToEligibilityOver50();

    // Act
    await over50Page.submitForm();

    // Assert
    await page.waitForURL(`/en/${StepName.ELIGIBILITY_OVER_50}`, {
      timeout: 20000,
    });
    await expect(page).toHaveURL(
      new RegExp(`/en/${StepName.ELIGIBILITY_OVER_50}`),
    );
    await assertErrorSummary(page);
    await assertInlineError(page, 'question-radio');
  });

  test('routes to the Eligibility UK Pensions page when "Yes" is selected', async ({
    page,
  }) => {
    // Arrange
    await over50Page.goToEligibilityOver50();

    // Act
    await over50Page.selectAnswerAndContinue('Yes');

    // Assert
    await page.waitForURL(`/en/${StepName.ELIGIBILITY_UK_PENSIONS}`, {
      timeout: 20000,
    });
    await expect(page).toHaveURL(
      new RegExp(`/en/${StepName.ELIGIBILITY_UK_PENSIONS}`),
    );
    await expect(
      page.getByTestId(`${StepName.ELIGIBILITY_UK_PENSIONS}-title`),
    ).toBeVisible();
  });

  test('routes to the Eligibility Age Exceptions page when "No" is selected', async ({
    page,
  }) => {
    // Arrange
    await over50Page.goToEligibilityOver50();

    // Act
    await over50Page.selectAnswerAndContinue('No');

    // Assert
    await page.waitForURL(`/en/${StepName.ELIGIBILITY_AGE_EXCEPTIONS}`, {
      timeout: 20000,
    });
    await expect(page).toHaveURL(
      new RegExp(`/en/${StepName.ELIGIBILITY_AGE_EXCEPTIONS}`),
    );
    await expect(
      page.getByTestId(`${StepName.ELIGIBILITY_AGE_EXCEPTIONS}-title`),
    ).toBeVisible();
  });

  test('routes to the Eligibility Defined Contribution page when back is clicked', async ({
    page,
  }) => {
    // Arrange
    await over50Page.goToEligibilityOver50();

    // Act
    await over50Page.clickBack();

    // Assert
    await page.waitForURL(`/en/${StepName.ELIGIBILITY_DEFINED_CONTRIBUTION}`, {
      timeout: 20000,
    });
    await expect(page).toHaveURL(
      new RegExp(`/en/${StepName.ELIGIBILITY_DEFINED_CONTRIBUTION}`),
    );
    await expect(
      page.getByTestId(`${StepName.ELIGIBILITY_DEFINED_CONTRIBUTION}-title`),
    ).toBeVisible();
  });
});
