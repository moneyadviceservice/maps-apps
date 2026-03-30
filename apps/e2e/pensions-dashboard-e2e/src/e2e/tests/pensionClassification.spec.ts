import { expect, test } from '@maps/playwright';

import allPossibleClassificationsDB from '../data/pensionClassification/AllPossibleClassifications_DB';
import allPossibleClassificationsDC from '../data/pensionClassification/AllPossibleClassifications_DC';
import homePage from '../pages/HomePage';
import pensionsFoundPage from '../pages/PensionsFoundPage';
import commonHelpers from '../utils/commonHelpers';
import { PensionClassificationUtils } from '../utils/pensionClassification';
import { ClassifiablePension } from '../utils/pensionClassification/types';

const expectedApCodes = [
  'None',
  'ANO',
  'DBC',
  'DCC',
  'MEM',
  'NET',
  'NEW',
  'PPF',
  'TRN',
  'WU',
];
const expectedEriCodes = [
  'None',
  'ANO',
  'DB',
  'DBC',
  'DCC',
  'DCHA',
  'DCHP',
  'MEM',
  'NET',
  'NEW',
  'PPF',
  'TRN',
  'WU',
];

/** Returns an array of pensions that are not found in the test data */
const getMissingPensions = (
  pensionData: ClassifiablePension[],
  benefitType: 'DB' | 'DC',
) => {
  const expectedCombinations = expectedEriCodes.flatMap((eri) =>
    expectedApCodes.map((ap) => ({
      benefitType,
      eriReason: eri,
      apReason: ap,
    })),
  );
  const missingCombinations = expectedCombinations.filter((expected) => {
    return !pensionData.some(
      (rec) =>
        rec.pensionType === benefitType &&
        (rec.eriDetails.unavailableReason || 'None') === expected.eriReason &&
        (rec.apDetails.unavailableReason || 'None') === expected.apReason,
    );
  });
  return missingCombinations;
};

/**
 * @epic 38362 - Pension Classification Service
 *
 * @feature 39170 - FE changes from Pension classification/API splitting
 *
 * @tests 39467 - Update your-pension-search-results page
 *
 * @scenario The strategy is to iterate through every pension classification possibility
 *           and ensure that each one goes into the right channel, using the correct data
 *           is key to this approach, so there is checks includes to ensure the correct data
 *           has been used in the test.
 */
test.describe('Pension Classification', { tag: ['@nocrossbrowser'] }, () => {
  /**
   * Check the test data provided has the required pensions to fulfil the test criteria.
   */
  test.beforeAll(() => {
    const missingPensions = {
      db: getMissingPensions(allPossibleClassificationsDB, 'DB'),
      dc: getMissingPensions(allPossibleClassificationsDC, 'DC'),
    };
    expect(missingPensions.db).toHaveLength(0);
    expect(missingPensions.dc).toHaveLength(0);
  });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await commonHelpers.setCookieConsentAccepted(page);
    await page.reload(); // Reload to apply cookie
    await homePage.checkHomePageLoads(page);
    await homePage.assertCookiesCleared(page);
    await homePage.clickStart(page);
  });

  /** Checks all DB pensions. */
  test('All pension classification scenario pensions are in the correct channel (DB)', async ({
    page,
  }) => {
    const scenarioName = 'AllPossibleClassifications_DB';
    const scenarioData = allPossibleClassificationsDB;

    await commonHelpers.navigatetoPensionsFoundPage(page, scenarioName);
    for (const pension of scenarioData) {
      const channel = await pensionsFoundPage.getPensionChannelByName(
        page,
        pension.schemeName,
      );
      const expectedChannel = PensionClassificationUtils.getChannel(pension);
      expect(channel).toBe(expectedChannel);
    }
  });

  /** Checks all DC pensions. */
  test('All pension classification scenario pensions are in the correct channel (DC)', async ({
    page,
  }) => {
    const scenarioName = 'AllPossibleClassifications_DC';
    const scenarioData = allPossibleClassificationsDC;

    await commonHelpers.navigatetoPensionsFoundPage(page, scenarioName);
    for (const pension of scenarioData) {
      const channel = await pensionsFoundPage.getPensionChannelByName(
        page,
        pension.schemeName,
      );
      const expectedChannel = PensionClassificationUtils.getChannel(pension);
      const assertionMessage = `Expecting pension: "${pension.schemeName}" to have channel of "${expectedChannel}"`;
      expect(channel, assertionMessage).toBe(expectedChannel);
    }
  });
});
