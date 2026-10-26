import { expect, test } from '@maps/playwright';

import { scenarioNineDetails } from '../data/scenarioDetails';

const pageHeading = 'No pensions found';
const noPensionsFoundSummary =
  'We’re still building and improving our service. We’re connecting new pension schemes on a regular basis.';
const linkText1 =
  'Exit the Pensions Dashboard and start again to enter your National Insurance number.';
const linkText2 =
  'check your details using your State Pension forecast  (opens in a new window) ';
const linkText4 = 'Learn more about refunded pensions.';
const linkText3 = 'contact us (opens in a new window) ';
const headingCheckStatePension = '    Check your State Pension forecast';
const expectedHeadingUsing = 'Using the Pensions Dashboard';
const expectedHeadingContact = 'Contact us';

/**
 * @tests User Story 51449: 'Did you understand this page' component
 * @tests Test Case 52101: [AC1] No Pensions Found
 *
 * @tests User Story 59201: H&S03 - FE - FAQ page - /using-the-pensions-dashboard
 * @tests Test Case 59563: 59201 AC5 Test Case 6 : Verify /no-pensions-found contact update
 * @tests Test Case 59566: 59201 AC7 Test Case 7 : Verify /no-pensions-found contact update
 *
 * @tests User Story 58967: H&S02 - FE - Improvements - Banner
 * @tests Test Case 59663: 58967 [AC1, AC2] Test Case 2: New H&S Banner (No Pensions Found)
 */

test.describe('User views content on Pensions not Showing Page', () => {
  test.beforeEach(async ({ commonHelpers }) => {
    await commonHelpers.navigateToEmulator('en');
  });

  test('Verify Content on Pensions not showing page', async ({
    basePage,
    burgerMenu,
    commonHelpers,
    didYouUnderstand,
    helpAndSupport,
    loadingPage,
    page,
    pensionsFoundPage,
  }) => {
    await commonHelpers.navigateToLoadingPage(scenarioNineDetails.option);
    await loadingPage.waitForPensionsToLoad(commonHelpers, 'en');
    await pensionsFoundPage.noPensionsFound();
    await expect(didYouUnderstand.feedbackBanner).toBeVisible();
    await expect(pensionsFoundPage.getPageTitle()).toContainText(pageHeading);
    await expect(pensionsFoundPage.getPageSummary()).toContainText(
      noPensionsFoundSummary,
    );
    await expect(pensionsFoundPage.getWhatYouCanDoSection()).toBeVisible();
    //Assert links text and destination
    //Link 1
    await expect(pensionsFoundPage.getExitLink()).toContainText(linkText1);
    await expect(pensionsFoundPage.getExitModal()).toBeHidden();
    await commonHelpers.clickLink(linkText1);
    await expect(pensionsFoundPage.getExitModal()).toBeVisible();
    await commonHelpers.clickButton('Cancel');
    await expect(pensionsFoundPage.getExitModal()).toBeHidden();
    //Link2
    const newPageCheckStatePension =
      await commonHelpers.clickLinkAndReturnNewPage(
        pensionsFoundPage.getStatePensionLink(),
      );

    await expect(pensionsFoundPage.getStatePensionLink()).toContainText(
      linkText2,
    );
    await expect(newPageCheckStatePension.locator('h1')).toContainText(
      headingCheckStatePension,
    );
    await newPageCheckStatePension.close();
    //Link3
    const newPageContact = await commonHelpers.clickLinkAndReturnNewPage(
      pensionsFoundPage.getContactLink(),
    );
    await expect(pensionsFoundPage.getContactLink()).toContainText(linkText3);
    await expect(newPageContact.locator('h1')).toContainText(
      expectedHeadingContact,
    );
    await newPageContact.close();
    //Link4
    const newPageUsing = await commonHelpers.clickLinkAndReturnNewPage(
      pensionsFoundPage.getUsingThePensionsDashboardLink(),
    );
    await expect(
      pensionsFoundPage.getUsingThePensionsDashboardLink(),
    ).toContainText(linkText4);
    await expect(newPageUsing.locator('h1')).toContainText(
      expectedHeadingUsing,
    );
    await newPageUsing.close();

    await basePage.clickBurgerIcon();
    await burgerMenu.helpAndSupportLink.click();
    await expect(page).toHaveURL('/en/support');
    await commonHelpers.clickBackLink();
    await expect(page).toHaveURL('/en/no-pensions-found');

    await expect(helpAndSupport.component).toBeVisible();
    await helpAndSupport.button.click();
    await expect(page).toHaveURL('/en/support');
    await commonHelpers.clickBackLink();
    await expect(page).toHaveURL('/en/no-pensions-found');
  });
});
