import { expect, test } from '@lib/test.lib';

const feedbackSurveyCases = [
  {
    language: 'English',
    path: '/en/pension-wise-triage/',
    accessibleName: /feedback/i,
    surveyUrl: 'https://forms.cloud.microsoft/e/FcDMdBdu7Q',
    testCase: '59453',
  },
  {
    language: 'Welsh',
    path: '/cy/pension-wise-triage/',
    accessibleName: /adborth/i,
    surveyUrl: 'https://forms.cloud.microsoft/e/q1zparynfh',
    testCase: '59454',
  },
] as const;

test.describe('Pension Wise Triage beta banner feedback survey', () => {
  for (const scenario of feedbackSurveyCases) {
    /**
     * @tests User Story 55458 AC 1
     */
    test(`${scenario.testCase}: displays the updated ${scenario.language} survey link`, async ({
      basePage,
      setCookieControl,
    }) => {
      await setCookieControl();
      await basePage.goto(scenario.path);

      const feedbackLink = basePage.feedbackLink;

      await expect(basePage.phaseBanner).toBeVisible();
      await expect(feedbackLink).toBeVisible();
      await expect(feedbackLink).toHaveAccessibleName(scenario.accessibleName);
      await expect(feedbackLink).toHaveAttribute('href', scenario.surveyUrl);
      await expect(feedbackLink).toHaveAttribute('target', '_blank');
    });
  }
});
