import { expect, test } from '@playwright/test';

import { landingPage as landingPageData } from '../data/landing';
import landingPage from '../pages/LandingPage';

/**
 * @test 56749 AC 1 Test Case 1 : Verify Beta banner is displayed on Retirement Budget Planner page
 * @test 56750 AC 2 Test Case 2 : Verify external links open the correct URLs in a new tab
 * @test 56751 AC 3 Test Case 3 : Verify clicking the Start my retirement budget button navigates to the About You page
 * @test 56752 AC 4 Test Case 4 : Verify the content of the landing page sections is displayed correctly
 * @test 56753 AC 5 Test Case 5 : Verify the landing page is accessible in both English and Welsh
 * @test 56754 AC 6 Test Case 6 : displays the en beta banner and feedback link
 * @test 56755 AC 7 Test Case 7 : displays the cy beta banner and feedback link
 *
 */
test.describe('Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    await landingPage.visit(page, 'en');
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

  for (const language of ['en', 'cy'] as const) {
    test(`displays the ${language} beta banner and feedback link`, async ({
      page,
    }) => {
      await landingPage.visit(page, language);

      const phaseBanner = landingPage.phaseBanner(page);
      const feedbackLink = landingPage.phaseBannerFeedbackLink(page);

      await expect(phaseBanner).toBeVisible();
      await expect(phaseBanner).toContainText(landingPageData.betaText);
      await expect(feedbackLink).toBeVisible();
      await expect(feedbackLink).toHaveAttribute(
        'href',
        landingPageData.betaFeedbackLinks[language],
      );
      await expect(feedbackLink).toHaveAttribute('target', '_blank');
    });
  }

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
    for (const externalLink of landingPage.externalLinks(page)) {
      expect(await landingPage.openExternalLink(context, externalLink)).toBe(
        externalLink.url,
      );
    }
  });
});
