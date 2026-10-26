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
 *
 * @tests User Story 58967: H&S02 - FE - Improvements - Banner
 * @tests Test Case 59662: 58967 [AC1, AC2] Test Case 1: New H&S Banner (Your Pension Search Results)
 *
 * @tests User Story 59199: H&S01 - FE - Improvements - H&S Landing Page /support
 * @tests Test Case 59681: 59199 AC1 Test Case 1 : Verify H1 and Content on Support landing page
 * @tests Test Case 59682: 59199 AC2 Test Case 2 : Verify /support landing page H2 and content
 * @tests Test Case 59684: 59199 AC3 Test case 3 : Verify understand your next steps section on support landing page
 * @tests Test Case 59690: 59199 AC8 Test Case 8 : Verify Card content & link - Using the pensions dashboard
 * @tests Test Case 59692: 59199 AC9 Test Case 9 : Verify Card content & link - Understand your pensions
 * @tests Test Case 59693: 59199 AC10 Test Case 10 : Verify Card content & link - Contact us
 * @tests Test Case 59695: 59199 AC12 Test Case 12 : Verify /support landing page - MOBILE view
 *
 * @tests User Story 58967: H&S02 - FE - Improvements - Banner
 * @tests Test Case 59662: 58967 [AC1, AC2] Test Case 1: New H&S Banner (Your Pension Search Results)
 * @tests Test Case 59664: 58967 [AC1, AC2] Test Case 3: New H&S Banner (Pensions Not Showing)
 * @tests Test Case 59665: 58967 [AC1, AC2] Test Case 4: New H&S Banner (Your Pension Breakdown)
 * @tests Test Case 59666: 58967 [AC1, AC2] Test Case 5: New H&S Banner (Your Pensions Timeline)
 * @tests Test Case 59667: 58967 [AC1, AC2] Test Case 6: New H&S Banner (State Pension Details)
 * @tests Test Case 59668: 58967 [AC1, AC2] Test Case 7: New H&S Banner (Pensions That Need Action)
 *
 * @tests User Story 59201: H&S03 - FE - FAQ page - /using-the-pensions-dashboard
 * @tests Test Case 59438: 59201 AC1 Test Case 1 : Verify updated using-the-pension-dashboard page - CONTENT
 * @tests Test Case 59442: 59201 AC2 Test Case 2 : Verify 'Understand your next steps' section
 * @tests Test Case 59439: 59201 AC3 Test Case 3 : Verify 'Not what you're looking for ' section
 * @tests Test Case 59559: 59201 AC4 Test Case 4 : H&S  explore URL unavailable
 * @tests Test Case 59561: 59201 AC5 Test Case 5 : H&S  report a technical problem URL unavailable
 *
 * @tests User Story 59311: H&S04- FE - FAQ page /understand-your-pensions
 * @tests Test Case 59626: 59311 AC1, AC3 Test Case 1 : Verify /understand-your-pensions FAQ page content
 * @tests Test Case 59627: 59311 AC2, AC3 Test Case 2 : Verify Not what you're looking for?' banner
 * @tests Test Case 59630: 59311 AC4 Test Case 3 : Verify /understand-your-pensions mobile view
 *
 * @tests User Story 59314: H&S05 - FE - Improvements - Menu
 * @tests Test Case 59707: 59314 - AC1 - Test Case 1 - Help and support is visible in the menu header and functions correctly
 *
 * @tests User Story 59975: H&S08 - FE - Content adjustments to 'Report a problem'
 * @tests Test Case 59999: 59975 AC1, AC4, AC3 Test case 1 : Verify Content changes to H&S banner
 * @tests Test Case 60000: 59975 AC2, AC3, AC4 Test Case 2 : Verify Content Changes on /support page
 */

