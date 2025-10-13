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

const retirementDateToolTipIconState =
  'p:has-text("Retirement date") input[data-testid="tooltip-input"]';
const informationLastUpdatedToolTipIconState =
  'p:has-text("Information last updated") input[data-testid="tooltip-input"]';
const pensionOriginToolTipText =
  'The pension origin is where this pension scheme comes from, such as a current or former job, a transfer, or an annuity you’ve already bought.';
const moreInformationSubtext =
  'Find out more about this pension scheme, including the charges and how it’s managed.';
const cAndCToolTipText =
  'Costs and charges are paid to your pension provider to cover the costs of managing your money. They’re usually paid automatically out of your pension scheme.';
const cAndCToolTip = `Show more information ${cAndCToolTipText}Close`;
const pensionOriginToolTip = `Show more information ${pensionOriginToolTipText}Close`;
const incomeAndValuesHeading = 'Income and values';
const incomeAndValuesSubtext =
  'These charts show the value of your pension now (or from the latest available date) and what it could be worth in the future.';

test.describe('Pension Breakdown page', () => {
  test.beforeEach(async ({ page }) => {
    await commonHelpers.navigateToEmulator(page);
  });
  test.afterEach(async ({ page }) => {
    await commonHelpers.logoutOfApplication(page);
  });

  test('Expected content is displayed on pensions details page for Pending pensions DC pension types', async ({
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
      await pendingPensionsPage.viewDetailsOfPendingPension(page, schemeName);
      await pensionDetailsPage.assertHeading(page, schemeName);
      //Summary Tab
      expect(page.url()).toContain('/pension-details/your-pension-summary');
      //plan reference number & tooltip text, Retirement date, information last updated & tooltip text
      expect(
        await pensionDetailsPage.verifyCommonHeaderAndIllustrationDate(
          page,
          pension.referenceNumber,
          pension.payableDateERI,
          pension.dataIllustrationDate,
        ),
      ).toBe(true);
      //tootip closed by default
      await expect(
        page.locator(retirementDateToolTipIconState),
      ).toHaveAttribute('aria-expanded', 'false');
      await pensionDetailsPage.clickTooltip(page, 'Retirement date');
      //tooltip open
      await expect(
        page.locator(retirementDateToolTipIconState),
      ).toHaveAttribute('aria-expanded', 'true');
      await pensionDetailsPage.clickTooltip(page, 'Retirement date');
      //tooltip closed
      await expect(
        page.locator(retirementDateToolTipIconState),
      ).toHaveAttribute('aria-expanded', 'false');
      //tootip closed by default
      await expect(
        page.locator(informationLastUpdatedToolTipIconState),
      ).toHaveAttribute('aria-expanded', 'false');
      await pensionDetailsPage.clickTooltip(page, 'Information last updated');
      //tooltip open
      await expect(
        page.locator(informationLastUpdatedToolTipIconState),
      ).toHaveAttribute('aria-expanded', 'true');
      await pensionDetailsPage.clickTooltip(page, 'Information last updated');
      //tooltip closed
      await expect(
        page.locator(informationLastUpdatedToolTipIconState),
      ).toHaveAttribute('aria-expanded', 'false');

      //Income and Values tab
      await pensionDetailsPage.checkPensionDetailsTabs(
        page,
        'tab-pension-income-and-values',
        'Income and values',
      );
      expect(page.url()).toContain(
        '/pension-details/pension-income-and-values',
      );
      //plan reference number & tooltip text, Retirement date, information last updated & tooltip text
      expect(
        await pensionDetailsPage.verifyCommonHeaderAndIllustrationDate(
          page,
          pension.referenceNumber,
          pension.payableDateERI,
          pension.dataIllustrationDate,
        ),
      ).toBe(true);
      await expect(page.getByTestId('heading')).toContainText(
        incomeAndValuesHeading,
      );
      await expect(page.getByTestId('sub-heading')).toContainText(
        incomeAndValuesSubtext,
      );
      //About this Pension Tab
      await pensionDetailsPage.checkPensionDetailsTabs(
        page,
        'tab-about-this-pension',
        'About this pension',
      );
      expect(page.url()).toContain('/pension-details/about-this-pension');
      const aboutThisPension: [string, string, string | undefined][] = [
        ['provider', 'Pension provider', pension.pensionAdministrator],
        ['contact-reference', 'Plan reference number', pension.referenceNumber],
        ['start-date', 'Pension opened', pension.pensionStartDate],
        ['status', 'Active contributions', pension.activeContributions],
        ['employer-name', 'Employer name (most recent)', pension.employerName],
        ['employer-status', 'Employer status', pension.employerStatus],
        [
          'employment-start-date',
          'Employment start date',
          pension.employementStartDate,
        ],
        [
          'employment-end-date',
          'Employment end date',
          pension.employmentEndDate,
        ],
        [
          'pension-origin',
          `Pension origin ${pensionOriginToolTip}`,
          pension.pensionOrigin,
        ],
      ];
      for (const [testId, field, expectedValue] of aboutThisPension) {
        const ddLocator = page.getByTestId(`dd-${testId}`);
        //checks that displayed value and data value are matched
        if (expectedValue) {
          await expect(ddLocator).toBeVisible();
          await expect(page.getByTestId(`dt-${testId}`)).toHaveText(field);
          await expect(ddLocator).toHaveText(expectedValue);
          //test will fail if item is displayed in UI but not in data
        } else {
          await expect(ddLocator).toBeHidden();
        }
      }
      // test will fail if expected data is present but not displayed in the UI
      expect(
        await pensionDetailsPage.verifyExpectedDataIsDisplayedInUi(
          page,
          aboutThisPension,
          'About this pension',
        ),
      ).toBe(true);
      // More information section:
      const moreInformation: [string, string, string | undefined][] = [
        [
          'more-info-C_AND_C',
          `Costs and charges ${cAndCToolTip}`,
          pension.costCharges,
        ],
        ['more-info-SIP', 'Investment principles', pension.statementInvestment],
        [
          'more-info-IMP',
          'Implementation statement',
          pension.implementationStatement,
        ],
        ['more-info-ANR', 'Annual Report', pension.annualReport],
      ];

      const expectedVisibleCount = moreInformation.filter(
        ([_, __, val]) => val,
      ).length;

      if (expectedVisibleCount > 0) {
        // Section must exist if any value present
        await expect(
          page.getByRole('heading', { name: 'More information' }),
        ).toBeVisible();

        await expect(
          page.getByTestId('definition-list-sub-text'),
        ).toContainText(moreInformationSubtext);

        for (const [testId, field, expectedValue] of moreInformation) {
          const ddLocator = page.getByTestId(`dd-${testId}`);
          //checks that displayed value and data value are matched
          if (expectedValue) {
            await expect(ddLocator).toBeVisible();
            await expect(page.getByTestId(`dt-${testId}`)).toHaveText(field);
            await expect(ddLocator).toHaveText(expectedValue);
            //test will fail if item is displayed in UI but not in data
          } else {
            await expect(ddLocator).toBeHidden();
          }
        }
        // test will fail if expected data is present but not displayed in the UI
        expect(
          await pensionDetailsPage.verifyExpectedDataIsDisplayedInUi(
            page,
            moreInformation,
            'More information',
          ),
        ).toBe(true);
      }

      await pensionDetailsPage.checkPensionDetailsTabs(
        page,
        'tab-contact-pension-provider',
        'Contact provider',
      );
      expect(page.url()).toContain('/pension-details/contact-pension-provider');
      await commonHelpers.clickLink(page, 'Back');
      await pendingPensionsPage.pageLoads(page);
    }
  });
});
