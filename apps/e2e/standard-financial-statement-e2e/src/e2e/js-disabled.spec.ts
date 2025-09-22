import { expect, test } from '@playwright/test';

import { homePage } from '../pages/HomePage';

test.use({ javaScriptEnabled: false });

test.describe('JavaScript - Disabled', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    expect(await homePage.assertHeading(page)).toBe(true);
  });

  test('Spending Guidelines', async ({ page }) => {
    await page.goto('/en/use-the-sfs');

    await expect(await homePage.getHeading(page)).toHaveText('Use the SFS');

    await homePage.clickNavLink(page, 'Spending Guidelines 2025/26');
    await page.waitForURL('**/en/use-the-sfs/spending-guidelines');
    await expect(await homePage.getHeading(page)).toHaveText(
      'Spending guidelines',
    );
    await expect(page.getByTestId('callout-information-blue')).toContainText(
      'Javascript required to Sign in and view contentThis page contains gated resources that require login through our secure authentication system. JavaScript is necessary to access the login interface and complete the authentication process.To continue, enable JavaScript in your browser settings (usually found under Privacy/Security or Site Settings), then refresh this page. The ‘Sign in’ button will appear, allowing you to access this content.If you are unable to enable JavaScript, please contact us at sfs.support@maps.org.uk',
    );
  });

  test('Spending Guidelines Commentary', async ({ page }) => {
    await page.goto('/en/use-the-sfs');

    await expect(await homePage.getHeading(page)).toHaveText('Use the SFS');

    await homePage.clickNavLink(page, 'Commentary for 2025/26');
    await page.waitForURL('**/en/use-the-sfs/spending-guidelines-commentary');
    await expect(await homePage.getHeading(page)).toHaveText(
      'Spending Guidelines Commentary 2025/26',
    );
    await expect(page.getByTestId('callout-information-blue')).toContainText(
      'Javascript required to Sign in and view contentThis page contains gated resources that require login through our secure authentication system. JavaScript is necessary to access the login interface and complete the authentication process.To continue, enable JavaScript in your browser settings (usually found under Privacy/Security or Site Settings), then refresh this page. The ‘Sign in’ button will appear, allowing you to access this content.If you are unable to enable JavaScript, please contact us at sfs.support@maps.org.uk',
    );
  });

  test('Commentary for past years', async ({ page }) => {
    await page.goto('/en/use-the-sfs');

    await expect(await homePage.getHeading(page)).toHaveText('Use the SFS');

    await homePage.clickNavLink(page, 'Commentary for past years');
    await page.waitForURL('**/en/use-the-sfs/commentary-for-past-years');
    await expect(await homePage.getHeading(page)).toHaveText(
      'Spending Guidelines Commentary for past years',
    );
    await expect(page.getByTestId('callout-information-blue')).toContainText(
      'Javascript required to Sign in and view contentThis page contains gated resources that require login through our secure authentication system. JavaScript is necessary to access the login interface and complete the authentication process.To continue, enable JavaScript in your browser settings (usually found under Privacy/Security or Site Settings), then refresh this page. The ‘Sign in’ button will appear, allowing you to access this content.If you are unable to enable JavaScript, please contact us at sfs.support@maps.org.uk',
    );
  });

  test('Methodology', async ({ page }) => {
    await page.goto('/en/use-the-sfs');

    await expect(await homePage.getHeading(page)).toHaveText('Use the SFS');

    await homePage.clickNavLink(page, 'Methodology');
    await page.waitForURL('**/en/use-the-sfs/spending-guidelines-methodology');
    await expect(await homePage.getHeading(page)).toHaveText(
      'Spending guidelines methodology',
    );
    await expect(page.getByTestId('callout-information-blue')).toContainText(
      'Javascript required to Sign in and view contentThis page contains gated resources that require login through our secure authentication system. JavaScript is necessary to access the login interface and complete the authentication process.To continue, enable JavaScript in your browser settings (usually found under Privacy/Security or Site Settings), then refresh this page. The ‘Sign in’ button will appear, allowing you to access this content.If you are unable to enable JavaScript, please contact us at sfs.support@maps.org.uk',
    );
  });

  test('Downloads - SFS Format', async ({ page }) => {
    await page.goto('/en/use-the-sfs');

    await expect(await homePage.getHeading(page)).toHaveText('Use the SFS');

    await homePage.clickNavLink(page, 'SFS Format');
    await page.waitForURL('**/en/use-the-sfs/download-the-sfs-format');
    await expect(await homePage.getHeading(page)).toHaveText(
      'Download the SFS format',
    );
    await expect(page.getByTestId('callout-information-blue')).toContainText(
      'Javascript required to Sign in and view contentThis page contains gated resources that require login through our secure authentication system. JavaScript is necessary to access the login interface and complete the authentication process.To continue, enable JavaScript in your browser settings (usually found under Privacy/Security or Site Settings), then refresh this page. The ‘Sign in’ button will appear, allowing you to access this content.If you are unable to enable JavaScript, please contact us at sfs.support@maps.org.uk',
    );
  });

  test('Downloads - SFS Excel Tool', async ({ page }) => {
    await page.goto('/en/use-the-sfs');

    await expect(await homePage.getHeading(page)).toHaveText('Use the SFS');

    await homePage.clickNavLink(page, 'SFS Excel Tool');
    await page.waitForURL('**/en/use-the-sfs/download-the-sfs-excel-tool');
    await expect(await homePage.getHeading(page)).toHaveText(
      'Download the SFS Excel tool',
    );
    await expect(page.getByTestId('callout-information-blue')).toContainText(
      'Javascript required to Sign in and view contentThis page contains gated resources that require login through our secure authentication system. JavaScript is necessary to access the login interface and complete the authentication process.To continue, enable JavaScript in your browser settings (usually found under Privacy/Security or Site Settings), then refresh this page. The ‘Sign in’ button will appear, allowing you to access this content.If you are unable to enable JavaScript, please contact us at sfs.support@maps.org.uk',
    );
  });

  test('Downloads - SFS Customer Version', async ({ page }) => {
    await page.goto('/en/use-the-sfs');

    await expect(await homePage.getHeading(page)).toHaveText('Use the SFS');

    await homePage.clickNavLink(page, 'SFS Customer Version');
    await page.waitForURL('**/en/use-the-sfs/sfs-customer-version');
    await expect(await homePage.getHeading(page)).toHaveText(
      'SFS customer version',
    );
    await expect(page.getByTestId('callout-information-blue')).toContainText(
      'Javascript required to Sign in and view contentThis page contains gated resources that require login through our secure authentication system. JavaScript is necessary to access the login interface and complete the authentication process.To continue, enable JavaScript in your browser settings (usually found under Privacy/Security or Site Settings), then refresh this page. The ‘Sign in’ button will appear, allowing you to access this content.If you are unable to enable JavaScript, please contact us at sfs.support@maps.org.uk',
    );
  });

  test('Guidance - for using the SFS', async ({ page }) => {
    await page.goto('/en/use-the-sfs');

    await expect(await homePage.getHeading(page)).toHaveText('Use the SFS');

    await homePage.clickNavLink(page, 'Guidance for using the SFS');
    await page.waitForURL('**/en/use-the-sfs/guidance-for-using-the-sfs');
    await expect(await homePage.getHeading(page)).toHaveText(
      'Guidance for using the SFS',
    );
    await expect(page.getByTestId('callout-information-blue')).toContainText(
      'Javascript required to Sign in and view contentThis page contains gated resources that require login through our secure authentication system. JavaScript is necessary to access the login interface and complete the authentication process.To continue, enable JavaScript in your browser settings (usually found under Privacy/Security or Site Settings), then refresh this page. The ‘Sign in’ button will appear, allowing you to access this content.If you are unable to enable JavaScript, please contact us at sfs.support@maps.org.uk',
    );
  });

  test('Guidance - Frequently asked questions', async ({ page }) => {
    await page.goto('/en/use-the-sfs');

    await expect(await homePage.getHeading(page)).toHaveText('Use the SFS');

    await homePage.clickNavLink(page, 'Frequently asked questions');
    await page.waitForURL('**/en/use-the-sfs/frequently-asked-questions');
    await expect(await homePage.getHeading(page)).toHaveText(
      'Frequently asked questions',
    );
    await expect(page.getByTestId('callout-information-blue')).toContainText(
      'Javascript required to Sign in and view contentThis page contains gated resources that require login through our secure authentication system. JavaScript is necessary to access the login interface and complete the authentication process.To continue, enable JavaScript in your browser settings (usually found under Privacy/Security or Site Settings), then refresh this page. The ‘Sign in’ button will appear, allowing you to access this content.If you are unable to enable JavaScript, please contact us at sfs.support@maps.org.uk',
    );
  });

  test('Guidance - Governance Group Terms of Reference', async ({ page }) => {
    await page.goto('/en/use-the-sfs');

    await expect(await homePage.getHeading(page)).toHaveText('Use the SFS');

    await homePage.clickNavLink(page, 'Governance Group ToR');
    await page.waitForURL('**/en/use-the-sfs/governance-group-tor');
    await expect(await homePage.getHeading(page)).toHaveText(
      'Governance Group Terms of Reference',
    );
    await expect(page.getByTestId('callout-information-blue')).toContainText(
      'Javascript required to Sign in and view contentThis page contains gated resources that require login through our secure authentication system. JavaScript is necessary to access the login interface and complete the authentication process.To continue, enable JavaScript in your browser settings (usually found under Privacy/Security or Site Settings), then refresh this page. The ‘Sign in’ button will appear, allowing you to access this content.If you are unable to enable JavaScript, please contact us at sfs.support@maps.org.uk',
    );
  });

  test('Guidance - Encouraging debt advice', async ({ page }) => {
    await page.goto('/en/use-the-sfs');

    await expect(await homePage.getHeading(page)).toHaveText('Use the SFS');

    await homePage.clickNavLink(
      page,
      'Encouraging debt advice clients to save using behavioural science',
    );
    await page.waitForURL('**/en/use-the-sfs/encouraging-debt-advice');
    await expect(await homePage.getHeading(page)).toHaveText(
      'Encouraging debt advice clients to save using behavioural science',
    );
    await expect(page.getByTestId('callout-information-blue')).toContainText(
      'Javascript required to Sign in and view contentThis page contains gated resources that require login through our secure authentication system. JavaScript is necessary to access the login interface and complete the authentication process.To continue, enable JavaScript in your browser settings (usually found under Privacy/Security or Site Settings), then refresh this page. The ‘Sign in’ button will appear, allowing you to access this content.If you are unable to enable JavaScript, please contact us at sfs.support@maps.org.uk',
    );
  });
});
