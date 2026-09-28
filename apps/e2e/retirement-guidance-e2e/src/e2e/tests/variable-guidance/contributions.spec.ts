import { expect, test } from '@playwright/test';

import { guidanceData } from '../../data/guidance-data';
import {
  contributionsNoGuidanceScenarios,
  employerContributingScenarios,
  employerNotContributingScenarios,
  notEmployedContributingScenarios,
  notEmployedNotContributingScenarios,
  selfEmployedContributingScenarios,
  selfEmployedNotContributingScenarios,
} from '../../data/scenario-data';
import { RetirementGuidancePage } from '../../pages/retirement-guidance.page';

/**
 * @tests User Story 50909: Get Retirement Guidance - Results – Variable Guidance (Employment & Contribution)
 * @test Test Case 53948: 50909 AC 1 Test Case 1: Employer + Paying into Pension + State Pension Only
 * @test Test Case 53950: 50909 AC 2 Test Case 2: Employer + Paying into Pension + Defined Benefit Only
 * @test Test Case 53951: 50909 AC 3 Test Case 3: Employer + Paying into Pension + Defined Benefit Combination
 * @test Test Case 53952: 50909 AC 4 Test Case 4: Employer + Paying into Pension + Pension Type Not Sure
 * @test Test Case 53953: 50909 AC 5 Test Case 5: Employer + Paying into Pension + Single Non-DB Pension Type
 * @test Test Case 53954: 50909 AC 6 Test Case 6: Employer + Paying into Pension + Multiple Pension Types (No DB)
 * @test Test Case 53955: 50909 AC 7 Test Case 7: Employer + Not Paying into Pension + Any Pension Type
 * @test Test Case 53956: 50909 AC 8 Test Case 8: Employer + Not Paying into Pension + Not Sure
 * @test Test Case 53957: 50909 AC 9 Test Case 9: Employer + Not Paying into Pension + Multiple Pension Types
 * @test Test Case 53958: 50909 AC 10 Test Case 10: Employer + Not sure Paying into Pension + Any Pension Type
 * @test Test Case 53959: 50909 AC 11 Test Case 11: Employer + Not sure Paying into Pension + Not Sure
 * @test Test Case 53960: 50909 AC 12 Test Case 12: Employer + Not sure Paying into Pension + Multiple Pension Types
 * @test Test Case 53961: 50909 AC 13 Test Case 13: Self-employed + Paying into Pension + Single Non-DB Pension Type
 * @test Test Case 53962: 50909 AC 14 Test Case 14: Self-employed + Paying into Pension + Defined Benefit only
 * @test Test Case 53963: 50909 AC 15 Test Case 15: Self-employed + Paying into Pension + Not Sure
 * @test Test Case 53964: 50909 AC 16 Test Case 16: Self-employed + Paying into Pension + Multiple Pension Types
 * @test Test Case 53965: 50909 AC 17 Test Case 17: Self-employed + Not Paying into Pension + Any Pension Type
 * @test Test Case 53966: 50909 AC 18 Test Case 18: Self-employed + Not Paying into Pension + Not Sure
 * @test Test Case 53968: 50909 AC 19 Test Case 19: Self-employed + Not Paying into Pension + Multiple Pension Types
 * @test Test Case 53969: 50909 AC 20 Test Case 20: Self-employed + Not sure Paying into Pension + Any Pension Type
 * @test Test Case 53970: 50909 AC 21 Test Case 21: Self-employed + Not sure Paying into Pension + Not Sure
 * @test Test Case 53971: 50909 AC 22 Test Case 22: Self-employed + Not sure Paying into Pension + Multiple Pension Types
 * @test Test Case 53973: 50909 AC 24 Test Case 24: Not Employed + Paying into Pension + Single Non-DB Pension Type
 * @test Test Case 53974: 50909 AC 25 Test Case 25: Not Employed + Paying into Pension + Defined Benefit only
 * @test Test Case 53975: 50909 AC 26 Test Case 26: Not Employed + Paying into Pension + Not Sure
 * @test Test Case 53976: 50909 AC 27 Test Case 27: Not Employed + Paying into Pension + Multiple Pension Types
 * @test Test Case 53977: 50909 AC 28 Test Case 28: Not Employed + Not Paying into Pension + Any Pension Type
 * @test Test Case 53978: 50909 AC 29 Test Case 29: Not Employed + Not Paying into Pension + Not Sure
 * @test Test Case 53979: 50909 AC 30 Test Case 30: Not Employed + Not Paying into Pension + Multiple Pension Types
 * @test Test Case 53980: 50909 AC 31 Test Case 31: Not Employed + Not sure Paying into Pension + Any Pension Type
 * @test Test Case 53981: 50909 AC 32 Test Case 32: Not Employed + Not sure Paying into Pension + Not Sure
 * @test Test Case 53982: 50909 AC 33 Test Case 33: Not Employed + Not sure Paying into Pension + Multiple Pension Types
 *
 * @test User Story 56368: GRG - implement CY - Variable guidance (employment & contributions)
 * @test Test Case 57483: 56368 AC10 TEST CASE 10: Package 2b updated EN copy for AVC sentences 5 and 6
 * @test Test Case 57485: 56368 AC11 TEST CASE 11: Package 4 "You'll usually benefit from extra tax relief" section matches source document
 * @test Test Case 57486: 56368 AC12 TEST CASE 12: Package 6 updated heading and "For example" tax relief sentence match source document
 * @test Test Case 57482: 56368 AC9 TEST CASE 9: Package 2a updated EN copy for AVC sentences 2 and 3
 */

