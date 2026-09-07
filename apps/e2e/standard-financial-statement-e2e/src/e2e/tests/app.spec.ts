import { appUrl } from '@lib/env.lib';
import { expect, test } from '@lib/test.lib';

import {
  FOOTER_LINK,
  ANCHOR_LINK,
  HEADER_LINK,
  NAV_LINK,
} from '../../data/nav.data';
import { verifyDataLayer } from '../../utils/verifyDataLayer';

test.describe('Mobile navigation', () => {
  /**
   * Test SFS navigation on mobile devices. The viewport is set to a standard mobile device size.
   */
  test.use({ viewport: { width: 375, height: 667 } });

  test.beforeEach(async ({ extendedPage, homePage }) => {
    await extendedPage.gotoHome();
    await expect(homePage.introHeading).toBeVisible();
  });

  /**
   * @tests 39651 - verifying that the title attribute of the search bar toggle button changes when clicked, which will help screen reader users to understand the state of the button (open or closed).
   */
  test('Mobile search bar toggle button', async ({ homePage }) => {
    await homePage.clickSearchBar();
    await expect(homePage.searchBarToggle).toHaveAttribute(
      'title',
      'Close search',
    );
    await homePage.clickSearchBar();
    await expect(homePage.searchBarToggle).toHaveAttribute(
      'title',
      'Open search',
    );
  });
});

