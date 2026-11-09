import { expect, test } from '@playwright/test';

import { copyTweaksAfterEditorialReview } from '../data/copy-tweaks-after-editorial-review-us-54883';
import aboutYouPage from '../pages/AboutYouPage';
import homePage from '../pages/HomePage';
import resultsPage from '../pages/ResultsPage';
import retirementCostsPage from '../pages/RetirementCostsPage';
import retirementIncomePage from '../pages/RetirementIncomePage';

/**
 * @test User Story 54883 - copy tweaks
 * @test 54883 AC 1 Test Case 1 : Verify updated English retirement income introductory text
 * @test 54883 AC 1 Test Case 2 : Verify updated Welsh retirement income introductory text
 * @test 54883 AC 2 Test Case 1 : Verify State Pension field heading in English
 * @test 54883 AC 2 Test Case 2 : Verify State Pension field heading in Welsh
 * @test 54883 AC 3 Test Case 1 : Verify updated English rent or care home fees title
 * @test 54883 AC 3 Test Case 2 : Verify updated Welsh rent or care home fees title
 * @test 54883 AC 4 Test Case 1 : Verify updated English other essential outgoings introductory text
 * @test 54883 AC 4 Test Case 2 : Verify updated Welsh other essential outgoings introductory text
 * @test 54883 AC 5 Test Case 1 : Verify updated English other essential outgoings field titles
 * @test 54883 AC 5 Test Case 2 : Verify updated Welsh other essential outgoings field titles
 */
test.describe('Retirement Budget Planner - User Story 54883 copy tweaks', () => {
  test.beforeEach(async ({ page }) => {
    await homePage.startRetirementBudgetPlanner(page);
    await aboutYouPage.fillValuesAndContinue(page);
    await retirementIncomePage.waitForPageToBeReady(page);
  });

  test('shows the updated English retirement income copy and field titles', async ({
    page,
  }) => {
    await expect(retirementIncomePage.getIntroText(page)).toHaveText(
      copyTweaksAfterEditorialReview.income.intro.en,
    );

    await retirementIncomePage.openAccordionByTitle(
      page,
      'Other retirement income',
    );
    const payFromWorkSection =
      await retirementIncomePage.openMoreInformationByLegend(
        page,
        copyTweaksAfterEditorialReview.income.payFromWork.legend.en,
      );

    await expect(payFromWorkSection).toContainText(
      copyTweaksAfterEditorialReview.income.payFromWork.moreInformation.en,
    );
  });

  test('shows the updated Welsh retirement income copy and field titles', async ({
    page,
  }) => {
    await page
      .getByRole('link', {
        name: copyTweaksAfterEditorialReview.languageLinks.welsh,
      })
      .click();
    await retirementIncomePage.waitForPageToBeReady(page, { language: 'cy' });

    await expect(retirementIncomePage.getIntroText(page)).toHaveText(
      copyTweaksAfterEditorialReview.income.intro.cy,
    );

    await retirementIncomePage.openAccordionByTitle(
      page,
      'Incwm ymddeoliad arall',
    );
    const payFromWorkSection =
      await retirementIncomePage.openMoreInformationByLegend(
        page,
        copyTweaksAfterEditorialReview.income.payFromWork.legend.cy,
        copyTweaksAfterEditorialReview.income.payFromWork.moreInformationLink
          .cy,
      );

    await expect(payFromWorkSection).toContainText(
      copyTweaksAfterEditorialReview.income.payFromWork.moreInformation.cy,
    );
  });

  test('shows the State Pension payments heading in English', async ({
    page,
  }) => {
    await expect(
      retirementIncomePage.getFieldHeading(
        page,
        copyTweaksAfterEditorialReview.income.statePensionPayments.en,
      ),
    ).toBeVisible();
  });

  test('shows the State Pension payments heading in Welsh', async ({
    page,
  }) => {
    await page
      .getByRole('link', {
        name: copyTweaksAfterEditorialReview.languageLinks.welsh,
      })
      .click();
    await retirementIncomePage.waitForPageToBeReady(page, { language: 'cy' });

    await expect(
      retirementIncomePage.getFieldHeading(
        page,
        copyTweaksAfterEditorialReview.income.statePensionPayments.cy,
      ),
    ).toBeVisible();
  });

  test('shows the updated English rent or care home fees title', async ({
    page,
  }) => {
    await retirementIncomePage.fillValuesAndContinue(page);
    await retirementCostsPage.waitForPageToBeReady(page);

    await expect(
      retirementCostsPage.getFieldHeading(
        page,
        copyTweaksAfterEditorialReview.costs.rentOrCareHomeFees.en,
      ),
    ).toBeVisible();
  });

  test('shows the updated Welsh rent or care home fees title', async ({
    page,
  }) => {
    await retirementIncomePage.fillValuesAndContinue(page);
    await retirementCostsPage.waitForPageToBeReady(page);
    await page
      .getByRole('link', {
        name: copyTweaksAfterEditorialReview.languageLinks.welsh,
      })
      .click();
    await retirementCostsPage.waitForPageToBeReady(page, { language: 'cy' });

    await expect(
      retirementCostsPage.getFieldHeading(
        page,
        copyTweaksAfterEditorialReview.costs.rentOrCareHomeFees.cy,
      ),
    ).toBeVisible();
  });

  test('shows the updated English other essential outgoings copy and field titles', async ({
    page,
  }) => {
    await retirementIncomePage.fillValuesAndContinue(page);
    await retirementCostsPage.waitForPageToBeReady(page);

    const costs = copyTweaksAfterEditorialReview.costs.otherEssentialOutgoings;
    await retirementCostsPage.openOtherEssentialOutgoingsSection(
      page,
      costs.title.en,
    );

    await expect(
      retirementCostsPage.getOtherEssentialOutgoingsIntro(page, costs.title.en),
    ).toHaveText(costs.intro.en);
    await expect(
      retirementCostsPage.getOtherEssentialOutgoingsFieldTitles(
        page,
        costs.title.en,
      ),
    ).toHaveText(costs.fieldTitles.en);
  });

  test('shows the updated Welsh other essential outgoings copy and field titles', async ({
    page,
  }) => {
    await retirementIncomePage.fillValuesAndContinue(page);
    await retirementCostsPage.waitForPageToBeReady(page);
    await page
      .getByRole('link', {
        name: copyTweaksAfterEditorialReview.languageLinks.welsh,
      })
      .click();
    await retirementCostsPage.waitForPageToBeReady(page, { language: 'cy' });

    const costs = copyTweaksAfterEditorialReview.costs.otherEssentialOutgoings;
    await retirementCostsPage.openOtherEssentialOutgoingsSection(
      page,
      costs.title.cy,
    );

    await expect(
      retirementCostsPage.getOtherEssentialOutgoingsIntro(page, costs.title.cy),
    ).toHaveText(costs.intro.cy);
    await expect(
      retirementCostsPage.getOtherEssentialOutgoingsFieldTitles(
        page,
        costs.title.cy,
      ),
    ).toHaveText(costs.fieldTitles.cy);
  });

  test('shows lowercase bullets under ways to boost retirement income', async ({
    page,
  }) => {
    await retirementIncomePage.fillValuesAndContinue(page);
    await retirementCostsPage.fillValuesAndContinue(page);
    await resultsPage.waitForPageToBeReady(page);

    const checklist = await resultsPage.openRetirementPlanningChecklist(page);

    await expect(checklist.getByRole('listitem')).toHaveText(
      copyTweaksAfterEditorialReview.results.checklistItems,
    );
  });
});
