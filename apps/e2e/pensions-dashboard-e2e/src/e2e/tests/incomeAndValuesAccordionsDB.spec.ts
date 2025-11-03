/* eslint-disable playwright/no-focused-test */
import { expect, test } from '@playwright/test';

import { newDetailsPageWarnings } from '../data/scenarioDetails';
import IncomeAndValuesAccordions from '../pages/components/IncomeAndValuesAccordions';
import loadingPage from '../pages/LoadingPage';
import pensionDetailsPage from '../pages/PensionDetailsPage';
import pensionBreakdownPage from '../pages/PensionsBreakdownPage';
import pensionsFoundPage from '../pages/PensionsFoundPage';
import scenarioSelectionPage from '../pages/ScenarioSelectionPage';
import welcomePage from '../pages/WelcomePage';
import commonHelpers from '../utils/commonHelpers';
const featuresTestId = 'features';
const moreDetailsTestId = 'more-details';
const calculationTestId = 'db-calculation-accordion';

/**
 * @tests User Story 37389
 * @scenario The newDetailsPage_Warnings test scenario that cover the following scenarios:
 *    - DB Pension with all possibly data Increasing TRUE, Safeguarding benefit TRUE, Survivor benefit TRUE, Warning Code UNP, CUR, TVI, DEF,  Calculation Method BS (Compass Retirement Scheme)
 *    - DB Pension with no data for any of the accordions (Prosperity Plus Plan)
 *    - DB Pension displaying some data when available (Guardian Growth Fund)
 * @tests Test Case 38367: 37389 AC1 Test Case 1 Accordions Income & values DB - Verify accordion label text and positioning
 * @tests Test Case 38368: 37389 AC1 Test Case 2 Accordions Income & values DB -Verify accordions closed by default and expands and collapses when clicked
 * @test Test Case 38366: 37389 AC1 Test Case 3 Verify Accordions Income & values DB - All possible data displayed for all three accordions
 * @test Test Case 38369: 37389 AC1 Test Case 4 Accordions Income & values DB -Verify Features and 'More details' accordions are hidden, Calculation accordion displays 'unavailable' when no data available
 * @test Test Case 38370: 37389 AC1 Test Case 5 Accordions Income & values DB -Verify some data displaying when data is available
 * @test Test Case 38371: 37389 AC2 Test Case 6 Accordions Income & values DB -Verify Feature and 'More details' accordions text displayed in bullet point format, and not Calculation accordion
 */

