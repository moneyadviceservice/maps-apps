import { expect, test } from '@playwright/test';

import pensionsNotShowingPage from '../pages/PensionsNotShowingPage';
import commonHelpers from '../utils/commonHelpers';

const pageHeading = 'Pensions not showing';
const pensionsNotShowingSummary =
  'We’re still building and improving our service. We’re connecting new pension schemes on a regular basis.';
const pensionsNotShowingSubheading = 'What you can do:';
const textOnPage1 = 'Check back later to see if your pensions are showing.';
const textOnPage2 =
  'Let us know your National Insurance number (NINO) if you haven’t already. You’ll have to sign in again with GOV.UK One Login to return';
const textOnPage3 =
  'If your State Pension is not showing and you think you’re entitled to one, ';
const textOnPage4 =
  'If you know the name of your employer(s) or pension provider(s), contact them directly.';
const linkText1 =
  'Exit the Pensions Dashboard and start again to enter your National Insurance number.';
const linkText2 =
  'check your details using your State Pension forecast  (opens in a new window) ';
const linkText3 = 'Learn more about refunded pensions.';
const headingCheckStatePension = '    Check your State Pension forecast';
const expectedHeadingExplore = 'Explore the Pensions Dashboard';

test.describe('User views content on Pensions not Showing Page', () => {
  test.beforeEach(async ({ page }) => {
    await commonHelpers.navigateToStartPage(page);
  });

  test('Verify Content on Pensions not showing page', async ({ page }) => {
    await page.goto('/en/pensions-not-showing');
    await pensionsNotShowingPage.pageLoads(page);
    await expect(page.getByTestId('page-title')).toContainText(pageHeading);
    await expect(page.getByTestId('tool-intro')).toContainText(
      pensionsNotShowingSummary,
    );
    await expect(
      page.locator(`h2:text-is("${pensionsNotShowingSubheading}")`),
    ).toBeVisible();
    await expect(page.locator('li > p').first()).toContainText(textOnPage1);
    await expect(page.locator('li > p').nth(1)).toContainText(textOnPage2);
    await expect(page.locator('li > p').nth(2)).toContainText(textOnPage3);
    await expect(page.locator('li > p').nth(3)).toContainText(textOnPage4);
    //Assert links text and destination
    //Link 1
    const linkLocatorExit = page.getByTestId(
      'pensions-not-showing-logout-link',
    );
    const logoutModal = page.getByTestId(
      'pensions-not-showing-logout-link-dialog',
    );
    await expect(linkLocatorExit).toContainText(linkText1);
    await expect(logoutModal).toBeHidden();
    await commonHelpers.clickLink(page, linkText1);
    await expect(logoutModal).toBeVisible();
    await commonHelpers.clickButton(page, 'Cancel');
    await expect(logoutModal).toBeHidden();
    //Link2
    const linkLocatorState = page.locator('li > p > a').nth(0);
    const newPageCheckStatePension =
      await commonHelpers.clickLinkAndReturnNewPage(page, linkLocatorState);
    await expect(linkLocatorState).toContainText(linkText2);
    await expect(newPageCheckStatePension.locator('h1')).toContainText(
      headingCheckStatePension,
    );
    await newPageCheckStatePension.close();
    //Link3
    const linkLocatorExplore = page.locator('li > p > a').nth(1);
    const newPageExplore = await commonHelpers.clickLinkAndReturnNewPage(
      page,
      linkLocatorExplore,
    );
    await expect(linkLocatorExplore).toContainText(linkText3);
    await expect(newPageExplore.locator('h1')).toContainText(
      expectedHeadingExplore,
    );
    await newPageExplore.close();
  });
});
