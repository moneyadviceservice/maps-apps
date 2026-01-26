import { expect, test } from '@maps/playwright';

import {
  simpleDetailsPageAllData,
  simpleDetailsPageEmptyFields,
} from '../data/scenarioDetails';
import pensionDetailsPage from '../pages/PensionDetailsPage';
import pensionBreakdownPage from '../pages/PensionsBreakdownPage';
import pensionsFoundPage from '../pages/PensionsFoundPage';
import commonHelpers from '../utils/commonHelpers';

test.describe('Pension Details page - Your Pensions', () => {
  test.beforeEach(async ({ page }) => {
    await commonHelpers.navigateToEmulator(page);
  });

  test('Expected content is displayed on pensions details page - About this pension tab, Confirmed pensions', async ({
    page,
  }) => {
    await commonHelpers.navigatetoPensionsFoundPage(
      page,
      simpleDetailsPageAllData.option,
    );
    await pensionsFoundPage.clickSeeYourPensions(page);

    const schemeNames = ['Willow Pension Scheme', 'Oak Pension Scheme'];
    for (const schemeName of schemeNames) {
      const pension = simpleDetailsPageAllData.pensions.find(
        (p) => p.schemeName === schemeName,
      );
      await pensionBreakdownPage.viewDetailsOfPension(page, schemeName);
      await pensionDetailsPage.assertHeading(page, schemeName);
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

      // Navigate to About this pension tab
      await pensionDetailsPage.checkPensionDetailsTabs(
        page,
        'tab-about-this-pension',
        'About this pension',
      );
      expect(page.url()).toContain('/pension-details/about-this-pension');
      const pensionOriginToolTipText =
        'The pension origin is where this pension scheme comes from, such as a current or former job, a transfer, or an annuity you’ve already bought.';
      const pensionOriginToolTip = `Show more information ${pensionOriginToolTipText}Close`;
      const pensionOriginWithToolTip = `Pension origin ${pensionOriginToolTip}`;

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
        ['pension-origin', pensionOriginWithToolTip, pension.pensionOrigin],
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
      const moreInformationSubtext =
        'Find out more about this pension scheme, including the charges and how it’s managed.';
      await expect(
        page.getByRole('heading', { name: 'More information' }),
      ).toBeVisible();
      await expect(page.getByTestId('definition-list-sub-text')).toContainText(
        moreInformationSubtext,
      );
      const cAndCToolTipText =
        'Costs and charges are paid to your pension provider to cover the costs of managing your money. They’re usually paid automatically out of your pension scheme.';
      const cAndCToolTip = `Show more information ${cAndCToolTipText}Close`;
      const costsAndChargesWithToolTip = `Costs and charges ${cAndCToolTip}`;
      const moreInformation: [string, string, string | undefined][] = [
        ['more-info-C_AND_C', costsAndChargesWithToolTip, pension.costCharges],
        ['more-info-SIP', 'Investment principles', pension.statementInvestment],
        [
          'more-info-IMP',
          'Implementation statement',
          pension.implementationStatement,
        ],
        ['more-info-ANR', 'Annual Report', pension.annualReport],
      ];

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

      await commonHelpers.clickLink(page, 'Back');
      await pensionBreakdownPage.pageLoads(page);
    }
  });

  test('Empty values and fields are not displayed on pensions details page - About this pension tab, Confirmed pensions', async ({
    page,
  }) => {
    await commonHelpers.navigatetoPensionsFoundPage(
      page,
      simpleDetailsPageEmptyFields.option,
    );
    await pensionsFoundPage.clickSeeYourPensions(page);

    const schemeNames = [
      'Empty Willow Pension Scheme',
      'Empty Oak Pension Scheme',
    ];
    for (const schemeName of schemeNames) {
      const pension = simpleDetailsPageEmptyFields.pensions.find(
        (p) => p.schemeName === schemeName,
      );
      await pensionBreakdownPage.viewDetailsOfPension(page, schemeName);
      await pensionDetailsPage.assertHeading(page, schemeName);
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

      // Navigate to About this pension tab
      await pensionDetailsPage.checkPensionDetailsTabs(
        page,
        'tab-about-this-pension',
        'About this pension',
      );
      expect(page.url()).toContain('/pension-details/about-this-pension');

      const aboutThisPension: [string, string, string | undefined][] = [
        ['provider', 'Pension provider', pension.pensionAdministrator],
        ['contact-reference', 'Plan reference number', pension.referenceNumber],
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
      await expect(
        page.getByRole('heading', { name: 'More information' }),
      ).toBeHidden();

      await commonHelpers.clickLink(page, 'Back');
      await pensionBreakdownPage.pageLoads(page);
    }
  });
});
