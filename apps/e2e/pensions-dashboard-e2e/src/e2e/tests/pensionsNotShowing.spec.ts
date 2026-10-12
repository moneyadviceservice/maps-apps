import { expect, test } from '@maps/playwright';

import { allNewTestCases } from '../data/scenarioDetails';

/**
 * @tests User Story 58968: FE - Pensions not showing - Content Update
 * @tests Test Case 59363: 58968 AC1, AC2, AC3 Test Case 1 : Verify Pensions not showing page content update
 */

const pageHeading = 'Pensions not showing';
const pensionsNotShowingSummary =
  'We’re still building and improving our service. We’re connecting new pension schemes on a regular basis.';
const pensionsNotShowingSubheading = 'What you can do:';
const whatYouCanDoListText = [
  'Check back later to see if your pensions are showing.',
  'Let us know your National Insurance number (NINO) if you haven’t already. You’ll have to sign in again with GOV.UK One Login to return',
  'If your State Pension is not showing and you think you’re entitled to one, check your details using your State Pension forecast (opens in a new window)',
  'If you know the name of your employer(s) or pension provider(s), contact them directly.',
  'If you had a workplace pension from 1988 or earlier, or if you worked for an employer for less than two years, check if your pension contributions were refunded. Learn more about refunded pensions. (opens in a new window)',
];
const linkText1 =
  'Exit the Pensions Dashboard and start again to enter your National Insurance number.';
const linkText2 =
  'check your details using your State Pension forecast  (opens in a new window) ';
const linkText3 = 'Learn more about refunded pensions.';
const headingCheckStatePension = '    Check your State Pension forecast';
const expectedHeadingUse = 'Using the Pensions Dashboard';
const notIncludedHeadingText = 'Some pensions may not be included';
const notIncludedDescriptionText = 'You will not see pension schemes that:';
const notIncludedListText = [
  'you’ve already taken or you’re receiving money from, including those in pension drawdown',
  'are workplace schemes with fewer than 100 scheme members, unless the provider connects to the Pensions Dashboard voluntarily',
  'are administered outside the United Kingdom',
  'are managed by the Pension Protection Fund (PPF), including the Financial Assistance Scheme (FAS)',
];
const notIncludedFooterText =
  'Providers may not be able to send us information in certain circumstances. In most cases, the Dashboard will provide more details on why this information isn’t showing.';

test.describe('User views content on Pensions not Showing Page', () => {
  test.beforeEach(async ({ commonSessions, pensionsFoundPage }) => {
    const scenarioName = allNewTestCases.option;
    await commonSessions.navigateToPensionsFoundPage(scenarioName);
    await pensionsFoundPage.waitForPensionsFound();
  });

  test('Verify Content on Pensions not showing page', async ({
    commonHelpers,
    pensionsNotShowingPage,
  }) => {
    await pensionsNotShowingPage.goToPensionsNotShowingPage();
    await pensionsNotShowingPage.pageLoads();
    await expect(pensionsNotShowingPage.getPageHeading()).toContainText(
      pageHeading,
    );
    await expect(pensionsNotShowingPage.getToolIntro()).toContainText(
      pensionsNotShowingSummary,
    );
    await expect(pensionsNotShowingPage.getSubheading().nth(1)).toContainText(
      pensionsNotShowingSubheading,
    );

    await expect(pensionsNotShowingPage.getListParagraphs()).toContainText([
      ...whatYouCanDoListText,
    ]);

    //Assert links text and destination
    //Link 1
    await expect(pensionsNotShowingPage.getlinkLocatorExit()).toContainText(
      linkText1,
    );
    await expect(pensionsNotShowingPage.getLogoutModal()).toBeHidden();
    await commonHelpers.clickLink(linkText1);
    await expect(pensionsNotShowingPage.getLogoutModal()).toBeVisible();
    await commonHelpers.clickButton('Cancel');
    await expect(pensionsNotShowingPage.getLogoutModal()).toBeHidden();
    //Link2
    const newPageCheckStatePension =
      await commonHelpers.clickLinkAndReturnNewPage(
        pensionsNotShowingPage.getLinkLocatorStatePension(),
      );
    await expect(
      pensionsNotShowingPage.getLinkLocatorStatePension(),
    ).toContainText(linkText2);
    const pageTitleLocator = commonHelpers.pageTitle(newPageCheckStatePension);
    await expect(pageTitleLocator).toContainText(headingCheckStatePension);
    await newPageCheckStatePension.close();
    //Link3
    const newPageUse = await commonHelpers.clickLinkAndReturnNewPage(
      pensionsNotShowingPage.getLinkLocatorUse(),
    );
    await expect(pensionsNotShowingPage.getLinkLocatorUse()).toContainText(
      linkText3,
    );
    const pageHeadingLocator = commonHelpers.pageTitle(newPageUse);
    await expect(pageHeadingLocator).toContainText(expectedHeadingUse);
    await newPageUse.close();
    // Not included
    await expect(pensionsNotShowingPage.getNotIncludedHeading()).toContainText(
      notIncludedHeadingText,
    );
    await expect(
      pensionsNotShowingPage.getNotIncludedDescription(),
    ).toContainText(notIncludedDescriptionText);
    await expect(
      pensionsNotShowingPage.getNotIncludedListItems(),
    ).toContainText(notIncludedListText);
    await expect(pensionsNotShowingPage.getNotIncludedFooter()).toContainText(
      notIncludedFooterText,
    );
  });
});
