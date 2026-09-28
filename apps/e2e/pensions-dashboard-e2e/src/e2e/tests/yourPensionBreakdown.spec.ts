import { expect, test } from '@maps/playwright';

import {
  allNewTestCases,
  pensionCardsMay2025,
  scenarioEightDetails,
  supportedUnsupportedPensions,
} from '../data/scenarioDetails';
import ConfirmedPensionsSummary from '../pages/components/SummarySentence';

/**
 * @tests User Story 53944; Remove the OJ banner
 * @tests Test Case 54904: 53944 AC1 Test Case 1 : OJ banner removed on pension breakdown page
 * @tests Test Case 54905: 53944 AC2 Test Case 2 : OJ Banner Removed, Verify H&S anchor link focus
 *
 * @tests User Story 57345: FE - Combine Pending to Confirmed Pensions
 * @tests Test Case 58856: 57345 AC2 Test Case 2 : 'Yellow' pensions are displayed on Pension Breakdown page
 * @tests Test Case 58860: 57345 AC3 Test Case 3 - Verify Content Changes under 'Pensions without estimated incomes'
 */

const detailsButtonText = 'See details';
const nextStepsHeading = 'Understand your next steps';
const nextStepsContentText =
  'Get free help with your pension, including ways to boost it, how and when you can take an income and if a pension transfer is a good idea.';
const retirementGuidanceUrl =
  'https://www.moneyhelper.org.uk/en/pensions-and-retirement/make-the-most-of-your-pension';

