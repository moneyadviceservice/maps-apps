import { expect, test } from '@playwright/test';
import { basePage } from '../pages/basePage';

test.describe('Register Page', () => {
  test('Content', async ({ page }) => {
    await page.goto('/register');

    await test.step('Assert title', async () => {
      expect(
        await basePage.assertTitle(page, 'Travel Insurance Directory'),
      ).toBe(true);
    });

    await test.step('Assert content heading', async () => {
      expect(
        await basePage.assertHeading(
          page,
          'Register your firm for the Travel Insurance Directory',
        ),
      ).toBe(true);
    });

    await test.step('Assert content', async () => {
      const paragraph = page.getByTestId('paragraph');
      expect(await paragraph.allTextContents()).toStrictEqual([
        'Firms authorised by the Financial Conduct Authority (FCA) can use this service to register for the Travel Insurance Directory.',
        'We will assess your application to ensure your firm meets the required risk appetite and capability standards for covering travellers with pre-existing medical conditions.',
        'What you will need before beginning your application, please ensure you have the following details to hand:',
      ]);

      const list = page.getByTestId('list-element');
      await list.waitFor();
      await expect(list).toHaveText(
        'FCA Firm Reference Number (FRN)Confirmation of Financial Ombudsman Service (FOS) and FSCS coverageDetails of the specific medical conditions or risk profiles you cover',
      );
    });

    await test.step('Assert button click', async () => {
      const locator = page.getByRole('link', { name: 'Start' });
      await locator.waitFor();
      await locator.click({ force: true });
      await page.waitForURL('/register/step-1', { timeout: 5000 });
    });
  });
});
