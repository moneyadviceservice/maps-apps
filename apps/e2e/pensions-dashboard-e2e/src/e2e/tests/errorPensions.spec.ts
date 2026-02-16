/* eslint-disable playwright/no-focused-test */
import { expect, test } from '@maps/playwright';

import { singleErrorPension, twoErrorPensions } from '../data/scenarioDetails';
import pensionsFoundPage from '../pages/PensionsFoundPage';
import supportPages from '../pages/SupportPages';
import commonHelpers from '../utils/commonHelpers';
import { commonSessions } from '../utils/testSessionStorage';

const headingTextOneErrorPension = 'Issue retrieving data for 1 pension';
const headingTextextTwoErrorPensions = 'Issue retrieving data for 2 pensions';
const paragraphTextOneErrorPension =
  'We found 1 more pension but cannot show you the details because there was a problem retrieving the data. Check back later or ';
const paragraphTextTwoErrorPensions =
  'We found 2 more pensions but cannot show you the details because there was a problem retrieving the data. Check back later or ';
const reportTechnicalProblemHeading = 'Report a technical problem';
const linkText = 'report a technical problem';
const pageTitleText = 'Pensions found';
const pensionsNotShowingLinkText = 'Are you expecting to see other pensions?';
const helpAndSupportHeadingText = 'Help and support';

/**
 * @tests User Story 44358
 * @tests Test Case 44846: 44358 AC1 TEST CASE 1 : Error pension banner is displayed - Desktop
 * @tests Test Case 44848: 44358 AC2 TEST CASE 2: Singular error pension heading is displayed
 * @test Test Case 44849: 44358 AC3 TEST CASE 3: Multiple error pensions heading is displayed
 * @test Test Case 44850: 44358 AC4 TEST CASE 4 : Hyperlink navigates to Report a technical problem page
 * @test Test Case 44852: 44358 AC5 TEST CASE 5 : Only error pension component is displayed
 * @test Test Case 44853: 44358 AC6 TEST CASE 6 : Error banner is displayed in mobile view
 */

test.describe('Error Pensions', () => {
  test('Single Error Pension is displayed', async ({ page }) => {
    const scenarioName = singleErrorPension.option;
    await commonSessions.navigateToPensionsFoundPage(page, scenarioName);
    //banner is visible
    await expect(pensionsFoundPage.errorPensionBanner(page)).toBeVisible();
    //heading text
    await expect(pensionsFoundPage.errorPensionTitle(page)).toHaveText(
      headingTextOneErrorPension,
    );
    //paragraph text
    await expect(pensionsFoundPage.errorPensionParagraph(page)).toContainText(
      paragraphTextOneErrorPension,
    );
    //link is visible
    await expect(
      pensionsFoundPage.reportTechnicalProblemLink(page),
    ).toContainText(linkText);
    //link navigates to Report a technical problem page
    await pensionsFoundPage.clickReportTechnicalProblemLink(page);
    await expect(commonHelpers.pageTitle(page)).toContainText(
      reportTechnicalProblemHeading,
    );
  });

  test('Multiple Error Pension are displayed, only error pension are displayed', async ({
    page,
  }) => {
    const scenarioName = twoErrorPensions.option;
    await commonSessions.navigateToPensionsFoundPage(page, scenarioName);
    //only error pension Banner is visible : incl Pensions Found heading, Are you expecting other pensions link, H&S section
    await expect(commonHelpers.pageTitle(page)).toHaveText(pageTitleText);
    await expect(
      await pensionsFoundPage.linkExpectingOtherPensions(page),
    ).toContainText(pensionsNotShowingLinkText);
    await expect(supportPages.helpAndSupportHeading(page)).toContainText(
      helpAndSupportHeadingText,
    );
    //channels not visible
    const channelsNotDisplayed = await pensionsFoundPage.noChannelsVisible(
      page,
    );
    expect(channelsNotDisplayed).toBe(true);
    //unsupported pensions not visible
    const unsupportedPensions =
      await pensionsFoundPage.unsupportedPensionsCallOut(page);
    await expect(unsupportedPensions).toBeHidden();
    //banner is visible
    await expect(pensionsFoundPage.errorPensionBanner(page)).toBeVisible();
    //heading text
    await expect(pensionsFoundPage.errorPensionTitle(page)).toHaveText(
      headingTextextTwoErrorPensions,
    );
    //paragraph text
    await expect(pensionsFoundPage.errorPensionParagraph(page)).toContainText(
      paragraphTextTwoErrorPensions,
    );
    //link is visible
    await expect(
      pensionsFoundPage.reportTechnicalProblemLink(page),
    ).toContainText(linkText);
    //link navigates to Report a technical problem page
    await pensionsFoundPage.clickReportTechnicalProblemLink(page);
    await expect(commonHelpers.pageTitle(page)).toContainText(
      reportTechnicalProblemHeading,
    );
  });
});
