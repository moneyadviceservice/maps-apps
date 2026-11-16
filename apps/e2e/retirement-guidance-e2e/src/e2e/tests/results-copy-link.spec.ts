import { expect, test } from '@playwright/test';

import questionnaireNavigator from '../pages/questionnaireNavigator';
import resultsPage from '../pages/resultsPage';

/**
 * @tests User Story: 55160
 * @test AC1: Copy results page URL button visible at bottom of page
 * @test AC2: Button copies URL to clipboard and shows temporary "Link copied!" message
 * @test AC3: Copied URL can be pasted into text applications
 * @test AC4: Button is hidden when JavaScript is disabled
 * @test AC5: Change answers button remains visible with secondary variant when JS disabled
 */

test.describe('Retirement Guidance - Results Page - Copy Link Feature (US-55160)', () => {
  test.beforeEach(async ({ page }) => {
    await questionnaireNavigator.skipToResults(page);
  });

  test.describe('AC1: Copy button visibility and styling', () => {
    test('should display Copy link button below other tools to try section', async ({
      page,
    }) => {
      const copyButton = resultsPage.getCopyLinkButton(page);
      await expect(copyButton).toBeVisible();
    });

    test('should style Copy link button with primary variant', async ({
      page,
    }) => {
      const copyButton = resultsPage.getCopyLinkButton(page);

      // Check that button has primary variant styling
      await expect(copyButton).toHaveAttribute('class', /bg-magenta-500/i);
    });

    test('should have correct button label', async ({ page }) => {
      const copyButton = resultsPage.getCopyLinkButton(page);
      await expect(copyButton).toContainText('Copy link to your results');
    });
  });

  test.describe('AC2: Copy to clipboard functionality', () => {
    test('should copy results page URL to clipboard when button is clicked', async ({
      page,
    }) => {
      // Grant clipboard permissions
      await page
        .context()
        .grantPermissions(['clipboard-read', 'clipboard-write']);

      // Click copy button
      await resultsPage.clickCopyLinkButton(page);

      // Check clipboard contains the current URL
      const clipboardText = await page.evaluate(() =>
        navigator.clipboard.readText(),
      );

      expect(clipboardText).toContain(page.url());
    });

    test('should show Link copied confirmation message after clicking button', async ({
      page,
    }) => {
      // Grant clipboard permissions
      await page
        .context()
        .grantPermissions(['clipboard-read', 'clipboard-write']);

      const copyButton = resultsPage.getCopyLinkButton(page);

      // Click copy button
      await copyButton.click();

      // Check for confirmation message - adjust selector based on actual implementation
      const confirmationMessage = page.locator('text=Link copied!');
      await expect(confirmationMessage).toBeVisible();
    });

    test('should revert button text after confirmation message timeout', async ({
      page,
    }) => {
      await page.clock.install();

      // Grant clipboard permissions
      await page
        .context()
        .grantPermissions(['clipboard-read', 'clipboard-write']);

      const copyButton = resultsPage.getCopyLinkButton(page);

      // Click copy button
      await copyButton.click();

      // Wait for confirmation message to appear
      const confirmationMessage = page.locator('text=Link copied!');
      await expect(confirmationMessage).toBeVisible();

      // Wait for confirmation message to clear, by fast-forwarding app timers instead of waiting in real time
      await page.clock.fastForward(4000);

      // Wait for button text to revert
      await expect(confirmationMessage).toBeHidden();

      await expect(copyButton).toContainText('Copy link to your results');
    });
  });

  test.describe('AC3: Pasted URL accessibility', () => {
    test('should allow pasting the copied URL into a text input', async ({
      page,
    }) => {
      // Grant clipboard permissions
      await page
        .context()
        .grantPermissions(['clipboard-read', 'clipboard-write']);

      const resultsPageUrl = page.url();

      // Click copy button
      await resultsPage.clickCopyLinkButton(page);

      // Read clipboard
      const clipboardText = await page.evaluate(() =>
        navigator.clipboard.readText(),
      );
      expect(clipboardText).toBe(resultsPageUrl);

      // Create a test input field
      await page.evaluate(() => {
        const input = document.createElement('input');
        input.id = 'test-paste-input';
        input.type = 'text';
        document.body.appendChild(input);
        input.focus();
      });

      // Simulate paste by writing clipboard text into the focused input
      await page.evaluate(async () => {
        const input = document.getElementById(
          'test-paste-input',
        ) as HTMLInputElement | null;

        if (!input) return;

        input.value = await navigator.clipboard.readText();
      });

      // Verify pasted content matches the original URL
      const pastedInput = page.locator('#test-paste-input');
      await expect(pastedInput).toHaveValue(resultsPageUrl);
    });
  });

  test.describe('AC4: JavaScript disabled behavior', () => {
    test.use({ javaScriptEnabled: false });

    test('should not display Copy link button when JavaScript is disabled', async ({
      page,
    }) => {
      // Verify Copy link button is not visible
      const copyButton = resultsPage.getCopyLinkButton(page);
      await expect(copyButton).toBeHidden();
    });
  });

  test.describe('AC5: Change answers button visibility with JS disabled', () => {
    test.use({ javaScriptEnabled: false });

    test('should keep Change answers button visible when JavaScript is disabled', async ({
      page,
    }) => {
      // Verify Change answers button is still visible
      const changeAnswersButton = resultsPage.getChangeAnswersButton(page);
      await expect(changeAnswersButton).toBeVisible();
    });

    test('should style Change answers button with secondary variant when JavaScript is disabled', async ({
      page,
    }) => {
      const changeAnswersButton = resultsPage.getChangeAnswersButton(page);

      // Check that button has secondary variant styling
      await expect(changeAnswersButton).toHaveAttribute(
        'class',
        /border-magenta-500/i,
      );
    });
  });
});
