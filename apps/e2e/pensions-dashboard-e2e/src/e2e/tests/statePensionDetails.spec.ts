/* eslint-disable playwright/no-focused-test */
import { expect, test } from '@playwright/test';

import { statePensionCaseC } from '../data/scenarioDetails';
import { emptyState } from '../data/scenarioDetails';
import loadingPage from '../pages/LoadingPage';
import pensionDetailsPage from '../pages/PensionDetailsPage';
import pensionBreakdownPage from '../pages/PensionsBreakdownPage';
import pensionsFoundPage from '../pages/PensionsFoundPage';
import scenarioSelectionPage from '../pages/ScenarioSelectionPage';
import welcomePage from '../pages/WelcomePage';
import commonHelpers from '../utils/commonHelpers';

const claimingYourSpText1 = `You won’t get your State Pension automatically - you have to claim it.`;
const claimingYourSpText2 = `You’ll get a letter no later than two months before you reach State Pension age, telling you what to do. If you don’t get a letter, you can still make a claim.`;

test.describe('Pension Details page - State Pensions', () => {
  test.beforeEach(async ({ page }) => {
    await commonHelpers.navigateToEmulator(page);
  });
  test.afterEach(async ({ page }) => {
    await commonHelpers.logoutOfApplication(page);
  });

  test('Expected content is displayed on pensions details page for State pensions', async ({
    page,
  }) => {
    await scenarioSelectionPage.selectScenario(page, statePensionCaseC.option);
    await welcomePage.welcomePageLoads(page);
    await welcomePage.clickWelcomeButton(page);
    await loadingPage.waitForPensionsToLoad(page);
    await pensionsFoundPage.waitForPensionsFound(page);
    await pensionsFoundPage.clickSeeYourPensions(page);

    const schemeNames = ['State Pension'];
    for (const schemeName of schemeNames) {
      const pension = statePensionCaseC.pensions.find(
        (p) => p.schemeName === schemeName,
      );
      await pensionBreakdownPage.viewDetailsOfPension(page, schemeName);
      await pensionDetailsPage.assertHeading(page, schemeName);
      await expect(page.getByTestId('tool-intro')).toContainText(
        pension.subtext,
      );

      // State Pension Forecast
      await expect(
        page.locator('h2:text-is("State Pension forecast")'),
      ).toBeVisible();
      await expect(
        page
          .getByTestId('paragraph')
          .filter({ hasText: `${pension.statePensionMessageEng}` }),
      ).toBeVisible();
      //Claiming your State Pension
      await expect(
        page.getByTestId('information-callout').filter({
          has: page.locator(`h4:text-is("Claiming your State Pension")`),
        }),
      ).toBeVisible();
      await expect(
        page.getByTestId('information-callout').filter({
          has: page.locator(`li > p:text-is("${claimingYourSpText1}")`),
        }),
      ).toBeVisible();
      await expect(
        page.getByTestId('information-callout').filter({
          has: page.locator(`li > p:text-is("${claimingYourSpText2}")`),
        }),
      ).toBeVisible();
      // Pension Details
      await expect(
        pensionDetailsPage.tableSectionHeading(page, 'Pension details').first(),
      ).toBeVisible();
      await expect(pensionDetailsPage.tableHeadings(page).nth(1)).toHaveText(
        'Estimate today',
      );
      await expect(pensionDetailsPage.tableHeadings(page).nth(2)).toHaveText(
        'Forecast',
      );
      const pensionDetails: [string, string | undefined, string | undefined][] =
        [
          ['Annual amount', pension.APAnnualAmount, pension.ERIAnnualAmount],
          ['Monthly amount', pension.APMonthlyAmount, pension.ERIMonthlyAmount],
          ['Payable date', pension.apPayableDate, pension.eriPayableDate],
        ];
      for (const [label, col1Value, col2Value] of pensionDetails) {
        if (col1Value) {
          await expect(pensionDetailsPage.getDataCol1(page, label)).toHaveText(
            col1Value,
          );
        }
        if (col2Value) {
          await expect(pensionDetailsPage.getDataCol2(page, label)).toHaveText(
            col2Value,
          );
        }
      }
      //sections not displayed
      await expect(
        pensionDetailsPage.tableSectionHeading(page, 'Plan details'),
      ).not.toBeVisible();
      await expect(
        pensionDetailsPage.tableSectionHeading(page, 'Other details'),
      ).not.toBeVisible();
      await expect(
        pensionDetailsPage.tableSectionHeading(page, 'Contact your provider'),
      ).not.toBeVisible();

      //Additional Data Section
      await expect(
        pensionDetailsPage.tableSectionHeading(page, 'Additional data'),
      ).toBeVisible();
      const additionalData: [string, string | undefined][] = [
        [
          'Additional State Pension Information',
          pension.additionalStatePensionInfo,
        ],
      ];
      for (const [label, expectedValue] of additionalData) {
        if (expectedValue) {
          await expect(pensionDetailsPage.getDataCol1(page, label)).toHaveText(
            expectedValue,
          );
        }
      }
      await commonHelpers.clickLink(page, 'Back');
      await pensionBreakdownPage.pageLoads(page);
    }
  });

  test('Dashes are displayed for empty values on pensions details page for State pensions', async ({
    page,
  }) => {
    await scenarioSelectionPage.selectScenario(page, emptyState.option);
    await welcomePage.welcomePageLoads(page);
    await welcomePage.clickWelcomeButton(page);
    await loadingPage.waitForPensionsToLoad(page);
    await pensionsFoundPage.waitForPensionsFound(page);
    await pensionsFoundPage.clickSeeYourPensions(page);

    const schemeNames = ['State Empty'];
    for (const schemeName of schemeNames) {
      const pension = emptyState.pensions.find(
        (p) => p.schemeName === schemeName,
      );
      await pensionBreakdownPage.viewDetailsOfPension(page, schemeName);
      await pensionDetailsPage.assertHeading(page, schemeName);
      await expect(page.getByTestId('tool-intro')).not.toBeVisible();

      // State Pension Forecast
      await expect(
        page.locator('h2:text-is("State Pension forecast")'),
      ).not.toBeVisible();
      //Claiming your State Pension
      await expect(
        page.getByTestId('information-callout').filter({
          has: page.locator(`h4:text-is("Claiming your State Pension")`),
        }),
      ).toBeVisible();
      await expect(
        page.getByTestId('information-callout').filter({
          has: page.locator(`li > p:text-is("${claimingYourSpText1}")`),
        }),
      ).toBeVisible();
      await expect(
        page.getByTestId('information-callout').filter({
          has: page.locator(`li > p:text-is("${claimingYourSpText2}")`),
        }),
      ).toBeVisible();
      // Pension Details
      await expect(
        pensionDetailsPage.tableSectionHeading(page, 'Pension details').first(),
      ).not.toBeVisible();

      //sections not displayed
      await expect(
        pensionDetailsPage.tableSectionHeading(page, 'Plan details'),
      ).not.toBeVisible();
      await expect(
        pensionDetailsPage.tableSectionHeading(page, 'Other details'),
      ).not.toBeVisible();
      await expect(
        pensionDetailsPage.tableSectionHeading(page, 'Contact your provider'),
      ).not.toBeVisible();

      //Additional Data Section
      await expect(
        pensionDetailsPage.tableSectionHeading(page, 'Additional data'),
      ).toBeVisible();
      const additionalData: [string, string | undefined][] = [
        [
          'Additional State Pension Information',
          pension.additionalStatePensionInfo,
        ],
      ];
      for (const [label, expectedValue] of additionalData) {
        if (expectedValue) {
          await expect(pensionDetailsPage.getDataCol1(page, label)).toHaveText(
            expectedValue,
          );
        }
      }
      await commonHelpers.clickLink(page, 'Back');
      await pensionBreakdownPage.pageLoads(page);
    }
  });
});
