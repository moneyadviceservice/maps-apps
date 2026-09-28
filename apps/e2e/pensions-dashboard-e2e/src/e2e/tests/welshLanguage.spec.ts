import { expect, test } from '@maps/playwright';

import { zTestAllDetails } from '../data/scenarioDetails';

/**
 * Ticket 50535: FE - Add Welsh Language Toggle
 * @tests Test Case 51545 [AC1] Click 'Cymraeg' in page header to switch to Welsh language
 * @tests Test Case 51560 [AC2] Click 'English' in Page Header
 *
 * Ticket 48051: FE - Welsh Implementation
 * @tests Test Case 50629 [AC0] Language does not flip to English when navigating between Welsh pages
 *
 * Ticket 51126: FE - Welsh Implementation - Contact form
 * @tests Test Case 51656 [AC1] Verify Contact form displays Welsh language
 */
test.describe('Welsh language tests', () => {
  test('Check that welsh language journey is unbroken when navigating through pages', async ({
    page,
    commonHelpers,
    contactUsPage,
    loadingPage,
    pensionBreakdownPage,
    pensionDetailsPage,
    pensionsFoundPage,
    timeline,
    scenarioSelectionPage,
    welcomePage,
  }) => {
    await commonHelpers.navigateToEmulator('cy');
    await scenarioSelectionPage.selectScenarioComposerDev(
      'AccessibilityTestMay26',
    );

    await welcomePage.welcomePageLoads('cy');
    await expect(page).toHaveURL(/\/cy/);
    await welcomePage.clickWelcomeButton();
    await loadingPage.waitForPensionsToLoad(commonHelpers, 'cy');
    await expect(page).toHaveURL(/\/cy/);
    await pensionsFoundPage.waitForPensionsFound('cy');
    await expect(page).toHaveURL(/\/cy/);
    await pensionsFoundPage.clickSeeYourPensions('cy');
    await expect(page).toHaveURL(/\/cy/);

    await pensionBreakdownPage.viewDetailsOfPension('State Pension');
    await pensionDetailsPage.assertHeadingStatePension('cy');
    await commonHelpers.clickBackLink();

    await pensionBreakdownPage.viewDetailsOfPension('Silver Nest');
    await pensionDetailsPage.assertHeading('Silver Nest');
    await expect(page).toHaveURL(/\/cy/);
    await pensionDetailsPage.selectTab('Incwm a gwerthoedd');
    await expect(page).toHaveURL(/\/cy/);
    await pensionDetailsPage.selectTab('Am y pensiwn hwn');
    await expect(page).toHaveURL(/\/cy/);
    await pensionDetailsPage.selectTab('Cysylltu â darparwr');
    await expect(page).toHaveURL(/\/cy/);
    await commonHelpers.clickBackLink();

    await pensionBreakdownPage.clickPensionsTimelineButton('cy');
    await expect(page).toHaveURL(/\/cy/);
    await timeline.McCloudAlternativeOption.click();
    await expect(page).toHaveURL(/\/cy/);
    await timeline.McCloudLegacyOption.click();
    await expect(page).toHaveURL(/\/cy/);
    await commonHelpers.clickBackLink();
    await commonHelpers.clickHomeLink();
    await pensionsFoundPage.clickReviewPensions('cy');
    await expect(page).toHaveURL(/\/cy/);
    await commonHelpers.clickHomeLink();
    await pensionsFoundPage.clickReportATechnicalProblem('cy');
    await expect(page).toHaveURL(/\/cy/);
    await commonHelpers.clickBackLink();
    await pensionsFoundPage.clickExploreThePensionsDashboard('cy');
    await expect(page).toHaveURL(/\/cy/);
    await commonHelpers.clickBackLink();
    await pensionsFoundPage.clickUnderstandYourPensions('cy');
    await expect(page).toHaveURL(/\/cy/);
    await commonHelpers.clickBackLink();
    await pensionsFoundPage.clickFooterContactUs('cy');
    await expect(page).toHaveURL(/\/cy/);
    const formButton = contactUsPage.onlineFormButton;
    await expect(formButton).toHaveAttribute('href', /\/cy/);
    await commonHelpers.clickBackLink();
    await commonHelpers.logoutOfApplication('cy');
  });

  test('Check that it is possible to toggle between English and Welsh language - Pension details', async ({
    page,
    commonHelpers,
    loadingPage,
    pensionBreakdownPage,
    pensionDetailsPage,
    pensionsFoundPage,
    scenarioSelectionPage,
    welcomePage,
  }) => {
    await commonHelpers.navigateToEmulator('cy');
    await scenarioSelectionPage.selectScenarioComposerDev(
      zTestAllDetails.option,
    );

    await welcomePage.welcomePageLoads('cy');
    await expect(page).toHaveURL(/\/cy/);
    await welcomePage.clickWelcomeButton();
    await loadingPage.waitForPensionsToLoad(commonHelpers, 'cy');
    await expect(page).toHaveURL(/\/cy/);
    await pensionsFoundPage.waitForPensionsFound('cy');
    await expect(page).toHaveURL(/\/cy/);
    await pensionsFoundPage.clickSeeYourPensions('cy');
    await expect(page).toHaveURL(/\/cy/);
    await pensionBreakdownPage.viewDetailsOfPension('State Pension');
    await pensionDetailsPage.assertHeadingStatePension('cy');
    await commonHelpers.switchLanguage('en');
    await commonHelpers.switchLanguage('cy');
    await expect(page).toHaveURL(/\/cy/);
    await commonHelpers.clickBackLink();
    await pensionBreakdownPage.viewDetailsOfPension('Your 21st Trust');
    await pensionDetailsPage.assertHeading('Your 21st Trust');
    await commonHelpers.switchLanguage('en');
    await commonHelpers.switchLanguage('cy');
    await pensionDetailsPage.selectTab('Incwm a gwerthoedd');
    await page.waitForURL('**/cy/pension-details/pension-income-and-values');
    await commonHelpers.switchLanguage('en');
    await commonHelpers.switchLanguage('cy');
    await pensionDetailsPage.selectTab('Am y pensiwn hwn');
    await page.waitForURL('**/cy/pension-details/about-this-pension');
    await commonHelpers.switchLanguage('en');
    await commonHelpers.switchLanguage('cy');
    await pensionDetailsPage.selectTab('Cysylltu â darparwr');
    await expect(page).toHaveURL(
      '/cy/pension-details/contact-pension-provider',
    );
    await commonHelpers.switchLanguage('en');
    await commonHelpers.switchLanguage('cy');
    await expect(page).toHaveURL(/\/cy/);
  });
});
