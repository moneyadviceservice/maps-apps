/* eslint-disable playwright/no-networkidle */
import { expect, test } from '@maps/playwright';

import { allNewTestCases } from '../data/scenarioDetails';
import contactUsPage from '../pages/ContactUsPage';
import loadingPage from '../pages/LoadingPage';
import pageNotFoundPage from '../pages/PageNotFoundPage';
import pensionsFoundPage from '../pages/PensionsFoundPage';
import scenarioSelectionPage from '../pages/ScenarioSelectionPage';
import supportPages from '../pages/SupportPages';
import welcomePage from '../pages/WelcomePage';
import commonHelpers from '../utils/commonHelpers';

/**
 * Ticket 42781: H&S Implementation - H&S Banner
 * @tests Test case 44639 [AC1] Contact Us link visible in H&S Banner
 * @tests Test case 44649 [AC2] Contact Us link in H&S Banner directs to Contact Us page
 *
 * Ticket 44015: H&S Implementation - Report a technical problem page
 * @tests Test case 44642 [AC1] Contact Us button present on Report a Technical Problem page
 * @tests Test case 44643 [AC2] Navigate to Contact Us page from Report a Technical Problem page
 *
 * Ticket 43956: H&S Implementation - Not what you're looking for?
 * @tests Test case 44645 [AC1] Contact Us link present in banner on Explore the Pensions Dashboard page
 * @tests Test case 44646 [AC2] Contact Us link present in banner on Understand Your Pensions page
 * @tests Test case 44648 [AC3] Report a Technical Problem page banner is unchanged
 *
 * Ticket 43973: H&S Implementation - New page - /contact-us-form
 * @tests Test case 44620 [AC1 - AC2] Contact Us page content
 * @tests Test case 44622 [AC3] Make a Complaint link opens in new tab
 * @tests Test case 44623 [AC4] Possible to enter details into and submit Contact Us webform
 * @tests Test case 44625 [AC5] Exit help and support button clickable when logged in
 * @tests Test case 44626 [AC5] Exit help and support option not visible after entering from FIND journey
 *
 * Ticket 44301: Page not found - Contact Us update
 * @tests Test case 44651 [AC1] Contact us link present on Page Not Found page
 * @tests Test case 44652 [AC2] Contact Us link redirects to Contact Us form from Page Not Found page
 *
 * Ticket 45557: Contact Us footer link
 * @tests Test case 45983 [AC1] 'Contact us' in footer redirects to internal /contact-us-form page while logged in
 * @tests Test case 45984 [AC2] 'Contact us' in footer redirects to external /contact-us-form page while logged out
 *
 * Ticket 45481: Remove H&S banner when not logged in
 * @tests Test case 47378 [AC1 - AC3] No External Access to H&S Banner
 * @tests Test case 47379 [AC4] Internal Access to H&S Banner
 */

