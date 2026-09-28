import { expect, test } from '@playwright/test';

import { guidanceData } from '../../data/guidance-data';
import {
  consolidationGuidanceScenarios,
  consolidationNoGuidanceScenarios,
  consolidationNotSurePensionScenarios,
} from '../../data/scenario-data';
import { RetirementGuidancePage } from '../../pages/retirement-guidance.page';

/**
 * @test User Story 57135: Update GRG Logic Q6 - Consolidation
 * @test Test Case 57596: 57135 AC1 Test Case 1 : Verify logic for consolidation guidance Q6 - State Pension only
 * @test Test Case 57605: 57135 AC10, AC12 Test Case 7 : Verify logic for consolidation guidance Q6 - Combination incl 'DB' and DC Pension Type
 * @test Test Case 57606: 57135 AC11, AC12 Test Case 8 : Verify logic for consolidation guidance Q6 - Combination (excl DB) Pension Type
 * @test Test Case 57598: 57135 AC2, AC3 Test Case 2 : Verify logic for consolidation guidance Q6 - DB Pension Type only
 * @test Test Case 57600: 57135 AC4, AC5 Test Case 3 : Verify logic for consolidation guidance Q6 - DC Pension Type only
 * @test Test Case 57602: 57135 AC6, AC7 Test Case 4 : Verify logic for consolidation guidance Q6 - 'Other' Pension Type only
 * @test Test Case 57603: 57135 AC8 Test Case 5 : Verify logic for consolidation guidance Q6 - 'Not Sure' Pension Type
 * @test Test Case 57604: 57135 AC9, AC12 Test Case 6 : Verify logic for consolidation guidance Q6 - Combination incl 'DB' (no DC) Pension Type
 *
 */
test.describe('Variable guidance - CONSOLIDATION', () => {
  test('Consolidation option "Yes" / "Not sure" displays the correct guidance package', async ({
    page,
  }) => {
    const retirementGuidance = new RetirementGuidancePage(page);

    for (const consolidation of ['yes', 'not-sure'] as const) {
      for (const scenario of consolidationGuidanceScenarios) {
        await test.step(`Consolidation "${consolidation}" & pension "${scenario.pension}" displays ${scenario.expected}`, async () => {
          await retirementGuidance.openConsolidationResult({
            consolidation,
            pension: scenario.pension,
          });

          const { expected, guidancePackage } =
            retirementGuidance.getExpectedGuidance(scenario.expected);

          // assert package visible
          await expect(guidancePackage.container).toBeVisible();
          await expect(guidancePackage.heading).toContainText(expected.heading);

          // accordion is closed by default, open accordion, assert accordion open
          await expect(guidancePackage.container).not.toHaveAttribute(
            'open',
            '',
          );
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
          await expect(guidancePackage.container).not.toHaveAttribute(
            'open',
            '',
          );
        });
      }
    }
  });

  test('Not sure pension type displays guidance package GP22', async ({
    page,
  }) => {
    const retirementGuidance = new RetirementGuidancePage(page);

    for (const scenario of consolidationNotSurePensionScenarios) {
      await test.step(`Consolidation "${scenario.consolidation}" & pension "${scenario.pension}" displays ${scenario.expected}`, async () => {
        await retirementGuidance.openConsolidationResult({
          consolidation: scenario.consolidation,
          pension: scenario.pension,
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

  test('No consolidation guidance is displayed for applicable scenarios', async ({
    page,
  }) => {
    const retirementGuidance = new RetirementGuidancePage(page);

    for (const scenario of consolidationNoGuidanceScenarios) {
      await test.step(`Consolidation "${scenario.consolidation}" & pension "${scenario.pension}" displays no consolidation guidance`, async () => {
        await retirementGuidance.openConsolidationResult({
          consolidation: scenario.consolidation,
          pension: scenario.pension,
        });

        const consolidationGuidancePackages = [
          'GP01',
          'GP01a',
          'GP01c',
        ] as const;

        for (const packageName of consolidationGuidancePackages) {
          await expect(
            retirementGuidance.guidancePackage(packageName).container,
          ).toBeHidden();
        }
      });
    }
  });
});
