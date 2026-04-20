import { test } from '@playwright/test';

import { HomePage } from '../pages/HomePage';

let homePage: HomePage;

test.beforeEach(async ({ page }) => {
  homePage = new HomePage(page);
  await homePage.goTo();
  homePage.acceptCookiesIfVisible();
});

test.describe('Home Page', () => {
  test('Content', async () => {
    await test.step('Assert title', async () => {
      homePage.assertTitle('Travel insurance directory');
    });

    await test.step('Assert content heading', async () => {
      await homePage.assertHeading(
        'Find a travel insurance provider if you have a serious medical condition or disability',
      );
    });

    await test.step('Assert content', async () => {
      await homePage.assertParagraphContent(
        "We can't provide quotes - but we can direct you to specialist firms that can. All firms are authorised and regulated by the Financial Conduct Authority (FCA) and have been through a rigorous selection process to prove their specialism",
      );
    });
  });

  test('Register link redirects to the registration page', async () => {
    await homePage.clickRegisterLink();
  });

  test('View firms button redirects to view firms page', async () => {
    await homePage.clickViewFirmsButton();
  });
});
