import { expect, test } from '@playwright/test';
import { basePage } from '../pages/basePage';

test.describe('Home Page', () => {
  test('Content', async ({ page }) => {
    await page.goto('/');

    await test.step('Assert title', async () => {
      expect(
        await basePage.assertTitle(page, 'Travel insurance directory'),
      ).toBe(true);
    });

    await test.step('Assert content heading', async () => {
      expect(
        await basePage.assertHeading(
          page,
          'Find a travel insurance provider if you have a serious medical condition or disability',
        ),
      ).toBe(true);
    });

    await test.step('Assert content', async () => {
      const locator = page.getByTestId('paragraph');
      await locator.waitFor();
      await expect(locator).toHaveText(
        "We can't provide quotes - but we can direct you to specialist firms that can. All firms are authorised and regulated by the Financial Conduct Authority (FCA) and have been through a rigorous selection process to prove their specialism",
      );
    });

    await test.step('Assert register link', async () => {
      const locator = page.getByRole('link', { name: 'Register' });
      await locator.waitFor();
      await locator.click({ force: true });
      await page.waitForURL('/register', { timeout: 5000 });
      expect(
        await basePage.assertHeading(
          page,
          'Register your firm for the Travel Insurance Directory',
        ),
      ).toBe(true);
    });
  });
});
