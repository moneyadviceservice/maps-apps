/* eslint-disable playwright/no-focused-test */
import { expect, test } from '@playwright/test';

import { newDetailsPageWarnings } from '../data/scenarioDetails';
import WarningMessages from '../pages/components/WarningMessages';
import loadingPage from '../pages/LoadingPage';
import pensionDetailsPage from '../pages/PensionDetailsPage';
import pensionBreakdownPage from '../pages/PensionsBreakdownPage';
import pensionsFoundPage from '../pages/PensionsFoundPage';
import scenarioSelectionPage from '../pages/ScenarioSelectionPage';
import welcomePage from '../pages/WelcomePage';
import commonHelpers from '../utils/commonHelpers';

/**
 * @tests User Story 36398
 * @scenario The newDetailsPage_Warnings test scenario contains 8 pensions that cover the following scenarios:
 *    - DC Pension with Warning codes PNR, PSO, PEO, SCP (Elite Preservation Trust)
 *    - DB Pension with Warning codes PNR, PSO, PEO, FAS (Guardian Growth Fund)
 *    - DB Pension with Warning codes PNR, PSO, PEO, SCP (Evergreen Ascent Fund)
 *    - DC Pension with no warning codes  (Optimum Retirement Plan)
 *    - DC Pension with Warning codes PNR, PSO, PEO, SCP (Sovereign Retirement)
 *    - DB Pension with Warning codes PNR, PSO, FAS (Compass Retirement Scheme)
 *    - DB Pension with Warning codes FAS (Prosperity Plus Plan)
 *    - DC Pension with Warning codes FAS (Tranquility Pension Scheme)
 *    - DB Pension with Warning Codes ERI: PNR, PSO, FAS, SCP, and AP: FAS, SCP, PNR, PEO (Past Retirement Fund)
 *    - DC Pension with Warning Codes ERI: PNR, PSO, PEO, SCP, and AP: FAS, PNR, PSO, PEO (Past Retirement Fund)
 *
 * @tests Test Case 37483: 36398 [AC1] Test Case 1 - Pension Sharing Order
 * @tests Test Case 37484: 36398 [AC1] Test Case 2 - Pension attachment or earmarking order
 * @tests Test Case 37485: 36398 [AC1] Test Case 3 - Pension retirement date is in the past
 * @tests Test Case 37486: 36398 [AC1] Test Case 4 - Annual allowance tax charge
 * @tests Test Case 37487: 36398 [AC1] Test Case 5 - Financial Assistance Scheme
 * @tests Test Case 37488: 36398 [AC1] Test Case 6 - Zero warnings
 * @tests Test Case 37489: 36398 [AC1] Test Case 7 - Max amount of warnings present on illustration
 * @tests Test Case 38125: 36398 Test Case 8 - Duplicate warning codes across ERI and AP are displayed once only
 */

test.describe('Pension Details page - Summary Tab - Warning message component', () => {
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

  test('Warning messages displayed in Summary tab for DB pensions with 5, 4, 3, & 1 warning messages', async ({
    page,
  }) => {
    const dBschemeNames = [
      'Guardian Growth Fund',
      'Evergreen Ascent Fund',
      'Compass Retirement Scheme',
      'Prosperity Plus Plan',
      'Past Retirement Fund',
    ];
    for (const schemeName of dBschemeNames) {
      const pension = newDetailsPageWarnings.pensions.find(
        (p) => p.schemeName === schemeName,
      );
      await pensionBreakdownPage.viewDetailsOfPension(page, schemeName);
      await pensionDetailsPage.assertHeading(page, schemeName);
      expect(page.url()).toContain('/pension-details/your-pension-summary');

      //plan reference number, Retirement date, information last updated
      console.log('illustration date Data:', pension.dataIllustrationDate);
      expect(
        await pensionDetailsPage.verifyCommonHeaderAndIllustrationDate(
          page,
          pension.referenceNumber,
          pension.payableDateERI,
          pension.dataIllustrationDate,
        ),
      ).toBe(true);

      // View Warning Text
      const pensionWarnings = new WarningMessages(page, pension);
      for (const warning of pensionWarnings.expectedWarnings) {
        const isVisible = await pensionWarnings.isWarningVisible(warning.type);
        if (warning.visible) {
          expect(isVisible).toBe(true);
          expect(
            await pensionWarnings.verifyWarningContent(
              warning.type,
              warning.expectedTitle,
              warning.expectedDescription,
            ),
          ).toBe(true);
        } else {
          expect(isVisible).toBe(false);
        }
      }
      await commonHelpers.clickLink(page, 'Back');
      await pensionBreakdownPage.pageLoads(page);
    }
  });

  test('Warning messages displayed in Summary tab for DC pensions with 5, 4, 1 and 0 warning messages', async ({
    page,
  }) => {
    const dCschemeNames = [
      'Elite Preservation Trust',
      'Future Pension Plan',
      'Optimum Retirement Plan',
      'Sovereign Retirement',
      'Tranquility Pension Scheme',
    ];
    for (const schemeName of dCschemeNames) {
      const pension = newDetailsPageWarnings.pensions.find(
        (p) => p.schemeName === schemeName,
      );
      await pensionBreakdownPage.viewDetailsOfPension(page, schemeName);
      await pensionDetailsPage.assertHeading(page, schemeName);
      expect(page.url()).toContain('/pension-details/your-pension-summary');

      //plan reference number, Retirement date, information last updated
      expect(
        await pensionDetailsPage.verifyCommonHeaderAndIllustrationDate(
          page,
          pension.referenceNumber,
          pension.payableDateERI,
          pension.dataIllustrationDate,
        ),
      ).toBe(true);

      // View Warning Text
      const pensionWarnings = new WarningMessages(page, pension);
      for (const warning of pensionWarnings.expectedWarnings) {
        const isVisible = await pensionWarnings.isWarningVisible(warning.type);
        if (warning.visible) {
          expect(isVisible).toBe(true);
          expect(
            await pensionWarnings.verifyWarningContent(
              warning.type,
              warning.expectedTitle,
              warning.expectedDescription,
            ),
          ).toBe(true);
        } else {
          expect(isVisible).toBe(false);
        }
      }
      await commonHelpers.clickLink(page, 'Back');
      await pensionBreakdownPage.pageLoads(page);
    }
  });
});
