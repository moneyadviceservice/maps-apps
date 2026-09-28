import { expect, test } from '@maps/playwright';

import { allNewTestCases } from '../data/scenarioDetails';

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

  test('Support pages', async ({
    page,
    bsl,
    commonHelpers,
    contactUsPage,
    contactUsWidget,
    didYouUnderstand,
    interpreter,
    loadingPage,
    onlineForm,
    pageNotFoundPage,
    pensionsFoundPage,
    phone,
    relayUK,
    scenarioSelectionPage,
    supportPages,
    webchat,
    welcomePage,
    whatsApp,
  }) => {
    await commonHelpers.navigateToEmulator('en');
    await commonHelpers.setCookieConsentAccepted();
    await scenarioSelectionPage.selectScenarioComposerDev(
      allNewTestCases.option,
    );
    await welcomePage.welcomePageLoads();
    await expect(didYouUnderstand.feedbackBanner).toBeVisible();
    await welcomePage.clickWelcomeButton();
    await loadingPage.waitForPensionsToLoad(commonHelpers, 'en');
    await pensionsFoundPage.waitForPensionsFound();

    // understand > explore > report > explore > explore > contact
    await supportPages.findLinkAndSelect(heading.understand);
    expect(page.url()).toContain(URL.understand);
    await expect(didYouUnderstand.feedbackBanner).toBeVisible();
    await supportPages.findLinkAndSelect(heading.explore);
    expect(page.url()).toContain(URL.explore);
    await expect(didYouUnderstand.feedbackBanner).toBeVisible();
    await supportPages.findLinkAndSelect(heading.report);
    expect(page.url()).toContain(URL.report);
    await supportPages.findLinkAndSelect(heading.explore);
    expect(page.url()).toContain(URL.explore);
    await supportPages.clickContactUsSupportButton();
    await expect(page).toHaveURL(URL.contact);
    await supportPages.findBackButtonAndSelect(heading.contact);
    await expect(page).toHaveURL(URL.pensions);

    // understand > report > understand > understand > contact > pensions > report > contact > pensions dashboard > contact
    await supportPages.findLinkAndSelect(heading.understand);
    expect(page.url()).toContain(URL.understand);
    await supportPages.findLinkAndSelect(heading.report);
    expect(page.url()).toContain(URL.report);
    await supportPages.findLinkAndSelect(heading.understand);
    expect(page.url()).toContain(URL.understand);
    await supportPages.clickContactUsSupportButton();
    await expect(page).toHaveURL(URL.contact);
    await supportPages.findBackButtonAndSelect(heading.contact);
    await expect(page).toHaveURL(URL.pensions);
    await supportPages.findLinkAndSelect(heading.report);
    await supportPages.clickContactUsWelcomeButton();
    await expect(page).toHaveURL(URL.contact);
    await supportPages.findBackButtonAndSelect(heading.contact);
    await expect(page).toHaveURL(URL.pensions);
    await pensionsFoundPage.clickFooterContactUs('en');
    await expect(page).toHaveURL(URL.contact);
    await supportPages.findBackButtonAndSelect(heading.contact);
    await expect(page).toHaveURL(URL.pensions);

    // Contact Us page
    await pensionsFoundPage.clickHelpAndSupportContactUs();
    await expect(page).toHaveURL(URL.contact);
    await expect(contactUsPage.pageTitle).toHaveText(contactUs.pageTitle);
    await expect(contactUsPage.introText).toHaveText(contactUs.introText);
    await expect(contactUsPage.hyperlink).toContainText(contactUs.hyperlink);
    await expect(contactUsPage.backToTopAnchor).toHaveAttribute('href', '#top');

    const button = contactUsWidget.button;
    await expect(button).toBeVisible({ timeout: 20000 });
    await button.click();
    await expect(contactUsWidget.widget).toBeVisible();
    await expect(contactUsWidget.header).toBeVisible();
    //Assert WhatsApp option in widget
    await expect(contactUsWidget.whatsAppButton).toBeVisible();
    await contactUsWidget.clickWhatsAppButton();
    await expect(contactUsWidget.whatsAppNumberLink).toBeVisible();
    await expect(contactUsWidget.whatsAppNumberLink).toHaveAttribute(
      'href',
      'https://wa.me/447985740907',
    );
    //WhatsApp click download link opens new page
    const downloadPage = await contactUsWidget.clickWidgetWhatsAppDownloadLink(
      commonHelpers,
    );
    expect(downloadPage.url()).toContain(URL.download);
    await downloadPage.close();
    //close widget
    await contactUsWidget.closeButton.click();
    await expect(contactUsWidget.widget).toBeHidden();

    // Phone component
    await expect(phone.heading).toBeVisible();
    await expect(phone.paragraph1).toBeVisible();
    await expect(phone.paragraph2).toBeVisible();
    await expect(phone.paragraph3).toBeVisible();
    await expect(phone.paragraph4).toBeVisible();

    const phoneButton = phone.button;
    await expect(phoneButton).toBeVisible();
    await expect(phoneButton).toHaveAttribute('href', 'tel:+448000720243');

    // Online Form component
    await expect(onlineForm.heading).toBeVisible();
    await expect(onlineForm.paragraph1).toBeVisible();
    await expect(onlineForm.paragraph2).toBeVisible();
    await expect(onlineForm.paragraph3).toBeVisible();
    await expect(onlineForm.paragraph4).toBeVisible();

    // Check online form button
    const onlineFormButton = contactUsPage.onlineFormButton;
    await expect(onlineFormButton).toBeVisible();
    await expect(onlineFormButton).toHaveAttribute('target', '_blank');
    await expect(onlineFormButton).toHaveAttribute('href', /\?aa=mhpd+/);
    await expect(onlineFormButton).toHaveAttribute(
      'href',
      /sessionID=[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/i,
    );

    // WhatsApp component
    await expect(whatsApp.heading).toBeVisible();
    await expect(whatsApp.paragraph1).toBeVisible();
    await expect(whatsApp.paragraph2).toBeVisible();
    await expect(whatsApp.paragraph3).toBeVisible();
    await expect(whatsApp.paragraph4).toBeVisible();
    await expect(whatsApp.paragraph5).toBeVisible();

    const whatsAppButton = whatsApp.button;
    await expect(whatsAppButton).toBeVisible();
    await expect(whatsAppButton).toHaveAttribute(
      'href',
      'https://wa.me/447985740907',
    );

    //WhatsApp click download link opens new page
    const newPage = await whatsApp.clickWhatsAppDownloadLink();
    expect(newPage.url()).toContain(URL.download);
    await newPage.close();

    // Accessibility section
    await expect(contactUsPage.accessibleOptionsHeading).toBeVisible();

    // Relay UK component
    await expect(relayUK.heading).toBeVisible();
    await expect(relayUK.dropdownTitle).toBeVisible();
    await relayUK.dropdownTitle.click();
    await expect(relayUK.dropdownText).toBeVisible();

    const relayUKLink = relayUK.link;
    await expect(relayUKLink).toBeVisible();
    await expect(relayUKLink).toHaveAttribute(
      'href',
      'https://www.relayuk.bt.com/',
    );
    await expect(relayUKLink).toHaveAttribute('target', '_blank');
    await expect(relayUKLink).toHaveAttribute('rel', /noopener|noreferrer/);

    // BSL component
    await expect(bsl.heading).toBeVisible();
    await expect(bsl.dropdownTitle).toBeVisible();
    await bsl.dropdownTitle.click();
    await expect(bsl.dropdownText).toBeVisible();

    const bslLink = bsl.link;
    await expect(bslLink).toBeVisible();
    await expect(bslLink).toHaveAttribute(
      'href',
      'https://connect.interpreterslive.co.uk/vrs?ilc=MoneyHelper',
    );
    await expect(bslLink).toHaveAttribute('target', '_blank');
    await expect(bslLink).toHaveAttribute('rel', /noopener|noreferrer/);

    // Interpreter component
    await expect(interpreter.heading).toBeVisible();
    await expect(interpreter.dropdownTitle).toBeVisible();
    await interpreter.dropdownTitle.click();
    await expect(interpreter.dropdownText).toBeVisible();

    const interpreterPhoneLink = interpreter.link;
    await expect(interpreterPhoneLink).toBeVisible();
    await expect(interpreterPhoneLink).toHaveAttribute(
      'href',
      'tel:+448000720243',
    );

    // Webchat component
    await expect(webchat.heading).toBeVisible();
    await expect(webchat.paragraph1).toBeVisible();
    await expect(webchat.paragraph2).toBeVisible();
    await expect(webchat.paragraph3).toBeVisible();
    await expect(webchat.paragraph4).toBeVisible();

    const webchatButton = webchat.button;
    await expect(webchatButton).toBeVisible();

    await webchatButton.click();
    const chatFrame = page.frameLocator('iframe[title="Messenger"]');
    const chatWindow = chatFrame.locator('header');
    await expect(chatWindow).toBeVisible({ timeout: 30000 });

    // Back to pensions found page
    await supportPages.findBackButtonAndSelect(heading.contact);
    await expect(page).toHaveURL(URL.pensions);

    // Internal error page
    await page.goto(URL.error);
    await expect(pageNotFoundPage.helpAndSupportBanner).toBeVisible();
    await expect(pageNotFoundPage.backToTopAnchor).toBeVisible();
    const popupPromise = page.waitForEvent('popup');
    await pageNotFoundPage.clickContactUsLink();
    const newTab = await popupPromise;
    await expect(newTab).toHaveURL(URL.contact);
  });

  test('Logged out - External error page and access to contact us', async ({
    page,
    commonHelpers,
    contactUsPage,
    pageNotFoundPage,
    pensionsFoundPage,
  }) => {
    // Logged out access to page not found page
    await commonHelpers.navigateToStartPage();
    await pensionsFoundPage.clickFooterContactUs('en');
    await expect(page).toHaveURL(URL.contact);
    await expect(contactUsPage.backButton).toBeHidden();

    const onlineFormButton = contactUsPage.onlineFormButton;
    await expect(onlineFormButton).toHaveAttribute(
      'href',
      /\?aa=mhpd&sessionID=/,
    );

    // Contact us page access from Page Not Found page
    await page.goto(URL.pensions);
    await expect(pageNotFoundPage.pageTitle).toHaveText(pageNotFound.pageTitle);
    await expect(pageNotFoundPage.helpAndSupportBanner).toBeHidden();
    await expect(pageNotFoundPage.backToTopAnchor).toBeHidden();
    const popupPromise = page.waitForEvent('popup');
    await pageNotFoundPage.clickContactUsLink();
    const newTab = await popupPromise;
    await expect(newTab).toHaveURL(URL.contact);
    await expect(contactUsPage.backButton).toBeHidden();
  });
});

test.describe('No-JS Tests', () => {
  // This will apply to all tests inside this describe block
  test.use({ javaScriptEnabled: false });

  test(
    'JS Disabled - webchat disabled',
    { tag: '@jsdisabled' },
    async ({ commonHelpers, pensionsFoundPage, webchat }) => {
      await commonHelpers.navigateToStartPage();
      await pensionsFoundPage.clickFooterContactUs('en');

      await expect(webchat.jsErrorMessage).toBeVisible();
      // 2. Verify the button is disabled
      const button = webchat.button;
      await expect(button).toBeDisabled();

      // Optional: Verify it looks disabled (checking the text color class)
      await expect(button).toHaveClass(/text-gray-400/);
    },
  );
});
