import { expect, test } from '@playwright/test';

import aboutYouBackButtonPage from '../pages/AboutYouBackButtonPage';

/**
 * @tests User Story 49506
 * @test AC1 Non embedded version: Back button on About you navigates to AEM landing page
 * @test AC2 Embedded version: Back button on About you navigates to React landing page
 */
test.describe('Retirement Budget Planner - About You back button destination', () => {
  for (const language of ['en', 'cy'] as const) {
    test(`AC1 (${language}): Non embedded back button navigates to AEM landing page`, async ({
      page,
    }) => {
      await aboutYouBackButtonPage.startNonEmbeddedJourney(page, language);

      expect(await aboutYouBackButtonPage.backLinkHref(page)).toBe(
        aboutYouBackButtonPage.expectedAemLandingUrl(language),
      );
      await aboutYouBackButtonPage.clickBackAndWaitForAem(page, language);
    });

    test(`AC2 (${language}): Embedded back button navigates to React landing page`, async ({
      page,
    }) => {
      await aboutYouBackButtonPage.startEmbeddedJourney(page, language);

      expect(await aboutYouBackButtonPage.backLinkHref(page)).toContain(
        aboutYouBackButtonPage.expectedEmbeddedLandingPrefix(language),
      );
      await aboutYouBackButtonPage.clickBackAndWaitForEmbeddedLanding(
        page,
        language,
      );
    });
  }
});
