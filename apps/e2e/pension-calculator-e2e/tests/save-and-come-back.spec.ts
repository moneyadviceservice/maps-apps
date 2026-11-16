import { saveAndComeBackData } from 'data/saveAndComeBackData';
import { SaveAndComeBackPage } from 'pages/SaveAndComeBackPage';
import { YourIncomePage } from 'pages/YourIncomePage';
import { expect, test } from '@playwright/test';

let saveAndComeBackPage: SaveAndComeBackPage;
let yourIncomePage: YourIncomePage;

const validEmail = saveAndComeBackData('').email;

test.beforeEach(async ({ page }) => {
  saveAndComeBackPage = new SaveAndComeBackPage(page);
  await saveAndComeBackPage.goto();
  await saveAndComeBackPage.acceptCookiesIfVisible();
});

test.describe('Save and come back', () => {
  /**
   * @tests 61023 - email successfully sent
   * @tests 61024 - email field is empty
   */
  test('Fill email and send email', async () => {
    await expect(saveAndComeBackPage.email()).toHaveValue('');
    await saveAndComeBackPage.fillEmail(validEmail);
    await saveAndComeBackPage.clickSaveAndSendEmailButton();
    await expect(saveAndComeBackPage.page).toHaveURL(/.*progress-saved/);
  });

  /**
   * @tests 61025 - Back navigation with persistent data
   */
  test('Back navigation with persistent data', async ({ page }) => {
    yourIncomePage = new YourIncomePage(page);
    await saveAndComeBackPage.clickBackButton();
    await expect(yourIncomePage.page).toHaveURL(/.*your-income/);
    await expect(yourIncomePage.grossPay()).toHaveValue('50,000');
  });
});

test.describe('Validation', () => {
  /**
   * @tests 61027 - Invalid email address
   */
  test('Empty email', async () => {
    await saveAndComeBackPage.clickSaveAndSendEmailButton();
    await expect(saveAndComeBackPage.errorSummary()).toBeVisible();
    await expect(saveAndComeBackPage.emailError()).toBeVisible();
  });

  /**
   * @tests 61027 - Email field is empty
   */
  test('Invalid email', async () => {
    await saveAndComeBackPage.fillEmail('test@solirius');
    await saveAndComeBackPage.clickSaveAndSendEmailButton();
    await expect(saveAndComeBackPage.errorSummary()).toBeVisible();
    await expect(saveAndComeBackPage.emailError()).toBeVisible();
  });

  test('Satisfy error and submit', async () => {
    await saveAndComeBackPage.clickSaveAndSendEmailButton();
    await expect(saveAndComeBackPage.errorSummary()).toBeVisible();
    await expect(saveAndComeBackPage.emailError()).toBeVisible();

    await saveAndComeBackPage.fillEmail(validEmail);
    await saveAndComeBackPage.clickSaveAndSendEmailButton();
    await expect(saveAndComeBackPage.page).toHaveURL(/.*progress-saved/);
  });

  /**
   * @tests 61028 - service returns error
   */
  test('Service returns an error', async ({ page }) => {
    await page.route('**/api/save', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          error: 'Internal Server Error',
          message: 'Simulated service error',
        }),
      });
    });

    await saveAndComeBackPage.fillEmail(validEmail);
    await saveAndComeBackPage.clickSaveAndSendEmailButton();
    await expect(saveAndComeBackPage.errorSummary()).toBeVisible();
  });
});
