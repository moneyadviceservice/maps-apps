/* eslint-disable playwright/no-focused-test */
import { expect, test } from '@playwright/test';

import { zTestAllDetails } from '../data/scenarioDetails';
import { emptyState } from '../data/scenarioDetails';
import loadingPage from '../pages/LoadingPage';
import pensionDetailsPage from '../pages/PensionDetailsPage';
import pensionBreakdownPage from '../pages/PensionsBreakdownPage';
import pensionsFoundPage from '../pages/PensionsFoundPage';
import scenarioSelectionPage from '../pages/ScenarioSelectionPage';
import welcomePage from '../pages/WelcomePage';
import commonHelpers from '../utils/commonHelpers';

/**
 * @tests User Story 37853 *NOT LIMITED TO
 * @tests Test Case 38198: 37853:  AC3: SP route path should be updated
 */

const claimingYourSpText1 = `You won’t get your State Pension automatically - you have to claim it.`;
const claimingYourSpText2 = `You’ll get a letter no later than two months before you reach State Pension age, telling you what to do. If you don’t get a letter, you can still make a claim.`;
const forecastText = 'About your State Pension forecast';
const accordionTextAbout = `How much you’ll get in your State Pensions depends on how many years you’ve made National Insurance contributions. When you reach State Pension age, you usually need 35 qualifying years to get the full State Pension, and ten qualifying years to get anything. Learn more`;
const estimatedIncomeSubheading = 'Estimated income';
const toolTip1Text =
  'The State Pension age is the earliest age you can claim State Pension. You don’t have to start taking your State Pension at this age - you can also defer it.Close';
const toolTip2Text =
  'National Insurance (NI) is a type of tax you pay to qualify for State Pension and some types of benefits. You usually need 35 qualifying years of NI contributions to get the full State Pension, and ten qualifying years to get anything. Learn more (opens in a new window) Close';

