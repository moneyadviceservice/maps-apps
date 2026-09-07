import { expect, test } from '@maps/playwright';

import { allNewTestCases } from '../data/scenarioDetails';
import BSL from '../pages/components/BSL';
import ContactUsWidget from '../pages/components/ContactUsWidget';
import DidYouUnderstand from '../pages/components/DidYouUnderstandThisPage';
import Interpreter from '../pages/components/Interpreter';
import OnlineForm from '../pages/components/OnlineForm';
import Phone from '../pages/components/Phone';
import RelayUK from '../pages/components/RelayUK';
import Webchat from '../pages/components/Webchat';
import WhatsApp from '../pages/components/WhatsApp';
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
 *
 * Ticket 43376: Send sessionID to ops w/webform
 * @tests Test case 51231 [AC1]: Session ID passed via query parameter into webform URL when logged in
 * @tests Test case 51232 [AC1]: Session ID passed via query parameter into webform URL when logged out
 *
 * @tests User Story 51449: 'Did you understand this page' component
 * @tests Test Case 52054: [AC1] Welcome page
 * @tests Test Case 52055: [AC1] Explore pensions dashboard
 * @tests Test Case 52056: [AC1] Understand Your Pensions
 *
 * @tests User Story 53640: FE - WhatsApp and design amendments - /contact-us-form page
 * @tests Test Case 56178: 53640 AC2 Test Case 2 : Wording change on Contact us page
 * @tests Test Case 56180: 53640 AC4 Test Case 4 : Verify phone option dynamic number by language
 * @tests Test Case 56181: 53640 AC5 Test Case 5 : Verify Online form option text on Contact us page
 * @tests Test Case 56186: 53640 AC6 Test Case 6 : Verify WhatsApp option on Contact us page (using webpage - App not installed)
 * @tests Test Case 56179: 53640 AC3 Test Case 3: Verify Webchat option with Javascript Disabled
 *
 * @tests User Story 52475: FE - WhatsApp - Contact Us widget
 * @tests Test Case 56389: 52475 AC2 Test Case 2 - Verify WhatsApp number on Contact Us widget
 * @tests Test Case 56388: 52475 AC 1 Test Case 1 - WhatsApp option on Contact us Widget
 * @tests Test Case 56390: 52475 AC2 Test Case 3 - Verify WhatsApp links via contact us widget (using webpage - App not installed))
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
    download: 'https://www.whatsapp.com/download',
  };

  const heading: { [key in string]: string } = {
    explore: 'Explore the Pensions Dashboard',
    understand: 'Understand your pensions',
    report: 'Report a technical problem',
    contact: 'Contact us',
  };

  const contactUs: { [key in string]: string } = {
    pageTitle: 'Contact us',
    introText: `However you choose to get in touch, we’re here to help - and you’ll always chat with a real person.`,
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
    const didYouUnderstandComponent = new DidYouUnderstand(page);
    await expect(didYouUnderstandComponent.getFeedbackBanner()).toBeVisible();
    await welcomePage.clickWelcomeButton(page);
    await loadingPage.waitForPensionsToLoad(page);
    await pensionsFoundPage.waitForPensionsFound(page);

    // understand > explore > report > explore > explore > contact
    await supportPages.findLinkAndSelect(page, heading.understand);
    expect(page.url()).toContain(URL.understand);
    await expect(didYouUnderstandComponent.getFeedbackBanner()).toBeVisible();
    await supportPages.findLinkAndSelect(page, heading.explore);
    expect(page.url()).toContain(URL.explore);
    await expect(didYouUnderstandComponent.getFeedbackBanner()).toBeVisible();
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
    await pensionsFoundPage.clickFooterContactUs(page, 'en');
    await expect(page).toHaveURL(URL.contact);
    await supportPages.findBackButtonAndSelect(page, heading.contact);
    await expect(page).toHaveURL(URL.pensions);

    // Contact Us page
    await pensionsFoundPage.clickHelpAndSupportContactUs(page);
    await expect(page).toHaveURL(URL.contact);
    await expect(contactUsPage.getPageTitle(page)).toHaveText(
      contactUs.pageTitle,
    );
    await expect(contactUsPage.getIntroText(page)).toHaveText(
      contactUs.introText,
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
    //Assert WhatsApp option in widget
    await expect(contactUsWidget.getWhatsAppButton()).toBeVisible();
    await contactUsWidget.clickWhatsAppButton(page);
    await expect(contactUsWidget.getWhatsAppNumberLink()).toBeVisible();
    await expect(contactUsWidget.getWhatsAppNumberLink()).toHaveAttribute(
      'href',
      'https://wa.me/447985740907',
    );
    //WhatsApp click download link opens new page
    const downloadPage = await contactUsWidget.clickWidgetWhatsAppDownloadLink(
      page,
    );
    expect(downloadPage.url()).toContain(URL.download);
    await downloadPage.close();
    //close widget
    await contactUsWidget.getCloseButton().click();
    await expect(contactUsWidget.getWidget()).toBeHidden();

    // Phone component
    const phone = new Phone(page);
    await expect(phone.getHeading()).toBeVisible();
    await expect(phone.getParagraph1()).toBeVisible();
    await expect(phone.getParagraph2()).toBeVisible();
    await expect(phone.getParagraph3()).toBeVisible();
    await expect(phone.getParagraph4()).toBeVisible();

    const phoneButton = phone.getButton();
    await expect(phoneButton).toBeVisible();
    await expect(phoneButton).toHaveAttribute('href', 'tel:+448000720243');

    // Online Form component
    const onlineForm = new OnlineForm(page);
    await expect(onlineForm.getHeading()).toBeVisible();
    await expect(onlineForm.getParagraph1()).toBeVisible();
    await expect(onlineForm.getParagraph2()).toBeVisible();
    await expect(onlineForm.getParagraph3()).toBeVisible();
    await expect(onlineForm.getParagraph4()).toBeVisible();

    // Check online form button
    const onlineFormButton = contactUsPage.getOnlineFormButton(page);
    await expect(onlineFormButton).toBeVisible();
    await expect(onlineFormButton).toHaveAttribute('target', '_blank');
    await expect(onlineFormButton).toHaveAttribute('href', /\?aa=mhpd+/);
    await expect(onlineFormButton).toHaveAttribute(
      'href',
      /sessionID=[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/i,
    );

    // Webchat component
    const webchat = new Webchat(page);
    await expect(webchat.getHeading()).toBeVisible();
    await expect(webchat.getParagraph1()).toBeVisible();
    await expect(webchat.getParagraph2()).toBeVisible();
    await expect(webchat.getParagraph3()).toBeVisible();
    await expect(webchat.getParagraph4()).toBeVisible();

    const webchatButton = webchat.getButton();
    await expect(webchatButton).toBeVisible();

    await webchatButton.click();
    const chatFrame = page.frameLocator('iframe[title="Messenger"]');
    const chatWindow = chatFrame.locator('header');
    await expect(chatWindow).toBeVisible({ timeout: 15000 });
    await webchat.closeWebchatWindow(page);
    await expect(chatWindow).not.toBeVisible({ timeout: 15000 });

    // WhatsApp component
    const whatsApp = new WhatsApp(page);
    await expect(whatsApp.getHeading()).toBeVisible();
    await expect(whatsApp.getParagraph1()).toBeVisible();
    await expect(whatsApp.getParagraph2()).toBeVisible();
    await expect(whatsApp.getParagraph3()).toBeVisible();
    await expect(whatsApp.getParagraph4()).toBeVisible();
    await expect(whatsApp.getParagraph5()).toBeVisible();

    const whatsAppButton = whatsApp.getButton();
    await expect(whatsAppButton).toBeVisible();
    await expect(whatsAppButton).toHaveAttribute(
      'href',
      'https://wa.me/447985740907',
    );

    //WhatsApp click download link opens new page
    const newPage = await whatsApp.clickWhatsAppDownloadLink(page);
    expect(newPage.url()).toContain(URL.download);
    await newPage.close();

    // Accessibility section
    await expect(contactUsPage.getAccessibleOptionsHeading(page)).toBeVisible();

    // Relay UK component
    const relayUK = new RelayUK(page);
    await expect(relayUK.getHeading()).toBeVisible();
    await expect(relayUK.getDropdownTitle()).toBeVisible();
    await relayUK.getDropdownTitle().click();
    await expect(relayUK.getDropdownText()).toBeVisible();

    const relayUKLink = relayUK.getLink();
    await expect(relayUKLink).toBeVisible();
    await expect(relayUKLink).toHaveAttribute(
      'href',
      'https://www.relayuk.bt.com/',
    );
    await expect(relayUKLink).toHaveAttribute('target', '_blank');
    await expect(relayUKLink).toHaveAttribute('rel', /noopener|noreferrer/);

    // BSL component
    const bsl = new BSL(page);
    await expect(bsl.getHeading()).toBeVisible();
    await expect(bsl.getDropdownTitle()).toBeVisible();
    await bsl.getDropdownTitle().click();
    await expect(bsl.getDropdownText()).toBeVisible();

    const bslLink = bsl.getLink();
    await expect(bslLink).toBeVisible();
    await expect(bslLink).toHaveAttribute(
      'href',
      'https://connect.interpreterslive.co.uk/vrs?ilc=MoneyHelper',
    );
    await expect(bslLink).toHaveAttribute('target', '_blank');
    await expect(bslLink).toHaveAttribute('rel', /noopener|noreferrer/);

    // Interpreter component
    const interpreter = new Interpreter(page);
    await expect(interpreter.getHeading()).toBeVisible();
    await expect(interpreter.getDropdownTitle()).toBeVisible();
    await interpreter.getDropdownTitle().click();
    await expect(interpreter.getDropdownText()).toBeVisible();

    const interpreterPhoneLink = interpreter.getLink();
    await expect(interpreterPhoneLink).toBeVisible();
    await expect(interpreterPhoneLink).toHaveAttribute(
      'href',
      'tel:+448000720243',
    );

    // Back to pensions found page
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
    // Logged out access to page not found page
    await commonHelpers.navigateToStartPage(page);
    await pensionsFoundPage.clickFooterContactUs(page, 'en');
    await expect(page).toHaveURL(URL.contact);
    await expect(contactUsPage.getBackButton(page)).toBeHidden();

    const onlineFormButton = contactUsPage.getOnlineFormButton(page);
    await expect(onlineFormButton).toHaveAttribute(
      'href',
      /\?aa=mhpd&sessionID=/,
    );

    // Contact us page access from Page Not Found page
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

  test(
    'JS Disabled - webchat disabled',
    { tag: '@jsdisabled' },
    async ({ page }) => {
      await commonHelpers.navigateToStartPage(page);
      await pensionsFoundPage.clickFooterContactUs(page, 'en');

      const webchat = new Webchat(page);
      await expect(webchat.getJSErrorMessage()).toBeVisible();
      // 2. Verify the button is disabled
      const button = webchat.getButton();
      await expect(button).toBeDisabled();

      // Optional: Verify it looks disabled (checking the text color class)
      await expect(button).toHaveClass(/text-gray-400/);
    },
  );
});