test.describe('Pension Details page - Income and Values Tab - DB pension Accordions', () => {
  test.beforeEach(async ({ page }) => {
    await commonHelpers.navigateToEmulator(page);
    await scenarioSelectionPage.selectScenarioComposerDev(
      page,
      newDetailsPageWarnings.option,
    );
    await welcomePage.welcomePageLoads(page);
    await welcomePage.clickWelcomeButton(page);
    await loadingPage.waitForPensionsToLoad(page);
    await pensionsFoundPage.waitForPensionsFound(page);
    await pensionsFoundPage.clickSeeYourPensions(page);
  });

  test('How these values are calculated accordion displays BS message', async ({
    page,
  }) => {
    const accordions = new IncomeAndValuesAccordions(page);
    const accordionLocator = accordions.getAccordionLocator(calculationTestId);
    const labelLocator = accordions.getLabelLocator(calculationTestId);
    const listItemsLocator = accordions.getListItemsLocator(calculationTestId);
    const contentLocator =
      accordions.getCalculationContentLocator(calculationTestId);
    const schemeName = 'Compass Retirement Scheme';
    const expectedText =
      'Estimates for this defined benefit pension are based on your salary and years you’ve been a scheme member, as well as the expected retirement date. They’re also based on the provider’s assumptions about inflation and whether the scheme is active. To help you understand the impact of inflation, the estimated income is shown in today’s money, so you can see what that amount would be worth right now.';
    await pensionBreakdownPage.navigateToSchemeIncomeAndValuesTab(
      page,
      schemeName,
    );
    //Assert accordion label text
    await expect(labelLocator).toContainText('How these values are calculated');
    // More details accordion is closed by default
    await expect(accordionLocator).not.toHaveAttribute('open');
    //Click accordion to open & assert open
    await accordions.toggle(calculationTestId);
    await expect(accordionLocator).toHaveAttribute('open');
    //Assert no bullet points
    await expect(listItemsLocator).toHaveCount(0);
    // Assert content text
    const calculationText = await accordions.getCalculationText(
      calculationTestId,
    );
    expect(calculationText).toEqual(expectedText);
    await expect(contentLocator).toContainText(expectedText);
    // Click accordion and assert closed
    await accordions.toggle(calculationTestId);
    await expect(accordionLocator).not.toHaveAttribute('open');
  });

  test('Features accordion displays all 3 items: Increasing TRUE, Safeguarding benefit TRUE, Warning Code UNP', async ({
    page,
  }) => {
    const accordions = new IncomeAndValuesAccordions(page);
    const schemeName = 'Compass Retirement Scheme';
    const accordionLocator = accordions.getAccordionLocator(featuresTestId);
    const labelLocator = accordions.getLabelLocator(featuresTestId);
    const listItemsLocator = accordions.getListItemsLocator(featuresTestId);
    const expectedTexts = [
      'This income will rise after a set number of years.',
      'This part of your pension has an underpin. This guarantees you a minimum pension income, which could be lower than the estimates from your provider.',
      'This pension has a safeguarded benefit. Contact your provider for more details.',
    ];
    await pensionBreakdownPage.navigateToSchemeIncomeAndValuesTab(
      page,
      schemeName,
    );
    //Assert accordion label text
    await expect(labelLocator).toContainText('Features');
    // Features accordion is closed by default
    await expect(accordionLocator).not.toHaveAttribute('open');
    //Click accordion to open & assert open
    await accordions.toggle(featuresTestId);
    await expect(accordionLocator).toHaveAttribute('open');
    //Assert 3 bullet points
    await expect(listItemsLocator).toHaveCount(3);
    // Assert content text
    const moreDetailsText = await accordions.getListItemsText(featuresTestId);
    expect(moreDetailsText).toEqual(expectedTexts);
    // Click accordion and assert closed
    await accordions.toggle(featuresTestId);
    await expect(accordionLocator).not.toHaveAttribute('open');
  });

  test('More details accordion displays all 4 items: Warning codes CUR, TVI, DEF and Survivor benefit TRUE', async ({
    page,
  }) => {
    const accordions = new IncomeAndValuesAccordions(page);
    const accordionLocator = accordions.getAccordionLocator(moreDetailsTestId);
    const labelLocator = accordions.getLabelLocator(moreDetailsTestId);
    const listItemsLocator = accordions.getListItemsLocator(moreDetailsTestId);
    const schemeName = 'Compass Retirement Scheme';
    const expectedTexts = [
      'These values are normally calculated in a non-sterling currency.',
      'Your estimated income was calculated when this pension was active.',
      'This benefit includes a transferred-in element.',
      'This benefit includes any pension paid to a spouse, civil partner or other dependants after you die. Contact your provider for more details.',
    ];
    await pensionBreakdownPage.navigateToSchemeIncomeAndValuesTab(
      page,
      schemeName,
    );
    //Assert accordion label text
    await expect(labelLocator).toContainText('More details');
    // Features accordion is closed by default
    await expect(accordionLocator).not.toHaveAttribute('open');
    //Click accordion to open & assert open
    await accordions.toggle(moreDetailsTestId);
    await expect(accordionLocator).toHaveAttribute('open');
    //Assert 4 bullet points
    await expect(listItemsLocator).toHaveCount(4);
    // Assert content text
    const moreDetailsText = await accordions.getListItemsText(
      moreDetailsTestId,
    );
    expect(moreDetailsText).toEqual(expectedTexts);
    // Click accordion and assert closed
    await accordions.toggle(moreDetailsTestId);
    await expect(accordionLocator).not.toHaveAttribute('open');
  });

  test('No data available for Features, More details or calculation method', async ({
    page,
  }) => {
    const accordions = new IncomeAndValuesAccordions(page);
    const dbCalculationAccordion =
      accordions.getAccordionLocator(calculationTestId);
    const calculationContentLocator =
      accordions.getCalculationContentLocator(calculationTestId);
    const featuresAccordion = accordions.getAccordionLocator(featuresTestId);
    const moreDetailsAccordion =
      accordions.getAccordionLocator(moreDetailsTestId);
    const schemeName = 'Prosperity Plus Plan';
    const expectedTexts = 'Unavailable';
    await pensionBreakdownPage.navigateToSchemeIncomeAndValuesTab(
      page,
      schemeName,
    );
    // feature and more details accordions are not visible
    await expect(featuresAccordion).toBeHidden();
    await expect(moreDetailsAccordion).toBeHidden();
    //Assert accordion 'How these values are calculated' is visible
    await expect(dbCalculationAccordion).toBeVisible();
    //Click accordion to open
    await accordions.toggle('db-calculation-accordion');
    // Assert content text
    await expect(calculationContentLocator).toContainText(expectedTexts);
  });
});
