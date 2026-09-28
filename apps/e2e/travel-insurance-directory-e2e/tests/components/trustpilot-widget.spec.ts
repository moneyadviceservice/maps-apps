import { expect, test } from '@playwright/test';

import { TrustPilot } from '../../pages/components/TrustPilot';
import { HomePage } from '../../pages/HomePage';

let trustPilot: TrustPilot;
let homePage: HomePage;

test.beforeEach(async ({ page }) => {
  trustPilot = new TrustPilot(page);
  homePage = new HomePage(page);
  await homePage.goto();
});

test.describe('Trustpilot widget', () => {
  /**
   * @tests 57795 - trustpilot widget visibility
   */
  test('Widget visibility', async () => {
    await expect(trustPilot.trustpilotWidget()).toBeVisible();

    const iframeLocator = trustPilot.trustpilotWidget().locator('iframe');
    await expect(iframeLocator).toBeAttached();
    await expect(iframeLocator).toBeVisible();
  });

  test('Widget has correct business id', async () => {
    await expect(trustPilot.trustpilotWidget()).toHaveAttribute(
      'data-businessunit-id',
      trustPilot.businessId,
    );
  });

  /**
   * @tests 57796 - trustpilot widget template id
   */
  test('Widget has correct template id', async () => {
    await expect(trustPilot.trustpilotWidget()).toHaveAttribute(
      'data-template-id',
      trustPilot.templateId,
    );
  });
});

/**
 * @tests 57807 - trustpilot widget no-js
 */
test.describe('No-JS suite', () => {
  test.use({ javaScriptEnabled: false });

  test('renders correctly without JavaScript', async () => {
    await expect(trustPilot.trustpilotWidget()).toBeVisible();
  });
});
