import { expect, test } from '@maps/playwright';

import { zTestAllDetails } from '../data/scenarioDetails';
import Timeline from '../pages/components/Timeline';
import contactUsPage from '../pages/ContactUsPage';
import loadingPage from '../pages/LoadingPage';
import pensionDetailsPage from '../pages/PensionDetailsPage';
import pensionBreakdownPage from '../pages/PensionsBreakdownPage';
import pensionsFoundPage from '../pages/PensionsFoundPage';
import scenarioSelectionPage from '../pages/ScenarioSelectionPage';
import welcomePage from '../pages/WelcomePage';
import commonHelpers from '../utils/commonHelpers';

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
  }) => {
    await commonHelpers.navigateToEmulator(page, 'cy');
    await scenarioSelectionPage.selectScenarioComposerDev(
      page,
      'AccessibilityTestMay26',
    );

    await welcomePage.welcomePageLoads(page, 'cy');
    await expect(page).toHaveURL(/\/cy/);
    await welcomePage.clickWelcomeButton(page);
    await loadingPage.waitForPensionsToLoad(page, 'cy');
    await expect(page).toHaveURL(/\/cy/);
    await pensionsFoundPage.waitForPensionsFound(page, 'cy');
    await expect(page).toHaveURL(/\/cy/);
    await pensionsFoundPage.clickSeeYourPensions(page, 'cy');
    await expect(page).toHaveURL(/\/cy/);

    await pensionBreakdownPage.viewDetailsOfPension(page, 'State Pension');
    await pensionDetailsPage.assertHeadingStatePension(page, 'cy');
    await commonHelpers.clickBackLink(page);

    await pensionBreakdownPage.viewDetailsOfPension(page, 'Silver Nest');
    await pensionDetailsPage.assertHeading(page, 'Silver Nest');
    await expect(page).toHaveURL(/\/cy/);
    await pensionDetailsPage.selectTab(page, 'Incwm a gwerthoedd');
    await expect(page).toHaveURL(/\/cy/);
    await pensionDetailsPage.selectTab(page, 'Am y pensiwn hwn');
    await expect(page).toHaveURL(/\/cy/);
    await pensionDetailsPage.selectTab(page, 'Cysylltu â darparwr');
    await expect(page).toHaveURL(/\/cy/);
    await commonHelpers.clickBackLink(page);

    await pensionBreakdownPage.clickPensionsTimelineButton(page, 'cy');
    await expect(page).toHaveURL(/\/cy/);
    const timeline = new Timeline(page);
    await timeline.McCloudAlternativeOption.click();
    await expect(page).toHaveURL(/\/cy/);
    await timeline.McCloudLegacyOption.click();
    await expect(page).toHaveURL(/\/cy/);
    await commonHelpers.clickBackLink(page);
    await commonHelpers.clickHomeLink(page);
    await pensionsFoundPage.clickSeePendingPensions(page, 'cy');
    await expect(page).toHaveURL(/\/cy/);
    await commonHelpers.clickHomeLink(page);
    await pensionsFoundPage.clickReviewPensions(page, 'cy');
    await expect(page).toHaveURL(/\/cy/);
    await commonHelpers.clickHomeLink(page);
    await pensionsFoundPage.clickReportATechnicalProblem(page, 'cy');
    await expect(page).toHaveURL(/\/cy/);
    await commonHelpers.clickBackLink(page);
    await pensionsFoundPage.clickExploreThePensionsDashboard(page, 'cy');
    await expect(page).toHaveURL(/\/cy/);
    await commonHelpers.clickBackLink(page);
    await pensionsFoundPage.clickUnderstandYourPensions(page, 'cy');
    await expect(page).toHaveURL(/\/cy/);
    await commonHelpers.clickBackLink(page);
    await pensionsFoundPage.clickFooterContactUs(page, 'cy');
    await expect(page).toHaveURL(/\/cy/);
    const formButton = contactUsPage.getOnlineFormButton(page);
    await expect(formButton).toHaveAttribute('href', /\/cy/);
    await commonHelpers.clickBackLink(page);
    await commonHelpers.logoutOfApplication(page, 'cy');
  });

  test('Check that it is possible to toggle between English and Welsh language - Pension details', async ({
    page,
  }) => {
    await commonHelpers.navigateToEmulator(page, 'cy');
    await scenarioSelectionPage.selectScenarioComposerDev(
      page,
      zTestAllDetails.option,
    );

    await welcomePage.welcomePageLoads(page, 'cy');
    await expect(page).toHaveURL(/\/cy/);
    await welcomePage.clickWelcomeButton(page);
    await loadingPage.waitForPensionsToLoad(page, 'cy');
    await expect(page).toHaveURL(/\/cy/);
    await pensionsFoundPage.waitForPensionsFound(page, 'cy');
    await expect(page).toHaveURL(/\/cy/);
    await pensionsFoundPage.clickSeeYourPensions(page, 'cy');
    await expect(page).toHaveURL(/\/cy/);
    await pensionBreakdownPage.viewDetailsOfPension(page, 'State Pension');
    await pensionDetailsPage.assertHeadingStatePension(page, 'cy');
    await commonHelpers.switchLanguage(page, 'en');
    await commonHelpers.switchLanguage(page, 'cy');
    await expect(page).toHaveURL(/\/cy/);
    await commonHelpers.clickBackLink(page);
    await pensionBreakdownPage.viewDetailsOfPension(page, 'Your 21st Trust');
    await pensionDetailsPage.assertHeading(page, 'Your 21st Trust');
    await commonHelpers.switchLanguage(page, 'en');
    await commonHelpers.switchLanguage(page, 'cy');
    await pensionDetailsPage.selectTab(page, 'Incwm a gwerthoedd');
    await page.waitForURL('**/cy/pension-details/pension-income-and-values');
    await commonHelpers.switchLanguage(page, 'en');
    await commonHelpers.switchLanguage(page, 'cy');
    await pensionDetailsPage.selectTab(page, 'Am y pensiwn hwn');
    await page.waitForURL('**/cy/pension-details/about-this-pension');
    await commonHelpers.switchLanguage(page, 'en');
    await commonHelpers.switchLanguage(page, 'cy');
    await pensionDetailsPage.selectTab(page, 'Cysylltu â darparwr');
    await expect(page).toHaveURL(
      '/cy/pension-details/contact-pension-provider',
    );
    await commonHelpers.switchLanguage(page, 'en');
    await commonHelpers.switchLanguage(page, 'cy');
    await expect(page).toHaveURL(/\/cy/);
  });
});
