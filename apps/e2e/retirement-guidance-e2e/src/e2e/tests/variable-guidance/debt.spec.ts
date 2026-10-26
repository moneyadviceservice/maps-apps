import { expect, test } from '@playwright/test';

import { guidanceData } from '../../data/guidance-data';
import { RetirementGuidancePage } from '../../pages/retirement-guidance.page';

/**
 * @tests User Story 50726: Get Retirement Guidance - Results – Variable Guidance (Debt)
 * @test Test Case 52423: 50726 AC1 Test Case 1: Verify guidance package 23a is displayed
 * @test Test Case 52425: 50726 AC2 Test Case 1: Verify guidance package 23 is displayed when user selects "No" to Q11
 * @test User Story 56373: GRG - Implement CY - Variable guidance (debt)
 * @test Test Case 57265: 56373 EN copy changes - Test Case 3 - Verify EN changes for Variable guidance (debt)
 */

test.describe('Variable guidance - DEBT', () => {
  const scenarios = [
    {
      debt: 'yes',
      debtAdvice: 'yes',
      expected: 'GP23a',
    },
    {
      debt: 'yes',
      debtAdvice: 'no',
      expected: 'GP23',
    },
  ] as const;

  for (const scenario of scenarios) {
    test(`Options "Debt (${scenario.debt})" & "Debt advice (${scenario.debtAdvice})" display guidance package ${scenario.expected}`, async ({
      page,
    }) => {
      const retirementGuidance = new RetirementGuidancePage(page);

      await retirementGuidance.openDebtResult({
        debt: scenario.debt,
        debtAdvice: scenario.debtAdvice,
      });
      const { expected, guidancePackage } =
        retirementGuidance.getExpectedGuidance(scenario.expected);

      //assert pacakge visible
      await expect(guidancePackage.container).toBeVisible();
      await expect(guidancePackage.heading).toContainText(expected.heading);

      // accordion is closed by default, open accordion, assert accordion open
      await expect(guidancePackage.container).not.toHaveAttribute('open', '');
      await guidancePackage.heading.click();
      await expect(guidancePackage.container).toHaveAttribute('open', '');

      //assert package content
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

  test('Option "no debt" displays no guidance', async ({ page }) => {
    const retirementGuidance = new RetirementGuidancePage(page);
    const guidancePackage23 = retirementGuidance.guidancePackage('GP23');
    const guidancePackage23a = retirementGuidance.guidancePackage('GP23a');
    await retirementGuidance.openDebtResult({
      debt: 'no',
    });
    await expect(guidancePackage23.container).toBeHidden();
    await expect(guidancePackage23a.container).toBeHidden();
  });
});
