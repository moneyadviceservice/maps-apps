import test, { expect } from '@playwright/test';

import { landingPage } from '../data/landing';
import landingPageModel, { BETA_FEEDBACK_LINKS } from '../pages/landingPage';

test.describe('Landing Page', () => {
  test('should render Landing page heading', async ({ page }) => {
    await page.goto('/en/landing');

    await expect(
      page.getByRole('heading', {
        name: landingPage.heading,
        exact: true,
      }),
    ).toBeVisible();

    await expect(page.getByTestId('landing-page-paragraph')).toHaveText(
      landingPage.paragraph,
    );
    await expect(
      page.getByRole('heading', {
        name: landingPage.whatYouGetHeading,
        exact: true,
      }),
    ).toBeVisible();

    await expect(page.getByTestId('what-you-get-description')).toHaveText(
      landingPage.whatYouGetDescription,
    );

    await expect(page.getByTestId('what-you-get-list')).toBeVisible();

    await expect(page.getByTestId('what-you-get-additional-info')).toHaveText(
      landingPage.whatYouGetAdditionalInfo,
    );

    await expect(
      page.getByRole('heading', {
        name: landingPage.howItWorksHeading,
        exact: true,
      }),
    ).toBeVisible();

    await expect(page.getByTestId('how-it-works-description')).toHaveText(
      landingPage.howItWorksDescription,
    );

    await expect(page.getByTestId('how-it-works-list')).toBeVisible();

    await expect(page.getByTestId('start-button')).toBeVisible();

    const feedbackLink = landingPageModel.getPhaseBannerFeedbackLink(page);

    await expect(feedbackLink).toBeVisible();
    await expect(feedbackLink).toHaveAttribute('href', BETA_FEEDBACK_LINKS.en);
  });
});
