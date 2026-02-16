import { expect, test } from '@maps/playwright';

import { scenarioNineDetails } from '../data/scenarioDetails';
import loadingPage from '../pages/LoadingPage';
import pensionsFoundPage from '../pages/PensionsFoundPage';
import commonHelpers from '../utils/commonHelpers';

const pageHeading = 'No pensions found';
const noPensionsFoundSummary =
  'We’re still building and improving our service. We’re connecting new pension schemes on a regular basis.';
const subHeading = 'What you can do:';
const linkText1 =
  'Exit the Pensions Dashboard and start again to enter your National Insurance number.';
const linkText2 =
  'check your details using your State Pension forecast  (opens in a new window) ';
const linkText4 = 'Learn more about refunded pensions.';
const linkText3 = 'report a technical problem (opens in a new window) ';
const headingCheckStatePension = '    Check your State Pension forecast';
const expectedHeadingExplore = 'Explore the Pensions Dashboard';
const expectedHeadingReport = 'Report a technical problem';

test.describe('User views content on Pensions not Showing Page', () => {
  test.beforeEach(async ({ page }) => {
    await commonHelpers.navigateToEmulator(page);
  });

  test('Verify Content on Pensions not showing page', async ({ page }) => {
    await commonHelpers.navigateToLoadingPage(page, scenarioNineDetails.option);
    await loadingPage.waitForPensionsToLoad(page);
    await pensionsFoundPage.noPensionsFound(page);
    await expect(page.getByTestId('page-title')).toContainText(pageHeading);
    await expect(page.getByTestId('tool-intro')).toContainText(
      noPensionsFoundSummary,
    );
    await expect(page.locator(`h2:text-is("${subHeading}")`)).toBeVisible();
    //Assert links text and destination
    //Link 1
    const linkLocatorExit = page.getByTestId('no-pensions-found-logout-link');
    const logoutModal = page.getByTestId(
      'no-pensions-found-logout-link-dialog',
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
    const linkLocatorReport = page.locator('li > p > a').nth(1);
    const newPageReport = await commonHelpers.clickLinkAndReturnNewPage(
      page,
      linkLocatorReport,
    );
    await expect(linkLocatorReport).toContainText(linkText3);
    await expect(newPageReport.locator('h1')).toContainText(
      expectedHeadingReport,
    );
    await newPageReport.close();
    //Link4
    const linkLocatorExplore = page.locator('li > p > a').nth(2);
    const newPageExplore = await commonHelpers.clickLinkAndReturnNewPage(
      page,
      linkLocatorExplore,
    );
    await expect(linkLocatorExplore).toContainText(linkText4);
    await expect(newPageExplore.locator('h1')).toContainText(
      expectedHeadingExplore,
    );
    await newPageExplore.close();
  });
});
