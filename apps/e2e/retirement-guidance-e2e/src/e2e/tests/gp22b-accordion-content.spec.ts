import { expect, test } from '@playwright/test';

import resultsPage from '../pages/resultsPage';

test.describe('Results Page - GP22b Accordion Copy Verification', () => {
  test('shows the GP22b heading and content in English', async ({ page }) => {
    await page.goto(
      '/en/results?q-1=0&q-2=0&q-3=0&q-4=0&q-5=0&q-6=0&q-7=0&q-8=0&q-9=0&q-10=0&q-11=0',
    );
    await resultsPage.waitForPage(page);

    const section = resultsPage.getGuidanceSection(
      page,
      'primary-goal-22b-section',
    );
    await expect(section).toBeVisible();
    await expect(section.locator('summary')).toContainText(
      'Learn how your pension works',
    );

    await resultsPage.expandAccordion(page, 'Learn how your pension works');

    const paragraphs = resultsPage.getAccordionContent(
      page,
      'Learn how your pension works',
    );
    await expect(paragraphs.nth(0)).toHaveText(
      'Many pension schemes have unique benefits or offer different ways to give you a retirement income.',
    );
    await expect(paragraphs.nth(1)).toHaveText(
      'Understanding how your pension works can help you:',
    );
    await expect(section.getByRole('listitem')).toHaveText([
      'plan how you’ll fund your retirement',
      'find ways to boost your retirement income',
      'make the most of your pension benefits.',
    ]);
    await expect(paragraphs.nth(2)).toHaveText(
      /We explain how different types of pension in the UK work, including the State Pension, defined contribution, defined benefit, hybrid and cash balance schemes\./,
    );
    await expect(section.getByRole('link')).toHaveAttribute(
      'href',
      'https://www.moneyhelper.org.uk/en/pensions-and-retirement/pensions-basics/types-of-pension-and-how-they-work',
    );
  });
});
