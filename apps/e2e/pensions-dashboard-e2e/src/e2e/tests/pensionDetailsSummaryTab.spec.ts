/* eslint-disable playwright/no-focused-test */
import { expect, test } from '@maps/playwright';

import {
  allNewTestCases,
  dbInactiveActive,
  lumpSumScenario,
  newDetailsPageSummary,
  newDetailsPageSummaryPending,
} from '../data/scenarioDetails';
import homePage from '../pages/HomePage';
import loadingPage from '../pages/LoadingPage';
import pendingPensionsPage from '../pages/PendingPensionsPage';
import pensionDetailsPage from '../pages/PensionDetailsPage';
import pensionBreakdownPage from '../pages/PensionsBreakdownPage';
import pensionsFoundPage from '../pages/PensionsFoundPage';
import scenarioSelectionPage from '../pages/ScenarioSelectionPage';
import welcomePage from '../pages/WelcomePage';
import commonHelpers from '../utils/commonHelpers';
import { commonSessions } from '../utils/testSessionStorage';
/**
 *
 * @tests User Story 37853
 * @tests User Story 38983
 * @tests User Story 36297 *NOT LIMITED TO
 * @tests Test Case 38196: 37853:  AC1: Pension detail page URLs should no longer include a unique ID at the end.
 * @tests Test Case 38197: 37853: AC2: DC, DB route path should be updated
 * @tests Test Case 38199: 37853: AC4: The pages should work for users with JavaScript disabled.
 * @tests Test Case 38543: 36297: Acceptance Criteria 1 - Summary Component Heading -DB & DC for confirmed and pending pensions.
 * @tests Test Case 38545: 36297: Acceptance Criteria 2 - Summary Tab: Summary.
 * @tests Test Case 38547: 36297: Acceptance Criteria 3 - Summary Tab: Pension Status and Pension Type Tags with Tooltip.
 * @tests Test Case 38551: 36297: Acceptance Criteria 4 - Summary Tab: Information Last Updated Date
 * @tests Test Case 38552: 36297: Acceptance Criteria 5 - ! - AC1-4 for mobile testing (NOT AUTOMATED - Manually Tested)
 * @tests Test Case 38983: 39414: Acceptance Criteria 1 - Summary Tab: Lump Sum Sentence for DB Pensions
 * @tests Test Case 38983: 39415: Acceptance Criteria 2 - Summary Tab:Values are displayed correctly in lump sum for DB Pensions
 * @tests Test Case 38983: 39416: Acceptance Criteria 3 - Summary Tab: Lump Sum Sentence is not displayed for when lumpSum payableDetails object is not attached to the ERI illustrationType
 * @tests Test Case 38983: 39417: Acceptance Criteria 4 - Summary Tab: Values are not displayed in lump sum for DB Pensions hen lumpSum payableDetails object is not attached to the ERI illustrationType
 */

