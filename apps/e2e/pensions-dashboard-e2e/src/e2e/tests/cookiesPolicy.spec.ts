/* eslint-disable playwright/no-focused-test */
import { expect, test } from '@maps/playwright';

import cookiePolicyPage from '../pages/CookiePolicyPage';
import commonHelpers from '../utils/commonHelpers';

const cookiesPolicyLink = 'a[href="/en/dashboard-cookie-policy"]';

/**
 * @tests User Story 38142 Privacy Policy
 * @tests Test Case 38322: 38142 [AC1] Test case 1 - Header and opening paragraph
 * @tests Test Case 38323: 38142 [AC1] Test case 2 - What are cookies? (Section 1)
 * @tests Test Case 38324: 338142 [AC1] Test case 3 - Strictly necessary cookies (Section 2): header and first paragraph
 * @tests Test Case 38225: 38142 [AC1] Test case 4 - Strictly necessary cookies (Section 2): first table
 * @tests Test Case 38226: 38142 [AC1] Test case 5 - Strictly necessary cookies (Section 2): second table
 * @tests Test Case 38227: 38142 [AC1] Test case 6 - Find your pensions service – essential cookies only (Section 3): header and first paragraph
 * @tests Test Case 38230: 38142 [AC1] Test case 7 - Find your pensions service – essential cookies only (Section 3): table
 * @tests Test Case 38232: 38142 [AC1] Test case 8 - Cookies that measure website use (analytics) (Section 4): header and first paragraph
 * @tests Test Case 38233: 38142 [AC1] Test case 9 - Cookies that measure website use (analytics) (Section 4): table 1
 * @tests Test Case 38235: 38142 [AC1] Test case 10 - Cookies that measure website use (analytics) (Section 4): table 2
 * @tests Test Case 38236: 38142 [AC1] Test case 11 -  Cookies that measure website use (analytics) (Section 4): table 3
 * @tests Test Case 38237: 38142 [AC1] Test case 12 -  Cookies that measure website use (analytics) (Section 4): table 4
 * @tests Test Case 38239: 38142 [AC1] Test case 13 - Cookies that help with our communications and marketing (Section 5)
 * @tests Test Case 38240: 38142 [AC1] Test case 14 - How can I control my cookies? (Section 6)
 * @tests Test Case 38241: 38142 [AC2] Test case 15 - Cookie Policy page name & URL
 * @tests Test Case 38242: 338142 [AC3] Test case 16 - Footer link
 * @tests User Story 39662 Cookie Policy mini update
 * @tests Test Case 39793: 39662 Cookie policy update for functional cookies
 */

