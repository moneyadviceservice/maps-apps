import { expect, test } from '@playwright/test';

import landingPageModel from '../pages/landingPage';

/**
 * @test 57766 GRG - Update React app landing page
 * @test 57883 - 57766 AC1, AC2, AC3 - Landing page start button and copy updates
 *
 * Summary: Verify landing page updates with new top start button and updated copy
 * - AC1: New start button appears at top of landing page below intro paragraph
 * - AC2: Third bullet point under "What you'll get" heading matches master copy
 * - AC3: Bottom start button copy updated and both buttons route consistently
 *
 * EN version only
 */

test.describe('GRG Landing Page Updates', () => {
  test('AC1: New top start button appears below intro paragraph - EN', async ({
    page,
  }) => {
    await landingPageModel.visitEnglish(page);

    // Verify top start button exists and is visible
    const topStartButton = landingPageModel.getStartButtonTop(page);
    await expect(topStartButton).toBeVisible();

    // Verify button text is "Get retirement guidance"
    await expect(topStartButton).toHaveText('Get retirement guidance');

    // Verify button styling is pink/primary-styled
    await expect(topStartButton).toHaveClass(/bg-magenta-500|primary/);

    // Verify button href points to question-1
    await expect(topStartButton).toHaveAttribute('href', '/en/question-1');
  });

  test('AC2: Third bullet point under "What you\'ll get" matches master copy - EN', async ({
    page,
  }) => {
    await landingPageModel.visitEnglish(page);

    // Get third bullet point
    const thirdBullet = landingPageModel.getWhatYouGetThirdBullet(page);
    await expect(thirdBullet).toBeVisible();

    // Verify exact text matches master copy
    await expect(thirdBullet).toHaveText(
      'useful tools to estimate how much retirement income you might need and if you’re on track to meet your goals',
    );
  });

  test('AC3: Bottom start button updated copy and consistent routing - EN', async ({
    page,
  }) => {
    await landingPageModel.visitEnglish(page);

    // Scroll to bottom to ensure button is visible
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    // Get bottom start button
    const bottomStartButton = landingPageModel.getStartButton(page);
    await expect(bottomStartButton).toBeVisible();

    // Verify button text is "Get retirement guidance" (not old copy)
    await expect(bottomStartButton).toHaveText('Get retirement guidance');

    // Verify old copy "Start the Get retirement guidance tool" does not appear on page
    const oldCopyLocator = page.locator(
      'text="Start the Get retirement guidance tool"',
    );
    await expect(oldCopyLocator).toHaveCount(0);

    // Get top start button for comparison
    const topStartButton = landingPageModel.getStartButtonTop(page);

    // Verify both buttons route to the same destination
    await expect(topStartButton).toHaveAttribute('href', '/en/question-1');
    await expect(bottomStartButton).toHaveAttribute('href', '/en/question-1');
  });
});
