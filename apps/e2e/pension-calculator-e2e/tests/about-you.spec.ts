import { expect, test } from '@playwright/test';

import { AboutYouPage } from '../pages/AboutYouPage';

let aboutYouPage: AboutYouPage;

test.beforeEach(async ({ page }) => {
  aboutYouPage = new AboutYouPage(page);
  await aboutYouPage.goto();
  await aboutYouPage.acceptCookiesIfVisible();
});

test.describe('About You Page', () => {
  /**
   * @tests 58963 - inputs
   * @tests 58964 - field behaviour
   * @test 58966 - successful navigation
   */
  test('Fill details', async ({ page }) => {
    await test.step('Fill date of Birth', async () => {
      await aboutYouPage.fillDateOfBirth('01', '01', '1990');
    });

    await test.step('Select gender', async () => {
      await aboutYouPage.checkMaleRadioButton();
    });

    await test.step('Fill retirement age', async () => {
      await aboutYouPage.fillRetirementAge('65');
    });

    await test.step('Click continue button', async () => {
      await aboutYouPage.clickContinueButton();
    });

    await test.step('Verify navigation to next page', async () => {
      await expect(page).toHaveURL(/.*your-income/);
    });
  });

  /**
   * @tests 58964 - accordion functionality
   */
  test('Accordion functionality', async () => {
    await test.step('Click why we need this info accordian', async () => {
      await expect(
        aboutYouPage.whyWeNeedThisInfoAccordion(),
      ).not.toHaveAttribute('open', '');

      await aboutYouPage.clickWhyWeNeedThisInfoAccordion();

      await expect(aboutYouPage.whyWeNeedThisInfoAccordion()).toHaveAttribute(
        'open',
        '',
      );
    });
  });
});

test.describe('Validation', () => {
  /**
   * @tests 46521 - field validation and errors
   */
  test('Empty mandatory fields trigger error messages', async () => {
    await test.step('Click continue button', async () => {
      await aboutYouPage.clickContinueButton();
    });

    await test.step('Verify error messages are displayed', async () => {
      await expect(aboutYouPage.errorSummary()).toBeVisible();
      await expect(
        aboutYouPage.errorSummary().getByRole('listitem'),
      ).toHaveCount(3);
      await expect(aboutYouPage.dobError()).toBeVisible();
      await expect(aboutYouPage.sexError()).toBeVisible();
      await expect(aboutYouPage.retirementAgeError()).toBeVisible();
    });
  });

  test('Clear errors on valid input', async () => {
    await test.step('Click continue button', async () => {
      await aboutYouPage.clickContinueButton();
    });

    await test.step('Verify error messages are displayed', async () => {
      await expect(aboutYouPage.errorSummary()).toBeVisible();
      await expect(aboutYouPage.dobError()).toBeVisible();
    });

    await test.step('Fill valid date of birth', async () => {
      await aboutYouPage.fillDateOfBirth('01', '01', '1990');
    });

    await test.step('Click continue button', async () => {
      await aboutYouPage.clickContinueButton();
    });

    await test.step('Verify error messages are cleared', async () => {
      await expect(aboutYouPage.errorSummary()).toBeVisible();
      await expect(aboutYouPage.dobError()).toBeHidden();
    });
  });

  test('Invalid date of birth', async () => {
    await test.step('Fill invalid date of birth', async () => {
      await aboutYouPage.fillDateOfBirth('32', '13', '2025');
    });

    await test.step('Click continue button', async () => {
      await aboutYouPage.clickContinueButton();
    });

    await test.step('Verify error message is displayed', async () => {
      await expect(aboutYouPage.errorSummary()).toBeVisible();
      await expect(aboutYouPage.dobError()).toBeVisible();
    });
  });

  test('Invalid retirement age', async () => {
    await test.step('Fill invalid retirement age', async () => {
      await aboutYouPage.fillRetirementAge('100');
    });

    await test.step('Click continue button', async () => {
      await aboutYouPage.clickContinueButton();
    });

    await test.step('Verify error message is displayed', async () => {
      await expect(aboutYouPage.errorSummary()).toBeVisible();
      await expect(aboutYouPage.retirementAgeError()).toBeVisible();
    });

    await test.step('Fill lower than minimum retirement age', async () => {
      await aboutYouPage.fillRetirementAge('54');
    });

    await test.step('Click continue button', async () => {
      await aboutYouPage.clickContinueButton();
    });

    await test.step('Verify error message is displayed', async () => {
      await expect(aboutYouPage.errorSummary()).toBeVisible();
      await expect(aboutYouPage.retirementAgeError()).toBeVisible();
    });
  });
});