test.describe('Moneyhelper Pension Dashboard Support Pages', () => {
  const URL: { [key in string]: string } = {
    homepage: '/en',
    pensions: '/en/your-pension-search-results',
    explore: '/en/support/explore-the-pensions-dashboard',
    understand: '/en/support/understand-your-pensions',
    report: '/en/support/report-a-technical-problem',
    contact: '/en/contact-us-form',
    error: '/en/madeupurl',
  };

  const heading: { [key in string]: string } = {
    explore: 'Explore the Pensions Dashboard',
    understand: 'Understand your pensions',
    report: 'Report a technical problem',
    contact: 'Contact us',
  };

  const contactUs: { [key in string]: string } = {
    pageTitle: 'Contact us',
    introText: `We're still building and improving our service. Please send us your query or tell us about any issues in as much detail as possible.`,
    paragraph:
      'Your feedback will help improve the MoneyHelper Pensions Dashboard.',
    hyperlink: 'Make a complaint',
    webformButton: 'Submit a webform',
  };

  const pageNotFound: { [key in string]: string } = {
    pageTitle: 'Sorry we couldn’t find the page you’re looking for',
  };

  test('Support pages', async ({ page }) => {
    await commonHelpers.navigateToEmulator(page);
    await commonHelpers.setCookieConsentAccepted(page);
    await scenarioSelectionPage.selectScenarioComposerDev(
      page,
      allNewTestCases.option,
    );
    await welcomePage.welcomePageLoads(page);
    await welcomePage.clickWelcomeButton(page);
    await loadingPage.waitForPensionsToLoad(page);
    await pensionsFoundPage.waitForPensionsFound(page);

    // understand > explore > report > explore > explore > contact
    await supportPages.findLinkAndSelect(page, heading.understand);
    expect(page.url()).toContain(URL.understand);
    await supportPages.findLinkAndSelect(page, heading.explore);
    expect(page.url()).toContain(URL.explore);
    await supportPages.findLinkAndSelect(page, heading.report);
    expect(page.url()).toContain(URL.report);
    await supportPages.findLinkAndSelect(page, heading.explore);
    expect(page.url()).toContain(URL.explore);
    await supportPages.clickContactUsSupportButton(page);
    await expect(page).toHaveURL(URL.contact);
    await supportPages.findBackButtonAndSelect(page, heading.contact);
    await expect(page).toHaveURL(URL.pensions);

    // understand > report > understand > understand > contact > pensions > report > contact > pensions dashboard > contact
    await supportPages.findLinkAndSelect(page, heading.understand);
    expect(page.url()).toContain(URL.understand);
    await supportPages.findLinkAndSelect(page, heading.report);
    expect(page.url()).toContain(URL.report);
    await supportPages.findLinkAndSelect(page, heading.understand);
    expect(page.url()).toContain(URL.understand);
    await supportPages.clickContactUsSupportButton(page);
    await expect(page).toHaveURL(URL.contact);
    await supportPages.findBackButtonAndSelect(page, heading.contact);
    await expect(page).toHaveURL(URL.pensions);
    await supportPages.findLinkAndSelect(page, heading.report);
    await supportPages.clickContactUsWelcomeButton(page);
    await expect(page).toHaveURL(URL.contact);
    await supportPages.findBackButtonAndSelect(page, heading.contact);
    await expect(page).toHaveURL(URL.pensions);
    await supportPages.clickFooterContactUs(page);
    await expect(page).toHaveURL(URL.contact);
    await supportPages.findBackButtonAndSelect(page, heading.contact);
    await expect(page).toHaveURL(URL.pensions);

    // contact us page
    await supportPages.clickHelpAndSupportContactUs(page);
    await expect(page).toHaveURL(URL.contact);
    await expect(contactUsPage.getPageTitle(page)).toHaveText(
      contactUs.pageTitle,
    );
    await expect(contactUsPage.getIntroText(page)).toHaveText(
      contactUs.introText,
    );
    await expect(contactUsPage.getParagraph(page)).toHaveText(
      contactUs.paragraph,
    );
    await expect(contactUsPage.getHyperlink(page)).toContainText(
      contactUs.hyperlink,
    );

    // Check webform button
    const webformButton = contactUsPage.getWebformButton(page);
    await expect(webformButton).toBeVisible();
    await expect(webformButton).toContainText(contactUs.webformButton);
    await expect(webformButton).toHaveAttribute('target', '_blank');
    await expect(webformButton).toHaveAttribute('href', /\?aa=mhpd/);

    await supportPages.findBackButtonAndSelect(page, heading.contact);
    await expect(page).toHaveURL(URL.pensions);

    // Internal error page
    await page.goto(URL.error);
    await expect(pageNotFoundPage.getHelpAndSupportBanner(page)).toBeVisible();
    await expect(pageNotFoundPage.getBackToTopAnchor(page)).toBeVisible();
    const popupPromise = page.waitForEvent('popup');
    await pageNotFoundPage.clickContactUsLink(page);
    const newTab = await popupPromise;
    await expect(newTab).toHaveURL(URL.contact);
  });

  test('Logged out - External error page and access to contact us', async ({
    page,
  }) => {
    await commonHelpers.navigateToStartPage(page);
    await supportPages.clickFooterContactUs(page);
    await expect(page).toHaveURL(URL.contact);
    await expect(contactUsPage.getBackButton(page)).toBeHidden();

    await page.goto(URL.pensions);
    await expect(pageNotFoundPage.getPageTitle(page)).toHaveText(
      pageNotFound.pageTitle,
    );
    await expect(pageNotFoundPage.getHelpAndSupportBanner(page)).toBeHidden();
    await expect(pageNotFoundPage.getBackToTopAnchor(page)).toBeHidden();
    const popupPromise = page.waitForEvent('popup');
    await pageNotFoundPage.clickContactUsLink(page);
    const newTab = await popupPromise;
    await expect(newTab).toHaveURL(URL.contact);
    await expect(contactUsPage.getBackButton(page)).toBeHidden();
  });
});
