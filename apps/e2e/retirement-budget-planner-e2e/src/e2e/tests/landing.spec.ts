import { expect, test } from '@playwright/test';

import { landingPage as landingPageData } from '../data/landing';
import landingPage from '../pages/LandingPage';

test.describe('Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/en/landing');
  });

  test('should render Landing page heading, how it works and callout sections', async ({
    page,
  }) => {
    // Heading component
    await expect(landingPage.headingComponent(page)).toBeVisible();
    await expect(landingPage.heading(page)).toBeVisible();
    await expect(landingPage.subHeadingIntro(page)).toBeVisible();
    await expect(landingPage.timeEstimate(page)).toBeVisible();
    await expect(landingPage.startButtons(page)).toHaveCount(2);

    // How RBP works component
    await expect(landingPage.howRbpWorksComponent(page)).toBeVisible();
    await expect(landingPage.howRbpWorksHeadings(page)).toHaveCount(3);
    await expect(landingPage.howRbpWorksHeadings(page)).toHaveText(
      landingPageData.howRbpWorksHeadings,
    );
    await expect(landingPage.howRbpWorksTextItems(page)).toHaveCount(4);
    await expect(landingPage.howRbpWorksTextItems(page)).toHaveText(
      landingPageData.howRbpWorksTextItems,
    );
    await expect(landingPage.howRbpWorksListItems(page)).toHaveCount(11);
    await expect(landingPage.howRbpWorksListItems(page)).toHaveText(
      landingPageData.howRbpWorksListItems,
    );
    await expect(landingPage.checkStatePensionLink(page)).toBeVisible();
    await expect(landingPage.checkStatePensionLink(page)).toHaveAttribute(
      'href',
      landingPageData.checkStatePensionLink.url,
    );

    // Callout component
    await expect(landingPage.calloutComponent(page)).toBeVisible();
    await expect(landingPage.calloutHeading(page)).toBeVisible();
    await expect(landingPage.calloutIntroText(page)).toBeVisible();
    await expect(landingPage.calloutListItems(page)).toHaveCount(3);
    await expect(landingPage.calloutListItems(page)).toHaveText(
      landingPageData.calloutListItems,
    );
    await expect(landingPage.calloutOutroText(page)).toBeVisible();
    await expect(landingPage.webchatLink(page)).toBeVisible();

    await expect(landingPage.webchatLink(page)).toHaveAttribute(
      'href',
      landingPageData.webchatLink.url,
    );
    await expect(landingPage.insideUkPhoneLink(page)).toBeVisible();
    await expect(landingPage.insideUkPhoneLink(page)).toHaveAttribute(
      'href',
      landingPageData.insideUkPhoneLink.url,
    );
    await expect(landingPage.outsideUkPhoneLink(page)).toBeVisible();
    await expect(landingPage.outsideUkPhoneLink(page)).toHaveAttribute(
      'href',
      landingPageData.outsideUkPhoneLink.url,
    );
    await expect(landingPage.contactFormLink(page)).toBeVisible();
    await expect(landingPage.contactFormLink(page)).toHaveAttribute(
      'href',
      landingPageData.contactFormLink.url,
    );
  });

  test('Landing page loads successfully', async ({ page }) => {
    await expect(landingPage.headingComponent(page)).toBeVisible();
    await expect(landingPage.heading(page)).toBeVisible();
  });

  test('Clicking Start my retirement budget button navigates to About You page', async ({
    page,
  }) => {
    await landingPage.clickStartButton(page);
    await expect(page).toHaveURL(/\/en\/about-you/);
  });

  test('Each external link opens the correct URL in a new tab', async ({
    page,
    context,
  }) => {
    const externalLinks = [
      {
        locator: landingPage.checkStatePensionLink(page),
        url: landingPageData.checkStatePensionLink.url,
      },
      {
        locator: landingPage.webchatLink(page),
        url: landingPageData.webchatLink.url,
      },
      {
        locator: landingPage.contactFormLink(page),
        url: landingPageData.contactFormLink.url,
      },
    ];

    for (const link of externalLinks) {
      const [newPage] = await Promise.all([
        context.waitForEvent('page'),
        link.locator.click(),
      ]);
      await newPage.waitForLoadState();
      expect(newPage.url()).toBe(link.url);
      await newPage.close();
    }
  });
});
