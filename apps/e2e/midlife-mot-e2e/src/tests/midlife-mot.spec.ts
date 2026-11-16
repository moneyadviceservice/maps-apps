import { expect, test } from '@lib/test.lib';

/**
 * Note:
 *
 * This test migration to Playwright is an MVP
 * The abstractions like page object model do not follow the usual conventions
 * for a questionnaire application, for example: debt-advice-locator
 */

const testAnswers = [
  // How old are you?
  '45 to 49',

  // Where do you live?
  'Scotland',

  // How well are you keeping up with bills and credit repayments?
  'I don’t have any bills or credit commitments',

  // What’s your approach to budgeting?
  "I don't have a budget but track my spending",

  // Have you considered these ways to increase your income?
  'Checking if you’re eligible for local council support',

  // Have you thought about ways to reduce the cost of these household bills?
  'Other bills, such as insurance, streaming subscriptions, credit card/loan interest and pet costs',

  // What will happen to your money and property if you get seriously ill or die?
  'None of these',

  // Do you have money set aside in case you lose your job or source of income?
  'Yes, but less than what I’d need for three months of expenses',

  // Do you have insurance to protect your income if...
  'You die',

  // Which of these items could you get insurance for, but haven’t already?
  'Your vehicle',

  // Do you have or will you be entitled to any of these pensions?
  'A workplace pension with my current and/or past employer(s)',

  // What type of workplace pension do you pay into?
  'A defined contribution pension',

  // How well are you managing your pension?
  'None of these',

  // How are you planning for retirement?
  'I know what my expenses are likely to be when I retire',

  // Where do you plan to live when you retire?
  'I’ll continue to rent privately',

  // Do you have savings goals? Yes, and a plan to achieve them
  'Yes, and a plan to achieve them',

  // Do you have any non-emergency savings or investments?
  "Yes, my savings are held in accounts I can't easily access, such as fixed-rate bonds or stocks and shares",

  // Which of the following statements about keeping your money safe apply to you?
  'None of the above',
];

test.describe('core journeys', () => {
  test.beforeEach(async ({ setCookieControl, page }) => {
    await setCookieControl();
    await page.goto('/');
  });

  test('end-to-end', async ({
    page,
    questionPage,
    checkAnswersPage,
    summaryPage,
    reportPage,
  }) => {
    // How old are you?
    await questionPage.answerQuestions(testAnswers);

    await expect(checkAnswersPage.header).toContainText('Check your answers');

    await checkAnswersPage.continueButton.click();

    const {
      teaserCards: calloutInformationCards,
      leftCalloutHeader,
      middleCalloutHeader,
      rightCalloutHeader,
    } = summaryPage;

    await expect(calloutInformationCards).toHaveCount(3);
    await expect(leftCalloutHeader).toContainText('What to focus on');
    await expect(middleCalloutHeader).toContainText('What to build on');
    await expect(rightCalloutHeader).toContainText('What to keep doing');

    await summaryPage.getYourReportButton.click();

    await expect(reportPage.header).toContainText('Your personalised report');
    await expect(reportPage.informationCalloutCards).toHaveCount(9);
    await expect(reportPage.allPrimaryButtons).toHaveCount(2);
    await expect(reportPage.footerText).toContainText(
      "Finished your Money Midlife MOT?See how you're doing with your work and health",
    );

    // Check that clicking download does generate a pdf.
    const downloadPromise = page.waitForEvent('download');
    await reportPage.downloadPdfButton.click();

    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/\.pdf$/i);

    await reportPage.startAgainButton.click();
    await expect(questionPage.header).toContainText('How old are you?');
  });
});