test.describe('Pension Breakdown page', () => {
  test.beforeEach(async ({ commonHelpers }) => {
    await commonHelpers.navigateToEmulator('en');
  });

  test('expected content is displayed on pensions breakdown page - Pensions with and without estimated income', async ({
    page,
    commonHelpers,
    commonSessions,
    pensionBreakdownPage,
    pensionsNotShowingPage,
  }) => {
    const scenarioName = allNewTestCases.option;
    await commonSessions.navigateToPensionBreakdown(scenarioName);
    expect(page.url()).toContain('/your-pension-breakdown');
    await expect(page.getByTestId('page-title')).toHaveText('Your pensions');
    await expect(
      page.locator(`h2:text-is("Pensions in your estimate (3)")`),
    ).toBeVisible();
    const schemeNames = ['SchemeNameAVC', 'Nest Pension', 'TestDB:Visa'];
    for (const schemeName of schemeNames) {
      const pension: any = allNewTestCases.pensions.find(
        (p) => p.schemeName === schemeName,
      );
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
        pensionBreakdownPage.getRetirementDate(schemeName),
      ).toContainText(pension.retirementDate);
      await expect(
        pensionBreakdownPage.getEstimatedIncome(schemeName),
      ).toContainText(pension.estimatedIncome);
      await expect(
        pensionBreakdownPage.getSeeDetailsButton(schemeName),
      ).toContainText(detailsButtonText);
    }

    await expect(
      page.locator(`h2:text-is("Pensions without estimated incomes (14)")`),
    ).toBeVisible();
    const schemeNamesWithoutEstimateIncome = [
      'TestPPF:Visa',
      'TestSML:Visa',
      'TestDCHA:Visa',
      'TestDCHP:Visa',
      'TestWU:Visa',
    ];
    for (const schemeName of schemeNamesWithoutEstimateIncome) {
      const pension: any = allNewTestCases.pensions.find(
        (p) => p.schemeName === schemeName,
      );
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
        pensionBreakdownPage.getSeeDetailsButton(schemeName),
      ).toContainText(detailsButtonText);
      await expect(
        pensionBreakdownPage.getRetirementDate(schemeName),
      ).toContainText(pension.retirementDate);
      await expect(
        pensionBreakdownPage.getEstimatedIncome(schemeName),
      ).toBeHidden();
    }

    //no income text
    const whyPensionsMightNotShowText = page.getByTestId(
      'pensions-no-income-description',
    );
    await expect(whyPensionsMightNotShowText).toContainText(
      pensionBreakdownPage.notIncludedText,
    );

    await commonHelpers.clickLink('Pensions not showing');
    await expect(pensionsNotShowingPage.getPageHeading()).toHaveText(
      'Pensions not showing',
    );

    await commonHelpers.clickBackLink();

    //Understand your next steps text
    await expect(
      pensionBreakdownPage.understandYourNextStepsHeading,
    ).toHaveText(nextStepsHeading);
    await expect(
      pensionBreakdownPage.understandYourNextStepsContent,
    ).toHaveText(nextStepsContentText);
    const newPage = await pensionBreakdownPage.clickRetirementGuidanceLink(
      commonHelpers,
    );
    expect(newPage.url()).toContain(retirementGuidanceUrl);
    await newPage.close();
  });

  test('Help and support link jumps to Help and support banner', async ({
    page,
    commonSessions,
  }) => {
    await commonSessions.navigateToPensionBreakdown(allNewTestCases.option);

    const helpLink = page.getByTestId('help-and-support-link');
    await expect(helpLink).toHaveAttribute('href', /#help-and-support$/);
    await helpLink.click();

    const helpBanner = page.getByTestId('help-and-support');
    await expect(helpBanner).toBeVisible();
    await expect(
      helpBanner.getByRole('heading', { name: 'Help and support' }),
    ).toBeFocused();
  });

  test('Only Pensions with estimated income are displayed', async ({
    page,
    commonHelpers,
    loadingPage,
    pensionBreakdownPage,
    pensionsFoundPage,
    scenarioSelectionPage,
    welcomePage,
  }) => {
    await scenarioSelectionPage.selectScenarioComposerDev(
      scenarioEightDetails.option,
    );
    await welcomePage.welcomePageLoads();
    await welcomePage.clickWelcomeButton();
    await loadingPage.waitForPensionsToLoad(commonHelpers, 'en');
    await pensionsFoundPage.waitForPensionsFound();
    await pensionsFoundPage.clickSeeYourPensions();
    await expect(page).toHaveURL(/.*\/your-pension-breakdown/);
    await expect(page.getByTestId('page-title')).toHaveText('Your pensions');
    await expect(
      page.locator(`h2:text-is("Pensions in your estimate (2)")`),
    ).toBeVisible();
    await expect(
      page.locator(`h2:text-is("Pensions without an estimated income")`),
    ).toBeHidden();

    const schemeNames = ['State Pension', 'Your Pension DC Master Trust'];
    for (const schemeName of schemeNames) {
      const pension: any = scenarioEightDetails.pensions.find(
        (p) => p.schemeName === schemeName,
      );
      await expect(
        pensionBreakdownPage.getPensionCard(schemeName),
      ).toBeVisible();
      await expect(
        pensionBreakdownPage.getPensionCardType(schemeName),
      ).toContainText(pension.pensionCardType);
      await expect(
        pensionBreakdownPage.getRetirementDate(schemeName),
      ).toContainText(pension.retirementDate);
      await expect(
        pensionBreakdownPage.getEstimatedIncome(schemeName),
      ).toContainText(pension.incomeMonth);
      await expect(
        pensionBreakdownPage.getSeeDetailsButton(schemeName),
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
    commonHelpers,
    loadingPage,
    pensionBreakdownPage,
    pensionsFoundPage,
    scenarioSelectionPage,
    welcomePage,
  }) => {
    await scenarioSelectionPage.selectScenarioComposerDev(
      supportedUnsupportedPensions.option,
    );
    await welcomePage.welcomePageLoads();
    await welcomePage.clickWelcomeButton();
    await loadingPage.waitForPensionsToLoad(commonHelpers, 'en');
    await pensionsFoundPage.waitForPensionsFound();
    await pensionsFoundPage.clickSeeYourPensions();
    await expect(page).toHaveURL(/.*\/your-pension-breakdown/);
    await expect(page.getByTestId('page-title')).toHaveText('Your pensions');
    await expect(
      page.locator(`h2:text-is("Pensions in your estimate (1)")`),
    ).toBeVisible();
    await expect(
      page.locator(`h2:text-is("Pensions without estimated incomes (1)")`),
    ).toBeVisible();

    const schemeNames = ['TestPPF-Visa'];
    for (const schemeName of schemeNames) {
      const pension: any = supportedUnsupportedPensions.pensions.find(
        (p) => p.schemeName === schemeName,
      );
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
        pensionBreakdownPage.getSeeDetailsButton(schemeName),
      ).toContainText(detailsButtonText);
      await expect(
        pensionBreakdownPage.getRetirementDate(schemeName),
      ).toContainText(pension.retirementDate);
      await expect(
        pensionBreakdownPage.getEstimatedIncome(schemeName),
      ).toBeHidden();
    }
    //accordion 1 is not visible
    await expect(
      page
        .getByTestId('summary-block-title')
        .filter({ hasText: 'About these values' }),
    ).toBeHidden();
    //no income text
    const whyPensionsMightNotShowText = page.getByTestId(
      'pensions-no-income-description',
    );
    await expect(whyPensionsMightNotShowText).toContainText(
      pensionBreakdownPage.notIncludedText,
    );
  });

  test('expected content is displayed on pensions breakdown page - State Pension, DB, DC, Active, Inactive', async ({
    page,
    commonHelpers,
    pensionBreakdownPage,
    pensionsFoundPage,
    loadingPage,
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

    const summarySentence = new ConfirmedPensionsSummary(page);
    const expectedSummarySentenceMonthlyAmount =
      pensionCardsMay2025.pensions.reduce((total, pension: any) => {
        return (
          total + (commonHelpers.cleanCurrency(pension.estimatedIncome) || 0)
        );
      }, 0);
    const summarySentenceMonthlyAmountText =
      await summarySentence.getMonthlyAmount();
    const summarySentenceMonthlyAmount = commonHelpers.cleanCurrency(
      summarySentenceMonthlyAmountText,
    );
    expect(summarySentenceMonthlyAmount).toEqual(
      expectedSummarySentenceMonthlyAmount,
    );

    const schemeNamesStatePension = ['State Pension'];
    for (const schemeName of schemeNamesStatePension) {
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
        pensionBreakdownPage.getRetirementDate(schemeName),
      ).toContainText(pension.expectedRetirementDate);
      await expect(
        pensionBreakdownPage.getEstimatedIncome(schemeName),
      ).toContainText(pension.estimatedIncome);
      await expect(
        pensionBreakdownPage.getSeeDetailsButton(schemeName),
      ).toContainText(detailsButtonText);

      await expect(
        pensionBreakdownPage.getActiveStatus(schemeName),
      ).toBeHidden();
      await expect(
        pensionBreakdownPage.getAdministratorName(schemeName),
      ).toBeHidden();
      await expect(
        pensionBreakdownPage.getEmployerName(schemeName),
      ).toBeHidden();
    }

    const schemeNamesPensionsWithEstimatedIncome = [
      'DB Scheme - Confirmed - Active',
      'DB Scheme - Confirmed - Inactive',
      'DC Scheme - Confirmed - Active',
      'DC Scheme - Confirmed - Inactive',
    ];
    for (const schemeName of schemeNamesPensionsWithEstimatedIncome) {
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
        pensionBreakdownPage.getRetirementDate(schemeName),
      ).toContainText(pension.expectedRetirementDate);
      await expect(
        pensionBreakdownPage.getEstimatedIncome(schemeName),
      ).toContainText(pension.estimatedIncome);
      await expect(
        pensionBreakdownPage.getSeeDetailsButton(schemeName),
      ).toContainText(detailsButtonText);
    }

    const schemeNamesMissingData = [
      'DB Scheme - Missing Data',
      'DC Scheme - Missing Data',
    ];
    for (const schemeName of schemeNamesMissingData) {
      const pension: any = pensionCardsMay2025.pensions.find(
        (p) => p.schemeName === schemeName,
      );
      await expect(
        pensionBreakdownPage.getPensionCard(schemeName),
      ).toBeVisible();
      await expect(
        pensionBreakdownPage.getPensionCardType(schemeName),
      ).toBeVisible();
      await expect(
        pensionBreakdownPage.getAdministratorName(schemeName),
      ).toContainText(pension.pensionAdministrator);
      await expect(
        pensionBreakdownPage.getEstimatedIncome(schemeName),
      ).toContainText(pension.estimatedIncome);
      await expect(
        pensionBreakdownPage.getSeeDetailsButton(schemeName),
      ).toContainText(detailsButtonText);
      await expect(
        pensionBreakdownPage.getActiveStatus(schemeName),
      ).toBeHidden();
      await expect(
        pensionBreakdownPage.getEmployerName(schemeName),
      ).toBeHidden();
    }

    const schemeNamesPensionsWithoutEstimatedIncome = [
      'DB Scheme - Active - No Income',
      'DC Scheme - Inactive - No Income',
    ];
    for (const schemeName of schemeNamesPensionsWithoutEstimatedIncome) {
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
      ).toContainText(pension.retirementDate);
      await expect(
        pensionBreakdownPage.getEstimatedIncome(schemeName),
      ).toBeHidden();
    }
  });
});
