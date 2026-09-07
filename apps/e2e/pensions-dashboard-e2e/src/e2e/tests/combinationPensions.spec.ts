import { expect, test } from '@maps/playwright';

import {
  combinationPensions,
  combinationPensions4,
} from '../data/scenarioDetails';
import { expectedTimelineDataCombination } from '../data/timelineScenarioDetails';
import ConfirmedPensionsSummary from '../pages/components/SummarySentence';
import Timeline from '../pages/components/Timeline';
import pensionDetailsPage from '../pages/PensionDetailsPage';
import pensionBreakdownPage from '../pages/PensionsBreakdownPage';
import commonHelpers from '../utils/commonHelpers';
import { commonSessions } from '../utils/testSessionStorage';
import CombinationPensionsHelper from '../utils/combinationPensionsHelper';

/**
 * @tests User Story 50679 FE - Combination - Pension Card
 * @tests Test Case 52738 50679 AC1 Test Case 1 : Pension Type of AVC - with 1 non permitted benefit type of DC - shows the correct pension card of Combination Pension
 * @tests Test Case 52739 50679 AC1 Test Case 2 : Pension Type of CB - with 1 permitted benefit type of CDI and 1 non-permitted benefit type of DC - shows the correct pension card of Combination Pension
 * @tests Test Case 52740 50679 AC1 Test Case 3 : Pension Type of CDC - with 2 non permitted benefit type of DB and CBL - shows the correct pension card of Combination Pension
 * @tests Test Case 52763 50679 AC1 Test Case 4 : Pension Type of DB - with 1 benefit illustration WITHOUT a benefitType - shows the correct pension card of Combination Pension
 * @tests Test Case 52736 50679 AC1 Test Case 5 : Pension Type of DB - with 1 permitted benefit type of DBL and 1 non-permitted benefit type of CBS - shows the correct pension card of Combination Pension
 * @tests Test Case 52735 50679 AC1 Test Case 6 : Pension Type of DC - with 2 non permitted benefit type of DB and CBS - shows the correct pension card of Combination Pension
 * @tests Test Case 52737 50679 AC1 Test Case 7 : Pension Type of DB - with 3 non permitted benefit type of DC, CBS and CDC - shows the correct pension card of Combination Pension
 * @tests Test Case 52734 50679 AC1 Test Case 8 : Pension Type of DC - with 1 non permitted benefit type of DB - shows the correct pension card of Combination Pension
 *
 * @tests User Story 50676 FE - Combination - Timeline
 * @tests Test Case 53443 [AC1]: Timeline Page with Combination Pension
 *
 * @tests User Story 50675 FE - Combination - Pension Details - Summary Tab
 * @tests Test Case 53436 [AC1]: Combination Summary Tab
 * @tests Test Case 53437 [AC2]: Label Box & Icon Rendering
 * @tests Test Case 52438 [AC3]: Combination Pension Explainer Box
 *
 * @tests User Story 50672 BE - Transformation rule for Combination pension arrangements
 * @tests Test Case 53451 [AC1]: DC Pension is Classified as Combination Pension if there is at least one non permitted benefit type
 * @tests Test Case 53718 [AC1]: DB Pension is Classified as Combination Pension if there is at least one non permitted benefit type
 * @tests Test Case 53719 [AC1]: AVC Pension is Classified as Combination Pension if there is at least one non permitted benefit type
 * @tests Test Case 53720 [AC1]: CB Pension is Classified as Combination Pension if there is at least one non permitted benefit type
 * @tests Test Case 53783 [AC1]: CDC Pension is Classified as Combination Pension if there is at least one non permitted benefit type
 * @tests Test Case 53723 [AC1]: DC Pension is Classified as DC Pension if all benefit types are permitted
 * @tests Test Case 53724 [AC1]: DB Pension is Classified as a DB Pension if all benefit types are permitted
 * @tests Test Case 53725 [AC1]: AVC Pension is Classified as a AVC Pension if all benefit types are permitted
 * @tests Test Case 53727 [AC1]: CB Pension is Classified as a CB Pension if all benefit types are permitted
 * @tests Test Case 53722 [AC1]: CDC Pension is Classified as CDC pension if all benefit types are permitted
 * @tests Test Case 53452 [AC2]: Pension is NOT classified as Combination Pension if pension type is HYB
 *
 */

