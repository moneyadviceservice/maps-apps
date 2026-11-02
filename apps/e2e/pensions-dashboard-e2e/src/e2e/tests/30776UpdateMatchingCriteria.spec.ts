import { expect, test } from '@maps/playwright';

import { allNewTestCases } from '../data/scenarioDetails';

test.describe(
  'DC pensions, Unsupported pensions, Match type POSS, SYS & NEW',
  { tag: ['@nocrossbrowser'] },
  () => {
    /**
     * As this test file uses the same scenario for all 3 tests, save the session and re-apply it.
     */
    test.beforeEach(async ({ commonSessions }) => {
      const scenarioName = allNewTestCases.option;
      await commonSessions.navigateToPensionsFoundPage(scenarioName);
    });

    test('14 DEFN DC pensions, Match type POSS, SYS & NEW are displayed on Pensions found page', async ({
      page,
      pensionsFoundPage,
    }) => {
      await pensionsFoundPage.assertPensionsFound(
        page,
        allNewTestCases.pensions,
      );
      await pensionsFoundPage.assertInvalidPensionsNotVisible(
        allNewTestCases.pensions,
      );
      const channelMapping: Record<string, string> = {
        SchemeNameAVC: 'callout-positive',
        'Nest Pension': 'callout-positive',
        'TestDB:Visa': 'callout-positive',
        'TestDCHA:Visa': 'callout-positive',
        'TestDCHP:Visa': 'callout-positive',
        'TestPPF:Visa': 'callout-positive',
        'TestWU:Visa': 'callout-positive',
        'TestSML:Visa': 'callout-positive',
        XXNewMatch: 'callout-positive',
        'TestANO:Visa': 'callout-positive',
        'TestDBC:Visa': 'callout-positive',
        'TestDCC:Visa': 'callout-positive',
        'TestNET:Visa': 'callout-positive',
        'TestNEW:Visa': 'callout-positive',
        'TestTRN:Visa': 'callout-positive',
        SysError: 'callout-positive',
        'TestMEM:Visa': 'callout-negative',
        PossMatch: 'callout-negative',
      };
      for (const schemeName of Object.keys(channelMapping)) {
        const expectedChannel = channelMapping[schemeName];
        await expect(
          page.locator(
            `[data-testid="${expectedChannel}"] li:has-text("${schemeName}")`,
          ),
        ).toBeVisible();
      }
    });

    test('7 DEFN DC pensions in green channel displayed on Pensions breakdown page', async ({
      page,
      pensionsFoundPage,
    }) => {
      await pensionsFoundPage.clickSeeYourPensions();
      const estimatedIncomeMapping: any = {
        SchemeNameAVC: 'confirmed-pensions',
        'Nest Pension': 'confirmed-pensions',
        'TestDB:Visa': 'confirmed-pensions',
        'TestDCHA:Visa': 'confirmed-pensions-no-income',
        'TestDCHP:Visa': 'confirmed-pensions-no-income',
        'TestPPF:Visa': 'confirmed-pensions-no-income',
        'TestWU:Visa': 'confirmed-pensions-no-income',
        'TestSML:Visa': 'confirmed-pensions-no-income',
      };

      for (const schemeName of Object.keys(estimatedIncomeMapping)) {
        const estimatedIncomeSection = estimatedIncomeMapping[schemeName];
        await expect(
          page.locator(
            `[data-testid="${estimatedIncomeSection}"] li:has-text("${schemeName}")`,
          ),
        ).toBeVisible();
      }
    });

    test('Pending pension cards do not display Expected income at retirement: section on pending pensions page', async ({
      page,
      pensionsFoundPage,
    }) => {
      await pensionsFoundPage.clickSeeYourPensions();
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
        await expect(
          page
            .locator(
              `[data-testid="information-callout"]:has-text("${schemeName}")`,
            )
            .locator(`[data-testid="pension-card-expected-income"]`),
        ).toBeHidden();
      }
    });
  },
);
