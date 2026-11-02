import { expect, test } from '@playwright/test';

import {
  consolidationNotSurePensionScenarios,
  pensionScenarios,
} from '../data/scenario-data';
import { RetirementGuidancePage } from '../pages/retirement-guidance.page';

/**
 * @tests User Story 58417
 * @test AC01 Unknown pension type and Q6 Yes or Not sure shows guidance package 01
 * @test AC02 Unknown pension type and Q6 No shows no guidance
 */
test.describe('Retirement Guidance - pension consolidation', () => {
  for (const scenario of consolidationNotSurePensionScenarios) {
    test(`AC01 shows GP01 when Q6 is ${scenario.consolidation}`, async ({
      page,
    }) => {
      const retirementGuidance = new RetirementGuidancePage(page);
      await retirementGuidance.openConsolidationResult(scenario);

      const { guidancePackage } = retirementGuidance.getExpectedGuidance(
        scenario.expected,
      );
      await expect(guidancePackage.container).toBeVisible();
    });
  }

  test('AC02 shows no guidance when Q6 is No', async ({ page }) => {
    const retirementGuidance = new RetirementGuidancePage(page);
    await retirementGuidance.openConsolidationResult({
      consolidation: 'no',
      pension: pensionScenarios.notSure,
    });

    for (const packageName of ['GP01', 'GP01a', 'GP01c'] as const) {
      await expect(
        retirementGuidance.guidancePackage(packageName).container,
      ).toBeHidden();
    }
  });
});