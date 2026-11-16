import { expect, test } from '@maps/playwright';

import {
  spScenarios,
  statePensionCallouts,
  zTestAllDetails,
} from '../data/scenarioDetails';
import DidYouUnderstand from '../pages/components/DidYouUnderstandThisPage';

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
 *
 * @tests User Story 59958: FE - SP Pending Details Page
 * @tests Test Case 60280: 59958 AC1 Test Case 1 :  Display 'Confirmed-Pensions without estimates incomes' State Pension Details
 * @tests Test Case 60282: 59958 AC3 Test Case 3 :  Display 'Confirmed-Pensions without estimates incomes' State Pension Details - MOBILE
 */

const claimingYourSpText1 = `You will not get your State Pension automatically - you have to claim it.`;
const claimingYourSpText2 = `You\u2019ll get a letter no later than 2 months before you reach State Pension age telling you what to do. If you do not get a letter, you can still make a claim.`;
const forecastText = 'About your State Pension forecast';
const accordionTextAbout = `About these valuesHow much you'll get in your State Pension depends on how many years you've made National Insurance contributions. When you reach State Pension age, you usually need 35 qualifying years to get the full State Pension and 10 qualifying years to get anything. Learn more (opens in a new window) `;
const toolTip1Text =
  'The State Pension age is the earliest age you can claim State Pension. You don’t have to start taking your State Pension at this age - you can also defer it.Close';
const toolTip2Text =
  'National Insurance (NI) is a type of tax you pay to qualify for State Pension and some types of benefits. You usually need 35 qualifying years of NI contributions to get the full State Pension and 10 qualifying years to get anything. Learn more (opens in a new window) Close';
const subHeadingText = 'We cannot show a State Pension forecast';
const introText = `The Department for Work and Pensions (DWP) has sent this message about your State Pension forecast:`;
const notificationHeading = 'DWP cannot send a State Pension forecast';
const notificationText = `You reached State Pension age on 31 May 2022. We are unable to give you a State Pension forecast at this time. Contact the UK Pension Centre on 0800 731 7898. If you are phoning from outside the UK, call +44191 218 7777.`;

test.describe('State Pensions', () => {
  test('Expected content is displayed on pensions details page for State pensions', async ({
    page,
    commonHelpers,
    pensionBreakdownPage,
    pensionDetailsPage,
    commonSessions,
  }) => {
    const scenarioName = zTestAllDetails.option;
    await commonSessions.navigateToPensionBreakdown(scenarioName);
    const schemeNames = ['State Pension'];
    for (const schemeName of schemeNames) {
      const pension = zTestAllDetails.pensions.find(
        (p) => p.schemeName === schemeName,
      );
      await pensionBreakdownPage.viewDetailsOfPension(schemeName);
      await pensionDetailsPage.assertHeadingStatePension('en');
      expect(page.url()).toContain('/pension-details');

      const didYouUnderstandComponent = new DidYouUnderstand(page);
      await expect(didYouUnderstandComponent.feedbackBanner).toBeVisible();

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
        pensionDetailsPage.aboutTheseValuesAccordion(),
      ).not.toHaveAttribute('open');
      await commonHelpers.clickAccordion(
        pensionDetailsPage.aboutTheseValuesAccordion(),
        'About these values',
      );
      await expect(
        pensionDetailsPage.aboutTheseValuesAccordion(),
      ).toHaveAttribute('open');
      await expect(
        pensionDetailsPage.aboutTheseValuesAccordion(),
      ).toContainText(accordionTextAbout);

      // Estimated Income section
      const bar1Heading = 'How much you already qualify for';
      const bar2Heading = 'If you continue to contribute';
      const bar1Label = `Estimate based on your National Insurance record up to ${pension?.illustrationDate}`;
      const bar2Label = `Forecast if you continue to make National Insurance contributions`;
      const estimatedIncomeSection = page.locator(
        '[data-testid="state-pension-estimated-income"]',
      );
      const calloutTitle = 'You already qualify for your full forecast amount';
      const calloutText = `You already have enough qualifying years of National Insurance contributions or credits to get your State Pension forecast amount.`;

      // Callout
      await expect(
        estimatedIncomeSection.getByText(calloutTitle),
      ).toBeVisible();
      await expect(estimatedIncomeSection.getByText(calloutText)).toBeVisible();

      // Progress Bars
      await expect(estimatedIncomeSection.getByText(bar1Heading)).toBeVisible();
      await expect(estimatedIncomeSection.getByText(bar1Label)).toBeVisible();
      await expect(
        estimatedIncomeSection.locator('[data-testid="sp-progress-bar-ap"]', {
          hasText: pension?.APMonthlyAmount,
        }),
      ).toBeVisible();
      await expect(estimatedIncomeSection.getByText(bar2Heading)).toBeVisible();
      await expect(estimatedIncomeSection.getByText(bar2Label)).toBeVisible();
      await expect(
        estimatedIncomeSection.locator('[data-testid="sp-progress-bar-eri"]', {
          hasText: pension?.ERIMonthlyAmount,
        }),
      ).toBeVisible();

      // About your State Pension forecast
      await expect(page.locator(`h2:text-is("${forecastText}")`)).toBeVisible();
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

      await commonHelpers.clickLink('Back');
      await pensionBreakdownPage.pageLoads();
    }
  });

  test('Expected content is displayed on pensions details page for SP without estimated income', async ({
    commonSessions,
    statePensionsDetailsPage,
  }) => {
    const scenarioName = spScenarios.option;
    await commonSessions.navigateToPensionBreakdown(scenarioName);

    await statePensionsDetailsPage.navigateToStatePensionsDetailsPage();
    await expect(statePensionsDetailsPage.subHeadingWithoutIncome).toHaveText(
      subHeadingText,
    );

    await expect(statePensionsDetailsPage.noIncomeIntro).toHaveText(introText);
    await expect(statePensionsDetailsPage.notificationBoxHeading).toHaveText(
      notificationHeading,
    );
    await expect(statePensionsDetailsPage.notificationIcon).toBeVisible();
    await expect(statePensionsDetailsPage.notificationBoxContent).toHaveText(
      notificationText,
    );
    await expect(
      statePensionsDetailsPage.claimingYourStatePensionCallout,
    ).toBeVisible();
    await expect(statePensionsDetailsPage.helpAndSupportBanner).toBeVisible();
  });

  test('renders expected State Pensions callout content', async ({
    page,
    commonHelpers,
    pensionBreakdownPage,
    pensionDetailsPage,
    commonSessions,
  }) => {
    const scenarioName = statePensionCallouts.option;
    await commonSessions.navigateToPensionBreakdown(scenarioName);
    for (const pension of statePensionCallouts.pensions) {
      const pensionCards = page.getByTestId('information-callout');
      const matchingSchemeByIndex = pensionCards.nth(
        statePensionCallouts.pensions.indexOf(pension),
      );
      await matchingSchemeByIndex.getByTestId('details-link').click();
      await pensionDetailsPage.assertHeadingStatePension('en');

      // Check the callout heading and text
      const calloutHeading = page.getByTestId('state-pension-callout-heading');
      const calloutText = page.getByTestId('state-pension-callout-text');

      await expect(calloutHeading).toHaveText(pension.calloutHeading);
      await expect(calloutText).toHaveText(pension.calloutText);

      await commonHelpers.clickLink('Back');
      await pensionBreakdownPage.pageLoads();
    }
  });
});
