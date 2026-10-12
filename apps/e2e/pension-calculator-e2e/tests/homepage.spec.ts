import { expect, test } from '@playwright/test';

import { HomePage } from '../pages/HomePage';

let homePage: HomePage;

test.beforeEach(async ({ page }) => {
  homePage = new HomePage(page);
  await homePage.goto();
  await homePage.acceptCookiesIfVisible();
});

test.describe('Home Page', () => {
  /**
   * @tests 58854 - Home page content
   * @tests 58855 - Breadcrumbs
   */
  test('Content', async () => {
    await test.step('Breadcrumbs visibility', async () => {
      await expect(homePage.breadCrumb()).toBeVisible();
      await expect(homePage.breadCrumb().getByRole('listitem')).toHaveCount(3);
    });

    await test.step('Title visibility', async () => {
      await expect(homePage.headingLocator('Pension calculator')).toBeVisible();
    });

    await test.step('Headings visibility', async () => {
      await expect(homePage.whatyoullGetSection()).toBeVisible();
      await expect(homePage.howItWorksSection()).toBeVisible();
      await expect(homePage.whatYoullNeedSection()).toBeVisible();
    });
  });

  /**
   * @tests 58857 - Call to action buttons
   */
  test('Start Pension Calc button hero button navigates to About You', async ({
    page,
  }) => {
    await homePage.clickStartPensionCalcButton('hero');
    await expect(page).toHaveURL(/.*about-you/);
  });

  test('Start Pension Calc button footer button navigates to About You', async ({
    page,
  }) => {
    await homePage.clickStartPensionCalcButton('footer');
    await expect(page).toHaveURL(/.*about-you/);
  });

  /**
   * @tests 58861 - Support channel links
   */
  test('Need more information links', async () => {
    await test.step('Webchat link', async () => {
      await expect(homePage.webchatLink()).toBeVisible();
      await expect(homePage.webchatLink()).toHaveAttribute(
        'href',
        'https://www.moneyhelper.org.uk/PensionsChat',
      );
    });

    await test.step('Phone number link', async () => {
      await expect(homePage.phoneNumberLink()).toBeVisible();
      await expect(homePage.phoneNumberLink()).toHaveAttribute(
        'href',
        'tel:08000113797',
      );
    });

    await test.step('Online form link', async () => {
      await expect(homePage.onlineFormLink()).toBeVisible();
      await expect(homePage.onlineFormLink()).toHaveAttribute(
        'href',
        'https://www.moneyhelper.org.uk/PensionsChat',
      );
    });
  });
});
