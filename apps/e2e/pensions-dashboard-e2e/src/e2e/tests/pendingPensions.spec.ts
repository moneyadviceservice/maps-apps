/* eslint-disable playwright/no-focused-test */
import { expect, test } from '@maps/playwright';

import { allNewTestCases, pensionCardsMay2025 } from '../data/scenarioDetails';
import loadingPage from '../pages/LoadingPage';
import pendingPensionsPage from '../pages/PendingPensionsPage';
import pensionBreakdownPage from '../pages/PensionsBreakdownPage';
import pensionsFoundPage from '../pages/PensionsFoundPage';
import scenarioSelectionPage from '../pages/ScenarioSelectionPage';
import welcomePage from '../pages/WelcomePage';
import commonHelpers from '../utils/commonHelpers';
import { commonSessions } from '../utils/testSessionStorage';

const detailsButtonText = 'See details';
const summaryText1 = "You don't need to do anything.";
const summaryText2 =
  ' These pensions are waiting for more information from your pension providers. See the pension’s details for more information.';
const summaryText3 =
  "They'll automatically show up in ‘Your pensions’ once their information is complete.";

/**
 * Tests have been updated to account for user story 39428, and cover the following test cases
 * @tests Test Case 40504 [AC1] - Successful Page Load and Heading Display
 * @tests Test Case 40505 [AC1] - Content Verification
 * @tests Test Case 40507 [AC2] - Display of "Important" Banner Text
 * @tests Test Case 40516 [AC3] - Banner and CTA Display
 * @tests Test Case 40517 [AC3] - CTA Link Functionality
 *
 * The tests below cover more than the above test cases.
 */

test.describe('Pension Breakdown page', () => {
  test.beforeEach(async ({ page }) => {
    await commonHelpers.navigateToEmulator(page);
  });

  test('Expected content is displayed on pensions breakdown page', async ({
    page,
  }) => {
    const scenarioName = allNewTestCases.option;
    await commonSessions.navigateToPendingPensions(page, scenarioName);

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
        pensionBreakdownPage.getPendingMessage(page, schemeName),
      ).toContainText('Pending');
      await expect(
        pensionBreakdownPage.getSeeDetailsButton(page, schemeName),
      ).toContainText(detailsButtonText);
    }

    await expect(page.getByTestId('callout-negative')).toBeVisible();
    await expect(
      page.getByTestId('callout-negative').filter({ hasText: 'Important' }),
    ).toBeVisible();
    await expect(
      page.getByTestId('callout-negative').getByTestId('paragraph').filter({
        hasText:
          'You have 3 pensions that need you to provide more information or contact the pension provider.',
      }),
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

  test('expected content is displayed on pending pensions page - DB, DC, Active, Inactive', async ({
    page,
  }) => {
    await scenarioSelectionPage.selectScenarioComposerDev(
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
        pensionBreakdownPage.getPendingMessage(page, schemeName),
      ).toContainText('Pending');
      await expect(
        pensionBreakdownPage.getSeeDetailsButton(page, schemeName),
      ).toContainText(detailsButtonText);

      await expect(
        pensionBreakdownPage.getRetirementDate(page, schemeName),
      ).toContainText(pension.expectedRetirementDate);
      await expect(
        pensionBreakdownPage.getEstimatedIncome(page, schemeName),
      ).toBeHidden();
    }
  });
});
