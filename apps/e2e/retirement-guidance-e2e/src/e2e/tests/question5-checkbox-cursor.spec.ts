import { expect, test } from '@playwright/test';

import question1Page, { QUESTION_1_ANSWERS } from '../pages/question1Page';
import question5Page, { QUESTION_5_ANSWERS } from '../pages/question5Page';

/**
 * @tests 57038 - GRG – UR6 a11y – pointer cursor for checkboxes
 * @test 59790 - 57038 AC1 TEST CASE 1: Checkbox input and label show a pointer cursor on hover, matching existing radio input behaviour
 */
test.describe('Retirement Guidance - Checkbox Cursor Styling', () => {
  test('AC1: Question 5 Checkbox labels have cursor-pointer styling - EN', async ({
    page,
  }) => {
    // Navigate to Question 5 (checkboxes page)
    await question5Page.visitQuestion5(page);
    await question5Page.waitForPage(page);

    // Verify page loads
    await expect(question5Page.getPageHeading(page)).toBeVisible();

    // Test checkbox labels have cursor-pointer class
    const answers = Object.values(QUESTION_5_ANSWERS);

    for (const answer of answers) {
      const label = question5Page.getCheckboxLabel(page, answer);
      await expect(label).toBeVisible();

      // Verify label has cursor-pointer class
      const classes = await label.getAttribute('class');
      expect(classes).toContain('cursor-pointer');
    }
  });

  test('AC1: Question 1 Radio labels have cursor-pointer styling (regression) - EN', async ({
    page,
  }) => {
    // Navigate to Question 1 (radio buttons page) for regression test
    await question1Page.visitQuestion1(page);
    await question1Page.waitForPage(page);

    // Verify page loads
    await expect(question1Page.getPageHeading(page)).toBeVisible();

    // Test radio labels have cursor-pointer class (regression)
    const answers = Object.values(QUESTION_1_ANSWERS);

    for (const answer of answers) {
      const label = question1Page.getRadioLabel(page, answer);
      await expect(label).toBeVisible();

      // Verify label has cursor-pointer class
      const classes = await label.getAttribute('class');
      expect(classes).toContain('cursor-pointer');
    }
  });
});
