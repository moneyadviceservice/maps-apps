/* eslint-disable playwright/no-focused-test */
import { expect, test } from '@playwright/test';

import { allNewTestCases } from '../data/scenarioDetails';
import loadingPage from '../pages/LoadingPage';
import pendingPensionsPage from '../pages/PendingPensionsPage';
import pensionDetailsPage from '../pages/PensionDetailsPage';
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
      await pendingPensionsPage.viewDetailsOfPension(page, schemeName);
      await pensionDetailsPage.assertHeading(page, schemeName);
      await expect(page.getByTestId('tool-intro')).toContainText(
        pension.subtext,
      );

      // Active and Inactive Pensions
      const expectedStatusText = pension.pensionStatusActive
        ? 'This pension is active. This means it’s being paid into.'
        : 'This pension is inactive.';
      const expectedDotColor = pension.pensionStatusActive
        ? '.bg-green-700'
        : '.bg-gray-400';
      await expect(page.locator(`${expectedDotColor}`)).toBeVisible();
      await expect(page.getByText(expectedStatusText)).toBeVisible();

      // Pension Details
      await expect(
        pensionDetailsPage.tableSectionHeading(page, 'Pension details').first(),
      ).toBeVisible();
      await expect(pensionDetailsPage.tableHeadings(page).nth(1)).toHaveText(
        'Current value',
      );
      await expect(pensionDetailsPage.tableHeadings(page).nth(2)).toHaveText(
        'Estimate at retirement',
      );
      const pensionDetails: [string, string | undefined, string | undefined][] =
        [
          ['Annual amount', pension.APAnnualAmount, pension.ERIAnnualAmount],
          ['Monthly amount', pension.APMonthlyAmount, pension.ERIMonthlyAmount],
          ['Pot value', pension.APPotValue, pension.ERIPotValue],
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

      //Plan Details
      await expect(
        pensionDetailsPage.tableSectionHeading(page, 'Plan details'),
      ).toBeVisible();
      const planDetails: [string, string | undefined][] = [
        ['Pension provider', pension.pensionAdministrator],
        ['Plan reference number', pension.referenceNumber],
        ['Pension start date', pension.pensionStartDate],
        ['Active contributions', pension.activeContributions],
        ['Employer name', pension.employerName],
        ['Employer status', pension.employerStatus],
        ['Pension retirement date', pension.retirementDate],
        ['Employment start date', pension.employementStartDate],
        ['Employment end date', pension.employmentEndDate],
        ['Data illustration date', pension.dataIllustrationDate],
        ['Pension origin', pension.pensionOrigin],
      ];
      for (const [label, expectedValue] of planDetails) {
        if (expectedValue) {
          await expect(pensionDetailsPage.getDataCol1(page, label)).toHaveText(
            expectedValue,
          );
        }
      }

      //Other Details
      await expect(
        pensionDetailsPage.tableSectionHeading(page, 'Other details'),
      ).toBeVisible();
      const otherDetails: [string, string | undefined][] = [
        ['Calculation method (ERI)', pension.calcMethodERI],
        ['Calculation method (AP)', pension.calcMethodAP],
        ['Amount type (ERI)', pension.amountTypeERI],
        ['Amount type (AP)', pension.amountTypeAP],
        ['Last payment date (ERI)', pension.lastPaymentDateERI],
        ['Last payment date (AP)', pension.lastPaymentDateAP],
        ['Increase (ERI)', pension.increaseERI],
        ['Increase (AP)', pension.increaseAP],
        ['Survivor benefit (ERI)', pension.survivorBenERI],
        ['Survivor benefit (AP)', pension.survivorBenAP],
        ['Safeguarded benefit (ERI)', pension.safeguardedBenERI],
        ['Safeguarded benefit (AP)', pension.safeguardedBenAP],
        ['Warning (ERI)', pension.warningERI],
        ['Warning (AP)', pension.warningAP],
      ];
      for (const [label, expectedValue] of otherDetails) {
        if (expectedValue) {
          await expect(pensionDetailsPage.getDataCol1(page, label)).toHaveText(
            expectedValue,
          );
        }
      }

      //Contact your provider
      await expect(
        pensionDetailsPage.tableSectionHeading(page, 'Contact your provider'),
      ).toBeVisible();
      const contactYourProvider: [string, string | undefined][] = [
        ['Pension provider', pension.pensionAdministrator],
        ['Website', pension.website],
        ['Preferred contact method', pension.preferredContact],
        ['Email', pension.email],
        ['Phone number', pension.tel],
        ['Address', pension.address],
      ];
      for (const [label, expectedValue] of contactYourProvider) {
        if (expectedValue) {
          await expect(pensionDetailsPage.getDataCol1(page, label)).toHaveText(
            expectedValue,
          );
        }
      }

      //Additional Data
      await expect(
        pensionDetailsPage.tableSectionHeading(page, 'Additional data'),
      ).toBeVisible();
      const additionalData: [string, string | undefined][] = [
        ['Costs and charges', pension.costCharges],
        ['Statement of Investment Principles', pension.statementInvestment],
        ['Implementation Statement', pension.implementationStatement],
        ['Annual Report', pension.annualReport],
      ];
      for (const [label, expectedValue] of additionalData) {
        if (expectedValue) {
          await expect(pensionDetailsPage.getDataCol1(page, label)).toHaveText(
            expectedValue,
          );
        }
      }

      await commonHelpers.clickLink(page, 'Back');
      await pendingPensionsPage.pageLoads(page);
    }
  });
});