test.describe('standard-financial-statement', () => {
  test.beforeEach(async ({ extendedPage, homePage }) => {
    await extendedPage.gotoHome();
    await expect(homePage.introHeading).toBeVisible();
  });

  test('Home Page', async ({ extendedPage: page }) => {
    await verifyDataLayer(page, 'pageLoadReact', appUrl('/en'), {
      page: {
        pageName: 'Home',
        pageTitle: 'Home | SFS',
        lang: 'en',
        site: 'moneyhelper',
        pageType: 'Homepage',
        source: 'direct',
        categoryL1: 'Home',
        url: appUrl('/en'),
      },
    });
  });

  test('Footer Links', async ({ extendedPage: page, homePage }) => {
    test.setTimeout(20_000);
    await expect(homePage.footer).toBeVisible();

    await homePage.clickFooterLink(FOOTER_LINK.privacy);
    expect(page.url()).toContain('/en/privacy');
    await expect(homePage.heading).toHaveText('Privacy');

    await verifyDataLayer(page, 'pageLoadReact', appUrl('/en/privacy'), {
      page: {
        pageName: 'Privacy',
        pageTitle: 'Privacy | SFS',
        lang: 'en',
        site: 'moneyhelper',
        pageType: 'Apply to use the SFS',
        source: 'direct',
        url: appUrl('/en/privacy'),
      },
    });

    await page.goBack();
    await expect(homePage.introHeading).toBeVisible();

    await homePage.clickFooterLink(FOOTER_LINK.accessibility);
    expect(page.url()).toContain('/en/accessibility');
    await expect(homePage.heading).toHaveText('Accessibility');

    await verifyDataLayer(page, 'pageLoadReact', appUrl('/en/accessibility'), {
      page: {
        pageName: 'Accessibility',
        pageTitle: 'Accessibility | SFS',
        lang: 'en',
        site: 'moneyhelper',
        pageType: 'Apply to use the SFS',
        source: 'direct',
        url: appUrl('/en/accessibility'),
      },
    });

    await page.goBack();
    await expect(homePage.introHeading).toBeVisible();

    await homePage.clickFooterLink(FOOTER_LINK.cookies);
    expect(page.url()).toContain('/en/cookies');
    await expect(homePage.heading).toHaveText('How we use cookies');

    await verifyDataLayer(page, 'pageLoadReact', appUrl('/en/cookies'), {
      page: {
        pageName: 'How we use cookies',
        pageTitle: 'How we use cookies | SFS',
        lang: 'en',
        site: 'moneyhelper',
        pageType: 'Apply to use the SFS',
        source: 'direct',
        url: appUrl('/en/cookies'),
      },
    });
  });

  test('What is the SFS page', async ({ extendedPage: page, homePage }) => {
    test.setTimeout(50_000);
    await homePage.clickMenuItem(HEADER_LINK.whatIsSfs);
    await expect(homePage.heading).toHaveText(
      'What is the Standard Financial Statement?',
    );
    expect(page.url()).toContain('/en/what-is-the-sfs');
    await expect(page.getByTestId('image-link').first()).toBeVisible();
    await verifyDataLayer(
      page,
      'pageLoadReact',
      appUrl('/en/what-is-the-sfs'),
      {
        page: {
          pageName: 'What is the Standard Financial Statement?',
          pageTitle: 'What is the Standard Financial Statement? | SFS',
          lang: 'en',
          site: 'moneyhelper',
          pageType: 'Category',
          source: 'direct',
          categoryL1: 'What is the Standard Financial Statement?',
          url: appUrl('/en/what-is-the-sfs'),
        },
      },
    );

    await page.goto('/en/what-is-the-sfs#who');
    expect(page.url()).toContain('/en/what-is-the-sfs#who');
    await expect(page.getByTestId('image-link').first()).toBeInViewport();
    await page.goBack();
    await expect(homePage.heading).toHaveText(
      'What is the Standard Financial Statement?',
    );

    await expect(page.getByTestId('image-link').first()).not.toBeInViewport();
    expect(page.url()).not.toContain('/en/what-is-the-sfs#who');
    await homePage.clickAnchor(ANCHOR_LINK.who, true);
    expect(page.url()).toContain('/en/what-is-the-sfs#who');
    await expect(page.getByTestId('image-link').first()).toBeInViewport();

    await homePage.clickNavLink(NAV_LINK.findFreeDebtAdvice);
    await page.waitForURL('**/en/what-is-the-sfs/find-free-debt-advice');
    expect(page.url()).toContain('/en/what-is-the-sfs/find-free-debt-advice');
    await expect(homePage.heading).toHaveText('Find free debt advice');
    await verifyDataLayer(
      page,
      'pageLoadReact',
      appUrl('/en/what-is-the-sfs/find-free-debt-advice'),
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
          url: appUrl('/en/what-is-the-sfs/find-free-debt-advice'),
        },
      },
    );
  });

  test('Member organisations page', async ({
    extendedPage: page,
    homePage,
  }) => {
    await homePage.clickMenuItem(HEADER_LINK.whatIsSfs);
    await homePage.clickNavLink(NAV_LINK.memberOrganisations);
    await expect(homePage.heading).toHaveText('Member organisations');
    expect(page.url()).toContain('/en/what-is-the-sfs/public-organisations');
    await verifyDataLayer(
      page,
      'pageLoadReact',
      appUrl('/en/what-is-the-sfs/public-organisations'),
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
          url: appUrl('/en/what-is-the-sfs/public-organisations'),
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

    await homePage.clickMenuItem(HEADER_LINK.contactUs);
    await expect(homePage.heading).toHaveText('Contact Us');
    expect(page.url()).toContain('/en/contact-us');
  });

  test('Use the SFS page', async ({ extendedPage: page, homePage }) => {
    await homePage.clickMenuItem(HEADER_LINK.useTheSfs);
    await expect(homePage.heading).toHaveText('Use the SFS');
    expect(page.url()).toContain('/en/use-the-sfs');
    await verifyDataLayer(page, 'pageLoadReact', appUrl('/en/use-the-sfs'), {
      page: {
        pageName: 'Use the SFS',
        pageTitle: 'Use the SFS | SFS',
        lang: 'en',
        site: 'moneyhelper',
        pageType: 'Category',
        source: 'direct',
        categoryL1: 'Use the SFS',
        url: appUrl('/en/use-the-sfs'),
      },
    });
  });

  test('Contact Us', async ({ extendedPage: page, homePage }) => {
    await homePage.clickMenuItem(HEADER_LINK.contactUs);
    await expect(homePage.heading).toHaveText('Contact Us');
    expect(page.url()).toContain('/en/contact-us');
    await verifyDataLayer(page, 'pageLoadReact', appUrl('/en/contact-us'), {
      page: {
        pageName: 'Contact Us',
        pageTitle: 'Contact Us | SFS',
        lang: 'en',
        site: 'moneyhelper',
        pageType: 'Apply to use the SFS',
        source: 'direct',
        url: appUrl('/en/contact-us'),
      },
    });
  });
});
