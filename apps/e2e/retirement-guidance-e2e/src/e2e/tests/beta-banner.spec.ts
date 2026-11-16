import { expect, test } from '@playwright/test';

import landingPage, {
  BETA_BANNER_CONTENT,
  BETA_FEEDBACK_LINKS,
} from '../pages/landingPage';

/**
 * @test User Story 56748: Add beta banner to get retirement guidance
 * @test 57272 : 56748 AC 1 Test Case 1 : Verify Beta Banner is displayed on Start Page EN
 * @test 57273 : 56748 AC 2 Test Case 2 : Verify Beta Banner Content EN
 * @test 57274 : 56748 AC 2 Test Case 3 : Verify Beta Banner Content CY *
 *
 * Summary: Verify that the beta banner is displayed with correct content on the landing page
 */

test.describe('Beta Banner - Display and Content Verification', () => {
  test('AC1: Verify Beta Banner is displayed on Start Page EN', async ({
    page,
  }) => {
    // Navigate to English landing page
    await landingPage.visitEnglish(page);

    // Wait for page to load
    await page.waitForLoadState('load');

    // Verify beta banner is visible
    await expect(landingPage.getPhaseBanner(page)).toBeVisible();
  });

  test('AC2: Verify Beta Banner Content EN', async ({ page }) => {
    // Navigate to English landing page
    await landingPage.visitEnglish(page);

    // Wait for page to load
    await page.waitForLoadState('load');

    // Verify beta banner contains expected text
    const betaBannerText = landingPage.getBetaBannerText(page);
    await expect(betaBannerText).toContainText(BETA_BANNER_CONTENT.en);
    await expect(betaBannerText).toContainText('will help us to improve it');

    // Verify beta banner feedback link is present
    const feedbackLink = landingPage.getPhaseBannerFeedbackLink(page);
    await expect(feedbackLink).toBeVisible();
    await expect(feedbackLink).toHaveAttribute('href', BETA_FEEDBACK_LINKS.en);
  });

  test('AC1 CY: Verify Beta Banner is displayed on Start Page CY', async ({
    page,
  }) => {
    // Navigate to Welsh landing page
    await landingPage.visitWelsh(page);

    // Wait for page to load
    await page.waitForLoadState('load');

    // Verify beta banner is visible
    await expect(landingPage.getPhaseBanner(page)).toBeVisible();
  });

  test('AC2 CY: Verify Beta Banner Content CY', async ({ page }) => {
    // Navigate to Welsh landing page
    await landingPage.visitWelsh(page);

    // Wait for page to load
    await page.waitForLoadState('load');

    // Verify beta banner contains expected Welsh text
    const betaBannerText = landingPage.getBetaBannerText(page);
    await expect(betaBannerText).toContainText(BETA_BANNER_CONTENT.cy);

    // Verify beta banner feedback link is present
    const feedbackLink = landingPage.getPhaseBannerFeedbackLink(page);
    await expect(feedbackLink).toBeVisible();
    await expect(feedbackLink).toHaveAttribute('href', BETA_FEEDBACK_LINKS.cy);
  });
});
