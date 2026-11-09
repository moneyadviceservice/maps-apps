import { expect, test } from '@playwright/test';

import { landingPage } from '../data/landing';
import homePage from '../pages/HomePage';

const toCaseInsensitiveSymbolRegex = (text: string): RegExp => {
  // Allow straight and curly apostrophes while keeping the rest exact.
  const escaped = text
    .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    .replace(/[’']/g, "[’']");

  return new RegExp(`^${escaped}$`, 'i');
};

/**
 * @tests User Story 46477
 * @test Test Case 50361 : 46477 AC1 TEST CASE 1: Verify the Get Retirement Guidance landing page content and formatting matches the Figma design (Automated in landing.spec.ts)
 * @test Test Case 50366 : 46477 AC2 TEST CASE 2: Verify information about how the tool works displays correctly when scrolling below the heading
 * @test Test Case 50376 : 46477 AC3 TEST CASE 3: Verify clicking the Start button takes the user to Q1
 */

test.describe('Retirement Guidance - Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    await homePage.startRetirementGuidance(page);
  });

  test('Verify the landing guidance journey page', async ({ page }) => {
    // AC2
    const listItems = page
      .getByTestId('what-you-get-list')
      .getByRole('listitem');

    await expect(listItems).toHaveText(
      landingPage.whatYouGetList.map(toCaseInsensitiveSymbolRegex),
    );

    const listItems2 = page
      .getByTestId('how-it-works-list')
      .getByRole('listitem');

    await expect(listItems2).toHaveText(
      landingPage.howItWorksList.map(toCaseInsensitiveSymbolRegex),
    );

    await page.getByRole('heading', { name: /What you’ll get/i }).waitFor();
    await page.getByRole('heading', { name: /How it works/i }).waitFor();
    await expect(page.getByTestId('completion-time')).toHaveText(
      landingPage.completionTime,
    );
    // AC3
    await page.getByTestId('start-button').click();

    await expect(page).toHaveURL(/\/en\/question-1/);
  });
});
