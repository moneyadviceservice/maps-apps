import { expect, test } from '@playwright/test';

import { guidanceData } from '../../data/guidance-data';
import {
  divorceGuidanceScenarios,
  divorceNoGuidanceScenarios,
} from '../../data/scenario-data';
import { RetirementGuidancePage } from '../../pages/retirement-guidance.page';

/**
 * @tests User Story 50891: Get Retirement Guidance - Results – Variable Guidance (Divorce)
 * @tests Test Case 52621: 50891 AC1 Test Case 1 : Verify User going through divorce with a known pension type
 * @tests Test Case 52633: 50891 AC2 Test Case 2 : Verify User going through divorce and unsure about pension
 * @tests Test Case 52634: 50891 AC3 Test Case 3 : Verify User going through divorce with multiple pensions
 * @tests Test Case 52636: 50891 AC4 Test Case 4 : Verify User going through divorce and unsure of one or more pension types
 * @tests Test Case 52638: 50891 AC5 Test Case 5 : Verify User not going through divorce with a pension
 */
test.describe('Variable guidance - DIVORCE', () => {
  test('Divorce option "Yes" displays guidance package GP17', async ({
    page,
  }) => {
    const retirementGuidance = new RetirementGuidancePage(page);

    for (const scenario of divorceGuidanceScenarios) {
      await test.step(`Pension "${scenario.pension}" displays ${scenario.expected}`, async () => {
        await retirementGuidance.openDivorceResult({
          divorce: 'yes',
          pension: scenario.pension,
        });
        const { expected, guidancePackage } =
          retirementGuidance.getExpectedGuidance(scenario.expected);

        // assert package visible
        await expect(guidancePackage.container).toBeVisible();
        await expect(guidancePackage.heading).toContainText(expected.heading);

        // accordion closed by default, open accordion, assert accordion open
        await expect(guidancePackage.container).not.toHaveAttribute('open', '');
        await guidancePackage.heading.click();
        await expect(guidancePackage.container).toHaveAttribute('open', '');

        // assert package content
        await expect(guidancePackage.content).toContainText(expected.content);

        // assert all link text and URLs are correct and open in new tab
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

  test('Divorce option "No" displays no divorce guidance', async ({ page }) => {
    const retirementGuidance = new RetirementGuidancePage(page);
    const guidancePackage17 = retirementGuidance.guidancePackage('GP17');

    for (const scenario of divorceNoGuidanceScenarios) {
      await test.step(`Pension "${scenario.pension}" displays no divorce guidance`, async () => {
        await retirementGuidance.openDivorceResult({
          divorce: 'no',
          pension: scenario.pension,
        });

        await expect(guidancePackage17.container).toBeHidden();
      });
    }
  });
});
