import { expect, test } from '@playwright/test';

import { guidanceData } from '../../data/guidance-data';
import {
  overseasGuidanceScenarios,
  overseasNoGuidanceScenarios,
} from '../../data/scenario-data';
import { RetirementGuidancePage } from '../../pages/retirement-guidance.page';

/**
 * @tests User Story 50892: Get Retirement Guidance - Results – Variable Guidance (Overseas)
 * @tests Test Case 52818: 50892 AC1 Test Case 1 : Verify Mappings Package 08a State Pension only
 * @tests Test Case 52819: 50892 AC2 Test Case 2 : Verify Mapping Package 08 Multiple Pensions
 * @tests Test Case 52820: 50892 AC3 Test Case 3 : Verify Mapping Package 08 Combination of pension types without State Pension
 * @tests Test Case 52825: 50892 AC4 Test Case 4: Verify Mapping Package 08b Combination includes State Pension
 * @tests Test Case 52821: 50892 AC5 Test Case 5 : Verify Mapping Package 08b Pension type unknown
 * @tests Test Case 52826: 50892 AC6 Test Case 6 : Verify Mapping Package 08b Combination includes State Pension
 * @tests Test Case 52869: 50892 AC7 Test Case 7 : Verify Mapping Package Do not retire outside UK + Any pension type
 * @tests Test Case 52871: 50892 AC8 Test Case 8 : Verify Mapping Package Unsure About Retiring Outside UK with Multiple Pensions
 * @tests Test Case 52870: 50892 AC9 Test Case 9 : Verify Mapping Package Unsure About Retiring Outside UK with State Pension Only
 * @tests Test Case 52872: 50892 AC10 Test Case 10 : Verify Mapping Package Unsure About Retiring Outside UK with Multiple Pensions excluding State Pension
 * @tests Test Case 52873: 50892 AC11 Test Case 11 : Verify Mapping Package Unsure About Retiring Outside UK and Unsure of Pension Type
 * @tests User Story 56369: GRG - implement CY - Variable guidance (overseas)
 * @tests Test Case 57260: 56369 AC4, AC5 Test Case 4 : Verify EN text updates for variable guidance package 8b (overseas)
 *
 */

test.describe('Variable guidance - OVERSEAS', () => {
  test('Overseas option "Yes" displays the correct guidance package', async ({
    page,
  }) => {
    const retirementGuidance = new RetirementGuidancePage(page);

    for (const scenario of overseasGuidanceScenarios) {
      await test.step(`Pension "${scenario.pension.join(' + ')}" displays ${
        scenario.expected
      }`, async () => {
        await retirementGuidance.openOverseasResult({
          pension: scenario.pension,
          overseas: 'yes',
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

  test('Overseas option "Not sure" displays the correct guidance package', async ({
    page,
  }) => {
    const retirementGuidance = new RetirementGuidancePage(page);

    for (const scenario of overseasGuidanceScenarios) {
      await test.step(`Pension "${scenario.pension.join(' + ')}" displays ${
        scenario.expected
      }`, async () => {
        await retirementGuidance.openOverseasResult({
          pension: scenario.pension,
          overseas: 'not-sure',
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

  test('Overseas option "No" displays no overseas guidance', async ({
    page,
  }) => {
    const retirementGuidance = new RetirementGuidancePage(page);
    const guidancePackage08 = retirementGuidance.guidancePackage('GP08');
    const guidancePackage08a = retirementGuidance.guidancePackage('GP08a');
    const guidancePackage08b = retirementGuidance.guidancePackage('GP08b');

    for (const scenario of overseasNoGuidanceScenarios) {
      await test.step(`Pension "${scenario.pension.join(
        ' + ',
      )}" displays no overseas guidance`, async () => {
        await retirementGuidance.openOverseasResult({
          pension: scenario.pension,
          overseas: 'no',
        });

        await expect(guidancePackage08.container).toBeHidden();
        await expect(guidancePackage08a.container).toBeHidden();
        await expect(guidancePackage08b.container).toBeHidden();
      });
    }
  });
});