test.describe('Combination Pension Types', () => {
  test.beforeEach(async ({ page }) => {
    await commonSessions.navigateToPensionBreakdown(
      page,
      combinationPensions.option,
    );
  });

  test('Pension Breakdown page - Pension card & Timeline', async ({
    page,
    isMobile,
  }) => {
    const timeline = new Timeline(page);
    const confirmedPensionsSummary = new ConfirmedPensionsSummary(
      page,
      isMobile,
    );
    const detailsButtonText = 'See details';

    // Pension Card
    for (const pension of combinationPensions.pensions) {
      const { schemeName } = pension;

      if (!pension) {
        throw new Error(`No pension found for schemeName: ${schemeName}`);
      }

      await expect(
        pensionBreakdownPage.getPensionCard(page, schemeName),
      ).toBeVisible();
      await expect(
        pensionBreakdownPage.getPensionCardType(page, schemeName),
      ).toContainText(pension.pensionCardType);
      await expect(
        pensionBreakdownPage.getEmployerName(page, schemeName),
      ).toContainText(pension.employer);
      await expect(
        pensionBreakdownPage.getAdministratorName(page, schemeName),
      ).toContainText(pension.pensionProvider);
      await expect(
        pensionBreakdownPage.getRetirementDate(page, schemeName),
      ).toContainText(pension.expectedRetirementDate);
      await expect(
        pensionBreakdownPage.getEstimatedIncome(page, schemeName),
      ).toContainText(pension.estimatedIncome);
      await expect(
        pensionBreakdownPage.getSeeDetailsButton(page, schemeName),
      ).toContainText(detailsButtonText);
    }

    // Timeline
    await confirmedPensionsSummary.clickTimelineLinkNonMcCloud(page);
    expect(await timeline.getTimelineKeyText()).toContain('Combination');
    await timeline.togglePensionDropdown('2037', 'View pensions');
    const actualTimelineData = await timeline.getTimelineData(
      page,
      expectedTimelineDataCombination,
    );
    expect(actualTimelineData).toEqual(expectedTimelineDataCombination);
  });

  test('Pension Details Page Summary Tab', async ({ page, isMobile }) => {
    const confirmedPensionsSummary = new ConfirmedPensionsSummary(
      page,
      isMobile,
    );
    const tooltipText =
      'This pension includes a combination of benefit types. These can be calculated in different ways, have separate incomes and be paid out at different times.';
    const pensionScheme = ['Frank_Type(AVC)_Illustrations(DC)'];

    for (const schemeName of pensionScheme) {
      const pension = combinationPensions.pensions.find(
        (p) => p.schemeName === schemeName,
      );
      const summaryCardText = `You could receive ${pension?.estimatedIncome} a month from the first payable date of ${pension?.expectedRetirementDate}.`;
      const explainerHeading =
        'This pension has a combination of benefit types';
      const explainerText =
        'This pension includes a combination of benefit types. These can be calculated in different ways, have separate incomes and be paid out at different times. See the income and values for details.';
      const { container, heading, description } =
        await confirmedPensionsSummary.getExplainer('VAR');

      const firstPensionCard = page.getByTestId('information-callout').first();

      await pensionBreakdownPage.clickSeeDetailsButton(page, firstPensionCard);

      // summary sentence
      await expect(pensionDetailsPage.getSummaryCard(page)).toContainText(
        summaryCardText,
      );
      const combinationLabelBox = pensionDetailsPage.getPensionDetailType(page);
      await expect(combinationLabelBox.getByTestId('VAR-icon')).toBeVisible();
      await expect(combinationLabelBox).toContainText('Combination');

      //Combination tooltip
      await confirmedPensionsSummary.clickPensionTypeTooltip();
      await expect(confirmedPensionsSummary.tooltipIcon).toHaveAttribute(
        'aria-expanded',
        'true',
      );
      expect(
        await confirmedPensionsSummary.getPensionTypeTooltipText(),
      ).toContain(tooltipText);
      await confirmedPensionsSummary.clickPensionTypeTooltip();
      await expect(confirmedPensionsSummary.tooltipIcon).toHaveAttribute(
        'aria-expanded',
        'false',
      );

      //explainer
      await expect(container).toBeVisible();
      await expect(heading).toHaveText(explainerHeading);
      await expect(description).toContainText(explainerText);
    }
  });

  test('Pension Details Page Income Values Tab', async ({ page }) => {
    for (const pension of combinationPensions.pensions) {
      const { benefitTypes, schemeName } = pension;

      const benefitTypeDescription = {
        DC: 'Defined contribution',
        CB: 'Cash balance',
        DB: 'Defined benefit',
        CDC: 'Collective defined contribution',
      };

      // navigate to pension details page income and values tab
      const pensionCard = pensionBreakdownPage.getPensionCard(page, schemeName);
      await pensionBreakdownPage.clickSeeDetailsButton(page, pensionCard);
      await pensionDetailsPage.checkPensionDetailsTabs(
        page,
        'tab-pension-income-and-values',
        'Income and values',
      );

      // check that the relevant benefit type titles are displayed
      for (const benefitType of benefitTypes) {
        await expect(
          page.getByTestId(`benefit-type-title-${benefitType.toLowerCase()}`),
        ).toContainText(benefitTypeDescription[benefitType]);
      }

      await commonHelpers.clickBackLink(page);
    }
  });
});

test.describe('Pensions Dashboard - Combination Card Categorisation', () => {
  test.beforeEach(async ({ page }) => {
    await commonSessions.navigateToPensionBreakdown(
      page,
      combinationPensions4.option,
    );
  });

  test('should correctly label each pension card with correct pension card type based on combination logic rules', async ({
    page,
  }) => {
    const helper = new CombinationPensionsHelper(page);

    for (const pension of combinationPensions4.pensions) {
      const { schemeName } = pension;

      if (!pension) {
        throw new Error(`No pension found for schemeName: ${schemeName}`);
      }

      const pensionCard = pensionBreakdownPage.getPensionCard(page, schemeName);
      const pensionCardType = pensionBreakdownPage.getPensionCardType(
        page,
        schemeName,
      );

      const titleText = (await pensionCard.textContent()) || '';

      const { pensionType, illustrations } =
        helper.parsePensionTitle(titleText);
      const isCombinationPension = helper.isCombinationPension(
        pensionType,
        illustrations,
      );

      if (isCombinationPension) {
        await expect(pensionCardType).toHaveText('Combination');
      } else {
        await expect(pensionCardType).not.toHaveText('Combination');
      }
    }
  });
});
