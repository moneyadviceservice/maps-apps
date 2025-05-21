/* eslint-disable playwright/no-focused-test */
import { expect, test } from '@playwright/test';

import { allNewTestCases, pensionCardsMay2025 } from '../data/scenarioDetails';
import loadingPage from '../pages/LoadingPage';
import pendingPensionsPage from '../pages/PendingPensionsPage';
import pensionBreakdownPage from '../pages/PensionsBreakdownPage';
import pensionsFoundPage from '../pages/PensionsFoundPage';
import scenarioSelectionPage from '../pages/ScenarioSelectionPage';
import welcomePage from '../pages/WelcomePage';
import commonHelpers from '../utils/commonHelpers';

const detailsButtonText = 'See details';
const summaryText1 = "You don't need to do anything.";
const summaryText2 =
  ' These pensions are waiting for more information from your pension providers.';
const summaryText3 =
  "They'll automatically show up in ‘Your pensions’ once their information is complete.";

test.describe('Pension Breakdown page', () => {
  test.beforeEach(async ({ page }) => {
    await commonHelpers.navigateToEmulator(page);
  });
  test.afterEach(async ({ page }) => {
    await commonHelpers.logoutOfApplication(page);
  });

  test('Expected content is displayed on pensions breakdown page', async ({
    page,
  }) => {
    await scenarioSelectionPage.selectScenario(page, allNewTestCases.option);
    await welcomePage.welcomePageLoads(page);
    await welcomePage.clickWelcomeButton(page);
    await loadingPage.waitForPensionsToLoad(page);
    await pensionsFoundPage.waitForPensionsFound(page);
    await pensionsFoundPage.clickSeePendingPensions(page);
    await pendingPensionsPage.assertPendingPensions(
      page,
      allNewTestCases.pensions,
    );
    expect(page.url()).toContain('/pending-pensions');
    await expect(page.getByTestId('page-title')).toHaveText('Pending pensions');
    await expect(page.locator('p > strong')).toHaveText(`${summaryText1}`);
    await expect(
      page.getByTestId('paragraph').filter({ hasText: `${summaryText2}` }),
    ).toBeVisible();
    await expect(
      page.getByTestId('paragraph').filter({ hasText: `${summaryText3}` }),
    ).toBeVisible();

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
      const pension = allNewTestCases.pensions.find(
        (p) => p.schemeName === schemeName,
      );
      await pendingPensionsPage.viewTextOnPensionCard(page, schemeName);
      await expect(
        pensionBreakdownPage.getPensionCard(page, schemeName),
      ).toBeVisible();
      await expect(
        pensionBreakdownPage.getActiveStatus(page, schemeName),
      ).toContainText(pension.activeStatus);
      await expect(
        pensionBreakdownPage.getPensionCardType(page, schemeName),
      ).toContainText(pension.pensionCardType);
      await expect(
        pensionBreakdownPage.getEmployerName(page, schemeName),
      ).toContainText(pension.employerName);
      await expect(
        pensionBreakdownPage.getAdministratorName(page, schemeName),
      ).toContainText(pension.pensionAdministrator);
      await expect(
        pensionBreakdownPage.getWarningMessage(page, schemeName),
      ).toContainText(pension.warningMessage);
      await expect(
        pensionBreakdownPage.getSeeDetailsButton(page, schemeName),
      ).toContainText(detailsButtonText);
    }

    await expect(page.getByTestId('callout-negative')).toBeVisible();
    await expect(
      page.getByTestId('callout-negative').filter({ hasText: 'Important' }),
    ).toBeVisible();
    await expect(
      page
        .getByTestId('callout-negative')
        .filter({ has: page.getByTestId('need-action-link') }),
    ).toBeVisible();
    await pendingPensionsPage.clickNeedActionLink(page);
    await expect(page.getByTestId('page-title')).toHaveText(
      'Pensions that need action',
    );
  });

  test('expected content is displayed on pensions breakdown page - DB, DC, Active, Inactive', async ({
    page,
  }) => {
    await scenarioSelectionPage.selectScenario(
      page,
      pensionCardsMay2025.option,
    );
    await welcomePage.welcomePageLoads(page);
    await welcomePage.clickWelcomeButton(page);
    await loadingPage.waitForPensionsToLoad(page);
    await pensionsFoundPage.waitForPensionsFound(page);
    await pensionsFoundPage.clickSeePendingPensions(page);
    await pendingPensionsPage.assertPendingPensions(
      page,
      pensionCardsMay2025.pensions,
    );

    const schemeNamesPendingPensions = [
      'DB Scheme - Pending - Active',
      'DB Scheme - Pending - Inactive',
      'DC Scheme - Pending - Active',
      'DC Scheme - Pending - Inactive',
    ];
    for (const schemeName of schemeNamesPendingPensions) {
      const pension = pensionCardsMay2025.pensions.find(
        (p) => p.schemeName === schemeName,
      );
      await expect(
        pensionBreakdownPage.getPensionCard(page, schemeName),
      ).toBeVisible();
      await expect(
        pensionBreakdownPage.getPensionCardType(page, schemeName),
      ).toContainText(pension.pensionCardType);
      await expect(
        pensionBreakdownPage.getActiveStatus(page, schemeName),
      ).toContainText(pension.activeStatus);
      await expect(
        pensionBreakdownPage.getAdministratorName(page, schemeName),
      ).toContainText(pension.pensionAdministrator);
      await expect(
        pensionBreakdownPage.getEmployerName(page, schemeName),
      ).toContainText(pension.employerName);
      await expect(
        pensionBreakdownPage.getWarningMessage(page, schemeName),
      ).toContainText(pension.warningMessage);
      await expect(
        pensionBreakdownPage.getSeeDetailsButton(page, schemeName),
      ).toContainText(detailsButtonText);

      await expect(
        pensionBreakdownPage.getRetirementDate(page, schemeName),
      ).toContainText(pension.expectedRetirementDate);
      await expect(
        pensionBreakdownPage.getEstimatedIncome(page, schemeName),
      ).not.toBeVisible();
    }
  });
});
