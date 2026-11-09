import { expect, test } from '@playwright/test';

import landingPage, {
  BETA_FEEDBACK_LINKS,
  LANDING_COPY,
} from '../pages/landingPage';

/**
 * @tests User Story: 56345
 * @test AC1: Welsh Start Page keeps original structure and all displayed text is in Welsh
 * @test AC2: EN "What you'll get" third bullet matches updated copy exactly
 */
test.describe('Retirement Guidance - Landing Page CY/EN content (US-56345)', () => {
  test('AC1: CY start page shows original structure and Welsh copy', async ({
    page,
  }) => {
    await landingPage.visitWelsh(page);

    await expect(
      landingPage.getHeading(page, LANDING_COPY.cy.heading),
    ).toBeVisible();

    await expect(landingPage.getIntro(page)).toHaveText(LANDING_COPY.cy.intro);

    await expect(
      landingPage.getHeading(page, LANDING_COPY.cy.whatYouGetHeading),
    ).toBeVisible();

    await expect(landingPage.getWhatYouGetDescription(page)).toHaveText(
      LANDING_COPY.cy.whatYouGetDescription,
    );

    const whatYouGetItems = landingPage.getWhatYouGetItems(page);

    await expect(whatYouGetItems).toHaveText(LANDING_COPY.cy.whatYouGetItems);

    await expect(landingPage.getWhatYouGetAdditionalInfo(page)).toHaveText(
      LANDING_COPY.cy.additionalInfo,
    );

    await expect(
      landingPage.getHeading(page, LANDING_COPY.cy.howItWorksHeading),
    ).toBeVisible();

    await expect(landingPage.getHowItWorksDescription(page)).toHaveText(
      LANDING_COPY.cy.howItWorksDescription,
    );

    const howItWorksItems = landingPage.getHowItWorksItems(page);

    await expect(howItWorksItems).toHaveText(LANDING_COPY.cy.howItWorksItems);

    await expect(landingPage.getStartButton(page)).toHaveText(
      LANDING_COPY.cy.startButton,
    );

    await expect(landingPage.getCompletionTime(page)).toHaveText(
      LANDING_COPY.cy.completionTime,
    );

    const feedbackLink = landingPage.getPhaseBannerFeedbackLink(page);

    await expect(feedbackLink).toBeVisible();
    await expect(feedbackLink).toHaveAttribute('href', BETA_FEEDBACK_LINKS.cy);

    // Guardrail: ensure the EN heading isn't shown on the CY page
    await expect(
      landingPage.getHeading(page, LANDING_COPY.cy.englishHeading),
    ).toHaveCount(0);
  });

  test('AC2: EN What you’ll get third bullet matches required wording exactly', async ({
    page,
  }) => {
    await landingPage.visitEnglish(page);

    const thirdBullet = landingPage.getWhatYouGetThirdBullet(page);

    await expect(thirdBullet).toHaveText(LANDING_COPY.en.whatYouGetThirdBullet);
  });
});
