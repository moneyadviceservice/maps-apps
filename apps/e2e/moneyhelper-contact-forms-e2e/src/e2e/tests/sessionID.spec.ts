import { expect, test } from '@playwright/test';

import { FlowName, StepName } from '../lib/constants';
import { sessionID } from '../mocks/mock-data';
import { BasePage } from '../pages/BasePage';

test.describe('Session ID Logic', () => {
  let basePage: BasePage;

  test.beforeEach(async ({ page }) => {
    await page.context().clearCookies();
    basePage = new BasePage(page);
  });

  test('captures sessionID from mhpd entry and continues without query params', async ({
    page,
  }) => {
    await basePage.gotoHome(`?aa=${FlowName.MHPD}&sessionID=${sessionID}`);
    await page.getByTestId('guidance-continue-button').click();

    // The page should settle on the MHPD step after guard redirects.
    await page.waitForURL(`/en/${StepName.ABOUT_MHPD}?sessionID=${sessionID}`, {
      timeout: 20000,
    });
    await expect(page.getByTestId('about-mhpd-title')).toBeVisible();
    await expect(page).toHaveURL(
      `/en/${StepName.ABOUT_MHPD}?sessionID=${sessionID}`,
    );
  });
});
