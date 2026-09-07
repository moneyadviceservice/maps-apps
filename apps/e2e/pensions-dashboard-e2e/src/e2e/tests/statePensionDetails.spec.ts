import { expect, test } from '@maps/playwright';

import { statePensionCallouts, zTestAllDetails } from '../data/scenarioDetails';
import DidYouUnderstand from '../pages/components/DidYouUnderstandThisPage';
import pensionDetailsPage from '../pages/PensionDetailsPage';
import pensionBreakdownPage from '../pages/PensionsBreakdownPage';
import commonHelpers from '../utils/commonHelpers';
import { commonSessions } from '../utils/testSessionStorage';

/**
 * @tests User Story 37853 *NOT LIMITED TO
 * @tests Test Case 38198: 37853:  AC3: SP route path should be updated
 *
 * @tests User Story 51449: 'Did you understand this page' component
 * @tests Test Case 52091: [AC1] State Pension
 *
 * @tests User Story 56332: FE - SP Forecast vs Estimate
 * @tests Test Case 56983 [AC1]: Callout when AP > 0 and AP < ERI (English & Welsh)
 * @tests Test Case 56985 [AC2]: Callout when AP > 0 and AP = ERI (English & Welsh)
 * @tests Test Case 56986 [AC3]: Callout when AP = 0 and ERI > 0 (English & Welsh)
 * @tests Test Case 56987 [AC4 - AC6]: Heading hierarchy & Estimate/Forecast bar visual checks
 */

const claimingYourSpText1 = `You will not get your State Pension automatically - you have to claim it.`;
const claimingYourSpText2 = `You\u2019ll get a letter no later than 2 months before you reach State Pension age telling you what to do. If you do not get a letter, you can still make a claim.`;
const forecastText = 'About your State Pension forecast';
const accordionTextAbout = `About these valuesHow much you'll get in your State Pension depends on how many years you've made National Insurance contributions. When you reach State Pension age, you usually need 35 qualifying years to get the full State Pension and 10 qualifying years to get anything. Learn more (opens in a new window) `;
const toolTip1Text =
  'The State Pension age is the earliest age you can claim State Pension. You don’t have to start taking your State Pension at this age - you can also defer it.Close';
const toolTip2Text =
  'National Insurance (NI) is a type of tax you pay to qualify for State Pension and some types of benefits. You usually need 35 qualifying years of NI contributions to get the full State Pension and 10 qualifying years to get anything. Learn more (opens in a new window) Close';

test.describe('State Pensions', () => {
  test.describe('Pension Details Page', () => {
    test.beforeEach(async ({ page }) => {
      const scenarioName = zTestAllDetails.option;
      await commonSessions.navigateToPensionBreakdown(page, scenarioName);
    });

    test('Expected content is displayed on pensions details page for State pensions', async ({
      page,
    }) => {
      const schemeNames = ['State Pension'];
      for (const schemeName of schemeNames) {
        const pension = zTestAllDetails.pensions.find(
          (p) => p.schemeName === schemeName,
        );
        await pensionBreakdownPage.viewDetailsOfPension(page, schemeName);
        await pensionDetailsPage.assertHeadingStatePension(page, 'en');
        expect(page.url()).toContain('/pension-details');

        const didYouUnderstandComponent = new DidYouUnderstand(page);
        await expect(
          didYouUnderstandComponent.getFeedbackBanner(),
        ).toBeVisible();

        //Summary text
        const tooltip1Icon = await page
          .locator(
            `label[data-testid="tooltip-icon"] span:text-is("Show more information on State Pension Age")`,
          )
          .innerText();
        const tooltip2Icon = await page
          .locator(
            `label[data-testid="tooltip-icon"] span:text-is("Show more information on National Insurance")`,
          )
          .innerText();
        const tooltip1Content = page
          .locator(`span[data-testid="tooltip-content"]`)
          .nth(0);
        const tooltip2Content = page
          .locator(`span[data-testid="tooltip-content"]`)
          .nth(1);
        const subtext = `You will reach State Pension age ${tooltip1Icon} ${await tooltip1Content.innerText()} on ${
          pension?.retirementDate
        }. Your forecast is ${
          pension?.ERIMonthlyAmount
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

        // Estimated Income section
        const bar1Heading = 'How much you already qualify for';
        const bar2Heading = 'If you continue to contribute';
        const bar1Label = `Estimate based on your National Insurance record up to ${pension?.illustrationDate}`;
        const bar2Label = `Forecast if you continue to make National Insurance contributions`;
        const estimatedIncomeSection = page.locator(
          '[data-testid="state-pension-estimated-income"]',
        );
        const calloutTitle =
          'You already qualify for your full forecast amount';
        const calloutText = `You already have enough qualifying years of National Insurance contributions or credits to get your State Pension forecast amount.`;

        // Callout
        await expect(
          estimatedIncomeSection.getByText(calloutTitle),
        ).toBeVisible();
        await expect(
          estimatedIncomeSection.getByText(calloutText),
        ).toBeVisible();

        // Progress Bars
        await expect(
          estimatedIncomeSection.getByText(bar1Heading),
        ).toBeVisible();
        await expect(estimatedIncomeSection.getByText(bar1Label)).toBeVisible();
        await expect(
          estimatedIncomeSection.locator('[data-testid="sp-progress-bar-ap"]', {
            hasText: pension?.APMonthlyAmount,
          }),
        ).toBeVisible();
        await expect(
          estimatedIncomeSection.getByText(bar2Heading),
        ).toBeVisible();
        await expect(estimatedIncomeSection.getByText(bar2Label)).toBeVisible();
        await expect(
          estimatedIncomeSection.locator(
            '[data-testid="sp-progress-bar-eri"]',
            {
              hasText: pension?.ERIMonthlyAmount,
            },
          ),
        ).toBeVisible();

        // About your State Pension forecast
        await expect(
          page.locator(`h2:text-is("${forecastText}")`),
        ).toBeVisible();
        await expect(
          page
            .getByTestId('paragraph')
            .filter({ hasText: `${pension?.statePensionMessageEng}` }),
        ).toBeVisible();

        //Claiming your State Pension
        await expect(
          page.getByTestId('information-callout').filter({
            has: page.locator(`h3:text-is("Claiming your State Pension")`),
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
  });

  test.describe('State Pension Callouts', () => {
    test.beforeEach(async ({ page }) => {
      const scenarioName = statePensionCallouts.option;
      await commonSessions.navigateToPensionBreakdown(page, scenarioName);
    });

    test('renders expected State Pensions callout content', async ({
      page,
    }) => {
      for (const pension of statePensionCallouts.pensions) {
        const pensionCards = page.getByTestId('information-callout');
        const matchingSchemeByIndex = pensionCards.nth(
          statePensionCallouts.pensions.indexOf(pension),
        );
        await matchingSchemeByIndex.getByTestId('details-link').click();
        await pensionDetailsPage.assertHeadingStatePension(page, 'en');

        // Check the callout heading and text
        const calloutHeading = page.getByTestId(
          'state-pension-callout-heading',
        );
        const calloutText = page.getByTestId('state-pension-callout-text');

        await expect(calloutHeading).toHaveText(pension.calloutHeading);
        await expect(calloutText).toHaveText(pension.calloutText);

        await commonHelpers.clickLink(page, 'Back');
        await pensionBreakdownPage.pageLoads(page);
      }
    });
  });
});
