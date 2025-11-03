import { expect, test } from '@playwright/test';

import { ENV } from '../data/environmentVariables';
import * as pensionClassificationScenarios from '../data/pensionClassificationScenarios';
import homePage from '../pages/HomePage';
import { netlifyPasswordPage } from '../pages/NetlifyPasswordPage';
import pensionsFoundPage from '../pages/PensionsFoundPage';
import commonHelpers from '../utils/commonHelpers';
import { PensionClassificationUtils } from '../utils/pensionClassification';
import { ClassifiablePension } from '../utils/pensionClassification/types';

// The test expects each scenario to have one pension per unavailable ERI code.
const expectedEriCodes = [
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

/**
 * Checks whether a composer test scenario contains pensions with all expected ERI codes.
 *
 * @param {Array<ClassifiablePension>} scenarioData - The list of pensions to check.
 * Each pension is expected to have `eriDetails.unavailableReason` set to an ERI code.
 *
 * @example
 * const result = doesScenarioHaveAllEriCodes(scenarioData);
 * if (!result) {
 *   console.warn('Some ERI codes are missing from the scenario');
 * }
 */
const doesScenarioHaveAllEriCodes = (
  scenarioData: Array<ClassifiablePension>,
): boolean =>
  expectedEriCodes.every((eriCode) =>
    scenarioData.some(
      (pension) => pension.eriDetails.unavailableReason === eriCode,
    ),
  );

/**
 * Checks if a pension has a valid AP code, based on an input, also considers 'None'
 */
const isApCodeValid = (apCode: string, pension: ClassifiablePension) => {
  if (!apCode || apCode === 'None') {
    return (
      !pension.apDetails.unavailableReason &&
      !Number.isNaN(Number(pension.apDetails.annualAmount))
    );
  }
  return pension.apDetails.unavailableReason === apCode;
};

/**
 * Checks whether all pensions in the scenario have the specified AP code and pension type.
 *
 * @param {Array<ClassifiablePension>} scenarioData - The list of pensions to validate.
 * Each pension is expected to have `apDetails.unavailableReason` and `pensionType` properties.
 * @param {string} expectedApCode - The AP code that all pensions should have in `apDetails.unavailableReason`.
 * @param {string} expectedPensionType - The pension type that all pensions should have.
 *
 * @example
 * const result = doesScenarioMatchApCodeAndType(scenarioData, 'ABC', 'DB');
 * if (!result) {
 *   console.error('Scenario contains pensions that do not match the expected AP code or type.');
 * }
 */
const doesScenarioMatchApCodeAndType = (
  scenarioData: ClassifiablePension[],
  expectedApCode: string,
  expectedPensionType: string,
): boolean =>
  scenarioData.every(
    (pension) =>
      isApCodeValid(expectedApCode, pension) &&
      pension.pensionType === expectedPensionType,
  );

/**
 * All the scenarios follow the naming pattern of:
 *
 *  `${pensionType}APUnavailableCode${code}`
 *
 * This generates a list of all of them based on a list of pension types and unavailable codes.
 */
const generateScenarioNameList = () => {
  const pensionTypes = ['DC', 'DB'];
  const apUnavailableCodes = [
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

  // TODO: Not a perfect solution regarding getting the test data, but this is to get it over the line.
  return pensionTypes.flatMap((pensionType) =>
    apUnavailableCodes.map((code) => ({
      scenarioName: `${pensionType}APUnavailableCode${code}`,
      scenarioData: pensionClassificationScenarios[
        `${pensionType}APUnavailableCode${code}`
      ] as ClassifiablePension[],
      expectedPensionType: pensionType,
      expectedApCode: code,
    })),
  );
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
 *
 * @scenario Scenario naming schema is the pension types and the AP unavailable code.
 *
 *           i.e DBnoAPUnavailableCode = All DB pensions, with valid AP illustration.
 *                                       Each pension has different ERI unavailable codes.
 *
 *           i.e DCAPUnavailableCodeWU = All DC pensions, with AP illustration having unavailable code WU.
 *                                       Each pension has different ERI unavailable codes.
 */
test.describe('Pension Classification', () => {
  const testScenarios = [
    {
      scenarioName: 'DBnoAPUnavailableCode',
      scenarioData:
        pensionClassificationScenarios.DBnoAPUnavailableCode as ClassifiablePension[],
      expectedPensionType: 'DB',
      expectedApCode: 'None',
    },
    {
      scenarioName: 'DCnoAPUnavailableCode',
      scenarioData:
        pensionClassificationScenarios.DCnoAPUnavailableCode as ClassifiablePension[],
      expectedPensionType: 'DC',
      expectedApCode: 'None',
    },
    ...generateScenarioNameList(),
  ];

  for (const scenario of testScenarios) {
    test(`All ${scenario.scenarioName} pensions are in the correct channel (${scenario.expectedPensionType})`, async ({
      page,
      baseURL,
    }) => {
      const {
        scenarioName,
        expectedPensionType,
        expectedApCode,
        scenarioData,
      } = scenario;

      // Assert data scenario is correct.
      // const scenarioData = await composerDataFetcher.dev.fetchScenario(
      //   scenarioName,
      // );

      // Check the scenario provided is as expected.
      const hasAllEriCodes = doesScenarioHaveAllEriCodes(scenarioData);
      const scenarioMatchesExpectedType = doesScenarioMatchApCodeAndType(
        scenarioData,
        expectedApCode,
        expectedPensionType,
      );

      const allEriCodesString = expectedEriCodes.join(', ');
      const missingEriError = `Expected all "${scenarioName}" pensions to include all ERI error codes, expected unavailable codes: ${allEriCodesString}`;
      expect(hasAllEriCodes, missingEriError).toBeTruthy();

      const dataWrongError = `Expected all "${scenarioName}" pensions to have AP code: "${expectedApCode}" and pensionType: "${expectedPensionType}"`;
      expect(scenarioMatchesExpectedType, dataWrongError).toBeTruthy();

      // Check the frontend.
      await page.goto('/');

      if (baseURL.includes('netlify.app')) {
        await netlifyPasswordPage.enterPassword(page, ENV.NETLIFY_PASSWORD);
        await netlifyPasswordPage.clickSubmit(page);
      }

      await homePage.checkHomePageLoads(page);
      await homePage.assertCookiesCleared(page);
      await homePage.clickStart(page);
      await commonHelpers.navigatetoPensionsFoundPage(page, scenarioName);

      for (const pension of scenarioData) {
        const pensionChannel = await pensionsFoundPage.getPensionChannelByName(
          page,
          pension.schemeName,
        );
        const expectedChannel = PensionClassificationUtils.getChannel(pension);
        expect(
          pensionChannel,
          `Asserting "${pension.schemeName}" shows in the "${expectedChannel}" channel.`,
        ).toBe(expectedChannel);
      }
    });
  }
});