test.describe('Pension Details page - State Pensions', () => {
  test.beforeEach(async ({ page }) => {
    await commonHelpers.navigateToEmulator(page);
  });
  test.afterEach(async ({ page }) => {
    await commonHelpers.logoutOfApplication(page);
  });

  test('Expected content is displayed on pensions details page for State pensions', async ({
    page,
  }) => {
    await scenarioSelectionPage.selectScenarioComposerDev(
      page,
      zTestAllDetails.option,
    );
    await welcomePage.welcomePageLoads(page);
    await welcomePage.clickWelcomeButton(page);
    await loadingPage.waitForPensionsToLoad(page);
    await pensionsFoundPage.waitForPensionsFound(page);
    await pensionsFoundPage.clickSeeYourPensions(page);

    const schemeNames = ['State Pension'];
    for (const schemeName of schemeNames) {
      const pension = zTestAllDetails.pensions.find(
        (p) => p.schemeName === schemeName,
      );
      await pensionBreakdownPage.viewDetailsOfPension(page, schemeName);
      await pensionDetailsPage.assertHeadingStatePension(page);
      expect(page.url()).toContain('/pension-details');
      //Summary text
      const tooltip1Icon = await page
        .locator(
          `label[data-testid="tooltip-icon"] span:text-is("Show more information")`,
        )
        .first()
        .innerText();
      const tooltip2Icon = await page
        .locator(
          `label[data-testid="tooltip-icon"] span:text-is("Show more information")`,
        )
        .nth(1)
        .innerText();
      const tooltip1Content = page
        .locator(`span[data-testid="tooltip-content"]`)
        .nth(0);
      const tooltip2Content = page
        .locator(`span[data-testid="tooltip-content"]`)
        .nth(1);
      const subtext = `You will reach State Pension age ${tooltip1Icon} ${await tooltip1Content.innerText()} on ${
        pension.retirementDate
      }. Your forecast is ${
        pension.ERIMonthlyAmount
      }, based on your National Insurance ${tooltip2Icon} ${await tooltip2Content.innerText()} record.`;
      await expect(page.getByTestId('tool-intro')).toContainText(subtext);
      //ToolTips
      await expect(tooltip1Content).toHaveText(toolTip1Text);
      await expect(tooltip2Content).toHaveText(toolTip2Text);
      //accordion
      await expect(
        pensionDetailsPage.aboutTheseValuesAccordion(page),
      ).not.toHaveAttribute('open');
      await commonHelpers.clickAccordion(
        page,
        pensionDetailsPage.aboutTheseValuesAccordion(page),
        'About these values',
      );
      await expect(
        pensionDetailsPage.aboutTheseValuesAccordion(page),
      ).toHaveAttribute('open');
      await expect(
        pensionDetailsPage.aboutTheseValuesAccordion(page),
      ).toContainText(accordionTextAbout);
      // Pension Details
      await expect(
        pensionDetailsPage.tableSectionHeading(page, 'Pension details').first(),
      ).toBeVisible();
      await expect(pensionDetailsPage.tableHeadings(page).nth(1)).toHaveText(
        'Monthly amount',
      );
      await expect(pensionDetailsPage.tableHeadings(page).nth(2)).toHaveText(
        'Yearly amount',
      );
      await expect(pensionDetailsPage.tableHeadings(page).nth(3)).toHaveText(
        'Payable date',
      );
      const pensionDetails: [
        string,
        string | undefined,
        string | undefined,
        string,
      ][] = [
        [
          'Estimate today',
          pension.APMonthlyAmount,
          pension.APAnnualAmount,
          pension.apPayableDate,
        ],
        [
          'Forecast',
          pension.ERIMonthlyAmount,
          pension.ERIAnnualAmount,
          pension.eriPayableDate,
        ],
      ];
      for (const [label, col1Value, col2Value, col3Value] of pensionDetails) {
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
        if (col3Value) {
          await expect(pensionDetailsPage.getDataCol3(page, label)).toHaveText(
            col3Value,
          );
        }
      }
      // Estimated income section
      const bar1Label = `Estimate based on your National Insurance record up to ${pension.illustrationDate}`;
      const bar2Label = `Forecast if you continue to make National Insurance contributions`;
      const estimatedIncomeSection = page.locator(
        `div:has(h2:text-is("${estimatedIncomeSubheading}"))`,
      );
      await expect(estimatedIncomeSection.locator(':scope > h2')).toContainText(
        estimatedIncomeSubheading,
      );
      await expect(
        estimatedIncomeSection.locator(':scope > p').first(),
      ).toContainText(bar1Label);
      await expect(
        estimatedIncomeSection
          .locator(':scope span', { hasText: pension.APMonthlyAmount })
          .first(),
      ).toBeVisible();
      await expect(
        estimatedIncomeSection.locator(':scope > p').nth(1),
      ).toContainText(bar2Label);
      await expect(
        estimatedIncomeSection
          .locator(':scope span', { hasText: pension.ERIMonthlyAmount })
          .first(),
      ).toBeVisible();
      // State Pension Forecast
      await expect(page.locator(`h2:text-is("${forecastText}")`)).toBeVisible();
      await expect(
        page
          .getByTestId('paragraph')
          .filter({ hasText: `${pension.statePensionMessageEng}` }),
      ).toBeVisible();
      //Claiming your State Pension
      await expect(
        page.getByTestId('information-callout').filter({
          has: page.locator(`h4:text-is("Claiming your State Pension")`),
        }),
      ).toBeVisible();
      await expect(
        page.getByTestId('information-callout').filter({
          has: page.locator(`li > p:text-is("${claimingYourSpText1}")`),
        }),
      ).toBeVisible();
      await expect(
        page.getByTestId('information-callout').filter({
          has: page.locator(`li > p:text-is("${claimingYourSpText2}")`),
        }),
      ).toBeVisible();

      await commonHelpers.clickLink(page, 'Back');
      await pensionBreakdownPage.pageLoads(page);
    }
  });

  test('Dashes are displayed for empty values on pensions details page for State pensions', async ({
    page,
  }) => {
    await scenarioSelectionPage.selectScenarioComposerDev(
      page,
      emptyState.option,
    );
    await welcomePage.welcomePageLoads(page);
    await welcomePage.clickWelcomeButton(page);
    await loadingPage.waitForPensionsToLoad(page);
    await pensionsFoundPage.waitForPensionsFound(page);
    await pensionsFoundPage.clickSeeYourPensions(page);

    const schemeNames = ['State Empty'];
    for (const schemeName of schemeNames) {
      await pensionBreakdownPage.viewDetailsOfPension(page, schemeName);
      await pensionDetailsPage.assertHeadingStatePension(page);
      //Summary text
      await expect(page.getByTestId('tool-intro')).toBeHidden();
      //accordion
      await expect(
        pensionDetailsPage.aboutTheseValuesAccordion(page),
      ).not.toHaveAttribute('open');
      await commonHelpers.clickAccordion(
        page,
        pensionDetailsPage.aboutTheseValuesAccordion(page),
        'About these values',
      );
      await expect(
        pensionDetailsPage.aboutTheseValuesAccordion(page),
      ).toHaveAttribute('open');
      await expect(
        pensionDetailsPage.aboutTheseValuesAccordion(page),
      ).toContainText(accordionTextAbout);
      //estimatedIncomeSection
      await expect(
        page.locator(`h2:text-is("${estimatedIncomeSubheading}")`),
      ).toBeHidden();
      // State Pension Forecast
      await expect(page.locator(`h2:text-is("${forecastText}")`)).toBeHidden();
      //Claiming your State Pension
      await expect(
        page.getByTestId('information-callout').filter({
          has: page.locator(`h4:text-is("Claiming your State Pension")`),
        }),
      ).toBeVisible();
      await expect(
        page.getByTestId('information-callout').filter({
          has: page.locator(`li > p:text-is("${claimingYourSpText1}")`),
        }),
      ).toBeVisible();
      await expect(
        page.getByTestId('information-callout').filter({
          has: page.locator(`li > p:text-is("${claimingYourSpText2}")`),
        }),
      ).toBeVisible();
      // Pension Details
      await expect(
        pensionDetailsPage.tableSectionHeading(page, 'Pension details').first(),
      ).toBeHidden();
      await commonHelpers.clickLink(page, 'Back');
      await pensionBreakdownPage.pageLoads(page);
    }
  });
});
