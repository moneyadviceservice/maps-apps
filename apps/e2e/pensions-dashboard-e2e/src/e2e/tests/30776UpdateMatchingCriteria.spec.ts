/* eslint-disable playwright/no-focused-test */
import { expect, test } from '@playwright/test';

import { allNewTestCases } from '../data/scenarioDetails';
import loadingPage from '../pages/LoadingPage';
import pensionBreakdownPage from '../pages/PensionsBreakdownPage';
import pensionsFoundPage from '../pages/PensionsFoundPage';
import scenarioSelectionPage from '../pages/ScenarioSelectionPage';
import welcomePage from '../pages/WelcomePage';
import commonHelpers from '../utils/commonHelpers';

test.describe('DC pensions, Unsupported pensions, Match type POSS, SYS & NEW', () => {
  test.beforeEach(async ({ page }) => {
    await commonHelpers.navigateToEmulator(page);
  });
  test.afterEach(async ({ page }) => {
    await commonHelpers.logoutOfApplication(page);
  });

  test('14 DEFN DC pensions, Match type POSS, SYS & NEW are displayed on Pensions found page', async ({
    page,
  }) => {
    await scenarioSelectionPage.selectScenarioComposerDev(
      page,
      allNewTestCases.option,
    );
    await welcomePage.welcomePageLoads(page);
    await welcomePage.clickWelcomeButton(page);
    await loadingPage.waitForPensionsToLoad(page);
    await pensionsFoundPage.waitForPensionsFound(page);
    await pensionsFoundPage.assertPensionsFound(page, allNewTestCases.pensions);
    await pensionsFoundPage.assertInvalidPensionsNotVisible(
      page,
      allNewTestCases.pensions,
    );
    const channelMapping = {
      'Nest Pension': 'callout-positive',
      'TestDB:Visa': 'callout-positive',
      'TestDCHA:Visa': 'callout-positive',
      'TestDCHP:Visa': 'callout-positive',
      'TestPPF:Visa': 'callout-positive',
      'TestWU:Visa': 'callout-positive',
      'TestSML:Visa': 'callout-positive',
      XXNewMatch: 'callout-warning',
      'TestANO:Visa': 'callout-warning',
      'TestDBC:Visa': 'callout-warning',
      'TestDCC:Visa': 'callout-warning',
      'TestNET:Visa': 'callout-warning',
      'TestNEW:Visa': 'callout-warning',
      'TestTRN:Visa': 'callout-warning',
      SysError: 'callout-warning',
      'TestMEM:Visa': 'callout-negative',
      PossMatch: 'callout-negative',
    };
    for (const schemeName of Object.keys(channelMapping)) {
      const expectedChannel = channelMapping[schemeName];
      await expect(
        page.locator(
          `[data-testid="${expectedChannel}"] li:has-text("${schemeName}")`,
        ),
      ).toBeVisible();
    }
  });

  test('7 DEFN DC pensions in green channel displayed on Pensions breakdown page', async ({
    page,
  }) => {
    await scenarioSelectionPage.selectScenarioComposerDev(
      page,
      allNewTestCases.option,
    );
    await welcomePage.welcomePageLoads(page);
    await welcomePage.clickWelcomeButton(page);
    await loadingPage.waitForPensionsToLoad(page);
    await pensionsFoundPage.waitForPensionsFound(page);
    await pensionsFoundPage.clickSeeYourPensions(page);
    await pensionBreakdownPage.assertPensions(page, allNewTestCases.pensions);
    const estimatedIncomeMapping = {
      'Nest Pension': 'confirmed-pensions',
      'TestDB:Visa': 'confirmed-pensions',
      'TestDCHA:Visa': 'confirmed-pensions-no-income',
      'TestDCHP:Visa': 'confirmed-pensions-no-income',
      'TestPPF:Visa': 'confirmed-pensions-no-income',
      'TestWU:Visa': 'confirmed-pensions-no-income',
      'TestSML:Visa': 'confirmed-pensions-no-income',
    };

    for (const schemeName of Object.keys(estimatedIncomeMapping)) {
      const estimatedIncomeSection = estimatedIncomeMapping[schemeName];
      await expect(
        page.locator(
          `[data-testid="${estimatedIncomeSection}"] h4:has-text("${schemeName}")`,
        ),
      ).toBeVisible();
    }
  });

  test('Warning message displayed in pension card on pensions breakdown page', async ({
    page,
  }) => {
    await scenarioSelectionPage.selectScenarioComposerDev(
      page,
      allNewTestCases.option,
    );
    await welcomePage.welcomePageLoads(page);
    await welcomePage.clickWelcomeButton(page);
    await loadingPage.waitForPensionsToLoad(page);
    await pensionsFoundPage.waitForPensionsFound(page);
    await pensionsFoundPage.clickSeeYourPensions(page);
    const schemeNames = [
      'TestDCHA:Visa',
      'TestDCHP:Visa',
      'TestPPF:Visa',
      'TestWU:Visa',
      'TestSML:Visa',
    ];
    const getExpectedText = (schemeName) => {
      const pension = allNewTestCases.pensions.find(
        (p) => p.schemeName === schemeName,
      );
      return pension.warningMessage;
    };
    for (const schemeName of schemeNames) {
      const expectedText = getExpectedText(schemeName);
      await expect(
        page
          .locator(
            `[data-testid="information-callout"]:has-text("${schemeName}")`,
          )
          .locator(`[data-testid="pension-card-unavailable-reason"]`),
      ).toHaveText(expectedText);
    }
  });

  test('Warning message displayed in pension card on pending pensions page', async ({
    page,
  }) => {
    await scenarioSelectionPage.selectScenarioComposerDev(
      page,
      allNewTestCases.option,
    );
    await welcomePage.welcomePageLoads(page);
    await welcomePage.clickWelcomeButton(page);
    await loadingPage.waitForPensionsToLoad(page);
    await pensionsFoundPage.waitForPensionsFound(page);
    await pensionsFoundPage.clickSeePendingPensions(page);
    const schemeNames = [
      'XXNewMatch',
      'TestANO:Visa',
      'TestDBC:Visa',
      'TestDCC:Visa',
      'TestNET:Visa',
      'TestNEW:Visa',
      'TestTRN:Visa',
      'SysError',
    ];
    for (const schemeName of schemeNames) {
      await expect(
        page
          .locator(
            `[data-testid="information-callout"]:has-text("${schemeName}")`,
          )
          .locator(`[data-testid="pension-card-expected-income"]`),
      ).toHaveText('Pending');
    }
  });
});
