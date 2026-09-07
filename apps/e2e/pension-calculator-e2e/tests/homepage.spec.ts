import { test } from '@playwright/test';

import { HomePage } from '../pages/HomePage';

let homePage: HomePage;

test.beforeEach(async ({ page }) => {
  homePage = new HomePage(page);
  await homePage.goto();
  homePage.acceptCookiesIfVisible();
});

test.describe('Home Page', () => {
  test('Content', async () => {
    await test.step('Assert title', async () => {
      homePage.headingLocator('Pension Calculator');
    });
  });
});
