import { StepName } from '@app/lib/constants';
import {
  assertErrorSummary,
  assertInlineError,
  expect,
  test,
} from '@mhbf-e2e/lib/test.lib';

test.describe('Over 50', () => {
  /**
- 
@tests 59411 - Leave all radio buttons unselected and click "Continue"
- 
@tests 59411 - Select the "Yes" radio button and click "Continue"
- 
@tests 59411 - Select the "No" radio button and click "Continue"
- 
@tests 59411 - Click the "Back" link
   */

  test('shows errors for empty over 50 selection', async ({
    page,
    over50Page,
  }) => {
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
    over50Page,
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
      over50Page.pageTitle(StepName.ELIGIBILITY_UK_PENSIONS),
    ).toBeVisible();
  });

  test('routes to the Eligibility Age Exceptions page when "No" is selected', async ({
    page,
    over50Page,
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
      over50Page.pageTitle(StepName.ELIGIBILITY_AGE_EXCEPTIONS),
    ).toBeVisible();
  });

  test('routes to the Eligibility Defined Contribution page when back is clicked', async ({
    page,
    over50Page,
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
      over50Page.pageTitle(StepName.ELIGIBILITY_DEFINED_CONTRIBUTION),
    ).toBeVisible();
  });
});
