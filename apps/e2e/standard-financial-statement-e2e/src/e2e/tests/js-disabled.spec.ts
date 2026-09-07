import { mockCookieConsentRoute } from '@lib/cookie-consent.mock';
import { expect, test } from '@playwright/test';

import { NAV_LINK } from '../../data/nav.data';
import { HomePage } from '@pages/home.page';

test.use({ javaScriptEnabled: false });

test.describe('JavaScript - Disabled', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    await mockCookieConsentRoute(page);

    homePage = new HomePage(page);
    await page.goto('/en', { waitUntil: 'domcontentloaded' });
    await expect(homePage.introHeading).toBeVisible();
  });

  test('Spending Guidelines', async ({ page }) => {
    await page.goto('/en/use-the-sfs');

    await expect(homePage.heading).toHaveText('Use the SFS');

    await homePage.clickNavLink(NAV_LINK.spendingGuidelines);
    await page.waitForURL('**/en/use-the-sfs/spending-guidelines');
    await expect(homePage.heading).toHaveText('Spending guidelines');
    await expect(page.getByTestId('callout-information-blue')).toContainText(
      'Javascript required to Sign in and view contentThis page contains gated resources that require login through our secure authentication system. JavaScript is necessary to access the login interface and complete the authentication process.To continue, enable JavaScript in your browser settings (usually found under Privacy/Security or Site Settings), then refresh this page. The ‘Sign in’ button will appear, allowing you to access this content.If you are unable to enable JavaScript, please contact us at sfs.support@maps.org.uk',
    );
  });

  test('Spending Guidelines Commentary', async ({ page }) => {
    await page.goto('/en/use-the-sfs');

    await expect(homePage.heading).toHaveText('Use the SFS');

    await homePage.clickNavLink(NAV_LINK.spendingGuidelinesCommentary);
    await page.waitForURL('**/en/use-the-sfs/spending-guidelines-commentary');
    await expect(homePage.heading).toHaveText(
      'Spending Guidelines Commentary 2025/26',
    );
    await expect(page.getByTestId('callout-information-blue')).toContainText(
      'Javascript required to Sign in and view contentThis page contains gated resources that require login through our secure authentication system. JavaScript is necessary to access the login interface and complete the authentication process.To continue, enable JavaScript in your browser settings (usually found under Privacy/Security or Site Settings), then refresh this page. The ‘Sign in’ button will appear, allowing you to access this content.If you are unable to enable JavaScript, please contact us at sfs.support@maps.org.uk',
    );
  });

  test('Commentary for past years', async ({ page }) => {
    await page.goto('/en/use-the-sfs');

    await expect(homePage.heading).toHaveText('Use the SFS');

    await homePage.clickNavLink(NAV_LINK.commentaryForPastYears);
    await page.waitForURL('**/en/use-the-sfs/commentary-for-past-years');
    await expect(homePage.heading).toHaveText(
      'Spending Guidelines Commentary for past years',
    );
    await expect(page.getByTestId('callout-information-blue')).toContainText(
      'Javascript required to Sign in and view contentThis page contains gated resources that require login through our secure authentication system. JavaScript is necessary to access the login interface and complete the authentication process.To continue, enable JavaScript in your browser settings (usually found under Privacy/Security or Site Settings), then refresh this page. The ‘Sign in’ button will appear, allowing you to access this content.If you are unable to enable JavaScript, please contact us at sfs.support@maps.org.uk',
    );
  });

  test('Methodology', async ({ page }) => {
    await page.goto('/en/use-the-sfs');

    await expect(homePage.heading).toHaveText('Use the SFS');

    await homePage.clickNavLink(NAV_LINK.methodology);
    await page.waitForURL('**/en/use-the-sfs/spending-guidelines-methodology');
    await expect(homePage.heading).toHaveText(
      'Spending guidelines methodology',
    );
    await expect(page.getByTestId('callout-information-blue')).toContainText(
      'Javascript required to Sign in and view contentThis page contains gated resources that require login through our secure authentication system. JavaScript is necessary to access the login interface and complete the authentication process.To continue, enable JavaScript in your browser settings (usually found under Privacy/Security or Site Settings), then refresh this page. The ‘Sign in’ button will appear, allowing you to access this content.If you are unable to enable JavaScript, please contact us at sfs.support@maps.org.uk',
    );
  });

  test('Downloads - SFS Format', async ({ page }) => {
    await page.goto('/en/use-the-sfs');

    await expect(homePage.heading).toHaveText('Use the SFS');

    await homePage.clickNavLink(NAV_LINK.sfsFormat);
    await page.waitForURL('**/en/use-the-sfs/download-the-sfs-format');
    await expect(homePage.heading).toHaveText('Download the SFS format');
    await expect(page.getByTestId('callout-information-blue')).toContainText(
      'Javascript required to Sign in and view contentThis page contains gated resources that require login through our secure authentication system. JavaScript is necessary to access the login interface and complete the authentication process.To continue, enable JavaScript in your browser settings (usually found under Privacy/Security or Site Settings), then refresh this page. The ‘Sign in’ button will appear, allowing you to access this content.If you are unable to enable JavaScript, please contact us at sfs.support@maps.org.uk',
    );
  });

  test('Downloads - SFS Excel Tool', async ({ page }) => {
    await page.goto('/en/use-the-sfs');

    await expect(homePage.heading).toHaveText('Use the SFS');

    await homePage.clickNavLink(NAV_LINK.sfsExcelTool);
    await page.waitForURL('**/en/use-the-sfs/download-the-sfs-excel-tool');
    await expect(homePage.heading).toHaveText('Download the SFS Excel tool');
    await expect(page.getByTestId('callout-information-blue')).toContainText(
      'Javascript required to Sign in and view contentThis page contains gated resources that require login through our secure authentication system. JavaScript is necessary to access the login interface and complete the authentication process.To continue, enable JavaScript in your browser settings (usually found under Privacy/Security or Site Settings), then refresh this page. The ‘Sign in’ button will appear, allowing you to access this content.If you are unable to enable JavaScript, please contact us at sfs.support@maps.org.uk',
    );
  });

  test('Downloads - SFS Customer Version', async ({ page }) => {
    await page.goto('/en/use-the-sfs');

    await expect(homePage.heading).toHaveText('Use the SFS');

    await homePage.clickNavLink(NAV_LINK.sfsCustomerVersion);
    await page.waitForURL('**/en/use-the-sfs/sfs-customer-version');
    await expect(homePage.heading).toHaveText('SFS customer version');
    await expect(page.getByTestId('callout-information-blue')).toContainText(
      'Javascript required to Sign in and view contentThis page contains gated resources that require login through our secure authentication system. JavaScript is necessary to access the login interface and complete the authentication process.To continue, enable JavaScript in your browser settings (usually found under Privacy/Security or Site Settings), then refresh this page. The ‘Sign in’ button will appear, allowing you to access this content.If you are unable to enable JavaScript, please contact us at sfs.support@maps.org.uk',
    );
  });

  test('Guidance - for using the SFS', async ({ page }) => {
    await page.goto('/en/use-the-sfs');

    await expect(homePage.heading).toHaveText('Use the SFS');

    await homePage.clickNavLink(NAV_LINK.guidanceForUsingTheSfs);
    await page.waitForURL('**/en/use-the-sfs/guidance-for-using-the-sfs');
    await expect(homePage.heading).toHaveText('Guidance for using the SFS');
    await expect(page.getByTestId('callout-information-blue')).toContainText(
      'Javascript required to Sign in and view contentThis page contains gated resources that require login through our secure authentication system. JavaScript is necessary to access the login interface and complete the authentication process.To continue, enable JavaScript in your browser settings (usually found under Privacy/Security or Site Settings), then refresh this page. The ‘Sign in’ button will appear, allowing you to access this content.If you are unable to enable JavaScript, please contact us at sfs.support@maps.org.uk',
    );
  });

  test('Guidance - Frequently asked questions', async ({ page }) => {
    await page.goto('/en/use-the-sfs');

    await expect(homePage.heading).toHaveText('Use the SFS');

    await homePage.clickNavLink(NAV_LINK.frequentlyAskedQuestions);
    await page.waitForURL('**/en/use-the-sfs/frequently-asked-questions');
    await expect(homePage.heading).toHaveText('Frequently asked questions');
    await expect(page.getByTestId('callout-information-blue')).toContainText(
      'Javascript required to Sign in and view contentThis page contains gated resources that require login through our secure authentication system. JavaScript is necessary to access the login interface and complete the authentication process.To continue, enable JavaScript in your browser settings (usually found under Privacy/Security or Site Settings), then refresh this page. The ‘Sign in’ button will appear, allowing you to access this content.If you are unable to enable JavaScript, please contact us at sfs.support@maps.org.uk',
    );
  });

  test('Guidance - Governance Group Terms of Reference', async ({ page }) => {
    await page.goto('/en/use-the-sfs');

    await expect(homePage.heading).toHaveText('Use the SFS');

    await homePage.clickNavLink(NAV_LINK.governanceGroupTor);
    await page.waitForURL('**/en/use-the-sfs/governance-group-tor');
    await expect(homePage.heading).toHaveText(
      'Governance Group Terms of Reference',
    );
    await expect(page.getByTestId('callout-information-blue')).toContainText(
      'Javascript required to Sign in and view contentThis page contains gated resources that require login through our secure authentication system. JavaScript is necessary to access the login interface and complete the authentication process.To continue, enable JavaScript in your browser settings (usually found under Privacy/Security or Site Settings), then refresh this page. The ‘Sign in’ button will appear, allowing you to access this content.If you are unable to enable JavaScript, please contact us at sfs.support@maps.org.uk',
    );
  });

  test('Guidance - Encouraging debt advice', async ({ page }) => {
    await page.goto('/en/use-the-sfs');

    await expect(homePage.heading).toHaveText('Use the SFS');

    await homePage.clickNavLink(NAV_LINK.encouragingDebtAdvice);
    await page.waitForURL('**/en/use-the-sfs/encouraging-debt-advice');
    await expect(homePage.heading).toHaveText(
      'Encouraging debt advice clients to save using behavioural science',
    );
    await expect(page.getByTestId('callout-information-blue')).toContainText(
      'Javascript required to Sign in and view contentThis page contains gated resources that require login through our secure authentication system. JavaScript is necessary to access the login interface and complete the authentication process.To continue, enable JavaScript in your browser settings (usually found under Privacy/Security or Site Settings), then refresh this page. The ‘Sign in’ button will appear, allowing you to access this content.If you are unable to enable JavaScript, please contact us at sfs.support@maps.org.uk',
    );
  });
});
