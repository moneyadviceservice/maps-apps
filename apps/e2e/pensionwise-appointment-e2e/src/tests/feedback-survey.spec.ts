import { expect, test } from '@lib/test.lib';

type FeedbackSurveyScenario = {
  language: string;
  path: string;
  accessibleBannerName: RegExp;
  surveyUrl: string;
  testCase: string;
};

const feedbackSurveyScenarios: FeedbackSurveyScenario[] = [
  {
    language: 'English',
    path: '/en/pension-wise-appointment/progress/saved-next-steps',
    accessibleBannerName: /feedback/i,
    surveyUrl: 'https://forms.cloud.microsoft/e/FcDMdBdu7Q',
    testCase: '59456',
  },
  {
    language: 'Welsh',
    path: '/cy/pension-wise-appointment/progress/saved-next-steps',
    accessibleBannerName: /adborth/i,
    surveyUrl: 'https://forms.cloud.microsoft/e/q1zparynfh',
    testCase: '59455',
  },
];

test.describe('Pension Wise Appointment beta banner feedback survey', () => {
  for (const scenario of feedbackSurveyScenarios) {
    test.describe(scenario.language, () => {
      test.beforeEach(async ({ basePage, setCookieControl }) => {
        await setCookieControl();
        await basePage.goto(scenario.path);
      });

      /**
       * @tests User Story 55458 AC 2
       */
      test(`${scenario.testCase}: displays the updated beta banner survey link`, async ({
        basePage,
      }) => {
        const surveyLink = basePage.feedbackLink;

        await expect(surveyLink).toBeVisible();
        await expect(surveyLink).toHaveAccessibleName(
          scenario.accessibleBannerName,
        );
        await expect(surveyLink).toHaveAttribute('href', scenario.surveyUrl);
        await expect(surveyLink).toHaveAttribute('target', '_blank');
      });

      /**
       * @tests User Story 55458 AC 3
       * @test 59459: Feedback links have accessible names and open in a new tab.
       */
      test('59459: beta banner feedback link is accessible', async ({
        basePage,
      }) => {
        const feedbackLink = basePage.feedbackLink;

        await expect(feedbackLink).toHaveAccessibleName(
          scenario.accessibleBannerName,
        );
        await expect(feedbackLink).toBeVisible();
        await expect(feedbackLink).toHaveAttribute('href', scenario.surveyUrl);
        await expect(feedbackLink).toHaveAttribute('target', '_blank');
      });
    });
  }
});
