import AxeBuilder from '@axe-core/playwright';
import { expect, Page, test } from '@maps/playwright';

import { allNewTestCases } from '../data/scenarioDetails';
import loadingPage from '../pages/LoadingPage';
import pendingPensionsPage from '../pages/PendingPensionsPage';
import pensionDetailsPage from '../pages/PensionDetailsPage';
import pensionBreakdownPage from '../pages/PensionsBreakdownPage';
import pensionsFoundPage from '../pages/PensionsFoundPage';
import pensionsNotShowingPage from '../pages/PensionsNotShowingPage';
import pensionsThatNeedAction from '../pages/PensionsThatNeedActionPage';
import scenarioSelectionPage from '../pages/ScenarioSelectionPage';
import welcomePage from '../pages/WelcomePage';
import YourPensionsTimeline from '../pages/YourPensionsTimeline';
import { A11yUtilities } from '../utils/a11y';
import commonHelpers from '../utils/commonHelpers';
import { commonSessions } from '../utils/testSessionStorage';

const axe = (page: Page) =>
  /** @ts-expect-error This is caused by a mismatch in types that AxeBuilder and Playwright have */
  new AxeBuilder({ page }).withTags([
    'wcag2a',
    'wcag2aa',
    'wcag21a',
    'wcag21aa',
  ]);

/**
 * Accessibility Test Suite
 *
 * Purpose:
 * - Run automated accessibility (Axe) scans across key user journeys of the
 *   pensions dashboard so regressions are detected early.
 *
 * What these tests cover:
 * - Pre-pension-found public pages such as support pages, landing and
 *   welcome pages, and the loading experience.
 * - Post-pension-found flows including: pensions found, pensions not
 *   showing, your pension breakdown, pension details (all tabs), pension
 *   timeline, pending pensions and 'pensions that need action'.
 *
 * Why:
 * - Ensure the product meets accessibility standards and that interactive
 *   content (tabs, accordions, forms) and dynamic states remain usable for
 *   assistive technologies. These tests provide broad coverage to reduce the
 *   likelihood of introducing accessibility regressions during development.
 */
