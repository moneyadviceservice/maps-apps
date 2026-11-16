import { saveAndComeBackData } from 'data/saveAndComeBackData';
import { ProgressSavedPage } from 'pages/ProgressSavedPage';
import { SaveAndComeBackPage } from 'pages/SaveAndComeBackPage';
import { YourIncomePage } from 'pages/YourIncomePage';
import { expect, test } from '@playwright/test';

let progressSavedPage: ProgressSavedPage;
let saveAndComeBackPage: SaveAndComeBackPage;

const validEmail = saveAndComeBackData('').email;

test.beforeEach(async ({ page }) => {
  progressSavedPage = new ProgressSavedPage(page);
  saveAndComeBackPage = new SaveAndComeBackPage(page);
  await progressSavedPage.goto();
  await progressSavedPage.acceptCookiesIfVisible();
});

test.describe('Progress saved page', () => {
  /**
   * @tests 61185 - Back navigation
   */
  test('Back navigation', async () => {
    await progressSavedPage.clickBackButton();
    await expect(saveAndComeBackPage.page).toHaveURL(/\/en\/save\?/);
  });

  /**
   * @tests 61031 - Resend email
   */
  test('Resend email', async () => {
    await progressSavedPage.clickResendEmailButton();

    await expect(saveAndComeBackPage.page).toHaveURL(/\/en\/save\?/);
    await expect(saveAndComeBackPage.email()).toHaveValue('');
    await saveAndComeBackPage.fillEmail(validEmail);
    await saveAndComeBackPage.clickSaveAndSendEmailButton();

    await expect(saveAndComeBackPage.page).toHaveURL(/\/en\/progress-saved\?/);
  });

  /**
   * @tests 61032 - Return to your saved progress
   */
  test('Return to your saved progress', async ({ page }) => {
    const yourIncomePage = new YourIncomePage(page);
    await progressSavedPage.clickReturnToYourSavedProgressButton();
    await expect(yourIncomePage.page).toHaveURL(/\/en\/your-income\?/);
  });
});
