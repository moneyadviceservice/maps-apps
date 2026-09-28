import { expect, test } from '@playwright/test';

import { guidanceData } from '../../data/guidance-data';
import {
  housingScenariosMortgage,
  housingScenariosNone,
  housingScenariosPrivateLandlord,
  housingScenariosSocialHousing,
} from '../../data/scenario-data';
import { RetirementGuidancePage } from '../../pages/retirement-guidance.page';

/**
 * @tests User Story 50906: Get Retirement Guidance - Results – Variable Guidance (Housing)
 * @test Test Case 54519: 50906 AC1 Test Case 1: Less than 10 years - State Pension only - Rent – Private Landlord
 * @test Test Case 54520: 50906 AC1 Test Case 2: Less than 10 years - Defined Benefit only - Rent – Private Landlord
 * @test Test Case 54521: 50906 AC1 Test Case 3: Less than 10 years - Defined Benefit + Other Pension(s) - Rent – Private Landlord
 * @test Test Case 54522: 50906 AC1 Test Case 4: Less than 10 years - Non-State Pension and Non-Defined Benefit - Rent – Private Landlord
 * @test Test Case 54523: 50906 AC1 Test Case 5: Less than 10 years - Not sure - Rent – Private Landlord
 * @test Test Case 54524: 50906 AC1 Test Case 6: Less than 10 years - Combination excluding Defined Benefit - Rent – Private Landlord
 * @test Test Case 54525: 50906 AC1 Test Case 7: Less than 10 years - State Pension only - Rent – Social Housing
 * @test Test Case 54526: 50906 AC1 Test Case 8: Less than 10 years - Defined Benefit only - Rent – Social Housing
 * @test Test Case 54527: 50906 AC1 Test Case 9: Less than 10 years - Defined Benefit + Other Pension(s) - Rent – Social Housing
 * @test Test Case 54528: 50906 AC1 Test Case 10: Less than 10 years - Non-State Pension and Non-Defined Benefit - Rent – Social Housing
 * @test Test Case 54529: 50906 AC1 Test Case 11: Less than 10 years - Not sure - Rent – Social Housing
 * @test Test Case 54531: 50906 AC1 Test Case 12: Less than 10 years - Combination excluding Defined Benefit - Rent – Social Housing
 * @test Test Case 54532: 50906 AC1 Test Case 13: Less than 10 years - State Pension only - Mortgage
 * @test Test Case 54533: 50906 AC1 Test Case 14: Less than 10 years - Any pension except State Pension - Mortgage
 * @test Test Case 54534: 50906 AC1 Test Case 15: Less than 10 years - Not sure - Mortgage
 * @test Test Case 54535: 50906 AC1 Test Case 16: Less than 10 years - Combination of pension types - Mortgage
 * @test Test Case 54536: 50906 AC1 Test Case 17: Less than 10 years - State Pension only - None / Other
 * @test Test Case 54538: 50906 AC1 Test Case 18: Less than 10 years - Any pension except State Pension - None / Other
 * @test Test Case 54541: 50906 AC1 Test Case 19: Less than 10 years - Not sure - None / Other
 * @test Test Case 54542: 50906 AC1 Test Case 20: Less than 10 years - Combination of pension types - None / Other
 *
 * @test Test Case 54544: 50906 AC2 Test Case 1: More than 10 years - State Pension only - Rent – Private Landlord
 * @test Test Case 54545: 50906 AC2 Test Case 2: More than 10 years - Any pension except State Pension - Rent – Private Landlord
 * @test Test Case 54546: 50906 AC2 Test Case 3: More than 10 years - Not sure - Rent – Private Landlord
 * @test Test Case 54548: 50906 AC2 Test Case 4: More than 10 years - Combination of pension types - Rent – Private Landlord
 * @test Test Case 54549: 50906 AC2 Test Case 5: More than 10 years - Any pension type - Rent – Social Housing
 * @test Test Case 54550: 50906 AC2 Test Case 6: More than 10 years - Not sure - Rent – Social Housing
 * @test Test Case 54551: 50906 AC2 Test Case 7: More than 10 years - Combination of pension types - Rent – Social Housing
 * @test Test Case 54552: 50906 AC2 Test Case 8: More than 10 years - Any pension type - Mortgage
 * @test Test Case 54553: 50906 AC2 Test Case 9: More than 10 years - Not sure - Mortgage
 * @test Test Case 54554: 50906 AC2 Test Case 10: More than 10 years - Combination of pension types - Mortgage
 * @test Test Case 54555: 50906 AC2 Test Case 11: More than 10 years - State Pension only - None / Other
 * @test Test Case 54556: 50906 AC2 Test Case 12: More than 10 years - Any pension except State Pension - None / Other
 * @test Test Case 54557: 50906 AC2 Test Case 13: More than 10 years - Not sure - None / Other
 *
 * @test Test Case 54568: 50906 AC3 Test Case 1: Already Retired - State Pension only - Rent – Private Landlord
 * @test Test Case 54570: 50906 AC3 Test Case 2: Already Retired - Defined Benefit only - Rent – Private Landlord
 * @test Test Case 54574: 50906 AC3 Test Case 3: Already Retired - Defined Benefit + Other Pension(s) - Rent – Private Landlord
 * @test Test Case 54578: 50906 AC3 Test Case 3: Already Retired - Non-State Pension and Non-Defined Benefit - Rent – Private Landlord
 * @test Test Case 54580: 50906 AC3 Test Case 4: Already Retired - Not sure - Rent – Private Landlord
 * @test Test Case 54583: 50906 AC3 Test Case 5: Already Retired - Combination excluding Defined Benefit - Rent – Private Landlord
 * @test Test Case 54585: 50906 AC3 Test Case 6: Already Retired - State Pension only - Rent – Social Housing
 * @test Test Case 54591: 50906 AC3 Test Case 7: Already Retired - Defined Benefit only - Rent – Social Housing
 * @test Test Case 54592: 50906 AC3 Test Case 8: Already Retired - Defined Benefit + Other Pension(s) - Rent – Social Housing
 * @test Test Case 54594: 50906 AC3 Test Case 9: Already Retired - Non-State Pension and Non-Defined Benefit - Rent – Social Housing
 * @test Test Case 54595: 50906 AC3 Test Case 10: Already Retired - Not sure - Rent – Social Housing
 * @test Test Case 54608: 50906 AC3 Test Case 11: Already Retired - Combination excluding Defined Benefit - Rent – Social Housing
 * @test Test Case 54609: 50906 AC3 Test Case 12: Already Retired - State Pension only - Mortgage
 * @test Test Case 54610: 50906 AC3 Test Case 13: Already Retired - Any pension except State Pension - Mortgage
 * @test Test Case 54611: 50906 AC3 Test Case 14: Already Retired - Any pension except State Pension - None / Other
 * @test Test Case 54612: 50906 AC3 Test Case 15: Already Retired - State Pension Only - None / Other
 *
 * @test User Story 56370: GRG - implement CY - variable guidance (housing)
 * @test Test Case 57427: 56370 AC11, AC20 Test Case 11 : Verify CY & EN text for (housing) Package 14b
 * @test Test Case 57428: 56370 AC12, AC21 Test Case 12 : Verify CY & EN text for (housing) Package 15
 * @test Test Case 57430: 56370 AC14, AC22 Test Case 14 : Verify CY & EN text for (housing) Package 16
 * @test Test Case 57431: 56370 AC15, AC23 Test Case 15 : Verify CY & EN text for (housing) Package 16a
 * @test Test Case 57420: 56370 AC4, AC17 Test Case 4 : Verify CY & EN text for (housing) Package 10a
 * @test Test Case 57425: 56370 AC9, AC18, AC19 Test Case 9 : Verify CY & EN text for (housing) Package 14
 */