test.describe('Accessibility Tests', () => {
  test.describe('Pre Pension Found Pages', () => {
    test('Explore your Dashboard', async ({ page }) => {
      await page.goto(`/en/support/explore-the-pensions-dashboard`);
      await commonHelpers.openAllAccordions(page);

      const a11yReport = await axe(page).analyze();
      A11yUtilities.createA11yHtmlReport('ExploreYourDashboard', a11yReport);

      expect(a11yReport.violations).toEqual([]);
    });

    test('Understand Your Pension', async ({ page }) => {
      await page.goto(`/en/support/understand-your-pensions`);
      await commonHelpers.openAllAccordions(page);

      const a11yReport = await axe(page).analyze();
      A11yUtilities.createA11yHtmlReport('UnderstandYourPensions', a11yReport);

      expect(a11yReport.violations).toEqual([]);
    });

    /**
     * The 'Report a Technical Problem' page will be very different from what it currently is.
     * This needs reviewing closer to going live to the public.
     */
    test.fixme('Report a Technical Problem', async ({ page }) => {
      await page.goto(`/en/support/report-a-technical-problem`);
      await commonHelpers.openAllAccordions(page);

      const a11yReport = await axe(page).analyze();
      A11yUtilities.createA11yHtmlReport('ReportATechnicalProblem', a11yReport);

      expect(a11yReport.violations).toEqual([]);
    });

    test('Landing Page, Welcome Page & Loading Page', async ({ page }) => {
      const scenarioName = allNewTestCases.option;

      await test.step('Landing Page', async () => {
        await page.goto('/en');

        const landingPageResults = await axe(page).analyze();
        A11yUtilities.createA11yHtmlReport('LandingPage', landingPageResults);

        expect(landingPageResults.violations).toEqual([]);
      });

      await test.step('Welcome Page', async () => {
        await commonHelpers.navigateToEmulator(page);
        await scenarioSelectionPage.selectScenarioComposerDev(
          page,
          scenarioName,
        );
        await welcomePage.welcomePageLoads(page);

        const welcomePageResults = await axe(page).analyze();
        A11yUtilities.createA11yHtmlReport('WelcomePage', welcomePageResults);

        expect(welcomePageResults.violations).toEqual([]);
      });

      await test.step('Loading Page', async () => {
        const loadingHeader = loadingPage.getLoadingYourPensionsHeader(page);
        await welcomePage.clickWelcomeButton(page);
        await expect(loadingHeader).toBeVisible();

        const loadingPageResults = await axe(page).analyze();
        A11yUtilities.createA11yHtmlReport('LoadingPage', loadingPageResults);

        expect(loadingPageResults.violations).toEqual([]);
      });
    });
  });

  /**
   * These tests occur after a login, and/or after the pension breakdown has been requested.
   */
  test.describe('Post Pension Found Pages', () => {
    test.beforeEach(async ({ page }) => {
      const scenarioName = allNewTestCases.option;
      await commonSessions.navigateToPensionsFoundPage(page, scenarioName);
      await pensionsFoundPage.waitForPensionsFound(page);
    });

    test('Pensions Found', async ({ page }) => {
      const accessibilityReport = await axe(page).analyze();
      A11yUtilities.createA11yHtmlReport('PensionsFound', accessibilityReport);

      expect(accessibilityReport.violations).toEqual([]);
    });

    test('Pensions Not Showing', async ({ page }) => {
      await page.goto('/en/pensions-not-showing');
      await pensionsNotShowingPage.pageLoads(page);

      const accessibilityReport = await axe(page).analyze();
      A11yUtilities.createA11yHtmlReport('NotShowing', accessibilityReport);

      expect(accessibilityReport.violations).toEqual([]);
    });

    test('Your Pensions', async ({ page }) => {
      await page.goto('/en/your-pension-breakdown');
      await pensionBreakdownPage.pageLoads(page);

      const accessibilityReport = await axe(page).analyze();
      A11yUtilities.createA11yHtmlReport('YourPensions', accessibilityReport);

      expect(accessibilityReport.violations).toEqual([]);
    });

    test('Your Pension Timeline', async ({ page }) => {
      // Alternative, but prefered POM import structure.
      const yourPensionsTimeline = new YourPensionsTimeline(page);

      await page.goto('/en/your-pensions-timeline');
      await yourPensionsTimeline.pageLoads();

      const accessibilityReport = await axe(page).analyze();
      A11yUtilities.createA11yHtmlReport('Timeline', accessibilityReport);

      expect(accessibilityReport.violations).toEqual([]);
    });

    test('Your Pending Pensions', async ({ page }) => {
      await page.goto('/en/pending-pensions');
      await pendingPensionsPage.pageLoads(page);

      const accessibilityReport = await axe(page).analyze();
      A11yUtilities.createA11yHtmlReport('Pending', accessibilityReport);

      expect(accessibilityReport.violations).toEqual([]);
    });

    test('Pensions That Need Action', async ({ page }) => {
      await page.goto('/en/pensions-that-need-action');
      await pensionsThatNeedAction.pageLoads(page);

      const accessibilityReport = await axe(page).analyze();
      A11yUtilities.createA11yHtmlReport('NeedsAction', accessibilityReport);

      expect(accessibilityReport.violations).toEqual([]);
    });

    test('Your Pension Summary', async ({ page }) => {
      await page.goto('/en/pending-pensions');

      const firstPensionCard = page.getByTestId('information-callout').first();
      await pensionBreakdownPage.clickSeeDetailsButton(page, firstPensionCard);

      /**
       * Clear up some assumptions about what will be on the page.
       * This means if anything changes from what is expected, the
       * tests will fail, pointing our attention to it.
       */
      const tabs = await pensionDetailsPage.getAllTabs(page);
      await expect(tabs).toHaveCount(4);
      await expect(tabs.nth(0)).toHaveText('Summary');
      await expect(tabs.nth(1)).toHaveText('Income & values');
      await expect(tabs.nth(2)).toHaveText('About this pension');
      await expect(tabs.nth(3)).toHaveText('Contact provider');

      /**
       * Check the summary tab for accessibility issues.
       */
      await test.step('Summary Tab', async () => {
        const accessibilityReport = await axe(page).analyze();
        A11yUtilities.createA11yHtmlReport('SummaryTab', accessibilityReport);

        expect(accessibilityReport.violations).toEqual([]);
      });

      /**
       * Check the income and values tab for accessibility issues.
       */
      await test.step('Income & Values Tab', async () => {
        await pensionDetailsPage.checkPensionDetailsTabs(
          page,
          'tab-pension-income-and-values',
          'Income and values',
        );
        const accessibilityReport = await axe(page).analyze();
        A11yUtilities.createA11yHtmlReport('IncomeTab', accessibilityReport);

        expect(accessibilityReport.violations).toEqual([]);
      });

      /**
       * Check the about your pensions tab for accessibility issues.
       */
      await test.step('About Your Pensions Tab', async () => {
        await pensionDetailsPage.checkPensionDetailsTabs(
          page,
          'tab-about-this-pension',
          'About this pension',
        );
        const accessibilityReport = await axe(page).analyze();
        A11yUtilities.createA11yHtmlReport('AboutTab', accessibilityReport);

        expect(accessibilityReport.violations).toEqual([]);
      });

      /**
       * Check the about your contact provider tab for accessibility issues.
       *
       * Unskip this as part of the following ticket.
       * https://dev.azure.com/moneyandpensionsservice/MaPS%20Digital/_workitems/edit/42467
       */
      await test.step.skip('Contact Provider Tab', async () => {
        await pensionDetailsPage.checkPensionDetailsTabs(
          page,
          'tab-contact-pension-provider',
          'Contact provider',
        );
        const accessibilityReport = await axe(page).analyze();
        A11yUtilities.createA11yHtmlReport('ContactTab', accessibilityReport);

        expect(accessibilityReport.violations).toEqual([]);
      });
    });
  });
});
