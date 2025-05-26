/* eslint-disable playwright/no-focused-test */
import { expect, test } from '@playwright/test';

import { allNewTestCases } from '../data/scenarioDetails';
import loadingPage from '../pages/LoadingPage';
import pensionDetailsPage from '../pages/PensionDetailsPage';
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
const accordionTextAbout =
  'About these valuesPension values are based on the latest estimates and expected retirement dates from your pension providers. They’re not guaranteed, and may go down as well as up.';
const accordionTextHowCalculated =
  'Estimates for this defined contribution scheme are based on you buying a guaranteed income for life (an annuity), which starts paying from the scheme’s retirement date. They’re also based on the provider’s assumptions about inflation, investment performance, and whether you’re paying into the scheme.';

test.describe('Pension Details page - Your Pensions', () => {
  test.beforeEach(async ({ page }) => {
    await commonHelpers.navigateToEmulator(page);
  });
  test.afterEach(async ({ page }) => {
    await commonHelpers.logoutOfApplication(page);
  });

  test('Expected content is displayed on pensions details page for Green pensions', async ({
    page,
  }) => {
    await scenarioSelectionPage.selectScenario(page, allNewTestCases.option);
    await welcomePage.welcomePageLoads(page);
    await welcomePage.clickWelcomeButton(page);
    await loadingPage.waitForPensionsToLoad(page);
    await pensionsFoundPage.waitForPensionsFound(page);
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
      await pensionBreakdownPage.viewDetailsOfPension(page, schemeName);
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
      await pensionBreakdownPage.pageLoads(page);
    }
  });

  test('Accordions are displayed for pensions with an estimated income, on pension details page', async ({
    page,
  }) => {
    await scenarioSelectionPage.selectScenario(page, allNewTestCases.option);
    await welcomePage.welcomePageLoads(page);
    await welcomePage.clickWelcomeButton(page);
    await loadingPage.waitForPensionsToLoad(page);
    await pensionsFoundPage.waitForPensionsFound(page);
    await pensionsFoundPage.clickSeeYourPensions(page);

    const schemeNames = ['Nest Pension', 'TestDB:Visa'];
    for (const schemeName of schemeNames) {
      const pension = allNewTestCases.pensions.find(
        (p) => p.schemeName === schemeName,
      );
      await pensionBreakdownPage.viewDetailsOfPension(page, schemeName);
      await pensionDetailsPage.assertHeading(page, schemeName);

      //accordion 1
      const aboutTheseValuesAccordion = page
        .getByTestId('expandable-section')
        .nth(0);
      await expect(aboutTheseValuesAccordion).not.toHaveAttribute('open');
      await commonHelpers.clickAccordion(
        page,
        aboutTheseValuesAccordion,
        'About these values',
      );
      await expect(aboutTheseValuesAccordion).toHaveAttribute('open');
      await expect(aboutTheseValuesAccordion).toContainText(accordionTextAbout);

      // accordion 2
      const howCalculatedAccordion = page
        .getByTestId('expandable-section')
        .nth(1);
      await expect(howCalculatedAccordion).not.toHaveAttribute('open');
      await commonHelpers.clickAccordion(
        page,
        howCalculatedAccordion,
        'How your estimated income is calculated',
      );
      await expect(howCalculatedAccordion).toHaveAttribute('open');
      await expect(howCalculatedAccordion).toContainText(
        accordionTextHowCalculated,
      );
      await commonHelpers.clickLink(page, 'Back');
      await pensionBreakdownPage.pageLoads(page);
    }
  });

  test('No accordions are displayed for pensions without an estimated income, on pension details page', async ({
    page,
  }) => {
    await scenarioSelectionPage.selectScenario(page, allNewTestCases.option);
    await welcomePage.welcomePageLoads(page);
    await welcomePage.clickWelcomeButton(page);
    await loadingPage.waitForPensionsToLoad(page);
    await pensionsFoundPage.waitForPensionsFound(page);
    await pensionsFoundPage.clickSeeYourPensions(page);

    const schemeNames = [
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
      await pensionBreakdownPage.viewDetailsOfPension(page, schemeName);
      await pensionDetailsPage.assertHeading(page, schemeName);
      await expect(page.getByTestId('expandable-section')).toBeHidden();
      await commonHelpers.clickLink(page, 'Back');
      await pensionBreakdownPage.pageLoads(page);
    }
  });
});
