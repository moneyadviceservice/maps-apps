/* eslint-disable playwright/no-conditional-expect */

import { expect, test } from '@maps/playwright';

import {
  allNewTestCases,
  dbInactiveActive,
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
 * @tests User Story 48482 FE - pension-details/summary tab - summary box behaviour
 * @tests Test Case 38196: 37853:  AC1: Pension detail page URLs should no longer include a unique ID at the end.
 * @tests Test Case 38197: 37853: AC2: DC, DB route path should be updated
 * @tests Test Case 38199: 37853: AC4: The pages should work for users with JavaScript disabled.
 * @tests Test Case 38543: 36297: Acceptance Criteria 1 - Summary Component Heading -DB & DC for confirmed and pending pensions.
 * @tests Test Case 38545: 36297: Acceptance Criteria 2 - Summary Tab: Summary.
 * @tests Test Case 38547: 36297: Acceptance Criteria 3 - Summary Tab: Pension Status and Pension Type Tags with Tooltip.
 * @tests Test Case 38551: 36297: Acceptance Criteria 4 - Summary Tab: Information Last Updated Date
 * @tests Test Case 38552: 36297: Acceptance Criteria 5 - ! - AC1-4 for mobile testing (NOT AUTOMATED - Manually Tested)
 * @tests User Story 53945: Pension details page updates
 * @tests Test Case 54945: 53945 AC1, AC8 Test Case 1 : Verify  'Understand your next steps' section
 * @tests Test Case 54946: 53945 AC2, AC8 Test Case 2: Verify 'Understand your next steps' content
 * @tests Test Case 54949: 53945 AC3, AC8 Test Case 3 : Verify Next steps Card 1
 * @tests Test Case 54950: 53945 AC4, AC8 Test Case 4 : Verify Next steps Card 2
 * @tests Test Case 54951: 53945 AC5, AC8 Test Case 5 : Verify Next steps Card 3
 * @tests Test Case 54952: 53945 AC6, AC8 Test Case 6 : Verify Next steps Card 4
 *
 * @tests User Story 55004: Dev -Value Illustration Date - Pension-details page
 * @tests Test Case 55837: 55004 - AC1 - Test Case 1 - Desktop - Pension-details page summary tab - accordion wording
 * @tests Test Case 55839: 55004 - AC1 - Test Case 3 - Mobile - Pension-details page summary tab - accordion wording
 */

const accordionTitle = 'When was this calculated?';
const acccordionText =
  'You can see the calculation date on the Income and values page. This is the latest data your pension provider sent us.';

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

      /* eslint-disable playwright/no-conditional-in-test */
      if (pension.APPotValue) {
        const potValue = await pensionDetailsPage.getPotValueCallout(page);
        const potValueToolTipIconState = page.locator(
          'p:has-text("Latest pot value") label[data-testid="tooltip-icon"]',
        );
        //tootip closed by default
        await expect(potValueToolTipIconState).toHaveAttribute(
          'aria-expanded',
          'false',
        );
        await commonHelpers.clickTooltip(page, 'pot-value-title');
        //tooltip open
        await expect(potValueToolTipIconState).toHaveAttribute(
          'aria-expanded',
          'true',
        );
        await commonHelpers.clickTooltip(page, 'pot-value-title');
        //tooltip closed
        await expect(potValueToolTipIconState).toHaveAttribute(
          'aria-expanded',
          'false',
        );
        const potValueText = await potValue
          .getByTestId('pot-value-amount')
          .textContent();

        expect(potValueText).toContain(pension.APPotValue);
      }

      //plan reference number, Retirement date
      expect(
        await pensionDetailsPage.verifyCommonHeaderAndIllustrationDate(
          page,
          pension.referenceNumber,
          pension.payableDateERI,
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
      await commonHelpers.clickTooltip(page, 'retirement-date');
      //tooltip open
      await expect(retirementDateToolTipIconState).toHaveAttribute(
        'aria-expanded',
        'true',
      );
      await commonHelpers.clickTooltip(page, 'retirement-date');
      //tooltip closed
      await expect(retirementDateToolTipIconState).toHaveAttribute(
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

    const schemesWithNoBenefitValues = [
      'Prime Lifetime Fund',
      'Capital Gains Retirement',
      'Secure Growth',
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
      expect(referenceNumberVisible).toContain(pension?.referenceNumber);

      const payableDateVisible = await pensionDetailsPage.verifyPayableDate(
        page,
      );
      expect(payableDateVisible).toContain(pension?.payableDateERI);

      if (schemesWithNoBenefitValues.includes(schemeName)) {
        //when was this calulated accordion
        await expect(
          pensionDetailsPage.valueIllustrationDateAccordion(page),
        ).not.toHaveAttribute('open');
        expect(await pensionDetailsPage.valueIllustrationDateTitle(page)).toBe(
          accordionTitle,
        );
        await commonHelpers.clickAccordion(
          page,
          pensionDetailsPage.valueIllustrationDateAccordion(page),
          accordionTitle,
        );
        expect(
          await pensionDetailsPage.getValueIllustrationDateAccordionText(page),
        ).toBe(acccordionText);
        await expect(
          pensionDetailsPage.valueIllustrationDateAccordion(page),
        ).toHaveAttribute('open');
        await commonHelpers.clickAccordion(
          page,
          pensionDetailsPage.valueIllustrationDateAccordion(page),
          accordionTitle,
        );
        await expect(
          pensionDetailsPage.valueIllustrationDateAccordion(page),
        ).not.toHaveAttribute('open');
      } else {
        await expect(
          pensionDetailsPage.valueIllustrationDateAccordion(page),
        ).toBeHidden();
      }

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
      expect(referenceNumberVisible).toContain(pension?.referenceNumber);

      const payableDateVisible = await pensionDetailsPage.verifyPayableDate(
        page,
      );
      expect(payableDateVisible).toContain(pension?.payableDateERI);

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

      //plan reference number, Retirement date
      expect(
        await pensionDetailsPage.verifyCommonHeaderAndIllustrationDate(
          page,
          pension?.referenceNumber,
          pension?.payableDateERI,
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

  test('Expected next steps content is displayed on Pension details summary tab', async ({
    page,
  }) => {
    const nextStepsHeadingText = 'Understand your next steps';
    const nextStepsIntroText =
      'Pensions can be complicated, but we’re here to help you understand your options and next steps. Actions you take now might affect how comfortable your retirement is in the future.';
    const nextStepsIntroNewTabText = 'All these links open in a new tab.';
    const cardText = [
      {
        title: 'How can I make the most of my pension? (opens in a new window)',
        text: 'Get free help with your pension, including ways to boost it and how and when you can take an income.',
        link: 'https://www.moneyhelper.org.uk/en/pensions-and-retirement/make-the-most-of-your-pension',
      },
      {
        title:
          'How much money will I need in retirement? (opens in a new window)',
        text: 'Find out how much retirement income you’ll need to cover your essential costs with our Budget planner.',
        link: 'https://www.moneyhelper.org.uk/en/everyday-money/budgeting/budget-planner',
      },
      {
        title:
          'Will I have enough to live comfortably? (opens in a new window)',
        text: 'See how your estimated retirement income might change if you saved more with our Pension calculator.',
        link: 'https://www.moneyhelper.org.uk/en/pensions-and-retirement/pensions-basics/pension-calculator',
      },
      {
        title: 'Should I combine my pensions? (opens in a new window)',
        text: 'If you have multiple pensions, find out if transferring or combining your pensions is a good idea.',
        link: 'https://www.moneyhelper.org.uk/en/pensions-and-retirement/pension-transfers-consolidation',
      },
    ];

    const scenarioName = allNewTestCases.option;
    await commonSessions.navigateToPensionsFoundPage(page, scenarioName);
    await pensionsFoundPage.clickSeeYourPensions(page);

    const schemeNames = ['Nest Pension'];
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
      await expect(pensionDetailsPage.nextStepSection(page)).toBeVisible();
      await expect(pensionDetailsPage.nextStepsHeading(page)).toHaveText(
        nextStepsHeadingText,
      );
      await expect(pensionDetailsPage.nextStepsIntro(page)).toHaveText(
        nextStepsIntroText,
      );
      await expect(pensionDetailsPage.nextStepsIntroNewTab(page)).toHaveText(
        nextStepsIntroNewTabText,
      );
      await expect(pensionDetailsPage.nextStepsTeaserCard(page)).toHaveCount(4);
      for (const card of cardText) {
        const cardElement = pensionDetailsPage
          .nextStepsTeaserCard(page)
          .filter({
            hasText: card.title,
          });
        const titleLink = cardElement.getByRole('link', { name: card.title });
        await expect(cardElement).toBeVisible();
        await expect(titleLink).toBeVisible();
        await expect(titleLink).toHaveAttribute('href', card.link);
        await expect(cardElement).toContainText(card.text);
        const newTab = await pensionDetailsPage.clickLink(page, card.title);
        await expect(newTab).toHaveURL(card.link);
        await newTab.close();
      }
    }
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
