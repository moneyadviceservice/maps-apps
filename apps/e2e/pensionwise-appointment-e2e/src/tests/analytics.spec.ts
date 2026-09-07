/* eslint-disable playwright/no-conditional-expect */
/* eslint-disable playwright/no-conditional-in-test */
import { expect, test } from '@lib/test.lib';

import adobeDatalayer from '../data/adobeDatalayer.json';

test.describe('Adobe Analytics Tracking', () => {
  const fixtureEntries = Object.entries(adobeDatalayer);

  for (const [route, expected] of fixtureEntries) {
    const routeLabel = route === '' ? '/' : route; // Normalise endpoint.

    test(
      'pageLoad fires for ' + routeLabel,
      async ({ page, basePage, setCookieControl }) => {
        await setCookieControl();

        const lang = expected.page.lang ?? 'en';
        const url = '/' + lang + '/pension-wise-appointment' + route;

        await basePage.goto(url);

        if (route.includes('/summary')) {
          await expect(basePage.heroTitle).toBeVisible();
        } else {
          await expect(basePage.pageTitle).toBeVisible();
        }

        await basePage.body.click();
        await page.evaluate(() =>
          window.scrollTo(0, document.body.scrollHeight),
        );

        await expect(page).toHavePartialDataLayerEvent({
          event: 'pageLoad',
          page: expected.page,
          tool: expected.tool,
        });
      },
    );
  }
});
