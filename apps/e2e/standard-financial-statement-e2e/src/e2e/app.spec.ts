/* eslint-disable playwright/no-networkidle */
import { expect, test } from '@playwright/test';

import { homePage } from '../pages/HomePage';
import { verifyDataLayer } from '../utils/verifyDataLayer';

test.describe('standard-financial-statement', () => {
  test.beforeEach(async ({ page }) => {
    await homePage.disableCookieConsent(page);
    await page.goto('/');
    expect(await homePage.assertHeading(page)).toBe(true);
  });

  test('Home Page', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    await verifyDataLayer(page, 'pageLoadReact', 'http://localhost:8888/en', {
      page: {
        pageName: 'Home',
        pageTitle: 'Home | SFS',
        lang: 'en',
        site: 'moneyhelper',
        pageType: 'Homepage',
        source: 'direct',
        categoryL1: 'Home',
        url: 'http://localhost:8888/en',
      },
    });
  });

  test('Footer Links', async ({ page }) => {
    test.setTimeout(20_000);
    const footerExists = await homePage.assertFooter(page);
    expect(footerExists).toBe(true);

    await homePage.clickFooterLink(page, homePage.privacyLink);
    expect(page.url()).toContain('/en/privacy');
    await expect(await homePage.getHeading(page)).toHaveText('Privacy');

    await page.waitForLoadState('networkidle');
    await verifyDataLayer(
      page,
      'pageLoadReact',
      'http://localhost:8888/en/privacy',
      {
        page: {
          pageName: 'Privacy',
          pageTitle: 'Privacy | SFS',
          lang: 'en',
          site: 'moneyhelper',
          pageType: 'Apply to use the SFS',
          source: 'direct',
          url: 'http://localhost:8888/en/privacy',
        },
      },
    );

    await page.goBack();
    expect(await homePage.assertHeading(page)).toBe(true);

    await homePage.clickFooterLink(page, homePage.accessibilityLink);
    expect(page.url()).toContain('/en/accessibility');
    await expect(await homePage.getHeading(page)).toHaveText('Accessibility');

    await page.waitForLoadState('networkidle');
    await verifyDataLayer(
      page,
      'pageLoadReact',
      'http://localhost:8888/en/accessibility',
      {
        page: {
          pageName: 'Accessibility',
          pageTitle: 'Accessibility | SFS',
          lang: 'en',
          site: 'moneyhelper',
          pageType: 'Apply to use the SFS',
          source: 'direct',
          url: 'http://localhost:8888/en/accessibility',
        },
      },
    );

    await page.goBack();
    expect(await homePage.assertHeading(page)).toBe(true);

    await homePage.clickFooterLink(page, homePage.cookiesLink);
    expect(page.url()).toContain('/en/cookies');
    await expect(await homePage.getHeading(page)).toHaveText(
      'How we use cookies',
    );

    await page.waitForLoadState('networkidle');
    await verifyDataLayer(
      page,
      'pageLoadReact',
      'http://localhost:8888/en/cookies',
      {
        page: {
          pageName: 'How we use cookies',
          pageTitle: 'How we use cookies | SFS',
          lang: 'en',
          site: 'moneyhelper',
          pageType: 'Apply to use the SFS',
          source: 'direct',
          url: 'http://localhost:8888/en/cookies',
        },
      },
    );
  });

  test('What is the SFS page', async ({ page }) => {
    test.setTimeout(50_000);
    await homePage.clickMenuItem(page, 'What is the SFS?');
    await expect(await homePage.getHeading(page)).toHaveText(
      'What is the Standard Financial Statement?',
    );
    expect(page.url()).toContain('/en/what-is-the-sfs');
    // Waiting for images to load before taking snapshot
    await page.waitForLoadState('networkidle');
    await verifyDataLayer(
      page,
      'pageLoadReact',
      'http://localhost:8888/en/what-is-the-sfs',
      {
        page: {
          pageName: 'What is the Standard Financial Statement?',
          pageTitle: 'What is the Standard Financial Statement? | SFS',
          lang: 'en',
          site: 'moneyhelper',
          pageType: 'Category',
          source: 'direct',
          categoryL1: 'What is the Standard Financial Statement?',
          url: 'http://localhost:8888/en/what-is-the-sfs',
        },
      },
    );

    await homePage.clickLink(page, 'in partnership with key stakeholders');
    expect(page.url()).toContain('/en/what-is-the-sfs#who');
    await expect(page.getByTestId('image-link').first()).toBeInViewport();
    await page.goBack();
    await page.waitForLoadState('networkidle');

    await expect(page.getByTestId('image-link').first()).not.toBeInViewport();
    expect(page.url()).not.toContain('/en/what-is-the-sfs#who');
    await homePage.clickLink(
      page,
      'Who was involved in developing the Standard Financial Statement?',
    );
    expect(page.url()).toContain('/en/what-is-the-sfs#who');
    await expect(page.getByTestId('image-link').first()).toBeInViewport();

    await homePage.clickLink(page, 'Find free debt advice');
    await expect(await homePage.getHeading(page)).toHaveText(
      'Find free debt advice',
    );
    expect(page.url()).toContain('/en/what-is-the-sfs/find-free-debt-advice');
    await verifyDataLayer(
      page,
      'pageLoadReact',
      'http://localhost:8888/en/what-is-the-sfs/find-free-debt-advice',
      {
        page: {
          pageName: 'Find free debt advice',
          pageTitle: 'Find free debt advice | SFS',
          lang: 'en',
          site: 'moneyhelper',
          pageType: 'Sub Category',
          source: 'direct',
          categoryL1: 'What is the SFS',
          categoryL2: 'Find free debt advice',
          url: 'http://localhost:8888/en/what-is-the-sfs/find-free-debt-advice',
        },
      },
    );
  });

  test('Member organisations page', async ({ page }) => {
    await homePage.clickMenuItem(page, 'What is the SFS?');
    await homePage.clickLink(page, 'Member organisations');
    await expect(await homePage.getHeading(page)).toHaveText(
      'Member organisations',
    );
    expect(page.url()).toContain('/en/what-is-the-sfs/public-organisations');
    await verifyDataLayer(
      page,
      'pageLoadReact',
      'http://localhost:8888/en/what-is-the-sfs/public-organisations',
      {
        page: {
          pageName: 'Member organisations',
          pageTitle: 'Member organisations | SFS',
          lang: 'en',
          site: 'moneyhelper',
          pageType: 'Sub Category',
          source: 'direct',
          categoryL1: 'What is the SFS',
          categoryL2: 'Member organisations',
          url: 'http://localhost:8888/en/what-is-the-sfs/public-organisations',
        },
      },
    );

    await expect(page.getByTestId('paragraph')).toContainText([
      'The grid below shows all of the organisations with an active Standard Financial Statement (SFS) membership.',
      'Some of these organisations may be using the SFS currently, others may be in the process of transitioning. However, all members have agreed to the Code of Conduct and the associated best practice principles when they do begin using the format.',
      'You can search for a member organisation in the search box below, or filter by different groups of members.',
      'If you have received a Standard Financial Statement and want to verify the membership number on the statement, enter the code in the box below and you will be given the name of the organisation registered with that number.',
      'If you believe an organisation is operating with an invalid or incorrect membership code, please contact us.',
    ]);

    await page
      .getByTestId('rich-text')
      .getByRole('link', { name: 'contact us' })
      .click();
    await expect(await homePage.getHeading(page)).toHaveText('Contact Us');
    expect(page.url()).toContain('/en/contact-us');
  });

  test('Use the SFS page', async ({ page }) => {
    await homePage.clickMenuItem(page, 'Use the SFS');
    await expect(await homePage.getHeading(page)).toHaveText('Use the SFS');
    expect(page.url()).toContain('/en/use-the-sfs');
    await verifyDataLayer(
      page,
      'pageLoadReact',
      'http://localhost:8888/en/use-the-sfs',
      {
        page: {
          pageName: 'Use the SFS',
          pageTitle: 'Use the SFS | SFS',
          lang: 'en',
          site: 'moneyhelper',
          pageType: 'Category',
          source: 'direct',
          categoryL1: 'Use the SFS',
          url: 'http://localhost:8888/en/use-the-sfs',
        },
      },
    );
  });

  test('Contact Us', async ({ page }) => {
    await homePage.clickMenuItem(page, 'Contact Us');
    await expect(await homePage.getHeading(page)).toHaveText('Contact Us');
    expect(page.url()).toContain('/en/contact-us');
    await verifyDataLayer(
      page,
      'pageLoadReact',
      'http://localhost:8888/en/contact-us',
      {
        page: {
          pageName: 'Contact Us',
          pageTitle: 'Contact Us | SFS',
          lang: 'en',
          site: 'moneyhelper',
          pageType: 'Apply to use the SFS',
          source: 'direct',
          url: 'http://localhost:8888/en/contact-us',
        },
      },
    );
  });
});
