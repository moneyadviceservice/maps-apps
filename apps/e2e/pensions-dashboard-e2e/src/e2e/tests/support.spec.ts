/* eslint-disable playwright/no-networkidle */
import { expect, test } from '@maps/playwright';

import { allNewTestCases } from '../data/scenarioDetails';
import ContactUsWidget from '../pages/components/ContactUsWidget';
import OnlineForm from '../pages/components/OnlineForm';
import Phone from '../pages/components/Phone';
import Webchat from '../pages/components/Webchat';
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
 *
 * Ticket 47782: H&S v4 - UI update and Phone and Webform functionality
 * @tests Test case 49189 [AC1]: Heading and Guidance Content Verification
 * @tests Test case 49194 [AC2]: 'Back to Top' Navigation
 * @tests Test case 49197 [AC3]: Contact Method Layout and Cards
 * @tests Test case 49225 [AC3]: Webchat section
 * @tests Test case 49226 [AC3]: Phone section
 * @tests Test case 49229 [AC3]: Online form section
 * @tests Test case 49199 [AC4]: English Phone Link Functionality
 * @tests Test case 49201 [AC5]: Welsh Phone Link Functionality
 * @tests Test case 49202 [AC6]: Online Form External Navigation
 *
 * Ticket 47782: Webchat functionality
 * @tests Test case 49204 [AC1]: Webchat Pop-up Initialization
 * @tests Test case 49215 [AC2]: Global Widget Visibility & Persistence
 * @tests Test case 49216 [AC3]: Widget Side Banner Options
 * @tests Test case 49220 [AC7]: JavaScript Disabled Graceful Degradation
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
    introText: `We're here to answer your questions and point you to the right information. Contact us using the online form, webchat or by phone.`,
    paragraph:
      "However you choose to get in touch, we're here to help - and you always chat with a real person. While we cannot give financial advice, our trained specialists can help you navigate the Pensions Dashboard and understand your pensions.",
    hyperlink: 'Make a complaint',
    howToContactUsHeading: 'How to contact us',
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

    // Contact Us page
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
    await expect(contactUsPage.getBackToTopAnchor(page)).toHaveAttribute(
      'href',
      '#top',
    );

    const contactUsWidget = new ContactUsWidget(page);
    const button = contactUsWidget.getButton();
    await expect(button).toBeVisible({ timeout: 20000 });
    await button.click();
    await expect(contactUsWidget.getWidget()).toBeVisible();
    await expect(contactUsWidget.getHeader()).toBeVisible();
    await contactUsWidget.getCloseButton().click();

    // Phone component
    const phone = new Phone(page);
    await expect(phone.getHeading()).toBeVisible();
    await expect(phone.getParagraph1()).toBeVisible();
    await expect(phone.getParagraph2()).toBeVisible();
    await expect(phone.getHeading2()).toBeVisible();
    await expect(phone.getParagraph3()).toBeVisible();
    await expect(phone.getParagraph4()).toBeVisible();

    const phoneButton1 = phone.getButton1();
    await expect(phoneButton1).toBeVisible();
    await expect(phoneButton1).toHaveAttribute('href', 'tel:+448000720243');

    const phoneButton2 = phone.getButton2();
    await expect(phoneButton2).toBeVisible();
    await expect(phoneButton2).toHaveAttribute('href', 'tel:+448000720263');

    // Online Form component
    const onlineForm = new OnlineForm(page);
    await expect(onlineForm.getHeading()).toBeVisible();
    await expect(onlineForm.getParagraph1()).toBeVisible();
    await expect(onlineForm.getParagraph2()).toBeVisible();
    await expect(onlineForm.getHeading2()).toBeVisible();
    await expect(onlineForm.getParagraph3()).toBeVisible();
    await expect(onlineForm.getParagraph4()).toBeVisible();

    // Check online form button
    const onlineFormButton = contactUsPage.getOnlineFormButton(page);
    await expect(onlineFormButton).toBeVisible();
    await expect(onlineFormButton).toHaveAttribute('target', '_blank');
    await expect(onlineFormButton).toHaveAttribute('href', /\?aa=mhpd/);

    // Webchat component
    const webchat = new Webchat(page);
    await expect(webchat.getHeading()).toBeVisible();
    await expect(webchat.getParagraph1()).toBeVisible();
    await expect(webchat.getParagraph2()).toBeVisible();
    await expect(webchat.getHeading2()).toBeVisible();
    await expect(webchat.getParagraph3()).toBeVisible();
    await expect(webchat.getParagraph4()).toBeVisible();

    const webchatButton = webchat.getButton();
    await expect(webchatButton).toBeVisible();

    await webchatButton.click();
    const chatFrame = page.frameLocator('iframe[title="Messenger"]');
    const chatWindow = chatFrame.locator('header');
    await expect(chatWindow).toBeVisible({ timeout: 15000 });

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

test.describe('No-JS Tests', () => {
  // This will apply to all tests inside this describe block
  test.use({ javaScriptEnabled: false });

  test('JS Disabled - webchat disabled', async ({ page }) => {
    await commonHelpers.navigateToStartPage(page);
    await supportPages.clickFooterContactUs(page);

    const webchat = new Webchat(page);
    await expect(webchat.getJSErrorMessage()).toBeVisible();
    // 2. Verify the button is disabled
    const button = webchat.getButton();
    await expect(button).toBeDisabled();

    // Optional: Verify it looks disabled (checking the text color class)
    await expect(button).toHaveClass(/text-gray-400/);
  });
});
