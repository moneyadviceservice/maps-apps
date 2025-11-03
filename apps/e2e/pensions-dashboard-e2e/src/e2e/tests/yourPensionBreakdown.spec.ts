/* eslint-disable playwright/no-focused-test */
import { expect, test } from '@playwright/test';

import {
  allNewTestCases,
  pensionCardsMay2025,
  scenarioEightDetails,
  supportedUnsupportedPensions,
} from '../data/scenarioDetails';
import loadingPage from '../pages/LoadingPage';
import pensionBreakdownPage from '../pages/PensionsBreakdownPage';
import pensionsFoundPage from '../pages/PensionsFoundPage';
import scenarioSelectionPage from '../pages/ScenarioSelectionPage';
import welcomePage from '../pages/WelcomePage';
import commonHelpers from '../utils/commonHelpers';

const detailsButtonText = 'See details';
const accordionTextWhy =
  'Pensions still waiting for data from your pension providers and those with values less than £5,000 won’t show in your estimate. If any other pensions are missing, see Pensions not showing';

test.describe('Pension Breakdown page', () => {
  test.beforeEach(async ({ page }) => {
    await commonHelpers.navigateToEmulator(page);
  });
  test.afterEach(async ({ page }) => {
    await commonHelpers.logoutOfApplication(page);
  });

  test('expected content is displayed on pensions breakdown page - Pensions with and without estimated income', async ({
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
    expect(page.url()).toContain('/your-pension-breakdown');
    await expect(page.getByTestId('page-title')).toHaveText('Your pensions');
    await expect(
      page.locator(`h2:text-is("Pensions in your estimate (2)")`),
    ).toBeVisible();
    const schemeNames = ['Nest Pension', 'TestDB:Visa'];
    for (const schemeName of schemeNames) {
      const pension = allNewTestCases.pensions.find(
        (p) => p.schemeName === schemeName,
      );
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
        pensionBreakdownPage.getRetirementDate(page, schemeName),
      ).toContainText(pension.retirementDate);
      await expect(
        pensionBreakdownPage.getEstimatedIncome(page, schemeName),
      ).toContainText(pension.estimatedIncome);
      await expect(
        pensionBreakdownPage.getSeeDetailsButton(page, schemeName),
      ).toContainText(detailsButtonText);
    }

    await expect(
      page.locator(`h2:text-is("Not in your estimate (5)")`),
    ).toBeVisible();
    const schemeNamesWithoutEstimateIncome = [
      'TestPPF:Visa',
      'TestSML:Visa',
      'TestDCHA:Visa',
      'TestDCHP:Visa',
      'TestWU:Visa',
    ];
    for (const schemeName of schemeNamesWithoutEstimateIncome) {
      const pension = allNewTestCases.pensions.find(
        (p) => p.schemeName === schemeName,
      );
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
        pensionBreakdownPage.getWarningMessage(page, schemeName),
      ).toContainText(pension.warningMessage);
      await expect(
        pensionBreakdownPage.getSeeDetailsButton(page, schemeName),
      ).toContainText(detailsButtonText);
      await expect(
        pensionBreakdownPage.getRetirementDate(page, schemeName),
      ).toContainText(pension.retirementDate);
      await expect(
        pensionBreakdownPage.getEstimatedIncome(page, schemeName),
      ).toBeHidden();
    }

    //accordion
    const whyPensionsMightNotShowAccordion = page
      .getByTestId('expandable-section')
      .nth(0);
    await expect(whyPensionsMightNotShowAccordion).not.toHaveAttribute('open');
    await commonHelpers.clickAccordion(
      page,
      whyPensionsMightNotShowAccordion,
      'Why pensions might not show in your estimate',
    );
    await expect(whyPensionsMightNotShowAccordion).toHaveAttribute('open');
    await expect(whyPensionsMightNotShowAccordion).toContainText(
      accordionTextWhy,
    );
  });

  test('Only Pensions with estimated income are displayed', async ({
    page,
  }) => {
    await scenarioSelectionPage.selectScenarioComposerDev(
      page,
      scenarioEightDetails.option,
    );
    await welcomePage.welcomePageLoads(page);
    await welcomePage.clickWelcomeButton(page);
    await loadingPage.waitForPensionsToLoad(page);
    await pensionsFoundPage.waitForPensionsFound(page);
    await pensionsFoundPage.clickSeeYourPensions(page);
    expect(page.url()).toContain('/your-pension-breakdown');
    await expect(page.getByTestId('page-title')).toHaveText('Your pensions');
    await expect(
      page.locator(`h2:text-is("Pensions in your estimate (1)")`),
    ).toBeVisible();
    await expect(
      page.locator(`h2:text-is("Pensions without an estimated income")`),
    ).toBeHidden();

    const schemeNames = ['State Pension'];
    for (const schemeName of schemeNames) {
      const pension = scenarioEightDetails.pensions.find(
        (p) => p.schemeName === schemeName,
      );
      await expect(
        pensionBreakdownPage.getPensionCard(page, schemeName),
      ).toBeVisible();
      await expect(
        pensionBreakdownPage.getPensionCardType(page, schemeName),
      ).toContainText(pension.pensionCardType);
      await expect(
        pensionBreakdownPage.getRetirementDate(page, schemeName),
      ).toContainText(pension.retirementDate);
      await expect(
        pensionBreakdownPage.getEstimatedIncome(page, schemeName),
      ).toContainText(pension.incomeMonth);
      await expect(
        pensionBreakdownPage.getSeeDetailsButton(page, schemeName),
      ).toContainText(detailsButtonText);
    }

    //accordion 2 is not visible
    await expect(
      page
        .getByTestId('summary-block-title')
        .filter({ hasText: 'Why pensions might not show in your estimate' }),
    ).toBeHidden();
  });

  test('Only Pensions without estimated income is displayed', async ({
    page,
  }) => {
    await scenarioSelectionPage.selectScenarioComposerDev(
      page,
      supportedUnsupportedPensions.option,
    );
    await welcomePage.welcomePageLoads(page);
    await welcomePage.clickWelcomeButton(page);
    await loadingPage.waitForPensionsToLoad(page);
    await pensionsFoundPage.waitForPensionsFound(page);
    await pensionsFoundPage.clickSeeYourPensions(page);
    expect(page.url()).toContain('/your-pension-breakdown');
    await expect(page.getByTestId('page-title')).toHaveText('Your pensions');
    await expect(
      page.locator(`h2:text-is("Pensions with an estimated income")`),
    ).toBeHidden();
    await expect(
      page.locator(`h2:text-is("Pensions without an estimated income (1)")`),
    ).toBeVisible();

    const schemeNames = ['TestPPF-Visa'];
    for (const schemeName of schemeNames) {
      const pension = supportedUnsupportedPensions.pensions.find(
        (p) => p.schemeName === schemeName,
      );
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
        pensionBreakdownPage.getWarningMessage(page, schemeName),
      ).toContainText(pension.warningMessage);
      await expect(
        pensionBreakdownPage.getSeeDetailsButton(page, schemeName),
      ).toContainText(detailsButtonText);
      await expect(
        pensionBreakdownPage.getRetirementDate(page, schemeName),
      ).toContainText(pension.retirementDate);
      await expect(
        pensionBreakdownPage.getEstimatedIncome(page, schemeName),
      ).toBeHidden();
    }
    //accordion 1 is not visible
    await expect(
      page
        .getByTestId('summary-block-title')
        .filter({ hasText: 'About these values' }),
    ).toBeHidden();
    //accordion 2
    const whyPensionsMightNotShowAccordion =
      page.getByTestId('expandable-section');
    await expect(whyPensionsMightNotShowAccordion).not.toHaveAttribute('open');
    await commonHelpers.clickAccordion(
      page,
      whyPensionsMightNotShowAccordion,
      'Why pensions might not show in your estimate',
    );
    await expect(whyPensionsMightNotShowAccordion).toHaveAttribute('open');
    await expect(whyPensionsMightNotShowAccordion).toContainText(
      accordionTextWhy,
    );
  });

  test('expected content is displayed on pensions breakdown page - State Pension, DB, DC, Active, Inactive', async ({
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
    await pensionsFoundPage.clickSeeYourPensions(page);
    await pensionBreakdownPage.assertPensions(
      page,
      pensionCardsMay2025.pensions,
    );

    const schemeNamesStatePension = ['State Pension'];
    for (const schemeName of schemeNamesStatePension) {
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
        pensionBreakdownPage.getRetirementDate(page, schemeName),
      ).toContainText(pension.expectedRetirementDate);
      await expect(
        pensionBreakdownPage.getEstimatedIncome(page, schemeName),
      ).toContainText(pension.estimatedIncome);
      await expect(
        pensionBreakdownPage.getSeeDetailsButton(page, schemeName),
      ).toContainText(detailsButtonText);

      await expect(
        pensionBreakdownPage.getActiveStatus(page, schemeName),
      ).toBeHidden();
      await expect(
        pensionBreakdownPage.getAdministratorName(page, schemeName),
      ).toBeHidden();
      await expect(
        pensionBreakdownPage.getEmployerName(page, schemeName),
      ).toBeHidden();
    }

    const schemeNamesPensionsWithEstimatedIncome = [
      'DB Scheme - Confirmed - Active',
      'DB Scheme - Confirmed - Inactive',
      'DC Scheme - Confirmed - Active',
      'DC Scheme - Confirmed - Inactive',
    ];
    for (const schemeName of schemeNamesPensionsWithEstimatedIncome) {
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
        pensionBreakdownPage.getRetirementDate(page, schemeName),
      ).toContainText(pension.expectedRetirementDate);
      await expect(
        pensionBreakdownPage.getEstimatedIncome(page, schemeName),
      ).toContainText(pension.estimatedIncome);
      await expect(
        pensionBreakdownPage.getSeeDetailsButton(page, schemeName),
      ).toContainText(detailsButtonText);
    }

    const schemeNamesMissingData = [
      'DB Scheme - Missing Data',
      'DC Scheme - Missing Data',
    ];
    for (const schemeName of schemeNamesMissingData) {
      const pension = pensionCardsMay2025.pensions.find(
        (p) => p.schemeName === schemeName,
      );
      await expect(
        pensionBreakdownPage.getPensionCard(page, schemeName),
      ).toBeVisible();
      await expect(
        pensionBreakdownPage.getPensionCardType(page, schemeName),
      ).toBeVisible();
      await expect(
        pensionBreakdownPage.getAdministratorName(page, schemeName),
      ).toContainText(pension.pensionAdministrator);
      await expect(
        pensionBreakdownPage.getEstimatedIncome(page, schemeName),
      ).toContainText(pension.estimatedIncome);
      await expect(
        pensionBreakdownPage.getSeeDetailsButton(page, schemeName),
      ).toContainText(detailsButtonText);
      await expect(
        pensionBreakdownPage.getActiveStatus(page, schemeName),
      ).toBeHidden();
      await expect(
        pensionBreakdownPage.getEmployerName(page, schemeName),
      ).toBeHidden();
    }

    const schemeNamesPensionsWithoutEstimatedIncome = [
      'DB Scheme - Active - No Income',
      'DC Scheme - Inactive - No Income',
    ];
    for (const schemeName of schemeNamesPensionsWithoutEstimatedIncome) {
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
      ).toContainText(pension.retirementDate);
      await expect(
        pensionBreakdownPage.getEstimatedIncome(page, schemeName),
      ).toBeHidden();
    }
  });
});
