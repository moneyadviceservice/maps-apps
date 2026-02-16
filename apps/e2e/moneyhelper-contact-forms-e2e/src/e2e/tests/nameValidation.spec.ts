/* eslint-disable playwright/expect-expect */
import { test } from '@playwright/test';

import { assertErrorSummary, assertInlineError } from '../helpers';
import { NamePage } from '../pages/NamePage';
import { PensionTypePage } from '../pages/PensionTypePage';

const nameFieldCases = [
  {
    desc: 'both fields empty',
    first: '',
    last: '',
    errors: ['first-name', 'last-name'],
  },
  {
    desc: 'last name is empty',
    first: 'John',
    last: '',
    errors: ['last-name'],
  },
  {
    desc: 'first name is empty',
    first: '',
    last: 'Doe',
    errors: ['first-name'],
  },
  {
    desc: 'first name is over 50 characters',
    first: 'A'.repeat(51),
    last: 'Doe',
    errors: ['first-name'],
  },
  {
    desc: 'last name is over 50 characters',
    first: 'John',
    last: 'B'.repeat(51),
    errors: ['last-name'],
  },
];

test.describe('Name Page Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.context().clearCookies();
  });

  nameFieldCases.forEach(({ desc, first, last, errors }) => {
    test(`shows errors for when ${desc}`, async ({ page }) => {
      const pensionTypePage = new PensionTypePage(page);
      const namePage = new NamePage(page);

      // Navigate to name page
      await pensionTypePage.goToPensionType();
      await namePage.goToName('pensions-guidance');

      // Fill in name fields as per scenario
      await namePage.fillTextField('first-name', first);
      await namePage.fillTextField('last-name', last);
      await namePage.submitForm();

      // Wait for Name page to reload with validation errors
      await page.waitForURL(/\/en\/name/, { timeout: 20000 });

      // Use helpers to avoid duplication (DRY)
      await assertErrorSummary(page);

      // Assert inline errors for all relevant fields in this scenario - this approach avoids conditional logic in the test and keeps it data-driven
      for (const field of errors) {
        await assertInlineError(page, field);
      }
    });
  });
});
