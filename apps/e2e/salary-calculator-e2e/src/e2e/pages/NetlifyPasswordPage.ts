import { Page } from '@playwright/test';

/**
 * Page object for handling Netlify password-protected pages
 * Used when testing against remote dev/staging environments
 */
class NetlifyPasswordPage {
  /**
   * Enters the password on Netlify's password protection page
   * @param page - Playwright page object
   * @param password - The HTTP password for the protected site
   */
  async enterPassword(page: Page, password: string): Promise<void> {
    try {
      // Wait for the password field to appear (with a shorter timeout since it might not exist on local)
      const passwordField = page.getByRole('textbox', { name: 'Password' });
      await passwordField.waitFor({ state: 'visible', timeout: 5000 });

      // Fill in password
      await passwordField.fill(password);

      // Click submit button
      const submitButton = page.getByRole('button', { name: 'Submit' });
      await submitButton.waitFor({ state: 'visible' });
      await submitButton.click();

      // Wait for navigation away from password page
      await page.waitForLoadState('load');
    } catch (error) {
      // If password page doesn't appear within timeout, assume we're already past it or on local
      console.log('No Netlify password page detected, continuing...');
    }
  }

  /**
   * Checks if the current page is a Netlify password protection page
   * @param page - Playwright page object
   * @returns true if on password page, false otherwise
   */
  async isOnPasswordPage(page: Page): Promise<boolean> {
    try {
      const passwordField = page.getByRole('textbox', { name: 'Password' });
      return await passwordField.isVisible({ timeout: 2000 });
    } catch {
      return false;
    }
  }
}

export const netlifyPasswordPage = new NetlifyPasswordPage();
