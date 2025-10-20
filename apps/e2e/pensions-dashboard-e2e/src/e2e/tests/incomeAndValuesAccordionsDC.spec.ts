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
const calculationTestId = 'dc-calculation-accordion';

/**
 * @tests User Story 36429
 * @scenario The newDetailsPage_Warnings test scenario contains 8 pensions that cover the following scenarios:
 *    - DC Pension with Increasing TRUE, Safeguarding benefit TRUE, Warning Code UNP (Aria Pension Scheme)
 *    - DC Pension with Warning codes CUR, TVI, DEF and Survivor benefit TRUE (Optimum Retirement Plan)
 *    - DC Pension with Calculation Method SMPI (Elite Preservation Trust)
 *    - DC Pension with no data for any of the accordions (Tranquility Pension Scheme)
 * @tests Test Case 38221: 36429 AC1 Test case 6 : Features accordion displays all 3 items: Increasing TRUE, Safeguarding benefit TRUE, Warning Code UNP
 * @tests Test Case 38225: 36429 AC1 Test case 10: 'More details' accordion displays all possible items: Warning codes CUR, TVI, DEF and Survivor benefit TRUE
 * @test Test Case 38229: 36429 AC1 Test case 14 : 'How these values are calculated' accordion is displayed with Feature and more details accordions
 * @test Test Case 38228: 36429 AC1 Test case 13 : 'How these values are calculated' accordion displayed 'Unavailable' when data is not available
 */

test.describe('Pension Details page - Income and Values Tab - DC pension Accordions', () => {
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

  test('Features accordion displays all 3 items: Increasing TRUE, Safeguarding benefit TRUE, Warning Code UNP', async ({
    page,
  }) => {
    const accordions = new IncomeAndValuesAccordions(page);
    const schemeName = 'Aria Pension Scheme';
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
    const schemeName = 'Optimum Retirement Plan';
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

  test('How these values are calculated accordion displays SMPI message', async ({
    page,
  }) => {
    const accordions = new IncomeAndValuesAccordions(page);
    const accordionLocator = accordions.getAccordionLocator(calculationTestId);
    const labelLocator = accordions.getLabelLocator(calculationTestId);
    const listItemsLocator = accordions.getListItemsLocator(calculationTestId);
    const contentLocator =
      accordions.getCalculationContentLocator(calculationTestId);
    const schemeName = 'Elite Preservation Trust';
    const expectedText =
      'Estimates for this defined contribution pension are based on you buying a guaranteed income for life (an annuity), which starts paying from the expected retirement date. They’re also based on the provider’s assumptions about inflation, investment performance, and future contribution levels. To help you understand the impact of inflation, the estimated income is shown in today’s money, so you can see what that amount would be worth right now.';
    await pensionBreakdownPage.navigateToSchemeIncomeAndValuesTab(
      page,
      schemeName,
    );
    expect(page.url()).toContain('/pension-details/pension-income-and-values');
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

  test('No data available for Features, More details or calculation method', async ({
    page,
  }) => {
    const accordions = new IncomeAndValuesAccordions(page);
    const dcCalculationAccordion =
      accordions.getAccordionLocator(calculationTestId);
    const calculationContentLocator =
      accordions.getCalculationContentLocator(calculationTestId);
    const featuresAccordion = accordions.getAccordionLocator(featuresTestId);
    const moreDetailsAccordion =
      accordions.getAccordionLocator(moreDetailsTestId);
    const schemeName = 'Tranquility Pension Scheme';
    const expectedTexts = 'Unavailable';
    await pensionBreakdownPage.navigateToSchemeIncomeAndValuesTab(
      page,
      schemeName,
    );
    // feature and more details accordions are not visible
    await expect(featuresAccordion).toBeHidden();
    await expect(moreDetailsAccordion).toBeHidden();
    //Assert accordion 'How these values are calculated' is visible
    await expect(dcCalculationAccordion).toBeVisible();
    //Click accordion to open
    await accordions.toggle('dc-calculation-accordion');
    // Assert content text
    await expect(calculationContentLocator).toContainText(expectedTexts);
  });
});