test.describe('Moneyhelper Pension Dashboard Support Pages', () => {
  const URL: { [key in string]: string } = {
    homepage: '/en',
    pensions: '/en/your-pension-search-results',
    using: '/en/support/using-the-pensions-dashboard',
    understand: '/en/support/understand-your-pensions',
    contact: '/en/contact-us-form',
    explore: '/en/explore-the-pensions-dashboard',
    reportTechnicalProblem: '/en/report-a-technical-problem',
    error: '/en/madeupurl',
    download: 'https://www.whatsapp.com/download',
    support: '/en/support',
    retirementGuidance:
      'https://www.moneyhelper.org.uk/en/pensions-and-retirement/make-the-most-of-your-pension',
  };

  const heading: { [key in string]: string } = {
    using: 'Using the Pensions Dashboard',
    understand: 'Understand your pensions',
    contact: 'Contact us',
    support: 'How can we help you?',
    nextSteps: 'Understand your next steps',
    notWhatYoureLookingFor: 'Not what you’re looking for?',
    pageNotFound: 'Sorry we couldn’t find the page you’re looking for',
  };

  const landingPage: { [key in string]: string } = {
    introText: `Get help using the Pensions Dashboard, understanding your pensions and planning your next steps. You can also contact us.`,
  };

  const contactUs: { [key in string]: string } = {
    pageTitle: 'Contact us',
    introText: `However you choose to get in touch, we’re here to help - and you’ll always chat with a real person.`,
    hyperlink: 'Make a complaint',
    howToContactUsHeading: 'How to contact us',
  };

  const nextStepsContent =
    'Get free help with your pension, including ways to boost it, how and when you can take an income and if a pension transfer is a good idea.';
  const notWhatYoureLookingForContent =
    'If you can’t find the answer you were looking for try our other guides or get in touch.';

  test('navigation to help and support pages from pensions dashboard @e2e', async ({
    page,
    commonHelpers,
    helpAndSupport,
    loadingPage,
    pensionsFoundPage,
    pensionBreakdownPage,
    pensionDetailsPage,
    scenarioSelectionPage,
    yourPensionsTimelinePage,
    welcomePage,
  }) => {
    await commonHelpers.navigateToEmulator('en');
    await commonHelpers.setCookieConsentAccepted();
    await scenarioSelectionPage.selectScenarioComposerDev(
      'AccessibilityTestMay26',
    );
    await welcomePage.welcomePageLoads();
    await welcomePage.clickWelcomeButton();
    await loadingPage.waitForPensionsToLoad(commonHelpers, 'en');
    await pensionsFoundPage.waitForPensionsFound();

    await expect(helpAndSupport.component).toBeVisible();
    await helpAndSupport.button.click();
    await expect(page).toHaveURL('/en/support');
    await commonHelpers.clickBackLink();
    await expect(page).toHaveURL('/en/your-pension-search-results');

    await pensionsFoundPage.clickSeeYourPensions();

    await expect(helpAndSupport.component).toBeVisible();
    await helpAndSupport.button.click();
    await expect(page).toHaveURL('/en/support');
    await commonHelpers.clickBackLink();
    await expect(page).toHaveURL('/en/your-pension-breakdown');

    await pensionBreakdownPage.viewDetailsOfPension('State Pension');

    await pensionDetailsPage.assertHeadingStatePension();
    await expect(helpAndSupport.component).toBeVisible();
    await helpAndSupport.button.click();
    await expect(page).toHaveURL('/en/support');
    await commonHelpers.clickBackLink();
    await expect(page).toHaveURL('/en/pension-details');

    await commonHelpers.clickBackLink();

    await pensionBreakdownPage.clickPensionsTimelineButton();

    await expect(yourPensionsTimelinePage.heading).toBeVisible();

    await expect(helpAndSupport.component).toBeVisible();
    await helpAndSupport.button.click();
    await expect(page).toHaveURL('/en/support');
    await commonHelpers.clickBackLink();
    await expect(page).toHaveURL('/en/your-pensions-timeline?income=legacy');

    await expect(yourPensionsTimelinePage.heading).toBeVisible();

    await commonHelpers.clickBackLink();

    await commonHelpers.clickHomeLink();
    await pensionsFoundPage.clickReviewPensions();

    await expect(helpAndSupport.component).toBeVisible();
    await helpAndSupport.button.click();
    await expect(page).toHaveURL('/en/support');
    await commonHelpers.clickBackLink();
    await expect(page).toHaveURL('/en/pensions-that-need-action');

    await commonHelpers.clickHomeLink();
    await pensionsFoundPage.pensionsNotShowingLink.click();

    await expect(helpAndSupport.component).toBeVisible();
    await helpAndSupport.button.click();
    await expect(page).toHaveURL('/en/support');
    await commonHelpers.clickBackLink();

    await commonHelpers.logoutOfApplication();
  });

  test('navigation to help and support pages from burger menu @e2e', async ({
    page,
    basePage,
    burgerMenu,
    commonHelpers,
    loadingPage,
    pensionsFoundPage,
    pensionBreakdownPage,
    pensionDetailsPage,
    scenarioSelectionPage,
    welcomePage,
    yourPensionsTimelinePage,
  }) => {
    await commonHelpers.navigateToEmulator('en');
    await commonHelpers.setCookieConsentAccepted();
    await scenarioSelectionPage.selectScenarioComposerDev(
      'AccessibilityTestMay26',
    );
    await welcomePage.welcomePageLoads();
    await welcomePage.clickWelcomeButton();
    await loadingPage.waitForPensionsToLoad(commonHelpers, 'en');
    await pensionsFoundPage.waitForPensionsFound();

    await basePage.clickBurgerIcon();
    await burgerMenu.helpAndSupportLink.click();
    await expect(page).toHaveURL('/en/support');
    await commonHelpers.clickBackLink();
    await expect(page).toHaveURL('/en/your-pension-search-results');

    await pensionsFoundPage.clickSeeYourPensions();

    await basePage.clickBurgerIcon();
    await burgerMenu.helpAndSupportLink.click();
    await expect(page).toHaveURL('/en/support');
    await commonHelpers.clickBackLink();
    await expect(page).toHaveURL('/en/your-pension-breakdown');

    await pensionBreakdownPage.viewDetailsOfPension('State Pension');

    await basePage.clickBurgerIcon();
    await burgerMenu.helpAndSupportLink.click();
    await expect(page).toHaveURL('/en/support');
    await commonHelpers.clickBackLink();
    await expect(page).toHaveURL('/en/pension-details');

    await commonHelpers.clickBackLink();

    await pensionBreakdownPage.viewDetailsOfPension('Silver Nest');
    await pensionDetailsPage.assertHeading('Silver Nest');

    await basePage.clickBurgerIcon();
    await burgerMenu.helpAndSupportLink.click();
    await expect(page).toHaveURL('/en/support');
    await commonHelpers.clickBackLink();
    await expect(page).toHaveURL('/en/pension-details/your-pension-summary');

    await pensionDetailsPage.selectTab('Income & values');
    await pensionDetailsPage.assertHeading('Silver Nest');
    await expect(
      pensionDetailsPage.getIncomeAndValuesSubHeading(),
    ).toBeVisible();

    await basePage.clickBurgerIcon();
    await burgerMenu.helpAndSupportLink.click();
    await expect(page).toHaveURL('/en/support');
    await commonHelpers.clickBackLink();
    await expect(page).toHaveURL(
      '/en/pension-details/pension-income-and-values',
    );

    await pensionDetailsPage.selectTab('Income & values');
    await pensionDetailsPage.assertHeading('Silver Nest');
    await expect(
      pensionDetailsPage.getIncomeAndValuesSubHeading(),
    ).toBeVisible();

    await basePage.clickBurgerIcon();
    await burgerMenu.helpAndSupportLink.click();
    await expect(page).toHaveURL('/en/support');
    await commonHelpers.clickBackLink();
    await expect(page).toHaveURL(
      '/en/pension-details/pension-income-and-values',
    );

    await pensionDetailsPage.selectTab('About this pension');
    await pensionDetailsPage.assertHeading('Silver Nest');
    await expect(
      pensionDetailsPage.getTabHeading('About this pension'),
    ).toBeVisible();
    await basePage.clickBurgerIcon();
    await burgerMenu.helpAndSupportLink.click();
    await expect(page).toHaveURL('/en/support');
    await commonHelpers.clickBackLink();
    await expect(page).toHaveURL('/en/pension-details/about-this-pension');

    await pensionDetailsPage.selectTab('Contact provider');
    await pensionDetailsPage.assertHeading('Silver Nest');
    await expect(
      pensionDetailsPage.getTabHeading('Contact provider'),
    ).toBeVisible();
    await basePage.clickBurgerIcon();
    await burgerMenu.helpAndSupportLink.click();
    await expect(page).toHaveURL('/en/support');
    await commonHelpers.clickBackLink();
    await expect(page).toHaveURL(
      '/en/pension-details/contact-pension-provider',
    );

    await commonHelpers.clickBackLink();

    await pensionBreakdownPage.clickPensionsTimelineButton();

    await expect(yourPensionsTimelinePage.heading).toBeVisible();

    await basePage.clickBurgerIcon();
    await burgerMenu.helpAndSupportLink.click();
    await expect(page).toHaveURL('/en/support');
    await commonHelpers.clickBackLink();
    await expect(page).toHaveURL('/en/your-pensions-timeline?income=legacy');

    await expect(yourPensionsTimelinePage.heading).toBeVisible();

    await commonHelpers.clickBackLink();
    await commonHelpers.clickHomeLink();
    await pensionsFoundPage.clickReviewPensions();

    await basePage.clickBurgerIcon();
    await burgerMenu.helpAndSupportLink.click();
    await expect(page).toHaveURL('/en/support');
    await commonHelpers.clickBackLink();
    await expect(page).toHaveURL('/en/pensions-that-need-action');

    await commonHelpers.clickHomeLink();

    await pensionsFoundPage.clickFooterContactUs();
    await basePage.clickBurgerIcon();
    await burgerMenu.helpAndSupportLink.click();
    await expect(page).toHaveURL('/en/support');
    await commonHelpers.clickBackLink();
  });

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

    // Testing support home page - teaser card and support home navigation
    // support > using > support > understand > support > contact > pensions
    await supportPages.findSupportLinkAndSelect();
    expect(page.url()).toContain(URL.support);
    await supportPages.findSupportCardAndSelect(heading.using);
    expect(page.url()).toContain(URL.using);
    // navigate back to support home page from Using page
    await supportPages.findSupportHomeNavAndSelect();
    expect(page.url()).toContain(URL.support);
    await supportPages.findSupportCardAndSelect(heading.understand);
    expect(page.url()).toContain(URL.understand);
    // navigate back to support home page from Understand page
    await supportPages.findSupportHomeNavAndSelect();
    expect(page.url()).toContain(URL.support);
    await supportPages.findSupportCardAndSelect(heading.contact);
    expect(page.url()).toContain(URL.contact);
    // exits help and support page
    await supportPages.findBackButtonAndSelect(heading.contact);
    await expect(page).toHaveURL(URL.pensions);

    // support > understand > using > understand > contact
    await supportPages.findSupportLinkAndSelect();
    expect(page.url()).toContain(URL.support);
    await supportPages.findLinkAndSelect(heading.understand);
    expect(page.url()).toContain(URL.understand);
    await expect(didYouUnderstand.feedbackBanner).toBeVisible();
    await supportPages.findLinkAndSelect(heading.using);
    expect(page.url()).toContain(URL.using);
    await expect(didYouUnderstand.feedbackBanner).toBeVisible();
    await supportPages.findLinkAndSelect(heading.understand);
    expect(page.url()).toContain(URL.understand);
    await supportPages.clickContactUsSupportButton();
    await expect(page).toHaveURL(URL.contact);
    await supportPages.findBackButtonAndSelect(heading.contact);
    await expect(page).toHaveURL(URL.pensions);

    // support > understand > contact > pensions > support > using > contact > pensions dashboard > contact
    await supportPages.findSupportLinkAndSelect();
    expect(page.url()).toContain(URL.support);
    await supportPages.findLinkAndSelect(heading.understand);
    expect(page.url()).toContain(URL.understand);
    await supportPages.clickContactUsSupportButton();
    await expect(page).toHaveURL(URL.contact);
    await supportPages.findBackButtonAndSelect(heading.contact);
    await expect(page).toHaveURL(URL.pensions);
    await supportPages.findSupportLinkAndSelect();
    expect(page.url()).toContain(URL.support);
    await supportPages.findLinkAndSelect(heading.using);
    expect(page.url()).toContain(URL.using);
    await supportPages.clickContactUsSupportButton();
    await expect(page).toHaveURL(URL.contact);
    await supportPages.findBackButtonAndSelect(heading.contact);
    await expect(page).toHaveURL(URL.pensions);
    await pensionsFoundPage.clickFooterContactUs('en');
    await expect(page).toHaveURL(URL.contact);
    await supportPages.findBackButtonAndSelect(heading.contact);
    await expect(page).toHaveURL(URL.pensions);

    // Contact Us page
    await pensionsFoundPage.clickFooterContactUs('en');
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

  test('H&S New Pages', async ({
    page,
    commonSessions,
    pensionsFoundPage,
    supportPages,
    didYouUnderstand,
    commonHelpers,
    pageNotFoundPage,
  }) => {
    await commonSessions.navigateToPensionsFoundPage(allNewTestCases.option);

    //banner on Pensions founds page
    await expect(pensionsFoundPage.getHelpAndSupportSection()).toBeVisible();
    await expect(supportPages.helpAndSupportHeading).toHaveText(
      'Help and support',
    );
    await expect(supportPages.helpAndSupportBannerBody).toHaveText(
      'Get more information about the Pensions Dashboard, what it shows and answers to most commonly asked questions. You can also report a technical problem.',
    );
    await expect(supportPages.helpAndSupportBannerButton).toHaveText(
      'Get help and support',
    );
    await supportPages.findSupportLinkAndSelect();
    expect(page.url()).toContain(URL.support);

    // Support landing page
    await expect(supportPages.supportPageHeading).toContainText(
      heading.support,
    );
    await expect(supportPages.supportPageSummary).toContainText(
      landingPage.introText,
    );
    await expect(supportPages.supportPageTeaserCards).toHaveCount(3);
    const supportCards = [
      {
        heading: 'Using the Pensions Dashboard',
        href: '/en/support/using-the-pensions-dashboard',
        description:
          'Make the most out of your Pensions Dashboard and get answers for common questions.',
      },
      {
        heading: 'Understand your pensions',
        href: '/en/support/understand-your-pensions',
        description:
          'Help with building your pension, taking your pension and pension problems.',
      },
      {
        heading: 'Contact us',
        href: '/en/contact-us-form',
        description:
          'Call, email and more - you’ll always chat with a real person. You can also report a technical problem.',
      },
    ];

    for (let index = 0; index < supportCards.length; index += 1) {
      const card = supportCards[index];
      const cardLink = supportPages.getSupportPageTeaserCardLink(index);
      await expect(cardLink).toHaveText(card.heading);
      await expect(cardLink).toHaveAttribute('href', card.href);
      await expect(
        supportPages.getSupportPageTeaserCardDescription(index),
      ).toHaveText(card.description);
    }

    //Landing page back to top link & Feeback Survey
    await expect(supportPages.backToTopLink).toBeVisible();
    await supportPages.clickBackToTopLink();
    await expect(supportPages.supportPageHeading).toBeFocused();
    await expect(didYouUnderstand.feedbackBanner).toBeVisible();

    //landing page next steps
    await expect(supportPages.understandYourNextStepsSection).toBeVisible();
    const newPage = await supportPages.clickRetirementGuidanceLink(
      commonHelpers,
    );
    expect(newPage.url()).toContain(URL.retirementGuidance);
    await newPage.close();

    //Using page
    await supportPages.findSupportCardAndSelect(heading.using);
    //Using page: Understand your next steps section
    await expect(supportPages.understandYourNextStepsSection).toBeVisible();
    await expect(supportPages.understandYourNextStepsHeading).toContainText(
      heading.nextSteps,
    );
    await expect(supportPages.understandYourNextStepsContent).toContainText(
      nextStepsContent,
    );
    expect(newPage.url()).toContain(URL.retirementGuidance);
    await newPage.close();
    //Using page : Not what you're looking for section
    await expect(supportPages.notWhatYoureLookingForSection).toBeVisible();
    await expect(supportPages.notWhatYoureLookingForHeading).toContainText(
      heading.notWhatYoureLookingFor,
    );
    await expect(supportPages.notWhatYoureLookingForContent).toContainText(
      notWhatYoureLookingForContent,
    );
    await expect(
      supportPages.notWhatYoureLookingForUnderstandLink,
    ).toBeVisible();
    await expect(supportPages.notWhatYoureLookingForContactLink).toBeVisible();
    await expect(supportPages.notWhatYoureLookingForUsingLink).toBeHidden();
    //back to Top link
    await expect(supportPages.backToTopLink).toBeVisible();
    await supportPages.clickBackToTopLink();
    await expect(supportPages.supportPageHeading).toBeFocused();
    // Exit help and Support link
    await expect(supportPages.supportHomeLink).toBeVisible();
    await expect(supportPages.backButton).toBeVisible();
    await supportPages.findBackButtonAndSelect(heading.using); // exit help and support from Using Page
    await expect(page).toHaveURL(URL.pensions);

    //Understand page
    await supportPages.findSupportLinkAndSelect();
    await supportPages.findSupportCardAndSelect(heading.understand);
    await expect(supportPages.supportPageHeading).toContainText(
      heading.understand,
    );
    //Understand page: Understand your next steps section
    await expect(supportPages.understandYourNextStepsSection).toBeVisible();
    await expect(supportPages.understandYourNextStepsHeading).toContainText(
      heading.nextSteps,
    );
    await expect(supportPages.understandYourNextStepsContent).toContainText(
      nextStepsContent,
    );
    expect(newPage.url()).toContain(URL.retirementGuidance);
    await newPage.close();
    //Understand page : Not what you're looking for section
    await expect(supportPages.notWhatYoureLookingForSection).toBeVisible();
    await expect(
      supportPages.notWhatYoureLookingForUnderstandLink,
    ).toBeHidden();
    await expect(supportPages.notWhatYoureLookingForContactLink).toBeVisible();
    await expect(supportPages.notWhatYoureLookingForUsingLink).toBeVisible();

    //explore URL displays Sorry page
    await page.goto(URL.explore);
    await expect(pageNotFoundPage.pageTitle).toHaveText(heading.pageNotFound);
    await page.goto(URL.reportTechnicalProblem);
    await expect(pageNotFoundPage.pageTitle).toHaveText(heading.pageNotFound);
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
    await expect(pageNotFoundPage.pageTitle).toHaveText(heading.pageNotFound);
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