test.describe('Pension Details page - Your Pensions', () => {
  test.beforeEach(async ({ page }) => {
    await commonHelpers.navigateToEmulator(page);
  });

  test('Expected content is displayed on pensions details page for Confirmed DC pensions', async ({
    page,
  }) => {
    const scenarioName = allNewTestCases.option;
    await commonSessions.navigateToPensionsFoundPage(page, scenarioName);
    await pensionsFoundPage.clickSeeYourPensions(page);

    const schemeNames = [
      'Nest Pension',
      'TestDB:Visa',
      'TestDCHA:Visa',
      'TestDCHP:Visa',
      'TestPPF:Visa',
      'TestSML:Visa',
      'TestWU:Visa',
    ];
    for (const schemeName of schemeNames) {
      const pension = allNewTestCases.pensions.find(
        (p) => p.schemeName === schemeName,
      );
      expect(pension).toBeDefined(); // Add this line for better error reporting
      if (!pension) {
        throw new Error(
          `Pension with schemeName "${schemeName}" not found in allNewTestCases.pensions`,
        );
      }
      await pensionBreakdownPage.viewDetailsOfPension(page, schemeName);
      await pensionDetailsPage.assertHeading(page, schemeName);
      expect(page.url()).toContain('/pension-details/your-pension-summary');

      //plan reference number, Retirement date, information last updated
      expect(
        await pensionDetailsPage.verifyCommonHeaderAndIllustrationDate(
          page,
          pension.referenceNumber,
          pension.payableDateERI,
          pension.dataIllustrationDate,
        ),
      ).toBe(true);
      // retirementDate Tooltip open and closed states
      const retirementDateToolTipIconState = page.locator(
        'p:has-text("Retirement date") label[data-testid="tooltip-icon"]',
      );
      //tootip closed by default
      await expect(retirementDateToolTipIconState).toHaveAttribute(
        'aria-expanded',
        'false',
      );
      await pensionDetailsPage.clickTooltip(page, 'Retirement date');
      //tooltip open
      await expect(retirementDateToolTipIconState).toHaveAttribute(
        'aria-expanded',
        'true',
      );
      await pensionDetailsPage.clickTooltip(page, 'Retirement date');
      //tooltip closed
      await expect(retirementDateToolTipIconState).toHaveAttribute(
        'aria-expanded',
        'false',
      );

      // Information last updated Tooltip text and open & closed states
      const informationLastUpdatedToolTipIconState = page.locator(
        'p:has-text("Information last updated") label[data-testid="tooltip-icon"]',
      );
      //tootip closed by default
      await expect(informationLastUpdatedToolTipIconState).toHaveAttribute(
        'aria-expanded',
        'false',
      );
      await pensionDetailsPage.clickTooltip(page, 'Information last updated');
      //tooltip open
      await expect(informationLastUpdatedToolTipIconState).toHaveAttribute(
        'aria-expanded',
        'true',
      );
      await pensionDetailsPage.clickTooltip(page, 'Information last updated');
      //tooltip closed
      await expect(informationLastUpdatedToolTipIconState).toHaveAttribute(
        'aria-expanded',
        'false',
      );

      // Navigate through all of the tabs and assert URL
      await pensionDetailsPage.checkPensionDetailsTabs(
        page,
        'tab-pension-income-and-values',
        'Income and values',
      );
      expect(page.url()).toContain(
        '/pension-details/pension-income-and-values',
      );

      await pensionDetailsPage.checkPensionDetailsTabs(
        page,
        'tab-about-this-pension',
        'About this pension',
      );
      expect(page.url()).toContain('/pension-details/about-this-pension');
      await pensionDetailsPage.checkPensionDetailsTabs(
        page,
        'tab-contact-pension-provider',
        'Contact provider',
      );
      expect(page.url()).toContain('/pension-details/contact-pension-provider');

      await commonHelpers.clickLink(page, 'Back');
      await pensionBreakdownPage.pageLoads(page);
    }
  });

  // Active and Inactive Pensions
  // const expectedStatusText = pension.pensionStatusActive
  //   ? 'This pension is active. This means it’s being paid into.'
  //   : 'This pension is inactive.';
  // const expectedDotColor = pension.pensionStatusActive
  //   ? '.bg-green-700'
  //   : '.bg-gray-650';
  // await expect(page.locator(`${expectedDotColor}`)).toBeVisible();
  // await expect(page.getByText(expectedStatusText)).toBeVisible();

  //     // Pension Details
  //     await expect(
  //       pensionDetailsPage.tableSectionHeading(page, 'Pension details').first(),
  //     ).toBeVisible();
  //     await expect(pensionDetailsPage.tableHeadings(page).nth(1)).toHaveText(
  //       'Current value',
  //     );
  //     await expect(pensionDetailsPage.tableHeadings(page).nth(2)).toHaveText(
  //       'Estimate at retirement',
  //     );
  //     const pensionDetails: [string, string | undefined, string | undefined][] =
  //       [
  //         ['Annual amount', pension.APAnnualAmount, pension.ERIAnnualAmount],
  //         ['Monthly amount', pension.APMonthlyAmount, pension.ERIMonthlyAmount],
  //         ['Pot value', pension.APPotValue, pension.ERIPotValue],
  //       ];
  //     for (const [label, col1Value, col2Value] of pensionDetails) {
  //       if (col1Value) {
  //         await expect(pensionDetailsPage.getDataCol1(page, label)).toHaveText(
  //           col1Value,
  //         );
  //       }
  //       if (col2Value) {
  //         await expect(pensionDetailsPage.getDataCol2(page, label)).toHaveText(
  //           col2Value,
  //         );
  //       }
  //     }

  //     //Other Details
  //     await expect(
  //       pensionDetailsPage.tableSectionHeading(page, 'Other details'),
  //     ).toBeVisible();
  //     const otherDetails: [string, string | undefined][] = [
  //       ['Calculation method (ERI)', pension.calcMethodERI],
  //       ['Calculation method (AP)', pension.calcMethodAP],
  //       ['Amount type (ERI)', pension.amountTypeERI],
  //       ['Amount type (AP)', pension.amountTypeAP],
  //       ['Last payment date (ERI)', pension.lastPaymentDateERI],
  //       ['Last payment date (AP)', pension.lastPaymentDateAP],
  //       ['Increase (ERI)', pension.increaseERI],
  //       ['Increase (AP)', pension.increaseAP],
  //       ['Survivor benefit (ERI)', pension.survivorBenERI],
  //       ['Survivor benefit (AP)', pension.survivorBenAP],
  //       ['Safeguarded benefit (ERI)', pension.safeguardedBenERI],
  //       ['Safeguarded benefit (AP)', pension.safeguardedBenAP],
  //       ['Warning (ERI)', pension.warningERI],
  //       ['Warning (AP)', pension.warningAP],
  //     ];
  //     for (const [label, expectedValue] of otherDetails) {
  //       if (expectedValue) {
  //         await expect(pensionDetailsPage.getDataCol1(page, label)).toHaveText(
  //           expectedValue,
  //         );
  //       }
  //     }

  //     //Contact your provider
  //     await expect(
  //       pensionDetailsPage.tableSectionHeading(page, 'Contact your provider'),
  //     ).toBeVisible();
  //     const contactYourProvider: [string, string | undefined][] = [
  //       ['Pension provider', pension.pensionAdministrator],
  //       ['Website', pension.website],
  //       ['Preferred contact method', pension.preferredContact],
  //       ['Email', pension.email],
  //       ['Phone number', pension.tel],
  //       ['Address', pension.address],
  //     ];
  //     for (const [label, expectedValue] of contactYourProvider) {
  //       if (expectedValue) {
  //         await expect(pensionDetailsPage.getDataCol1(page, label)).toHaveText(
  //           expectedValue,
  //         );
  //       }
  //     }

  // });

  test('Expected Content for Confirmed Pension with and without estimated income Summary tabs for DB and DC Pensions', async ({
    page,
  }) => {
    const scenarioName = newDetailsPageSummary.option;
    await commonSessions.navigateToPensionsFoundPage(page, scenarioName);
    await pensionsFoundPage.clickSeeYourPensions(page);

    const schemeNames = [
      'Prime Lifetime Fund',
      'Capital Gains Retirement',
      'Secure Growth',
      'Pinnacle Pension Trust',
      'Horizon Income Plan',
      'Dynamic Future Fund',
    ];
    for (const schemeName of schemeNames) {
      const pension = newDetailsPageSummary.pensions.find(
        (p) => p.schemeName === schemeName,
      );
      console.log('Looking for scheme:', schemeName, 'Found:', !!pension);
      expect(pension).toBeDefined(); // This will fail the test if not found
      await pensionBreakdownPage.viewDetailsOfPension(page, schemeName);
      await pensionDetailsPage.assertHeading(page, schemeName);

      // Break down verification into separate assertions for better error visibility
      const referenceNumberVisible =
        await pensionDetailsPage.verifyReferenceNumber(page);
      expect(referenceNumberVisible).toContain(pension.referenceNumber);

      const payableDateVisible = await pensionDetailsPage.verifyPayableDate(
        page,
      );
      expect(payableDateVisible).toContain(pension.payableDateERI);

      const illustrationDateVisible =
        await pensionDetailsPage.verifyIllustrationDate(page);
      expect(illustrationDateVisible).toContain(pension.dataIllustrationDate);

      // ... any other assertions based on the UI and data
      await commonHelpers.clickLink(page, 'Back');
      await pensionBreakdownPage.pageLoads(page);
    }
  });

  test('Expected Content for Pending Pension with for DB Pensions', async ({
    page,
  }) => {
    await scenarioSelectionPage.selectScenarioComposerDev(
      page,
      newDetailsPageSummaryPending.option,
    );
    await welcomePage.welcomePageLoads(page);
    await welcomePage.clickWelcomeButton(page);
    await loadingPage.waitForPensionsToLoad(page);
    await pensionsFoundPage.waitForPensionsFound(page);
    await pensionsFoundPage.clickSeePendingPensions(page);

    const schemeNames = ['Zenith Retirement Scheme', 'Global Harmony Pension'];
    for (const schemeName of schemeNames) {
      const pension = newDetailsPageSummaryPending.pensions.find(
        (p) => p.schemeName === schemeName,
      );
      expect(pension).toBeDefined(); // This will fail the test if not found
      await pendingPensionsPage.viewDetailsOfPendingPension(page, schemeName);
      await pensionDetailsPage.assertHeading(page, schemeName);

      const referenceNumberVisible =
        await pensionDetailsPage.verifyReferenceNumber(page);
      expect(referenceNumberVisible).toContain(pension.referenceNumber);

      const payableDateVisible = await pensionDetailsPage.verifyPayableDate(
        page,
      );
      expect(payableDateVisible).toContain(pension.payableDateERI);

      const illustrationDateVisible =
        await pensionDetailsPage.verifyIllustrationDate(page);
      expect(illustrationDateVisible).toContain(pension.dataIllustrationDate);

      // ... any other assertions based on the UI and data
      await commonHelpers.clickLink(page, 'Back');
      await pendingPensionsPage.pageLoads(page);
    }
  });

  test('Expected content is displayed on pensions details page for Confirmed DB pensions', async ({
    page,
  }) => {
    await scenarioSelectionPage.selectScenarioComposerDev(
      page,
      dbInactiveActive.option,
    );
    await welcomePage.welcomePageLoads(page);
    await welcomePage.clickWelcomeButton(page);
    await loadingPage.waitForPensionsToLoad(page);
    await pensionsFoundPage.waitForPensionsFound(page);
    await pensionsFoundPage.clickSeeYourPensions(page);

    const schemeNames = ['BTP Pensions', 'Trafford Pension Fund'];
    for (const schemeName of schemeNames) {
      const pension = dbInactiveActive.pensions.find(
        (p) => p.schemeName === schemeName,
      );
      await pensionBreakdownPage.viewDetailsOfPension(page, schemeName);
      await pensionDetailsPage.assertHeading(page, schemeName);
      expect(page.url()).toContain('/pension-details/your-pension-summary');

      //plan reference number, Retirement date, information last updated
      expect(
        await pensionDetailsPage.verifyCommonHeaderAndIllustrationDate(
          page,
          pension.referenceNumber,
          pension.payableDateERI,
          pension.dataIllustrationDate,
        ),
      ).toBe(true);

      // Navigate through all of the tabs and assert URL
      await pensionDetailsPage.checkPensionDetailsTabs(
        page,
        'tab-pension-income-and-values',
        'Income and values',
      );
      expect(page.url()).toContain(
        '/pension-details/pension-income-and-values',
      );

      await pensionDetailsPage.checkPensionDetailsTabs(
        page,
        'tab-about-this-pension',
        'About this pension',
      );
      expect(page.url()).toContain('/pension-details/about-this-pension');

      await pensionDetailsPage.checkPensionDetailsTabs(
        page,
        'tab-contact-pension-provider',
        'Contact provider',
      );
      expect(page.url()).toContain('/pension-details/contact-pension-provider');

      await pensionDetailsPage.checkPensionDetailsTabs(
        page,
        'tab-your-pension-summary',
        'Summary',
      );
      expect(page.url()).toContain('/pension-details/your-pension-summary');
      await commonHelpers.clickLink(page, 'Back');
      await pensionBreakdownPage.pageLoads(page);
    }
  });

  test('verify lump sum sentence on summary sentence for a DB pension', async ({
    page,
  }) => {
    const scenarioName = lumpSumScenario.option;
    await commonSessions.navigateToPensionsFoundPage(page, scenarioName);
    await pensionsFoundPage.clickSeeYourPensions(page);

    const schemeNames = [
      'Horizon Lifetime Plan',
      'Oakfield Secure Pension',
      'GreenOak Retirement Plan',
    ];
    for (const schemeName of schemeNames) {
      const pension = lumpSumScenario.pensions.find(
        (p) => p.schemeName === schemeName,
      );
      const eriPotValue = pension?.ERIPotValue;
      console.log('ERIPotValue:', eriPotValue);
      const payableDate = pension?.payableDateERI;
      console.log('payableDate:', payableDate);
      await pensionBreakdownPage.viewDetailsOfPension(page, schemeName);
      await pensionDetailsPage.assertHeading(page, schemeName);
      expect(page.url()).toContain('/pension-details/your-pension-summary');

      // Verify the presence of lump sum statement
      const lumpSumSentence = await pensionDetailsPage.getLumpSumText(page);
      expect(lumpSumSentence.includes(eriPotValue)).toBe(true);
      expect(lumpSumSentence.includes(payableDate)).toBe(true);
      await commonHelpers.clickLink(page, 'Back');
    }
  });

  test('verify lump sum sentence is not displayed on summary sentence for a DB pension when lumpSum payableDetails object is not attached to the ERI illustrationType', async ({
    page,
  }) => {
    const scenarioName = lumpSumScenario.option;
    await commonSessions.navigateToPensionsFoundPage(page, scenarioName);
    await pensionsFoundPage.clickSeeYourPensions(page);

    const schemeName = 'SilverTree Future Fund';
    const pension = allNewTestCases.pensions.find(
      (p) => p.schemeName === schemeName,
    );
    const eriPotValue = pension?.ERIPotValue;
    console.log('ERIPotValue:', eriPotValue);
    const payableDate = pension?.payableDateERI;
    console.log('payableDate:', payableDate);
    await pensionBreakdownPage.viewDetailsOfPension(page, schemeName);
    await pensionDetailsPage.assertHeading(page, schemeName);
    expect(page.url()).toContain('/pension-details/your-pension-summary');

    // Verify the absence of lump sum statement
    const lumpSumSentence = await pensionDetailsPage.getLumpSumText(page);
    expect(lumpSumSentence.includes(eriPotValue)).toBe(false);
    expect(lumpSumSentence.includes(payableDate)).toBe(false);
  });
});

