import { expect, test } from '@playwright/test';

import { basePage } from '../pages/basePage';
import homePage from '../pages/HomePage';
import question1Page from '../pages/question1Page';
import question2Page from '../pages/question2Page';
import question3Page from '../pages/question3Page';
import question4Page from '../pages/question4Page';
import question5Page from '../pages/question5Page';
import question6Page from '../pages/question6Page';
import question7Page from '../pages/question7Page';
import question8Page from '../pages/question8Page';
import question9Page from '../pages/question9Page';
import question10Page from '../pages/question10Page';
import question11Page from '../pages/question11Page';
import questionnaireNavigator from '../pages/questionnaireNavigator';

/**
 * @test Test Case 57528 56720 AC1-AC11: Verify Error messages displayed above option buttons - EN
 * Validates that each question page displays the correct error message when continuing without selecting an option
 */
test.describe('Retirement Guidance - Error Messages on Question Pages', () => {
  test('Verify error message on Question 1 - "Select one option to continue."', async ({
    page,
  }) => {
    await homePage.startRetirementGuidance(page);
    await page.getByTestId('start-button').click();
    await question1Page.waitForPage(page);

    await basePage.clickContinue(page);

    await expect(question1Page.getFieldErrorMessage(page)).toBeVisible();
    await expect(question1Page.getFieldErrorMessage(page)).toHaveText(
      'Select one option to continue.',
    );
  });

  test("Verify error message on Question 2 - \"Select 'Yes', 'No', or 'I'm already retired' to continue.\"", async ({
    page,
  }) => {
    await homePage.startRetirementGuidance(page);
    await questionnaireNavigator.skipToQuestion(page, 2);
    await question2Page.waitForPage(page);

    await basePage.clickContinue(page);

    await expect(question2Page.getFieldErrorMessage(page)).toBeVisible();
    await expect(question2Page.getFieldErrorMessage(page)).toHaveText(
      "Select 'Yes', 'No', or 'I'm already retired' to continue.",
    );
  });

  test("Verify error message on Question 3 - \"Select 'Yes', 'No, I'm self-employed', or 'No, I'm not employed' to continue.\"", async ({
    page,
  }) => {
    await homePage.startRetirementGuidance(page);
    await questionnaireNavigator.skipToQuestion(page, 3);
    await question3Page.waitForPage(page);

    await basePage.clickContinue(page);

    await expect(question3Page.getFieldErrorMessage(page)).toBeVisible();
    await expect(question3Page.getFieldErrorMessage(page)).toHaveText(
      "Select 'Yes', 'No, I'm self-employed', or 'No, I'm not employed' to continue.",
    );
  });

  test("Verify error message on Question 4 - \"Select 'Yes', 'No', or 'Not sure' to continue.\"", async ({
    page,
  }) => {
    await homePage.startRetirementGuidance(page);
    await questionnaireNavigator.skipToQuestion(page, 4);
    await question4Page.waitForPage(page);

    await basePage.clickContinue(page);

    await expect(question4Page.getFieldErrorMessage(page)).toBeVisible();
    await expect(question4Page.getFieldErrorMessage(page)).toHaveText(
      "Select 'Yes', 'No', or 'Not sure' to continue.",
    );
  });

  test('Verify error message on Question 5 - "Select at least one option to continue."', async ({
    page,
  }) => {
    await homePage.startRetirementGuidance(page);
    await questionnaireNavigator.skipToQuestion(page, 5);
    await question5Page.waitForPage(page);

    await basePage.clickContinue(page);

    await expect(question5Page.getFieldErrorMessage(page)).toBeVisible();
    await expect(question5Page.getFieldErrorMessage(page)).toHaveText(
      'Select at least one option to continue.',
    );
  });

  test("Verify error message on Question 6 - \"Select 'Yes', 'No', or 'Not sure' to continue.\"", async ({
    page,
  }) => {
    await homePage.startRetirementGuidance(page);
    await questionnaireNavigator.skipToQuestion(page, 6);
    await question6Page.waitForPage(page);

    await basePage.clickContinue(page);

    await expect(question6Page.getFieldErrorMessage(page)).toBeVisible();
    await expect(question6Page.getFieldErrorMessage(page)).toHaveText(
      "Select 'Yes', 'No', or 'Not sure' to continue.",
    );
  });

  test("Verify error message on Question 7 - \"Select 'Yes', 'No', or 'Not sure' to continue.\"", async ({
    page,
  }) => {
    await homePage.startRetirementGuidance(page);
    await questionnaireNavigator.skipToQuestion(page, 7);
    await question7Page.waitForPage(page);

    await basePage.clickContinue(page);

    await expect(question7Page.getFieldErrorMessage(page)).toBeVisible();
    await expect(question7Page.getFieldErrorMessage(page)).toHaveText(
      "Select 'Yes', 'No', or 'Not sure' to continue.",
    );
  });

  test("Verify error message on Question 8 - \"Select 'Yes' or 'No' to continue.\"", async ({
    page,
  }) => {
    await homePage.startRetirementGuidance(page);
    await questionnaireNavigator.skipToQuestion(page, 8);
    await question8Page.waitForPage(page);

    await question8Page.clickContinue(page);

    await expect(question8Page.getFieldErrorMessage(page)).toBeVisible();
    await expect(question8Page.getFieldErrorMessage(page)).toHaveText(
      "Select 'Yes' or 'No' to continue.",
    );
  });

  test('Verify error message on Question 9 - "Select one option to continue."', async ({
    page,
  }) => {
    await homePage.startRetirementGuidance(page);
    await questionnaireNavigator.skipToQuestion(page, 9);
    await question9Page.waitForPage(page);

    await basePage.clickContinue(page);

    await expect(question9Page.getFieldErrorMessage(page)).toBeVisible();
    await expect(question9Page.getFieldErrorMessage(page)).toHaveText(
      'Select one option to continue.',
    );
  });

  test("Verify error message on Question 10 - \"Select 'Yes' or 'No' to continue.\"", async ({
    page,
  }) => {
    await homePage.startRetirementGuidance(page);
    await questionnaireNavigator.skipToQuestion(page, 10);
    await question10Page.waitForPage(page);

    await basePage.clickContinue(page);

    await expect(question10Page.getFieldErrorMessage(page)).toBeVisible();
    await expect(question10Page.getFieldErrorMessage(page)).toHaveText(
      "Select 'Yes' or 'No' to continue.",
    );
  });

  test("Verify error message on Question 11 - \"Select 'Yes' or 'No' to continue.\"", async ({
    page,
  }) => {
    await homePage.startRetirementGuidance(page);
    await questionnaireNavigator.skipToQuestion(page, 11);
    await question11Page.waitForPage(page);

    await basePage.clickContinue(page);

    await expect(question11Page.getFieldErrorMessage(page)).toBeVisible();
    await expect(question11Page.getFieldErrorMessage(page)).toHaveText(
      "Select 'Yes' or 'No' to continue.",
    );
  });
});
