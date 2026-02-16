/* eslint-disable playwright/expect-expect */
import { test } from '@playwright/test';

import { assertErrorSummary, assertInlineError } from '../helpers';
import { DOBPage } from '../pages/DOBPage';
import { NamePage } from '../pages/NamePage';
import { PensionTypePage } from '../pages/PensionTypePage';

const nextYear = new Date().getFullYear() + 1;
const dobFieldCases = [
  { desc: 'empty DOB fields', day: '', month: '', year: '' },
  { desc: 'only day field', day: '01', month: '', year: '' },
  { desc: 'only month field', day: '', month: '12', year: '' },
  { desc: 'only year field', day: '', month: '', year: '1990' },
  {
    desc: 'leap year DOB (Feb 29, 2023)',
    day: '29',
    month: '02',
    year: '2023',
  },
  { desc: 'future DOB', day: '01', month: '01', year: String(nextYear) },
  { desc: 'year before 1900', day: '01', month: '01', year: '1899' },
];

test.describe('Date of Birth Page Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.context().clearCookies();
  });

  dobFieldCases.forEach(({ desc, day, month, year }) => {
    test(`shows errors for ${desc}`, async ({ page }) => {
      const pensionTypePage = new PensionTypePage(page);
      const namePage = new NamePage(page);
      const dobPage = new DOBPage(page);

      // Navigate to DOB step via pension type and name pages by selecting 'Pension guidance' option
      await pensionTypePage.goToPensionType();
      await namePage.goToName('pensions-guidance');
      await dobPage.goToDOB();

      // Fill in specified fields and submit form to trigger validation errors
      await dobPage.fillTextField('day', day);
      await dobPage.fillTextField('month', month);
      await dobPage.fillTextField('year', year);
      await dobPage.submitForm();

      // Wait for DOB page to reload with validation errors
      await page.waitForURL(/\/en\/date-of-birth/, { timeout: 20000 });

      // Use helpers to avoid duplication (DRY)
      await assertErrorSummary(page);
      await assertInlineError(page, 'text-input');
    });
  });
});