test.describe('JavaScript Disabled', () => {
  test.use({ javaScriptEnabled: false });

  test(
    'Verify Pension details tabs urls',
    { tag: '@jsdisabled' },
    async ({ page }) => {
      await commonHelpers.navigateToStartPage(page);

      const schemeName = 'Nest Pension';
      //Navigate to Pension found page
      await homePage.clickStart(page);
      await page
        .locator(scenarioSelectionPage.submitButton)
        .waitFor({ state: 'visible' });
      await scenarioSelectionPage.selectScenarioNonJs(
        page,
        'allNewTestCasesPC',
      );
      await welcomePage.welcomePageLoads(page);
      await welcomePage.clickWelcomeButton(page);
      await loadingPage.waitForPensionsToLoadJSDisabled(page);
      await pensionsFoundPage.waitForPensionsFound(page);

      await pensionsFoundPage.clickSeeYourPensions(page);
      await pensionBreakdownPage.viewDetailsOfPension(page, schemeName);
      await pensionDetailsPage.assertHeading(page, schemeName);
      expect(page.url()).toContain('/pension-details/your-pension-summary');

      // Navigate through all of the tabs and assert URL
      await pensionDetailsPage.checkPensionDetailsTabs(
        page,
        'tab-pension-income-and-values',
        'Income and values',
      );
      expect(page.url()).toContain(
        '/pension-details/pension-income-and-values',
      );

      await pensionDetailsPage.checkPensionDetailsTabs(
        page,
        'tab-about-this-pension',
        'About this pension',
      );
      expect(page.url()).toContain('/pension-details/about-this-pension');
      await pensionDetailsPage.checkPensionDetailsTabs(
        page,
        'tab-contact-pension-provider',
        'Contact provider',
      );
      expect(page.url()).toContain('/pension-details/contact-pension-provider');
    },
  );
});