test.describe('Variable guidance - HOUSING', () => {
  test('Housing option "Rent - private landlord" displays the correct guidance package', async ({
    page,
  }) => {
    const retirementGuidance = new RetirementGuidancePage(page);

    for (const scenario of housingScenariosPrivateLandlord) {
      await test.step(`Retirement "${scenario.retirement}" & pension "${scenario.pension}" displays ${scenario.expected}`, async () => {
        await retirementGuidance.openHousingResult({
          retirement: scenario.retirement,
          pension: scenario.pension,
          housing: 'private-landlord',
        });
        const { expected, guidancePackage } =
          retirementGuidance.getExpectedGuidance(scenario.expected);

        // assert package visible
        await expect(guidancePackage.container).toBeVisible();
        await expect(guidancePackage.heading).toContainText(expected.heading);

        // accordion is closed by default, open accordion, assert accordion open
        await expect(guidancePackage.container).not.toHaveAttribute('open', '');
        await guidancePackage.heading.click();
        await expect(guidancePackage.container).toHaveAttribute('open', '');

        // assert package content
        await expect(guidancePackage.content).toContainText(expected.content);

        // assert all link text and url are correct and open in new tab
        for (let index = 0; index < expected.links.length; index++) {
          const expectedLink = expected.links[index];
          const link = guidancePackage.links.nth(index);
          await expect(link).toContainText(expectedLink.text);
          const newTab = await retirementGuidance.clickGuidanceLink(link);
          await expect(newTab).toHaveURL(expectedLink.url);
          await newTab.close();
        }

        // close accordion
        await guidancePackage.heading.click();
        await expect(guidancePackage.container).not.toHaveAttribute('open', '');
      });
    }
  });

  test('Housing option "Rent - social housing" displays the correct guidance package', async ({
    page,
  }) => {
    const retirementGuidance = new RetirementGuidancePage(page);

    for (const scenario of housingScenariosSocialHousing) {
      await test.step(`Retirement "${scenario.retirement}" & pension "${scenario.pension}" displays ${scenario.expected}`, async () => {
        await retirementGuidance.openHousingResult({
          retirement: scenario.retirement,
          pension: scenario.pension,
          housing: 'social-housing',
        });
        const { expected, guidancePackage } =
          retirementGuidance.getExpectedGuidance(scenario.expected);

        // assert package visible
        await expect(guidancePackage.container).toBeVisible();
        await expect(guidancePackage.heading).toContainText(expected.heading);

        // accordion is closed by default, open accordion, assert accordion open
        await expect(guidancePackage.container).not.toHaveAttribute('open', '');
        await guidancePackage.heading.click();
        await expect(guidancePackage.container).toHaveAttribute('open', '');

        // assert package content
        await expect(guidancePackage.content).toContainText(expected.content);

        // assert all link text and url are correct and open in new tab
        for (let index = 0; index < expected.links.length; index++) {
          const expectedLink = expected.links[index];
          const link = guidancePackage.links.nth(index);
          await expect(link).toContainText(expectedLink.text);
          const newTab = await retirementGuidance.clickGuidanceLink(link);
          await expect(newTab).toHaveURL(expectedLink.url);
          await newTab.close();
        }

        // close accordion
        await guidancePackage.heading.click();
        await expect(guidancePackage.container).not.toHaveAttribute('open', '');
      });
    }
  });

  test('Housing option "Mortgage" displays the correct guidance package', async ({
    page,
  }) => {
    const retirementGuidance = new RetirementGuidancePage(page);

    for (const scenario of housingScenariosMortgage) {
      await test.step(`Retirement "${scenario.retirement}" & pension "${scenario.pension}" displays ${scenario.expected}`, async () => {
        await retirementGuidance.openHousingResult({
          retirement: scenario.retirement,
          pension: scenario.pension,
          housing: 'mortgage',
        });
        const { expected, guidancePackage } =
          retirementGuidance.getExpectedGuidance(scenario.expected);

        // assert package visible
        await expect(guidancePackage.container).toBeVisible();
        await expect(guidancePackage.heading).toContainText(expected.heading);

        // accordion is closed by default, open accordion, assert accordion open
        await expect(guidancePackage.container).not.toHaveAttribute('open', '');
        await guidancePackage.heading.click();
        await expect(guidancePackage.container).toHaveAttribute('open', '');

        // assert package content
        await expect(guidancePackage.content).toContainText(expected.content);
        // assert all link text and url are correct and open in new tab
        for (let index = 0; index < expected.links.length; index++) {
          const expectedLink = expected.links[index];
          const link = guidancePackage.links.nth(index);
          await expect(link).toContainText(expectedLink.text);
          const newTab = await retirementGuidance.clickGuidanceLink(link);
          await expect(newTab).toHaveURL(expectedLink.url);
          await newTab.close();
        }

        // close accordion
        await guidancePackage.heading.click();
        await expect(guidancePackage.container).not.toHaveAttribute('open', '');
      });
    }
  });

  test('Housing option "None" displays the correct guidance package', async ({
    page,
  }) => {
    const retirementGuidance = new RetirementGuidancePage(page);

    for (const scenario of housingScenariosNone) {
      await test.step(`Retirement "${scenario.retirement}" & pension "${scenario.pension}" displays ${scenario.expected}`, async () => {
        await retirementGuidance.openHousingResult({
          retirement: scenario.retirement,
          pension: scenario.pension,
          housing: 'none',
        });
        const { expected, guidancePackage } =
          retirementGuidance.getExpectedGuidance(scenario.expected);

        // assert package visible
        await expect(guidancePackage.container).toBeVisible();
        await expect(guidancePackage.heading).toContainText(expected.heading);

        // accordion is closed by default, open accordion, assert accordion open
        await expect(guidancePackage.container).not.toHaveAttribute('open', '');
        await guidancePackage.heading.click();
        await expect(guidancePackage.container).toHaveAttribute('open', '');

        // assert package content
        await expect(guidancePackage.content).toContainText(expected.content);

        // assert all link text and url are correct and open in new tab
        for (let index = 0; index < expected.links.length; index++) {
          const expectedLink = expected.links[index];
          const link = guidancePackage.links.nth(index);
          await expect(link).toContainText(expectedLink.text);
          const newTab = await retirementGuidance.clickGuidanceLink(link);
          await expect(newTab).toHaveURL(expectedLink.url);
          await newTab.close();
        }

        // close accordion
        await guidancePackage.heading.click();
        await expect(guidancePackage.container).not.toHaveAttribute('open', '');
      });
    }
  });
});