const expectedSections = [
  {
    heading: '1. What are cookies?',
    text: `1. What are cookies? Cookies are small files saved on your phone, tablet or computer when you visit a website. We currently use two types of cookies: strictly necessary cookies, which are required for the site to work analytics cookies, which collect information about how you use the service to help us improve it. Cookies are not used to identify you personally. The MoneyHelper Pensions Dashboard and Find your pensions service is intended for UK-based users so for cookies we follow UK law, including the Data (Use and Access) Bill 2025. Find out how to manage cookies (opens in a new window) from the Information Commissioner's Office. Back to top`,
  },
  {
    heading: '2. Strictly necessary cookies (essential)',
    text: `2. Strictly necessary cookies (essential) Essential cookies are needed to make the service work and to keep your information secure, we do not need to ask permission for essential cookies. If you do not want us to use them, you can turn off cookies in your web browser, but the service may not work properly. We will not set any essential cookies until you start using the service. Essential cookies we use: Name Purpose Expires mhpdSessionConfig Maintains a secure session for the service and controls time-limited access to your pension data during the journey. Session beaconId This cookie is used to identify the session anonymously and check that your device is allowed to access the service. This cookie expires automatically after 90 days. codeVerifier This cookie helps the website confirm that the part you see (the front end) is properly connected to the behind-the-scenes services (the back end). Session _iz_sd_ss_ It is used by Informizely to track whether a survey has already been shown during a session and to ensure better user experience by avoiding repeated prompts in the same session. Session _iz_uh_ps_ It is used by Informizely to track visitor history and engagement across visits, to ensure surveys are not shown repeatedly (throttling) and to help targeting surveys to new vs. returning users. 1-2 years iPlanetDirectoryPro Gives you access to the service without needing to log in again. When you close your browser window, after 120 minutes, or after 15 minutes of inactivity, whichever occurs first. amlbcookie Ensures that your entire session is handled by the same server. When you close your browser window, after 120 minutes, or after 15 minutes of inactivity, whichever occurs first. route Ensures that your requests all go to the same server. When you close your browser window, after 120 minutes, or after 15 minutes of inactivity, whichever occurs first. reentry Tracks your journey after you log in with http://GOV.UK OneLogin. 15 minutes from when you re-enter the service from http://GOV.UK One Login, or when you close your browser window. OAUTH_REQUEST_ATTRIBUTES This is needed when you are directed to the service from an authorised dashboard. 5 minutes from when you enter the service or when you close your browser window. Back to top`,
  },
  {
    heading: '3. Cookies that measure website use (analytics)',
    text: `3. Cookies that measure website use (analytics) We use analytics cookies to collect information about how you use the MoneyHelper Pensions Dashboard and Find your pensions service, for example what pages you visit and what you click on. This helps us understand how we can improve the services. We do not share this data or allow anyone else to use it. Analytics cookies we use Microsoft Clarity Name Purpose Expires _clck Stores a unique ID and your preferences so the website can anonymously track how people use the site and make improvements based on that behaviour. 13 months _clsk Links together the different pages you visit during one visit, so your activity can be viewed as a single session to better understand how people use the site. 1 year CLID Identifies the first-time Clarity saw this user on any site using Clarity. 13 months ANONCHK Checks if a unique ID used for advertising is being shared, but since this site doesn't use that advertising feature, the setting is always turned off. 13 months MR Indicates whether to refresh MUID (Microsoft User ID). 13 months MUID (Microsoft User ID) Identifies unique web browsers visiting Microsoft sites. These cookies are used for advertising, site analytics, and other operational purposes. 13 months SM Used in synchronizing the MUID across Microsoft domains. 13 months Google Analytics Name Purpose Expires _ga Used by Google Analytics to recognise returning visitors by assigning a unique ID, helping us understand how people use our website over time. 2 years _gid Used by Google Analytics to identify visitors but only tracks activity within a single day. 24 hours _ga_<container-id> Used by Google Analytics to identify and track an individual session with a user device. 1 minute _gat_gtag_<container-id> Used by Google Analytics to limit requests to its service. 1 minute _utma Used by Google Analytics to track visitor behaviour and measure site performance. 2 years _gat_UA Used by Google to limit collection of data on high traffic sites. 10 minutes glassbox Name Purpose Expires _cls_s Session identifying cookie. It also indicates if the visitor is new or existing. Session expiry _cls_v Visitor identifying cookie. 1 year Bc Enables recording of user sessions across subdomains. Session expiry Adobe marketing cloud Name Purpose Expires s_ecid Stores a unique Experience Cloud ID, which helps link your visits and activity across different parts of the website for analytics purposes. 2 years s_cc Determines if cookies are enabled. Set by JavaScript. Session expiry s_sq Used by Activity Map. It contains information about the previous link clicked by the visitor. Session expiry s_vi Stores a unique visitor ID and timestamp. 2 years s_fid Stores the fallback unique visitor ID and timestamp 2 years s_ac Helps set other cookies correctly and is deleted right after it's used. Immediate mbox Stores a few values, including your session ID and settings, to help the website work properly. 2 years at_check Temporary cookie to check if the cookie read/write capability is enabled on the browser Session expiry Back to top`,
  },
  {
    heading: '4. Cookies that help with our communications and marketing',
    text: `4. Cookies that help with our communications and marketing These cookies may be set by third party websites. We don't currently use any cookies in this category. Back to top`,
  },
  {
    heading: '5. How can I control my cookies?',
    text: `5. How can I control my cookies? You can change your cookie preferences at any time using the 'Cookie preferences' link in the footer of this site. Alternatively, most web browsers allow some control of most cookies through the browser settings. There is more information on how to manage cookies (opens in a new window) on the Information Commissioner's Office website. Back to top`,
  },
];

test.describe('Cookies policy', () => {
  test.beforeEach(async ({ page }) => {
    await commonHelpers.navigateToStartPage(page);
  });

  test('Navigate to cookies policy page from Start page, assert content', async ({
    page,
  }) => {
    // navigate to cookies page
    await cookiePolicyPage.clickCookiesPolicyLink(page, cookiesPolicyLink);

    //assert heading, title and url
    await expect(page).toHaveTitle(
      'Dashboard cookie policy - MoneyHelper Pensions Dashboard',
    );
    expect(page.url()).toContain('/dashboard-cookie-policy');
    await expect(page.getByTestId('page-title')).toHaveText(
      'Cookie policy for the MoneyHelper Pensions Dashboard and the Find your pensions service',
    );

    //assert first paragraph
    const paragraph = page
      .locator('[data-testid="paragraph"].mb-4.md\\:mb-10')
      .nth(0);
    await expect(paragraph).toHaveText(
      'This sets out information about the cookies we use when you visit the MoneyHelper Pensions Dashboard and the Find your pensions service (the site). This is separate from the MoneyHelper website cookie policy.',
    );

    // Verify that the main sections exist (content may change frequently)
    await expect(
      page.locator('h2').filter({ hasText: 'What are cookies?' }),
    ).toBeVisible();
    await expect(
      page.locator('h2').filter({ hasText: 'Strictly necessary cookies' }),
    ).toBeVisible();
    await expect(
      page.locator('h2').filter({ hasText: 'analytics' }),
    ).toBeVisible();
    await expect(
      page.locator('h2').filter({ hasText: 'communications and marketing' }),
    ).toBeVisible();
    await expect(
      page.locator('h2').filter({ hasText: 'How can I control my cookies' }),
    ).toBeVisible();
  });
});
