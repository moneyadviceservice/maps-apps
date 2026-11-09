import { expect, test } from '@maps/playwright';

import { allNewTestCases, pensionCardsMay2025 } from '../data/scenarioDetails';

const detailsButtonText = 'See details';

/**
 * Tests have been updated to account for user story 39428, and cover the following test cases
 * @tests Test Case 40504 [AC1] - Successful Page Load and Heading Display
 * @tests Test Case 40505 [AC1] - Content Verification
 * @tests Test Case 40507 [AC2] - Display of "Important" Banner Text
 * @tests Test Case 40516 [AC3] - Banner and CTA Display
 * @tests Test Case 40517 [AC3] - CTA Link Functionality
 * @tests User Story 51558 Dev - Home Navigaion
 * @tests Test Case 51821: 51558 AC3, 5 TestCase3 : Home link next to back link on Pensions that need action page
 *
 * @tests User Story 57345: FE - Combine Pending to Confirmed Pensions
 * @tests Test Case 58856: 57345 AC2 Test Case 2 : 'Yellow' pensions are displayed on Pension Breakdown page
 * @tests Test Case 58856: 57345 AC2 Test Case 2 : 'Yellow' pensions are displayed on Pension Breakdown page
 *
 * The tests below cover more than the above test cases.
 */

test.describe('Pension Breakdown page', () => {
  test.beforeEach(async ({ commonHelpers }) => {
    await commonHelpers.navigateToEmulator('en');
  });

  test('Expected content is displayed on pensions breakdown page', async ({
    page,
    basePage,
    commonSessions,
    pendingPensionsPage,
    pensionBreakdownPage,
  }) => {
    const scenarioName = allNewTestCases.option;
    await commonSessions.navigateToPensionBreakdown(scenarioName);

    expect(page.url()).toContain('/your-pension-breakdown');
    await expect(page.getByTestId('page-title')).toHaveText('Your pensions');

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
      const pension: any = allNewTestCases.pensions.find(
        (p) => p.schemeName === schemeName,
      );
      await pendingPensionsPage.viewTextOnPensionCard(schemeName);
      await expect(
        pensionBreakdownPage.getPensionCard(schemeName),
      ).toBeVisible();
      await expect(
        pensionBreakdownPage.getActiveStatus(schemeName),
      ).toContainText(pension.activeStatus);
      await expect(
        pensionBreakdownPage.getPensionCardType(schemeName),
      ).toContainText(pension.pensionCardType);
      await expect(
        pensionBreakdownPage.getEmployerName(schemeName),
      ).toContainText(pension.employerName);
      await expect(
        pensionBreakdownPage.getAdministratorName(schemeName),
      ).toContainText(pension.pensionAdministrator);
      await expect(
        pensionBreakdownPage.getSeeDetailsButton(schemeName),
      ).toContainText(detailsButtonText);
    }

    await expect(page.getByTestId('notification-box-negative')).toBeVisible();
    await expect(
      page
        .getByTestId('notification-box-negative')
        .filter({ hasText: 'Important' }),
    ).toBeVisible();
    await expect(
      page
        .getByTestId('notification-box-negative')
        .getByTestId('paragraph')
        .filter({
          hasText:
            'You have 3 pensions that need you to provide more information or contact the pension provider.',
        }),
    ).toBeVisible();
    await expect(
      page
        .getByTestId('notification-box-negative')
        .filter({ has: page.getByTestId('need-action-link') }),
    ).toBeVisible();
    await pendingPensionsPage.clickNeedActionLink();
    await expect(page.getByTestId('page-title')).toHaveText(
      'Pensions that need action',
    );
    await expect(basePage.getHomeLink()).toBeVisible();
    await expect(basePage.getBackLink()).toBeVisible();
  });

  test('expected content is displayed on pending pensions page - DB, DC, Active, Inactive', async ({
    commonHelpers,
    loadingPage,
    pendingPensionsPage,
    pensionBreakdownPage,
    pensionsFoundPage,
    scenarioSelectionPage,
    welcomePage,
  }) => {
    await scenarioSelectionPage.selectScenarioComposerDev(
      pensionCardsMay2025.option,
    );
    await welcomePage.welcomePageLoads();
    await welcomePage.clickWelcomeButton();
    await loadingPage.waitForPensionsToLoad(commonHelpers, 'en');
    await pensionsFoundPage.waitForPensionsFound();
    await pensionsFoundPage.clickSeeYourPensions();
    await pendingPensionsPage.assertPendingPensions(
      pensionCardsMay2025.pensions,
    );

    const schemeNamesPendingPensions = [
      'DB Scheme - Pending - Active',
      'DB Scheme - Pending - Inactive',
      'DC Scheme - Pending - Active',
      'DC Scheme - Pending - Inactive',
    ];
    for (const schemeName of schemeNamesPendingPensions) {
      const pension: any = pensionCardsMay2025.pensions.find(
        (p) => p.schemeName === schemeName,
      );
      await expect(
        pensionBreakdownPage.getPensionCard(schemeName),
      ).toBeVisible();
      await expect(
        pensionBreakdownPage.getPensionCardType(schemeName),
      ).toContainText(pension.pensionCardType);
      await expect(
        pensionBreakdownPage.getActiveStatus(schemeName),
      ).toContainText(pension.activeStatus);
      await expect(
        pensionBreakdownPage.getAdministratorName(schemeName),
      ).toContainText(pension.pensionAdministrator);
      await expect(
        pensionBreakdownPage.getEmployerName(schemeName),
      ).toContainText(pension.employerName);
      await expect(
        pensionBreakdownPage.getSeeDetailsButton(schemeName),
      ).toContainText(detailsButtonText);

      await expect(
        pensionBreakdownPage.getRetirementDate(schemeName),
      ).toContainText(pension.expectedRetirementDate);
      await expect(
        pensionBreakdownPage.getEstimatedIncome(schemeName),
      ).toBeHidden();
    }
  });
});