test.describe('Variable guidance - CONTRIBUTIONS', () => {
  test('Employed and contributing displays the correct guidance package', async ({
    page,
  }) => {
    const retirementGuidance = new RetirementGuidancePage(page);

    for (const scenario of employerContributingScenarios) {
      await test.step(`Pension "${scenario.pension}" displays ${scenario.expected}`, async () => {
        await retirementGuidance.openContributionsResult({
          employment: 'employed',
          contribution: 'yes',
          pension: scenario.pension,
        });
        const { expected, guidancePackage } =
          retirementGuidance.getExpectedGuidance(scenario.expected);

        // assert package visible
        await expect(guidancePackage.container).toBeVisible();
        await expect(guidancePackage.heading).toContainText(expected.heading);

        // accordion is closed by default, open accordion, assert open
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

  test('Employed and not contributing / not sure displays guidance package GP03', async ({
    page,
  }) => {
    const retirementGuidance = new RetirementGuidancePage(page);

    for (const contribution of ['no', 'not-sure'] as const) {
      for (const scenario of employerNotContributingScenarios) {
        await test.step(`Contribution "${contribution}" & pension "${scenario.pension}" displays ${scenario.expected}`, async () => {
          await retirementGuidance.openContributionsResult({
            employment: 'employed',
            contribution,
            pension: scenario.pension,
          });
          const { expected, guidancePackage } =
            retirementGuidance.getExpectedGuidance(scenario.expected);

          //assert package visible
          await expect(guidancePackage.container).toBeVisible();
          await expect(guidancePackage.heading).toContainText(expected.heading);

          // accordion is closed by default, open accordion, assert open
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

  test('Self-employed and contributing displays the correct guidance', async ({
    page,
  }) => {
    const retirementGuidance = new RetirementGuidancePage(page);

    for (const scenario of selfEmployedContributingScenarios) {
      await test.step(`Pension "${scenario.pension}" displays ${scenario.expected}`, async () => {
        await retirementGuidance.openContributionsResult({
          employment: 'self-employed',
          contribution: 'yes',
          pension: scenario.pension,
        });

        const { expected, guidancePackage } =
          retirementGuidance.getExpectedGuidance(scenario.expected);

        await expect(guidancePackage.container).toBeVisible();
        await expect(guidancePackage.heading).toContainText(expected.heading);

        // accordion is closed by default, open accordion, assert open
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

  test('Self-employed and not contributing / not sure displays guidance package GP05', async ({
    page,
  }) => {
    const retirementGuidance = new RetirementGuidancePage(page);

    for (const contribution of ['no', 'not-sure'] as const) {
      for (const scenario of selfEmployedNotContributingScenarios) {
        await test.step(`Contribution "${contribution}" & pension "${scenario.pension}" displays ${scenario.expected}`, async () => {
          await retirementGuidance.openContributionsResult({
            employment: 'self-employed',
            contribution,
            pension: scenario.pension,
          });

          const { expected, guidancePackage } =
            retirementGuidance.getExpectedGuidance(scenario.expected);

          await expect(guidancePackage.container).toBeVisible();
          await expect(guidancePackage.heading).toContainText(expected.heading);

          // accordion is closed by default, open accordion, assert open
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

  test('Not employed and contributing displays the correct guidance', async ({
    page,
  }) => {
    const retirementGuidance = new RetirementGuidancePage(page);

    for (const scenario of notEmployedContributingScenarios) {
      await test.step(`Pension "${scenario.pension}" displays ${scenario.expected}`, async () => {
        await retirementGuidance.openContributionsResult({
          employment: 'not-employed',
          contribution: 'yes',
          pension: scenario.pension,
        });

        const { expected, guidancePackage } =
          retirementGuidance.getExpectedGuidance(scenario.expected);

        await expect(guidancePackage.container).toBeVisible();
        await expect(guidancePackage.heading).toContainText(expected.heading);

        // accordion is closed by default, open accordion, assert open
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

  test('Not employed and not contributing / not sure displays guidance package GP07', async ({
    page,
  }) => {
    const retirementGuidance = new RetirementGuidancePage(page);

    for (const contribution of ['no', 'not-sure'] as const) {
      for (const scenario of notEmployedNotContributingScenarios) {
        await test.step(`Contribution "${contribution}" & pension "${scenario.pension}" displays ${scenario.expected}`, async () => {
          await retirementGuidance.openContributionsResult({
            employment: 'not-employed',
            contribution,
            pension: scenario.pension,
          });

          const { expected, guidancePackage } =
            retirementGuidance.getExpectedGuidance(scenario.expected);

          await expect(guidancePackage.container).toBeVisible();
          await expect(guidancePackage.heading).toContainText(expected.heading);

          // accordion is closed by default, open accordion, assert open
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

  test('Defined Benefit only displays no contributions guidance when not employed', async ({
    page,
  }) => {
    const retirementGuidance = new RetirementGuidancePage(page);

    for (const scenario of contributionsNoGuidanceScenarios) {
      await test.step(`Employment "${scenario.employment}" & pension "${scenario.pension}" displays no contributions guidance`, async () => {
        await retirementGuidance.openContributionsResult({
          employment: scenario.employment,
          contribution: scenario.contribution,
          pension: scenario.pension,
        });

        const employmentGuidancePackages = [
          'GP02',
          'GP02a',
          'GP02b',
          'GP03',
          'GP04',
          'GP05',
          'GP06',
          'GP07',
        ] as const;

        for (const packageName of employmentGuidancePackages) {
          await expect(
            retirementGuidance.guidancePackage(packageName).container,
          ).toBeHidden();
        }
      });
    }
  });
});
