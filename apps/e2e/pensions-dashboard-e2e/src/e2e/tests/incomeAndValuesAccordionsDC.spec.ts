/* eslint-disable playwright/no-focused-test */
import { expect, test } from '@maps/playwright';

import { newDetailsPageWarnings } from '../data/scenarioDetails';
import IncomeAndValuesAccordions from '../pages/components/IncomeAndValuesAccordions';
import pensionBreakdownPage from '../pages/PensionsBreakdownPage';
import { commonSessions } from '../utils/testSessionStorage';

const featuresTestId = 'features';
const featuresDonutTestId = 'features-donut';
const moreDetailsTestId = 'more-details';
const moreDetailsDonutTestId = 'more-details-donut';
const calculationTestId = 'dc-calculation-accordion';
const calculationDonutTestId = 'dc-calculation-accordion-donut';

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
    const scenarioName = newDetailsPageWarnings.option;
    await commonSessions.navigateToPensionBreakdown(page, scenarioName);
  });

  test('Features accordion displays all 3 items: Increasing TRUE, Safeguarding benefit TRUE, Warning Code UNP', async ({
    page,
  }) => {
    const accordions = new IncomeAndValuesAccordions(page);
    const schemeName = 'Aria Pension Scheme';
    const accordionLocator = accordions.getAccordionLocator(featuresTestId);
    const labelLocator = accordions.getLabelLocator(featuresTestId);
    const listItemsLocator = accordions.getListItemsLocator(featuresTestId);
    const accordionDonutLocator =
      accordions.getAccordionLocator(featuresDonutTestId);
    const labelDonutLocator = accordions.getLabelLocator(featuresDonutTestId);
    const listItemsDonutLocator =
      accordions.getListItemsLocator(featuresDonutTestId);
    const expectedTexts = [
      'This income will rise after a set number of years.',
      "Your pension has an underpin. An underpin is when the income you'll get is calculated in two or more ways. You'll usually get the highest amount from these calculations.",
      'This pension has a safeguarded benefit, which means it includes valuable guaranteed features. This could limit your choices when taking or transferring this pension, so get regulated financial advice to make sure you understand your options. Speak to your provider for more information.',
    ];
    await pensionBreakdownPage.navigateToSchemeIncomeAndValuesTab(
      page,
      schemeName,
    );
    // Recurring (bar)
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

    // Pot values (donut)
    //Assert accordion label text
    await expect(labelDonutLocator).toContainText('Features');
    // Features accordion is closed by default
    await expect(accordionDonutLocator).not.toHaveAttribute('open');
    //Click accordion to open & assert open
    await accordions.toggle(featuresDonutTestId);
    await expect(accordionDonutLocator).toHaveAttribute('open');
    //Assert 3 bullet points
    await expect(listItemsDonutLocator).toHaveCount(3);
    // Assert content text
    const moreDetailsDonutText = await accordions.getListItemsText(
      featuresDonutTestId,
    );
    expect(moreDetailsDonutText).toEqual(expectedTexts);
    // Click accordion and assert closed
    await accordions.toggle(featuresDonutTestId);
    await expect(accordionDonutLocator).not.toHaveAttribute('open');
  });

  test('More details accordion displays all 4 items: Warning codes CUR, TVI, DEF and Survivor benefit TRUE', async ({
    page,
  }) => {
    const accordions = new IncomeAndValuesAccordions(page);
    const accordionLocator = accordions.getAccordionLocator(moreDetailsTestId);
    const labelLocator = accordions.getLabelLocator(moreDetailsTestId);
    const listItemsLocator = accordions.getListItemsLocator(moreDetailsTestId);
    const accordionDonutLocator = accordions.getAccordionLocator(
      moreDetailsDonutTestId,
    );
    const labelDonutLocator = accordions.getLabelLocator(
      moreDetailsDonutTestId,
    );
    const listItemsDonutLocator = accordions.getListItemsLocator(
      moreDetailsDonutTestId,
    );
    const schemeName = 'Optimum Retirement Plan';
    const expectedTexts = [
      "These values are normally held in a foreign currency. This means they're based on the exchange rate on the day they were calculated. Contact your provider for more details.",
      "Your estimated income was calculated when you were an active member of the scheme, which means it may be higher than what you'll get when you take it. Contact your provider for an up-to-date estimate.",
      "You've recently transferred one or more pensions into the pension, but the provider needs more time to include them in these values. Contact your provider for more up-to-date information.",
      'This benefit includes any pension paid to a spouse, civil partner or other dependants after you die. Contact your provider for more details.',
    ];
    await pensionBreakdownPage.navigateToSchemeIncomeAndValuesTab(
      page,
      schemeName,
    );
    // Recurring (bar)
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

    // Pot values (donut)
    //Assert accordion label text
    await expect(labelDonutLocator).toContainText('More details');
    // Features accordion is closed by default
    await expect(accordionDonutLocator).not.toHaveAttribute('open');
    //Click accordion to open & assert open
    await accordions.toggle(moreDetailsDonutTestId);
    await expect(accordionDonutLocator).toHaveAttribute('open');
    //Assert 4 bullet points
    await expect(listItemsDonutLocator).toHaveCount(4);
    // Assert content text
    const moreDetailsDonutText = await accordions.getListItemsText(
      moreDetailsDonutTestId,
    );
    expect(moreDetailsDonutText).toEqual(expectedTexts);
    // Click accordion and assert closed
    await accordions.toggle(moreDetailsDonutTestId);
    await expect(accordionDonutLocator).not.toHaveAttribute('open');
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
    const accordionDonutLocator = accordions.getAccordionLocator(
      calculationDonutTestId,
    );
    const labelDonutLocator = accordions.getLabelLocator(
      calculationDonutTestId,
    );
    const listItemsDonutLocator = accordions.getListItemsLocator(
      calculationDonutTestId,
    );
    const contentDonutLocator = accordions.getCalculationContentLocator(
      calculationDonutTestId,
    );
    const schemeName = 'Elite Preservation Trust';
    const expectedText =
      'Estimates for this pension are based on you buying a guaranteed income for life (an annuity), which starts paying from the expected retirement date. They’re also based on the provider’s assumptions about inflation, investment performance, and future contribution levels. To help you understand the impact of inflation, the estimated income is shown in today’s money, so you can see what that amount would be worth right now.';
    await pensionBreakdownPage.navigateToSchemeIncomeAndValuesTab(
      page,
      schemeName,
    );
    expect(page.url()).toContain('/pension-details/pension-income-and-values');

    // Recurring (bar)
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

    // Pot values (donut)
    //Assert accordion label text
    await expect(labelDonutLocator).toContainText(
      'How these values are calculated',
    );
    // More details accordion is closed by default
    await expect(accordionDonutLocator).not.toHaveAttribute('open');
    //Click accordion to open & assert open
    await accordions.toggle(calculationDonutTestId);
    await expect(accordionDonutLocator).toHaveAttribute('open');
    //Assert no bullet points
    await expect(listItemsDonutLocator).toHaveCount(0);
    // Assert content text
    const calculationDonutText = await accordions.getCalculationText(
      calculationDonutTestId,
    );
    expect(calculationDonutText).toEqual(expectedText);
    await expect(contentDonutLocator).toContainText(expectedText);
    // Click accordion and assert closed
    await accordions.toggle(calculationDonutTestId);
    await expect(accordionDonutLocator).not.toHaveAttribute('open');
  });

  test('No data available for Features, More details or calculation method', async ({
    page,
  }) => {
    const accordions = new IncomeAndValuesAccordions(page);
    const dcCalculationAccordion =
      accordions.getAccordionLocator(calculationTestId);
    const dcCalculationDonutAccordion = accordions.getAccordionLocator(
      calculationDonutTestId,
    );
    const calculationContentLocator =
      accordions.getCalculationContentLocator(calculationTestId);
    const calculationDonutContentLocator =
      accordions.getCalculationContentLocator(calculationDonutTestId);
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
    //Assert accordion 'How these values are calculated' is visible (pot value)
    await expect(dcCalculationDonutAccordion).toBeVisible();
    //Click accordion to open
    await accordions.toggle(calculationTestId);
    // Assert content text
    await expect(calculationContentLocator).toContainText(expectedTexts);
    await accordions.toggle(calculationDonutTestId);
    // Assert content text
    await expect(calculationDonutContentLocator).toContainText(expectedTexts);
  });
});
