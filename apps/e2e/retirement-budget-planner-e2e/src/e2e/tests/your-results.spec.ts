import { expect, test } from '@playwright/test';

import aboutYouPage from '../pages/AboutYouPage';
import { basePage } from '../pages/basePage';
import homePage from '../pages/HomePage';
import resultsPage from '../pages/ResultsPage';
import retirementCostsPage from '../pages/RetirementCostsPage';
import retirementIncomePage from '../pages/RetirementIncomePage';

const pageHeading = 'Your results';
const aboutYouHeading = 'About you';
const retirementIncomeHeading = 'Retirement income';
const retirementCostHeading = 'Retirement costs';
const saveResultsButton = 'Save results';
const startAgainButton = 'Start again';
const saveResultsHeading = 'Save and come back later';
const shareToolText = 'Share this calculator';
const retirementBudgetPlannerTitle = 'Retirement budget planner';
const facebookUrl =
  /facebook\.com\/sharer\.php\?u=https:\/\/retirement-budget-planner\.moneyhelper\.org\.uk/;
const xUrlText = /text=Find.*out.*how.*much.*money.*comfortable.*retirement/;
const xUrl = /url=https.*retirement-budget-planner\.moneyhelper\.org\.uk/;

/**
 * @tests User Story 36812
 * @tests User Story 45691
 * @tests User Story 44431
 * @tests Test Case 46562: 36812 AC2 Test case 2: Verify Retirement Budget Planner Title
 * @tests Test Case 46563: 37812 AC3&4 Test case 3: Verify Back Button
 * @test Test Case 46565: 36812 AC5 & 6 Test Case 4 : Verify Navigation Link 'About You'
 * @test Test Case 46568: 36812 AC 5&7 Test Case 5 : Verify Retirement Income navigation link
 * @test Test Case 46569: 36812 AC 5&8 Test Case 6 : Verify Retirement costs Navigation link
 * @test Test Case 46571: 36812 AC 15&17 Test Case 7 : Verify Save results Button
 * @test Test Case 46573: 36812 AC 15&16 Test Case 8 : Verify Start again button
 * @test Test Case 46608: 36812 AC 18-24 Test Case 9 : Verify Accordions
 *  @test Test Case 46669: 45691 AC1 Test case 1 : 'Start again' Button clears session data
 * @test Test Case 44431: AC1 TEST CASE 1 : Verify Social Share via Email
 * @test Test Case 44431: AC2 TEST CASE 2: Verify Share RBP via Facebook
 * @test Test Case44431: AC3 TEST CASE 3 : Verify Share RBP via 'X'
 */

test.describe('Retirement Budget Planner - Your results page', () => {
  test.beforeEach(async ({ page }) => {
    await homePage.startRetirementBudgetPlanner(page);
  });

  test('Verify Your result page', async ({ page, context }) => {
    //navigate to results page
    const dobDay = '1';
    const dobMonth = '1';
    const dobYear = '1970';
    const retirementAge = '75';
    const pensionValue = '5000';
    const mortgageRepayment = '500';

    await aboutYouPage.fillValuesAndContinue(
      page,
      dobDay,
      dobMonth,
      dobYear,
      retirementAge,
    );
    await retirementIncomePage.fillValuesAndContinue(page, pensionValue);
    await retirementCostsPage.fillValuesAndContinue(page, mortgageRepayment);

    //verify Your results heading
    await expect(basePage.pageHeading(page, pageHeading)).toBeVisible();

    //Verify Back link
    await basePage.clickBackLink(page);
    await basePage.waitForPageHeading(page, retirementCostHeading);
    await resultsPage.navigateBackToResults(page);

    // Verify Retirement budget planner title
    await expect(basePage.rbpTitleLocator(page)).toHaveText(
      retirementBudgetPlannerTitle,
    );

    //verify nav links
    const navLinks = [
      { id: 'about-you', heading: aboutYouHeading },
      { id: 'income', heading: retirementIncomeHeading },
      { id: 'essential-outgoings', heading: retirementCostHeading },
    ];

    for (const link of navLinks) {
      const successfulNavigation = await resultsPage.verifyNavigationLink(
        page,
        link.id,
        link.heading,
      );
      expect(successfulNavigation).toBe(true);
      await resultsPage.navigateBackToResults(page);
    }

    //verify accordions
    await expect(
      resultsPage.getRetirementPlanningChecklistHeader(page),
    ).toHaveText('Retirement planning checklist');
    const accordionData = [
      {
        index: 0,
        expectedSummary: 'Plan how and when to take your pension',
        expectedContent:
          'When and how to take your pension can affect how comfortable your retirement is. It’s a good idea to understand your options and start planning at least ten years before you plan to retire, so you have time to save more if you need to. For step-by-step help, including how to get free guidance, see our guide How to take your pension (opens in a new window) .',
      },
      {
        index: 1,
        expectedSummary: 'Check for ways to boost your retirement income',
        expectedContent:
          'Paying more into your pension – your employer might also match your contributions Checking you’re getting all the tax relief you’re eligible for Making sure you’re on track for the maximum State Pension Delaying your retirement date. For more information, see our guide Ways to boost your pension (opens in a new window) .',
      },
      {
        index: 2,
        expectedSummary:
          'Watch out for pension scams designed to steal your money',
        expectedContent:
          'Never access your pension or transfer any money to a pension provider because of a cold call, visit, email or text. It’s likely a scam designed to steal your money. You might lose all your retirement savings and have to pay an expensive tax bill. For more information, see our guide How to spot a pension scam (opens in a new window) .',
      },
    ];
    const closed = false;
    const open = true;
    for (const data of accordionData) {
      // Verify closed by default
      const defaultAccordionState = await resultsPage.getAccordionState(
        page,
        data.index,
      );
      expect(defaultAccordionState).toBe(closed);
      //Assert the Summary Title
      const actualSummary = await resultsPage.getAccordionSummaryText(
        page,
        data.index,
      );
      expect(actualSummary).toBe(data.expectedSummary);
      //Open the accordion
      await resultsPage.toggleAccordion(page, data.index);
      // Verify it is now open
      const accordionState = await resultsPage.getAccordionState(
        page,
        data.index,
      );
      expect(accordionState).toBe(open);
      //Assert the Inner Text
      const actualContent = await resultsPage.getAccordionContentText(
        page,
        data.index,
      );
      expect(actualContent).toContain(data.expectedContent);
      // Close it
      await resultsPage.toggleAccordion(page, data.index);
      //Verify it is closed again
      const finalState = await resultsPage.getAccordionState(page, data.index);
      expect(finalState).toBe(closed);
    }

    //Verify Save Button
    await basePage.clickButton(page, saveResultsButton);
    await basePage.waitForPageHeading(page, saveResultsHeading);
    await basePage.clickBackLink(page);
    await basePage.waitForPageHeading(page, pageHeading);

    //verify other tools to try header, 3 cards, each card title
    const header = await resultsPage.getOtherToolsHeader(page);
    await expect(header).toBeVisible();
    const cards = await resultsPage.getTeaserCards(page);
    await expect(cards).toHaveCount(3);
    const expectedCardTitles = [
      'Budget planner',
      'Pension calculator',
      'Benefits calculator',
    ];
    for (let i = 0; i < 3; i++) {
      const card = cards.nth(i);
      const title = await resultsPage.getTeaserCardTitle(card);
      expect(title).toBe(expectedCardTitles[i]);
    }

    //verify was this tool useful & feedbackbuttons
    // not covered by automation tests due to informizely widget dynamically injected and not covered by our own code
    // to be manually tested as part of user story: User Story 44432: Retirement Budget Planner - Your Results - Was this information useful

    //Verify share this calculator text and links visible on page
    await expect(resultsPage.getShareCalculatorText(page)).toHaveText(
      shareToolText,
    );
    //verify href that opens mail client
    await expect(resultsPage.getShareLink(page, 'email')).toBeVisible();
    const rawHref = await resultsPage.getEmailLinkHref(page);
    expect(rawHref).not.toBeNull();
    const decodedHref = decodeURIComponent(rawHref!);
    expect(decodedHref).toContain('subject=Retirement Budget Planner');
    expect(decodedHref).toContain(
      'body=Find out how much money you might need for a comfortable retirement with our free online tool',
    );
    expect(decodedHref).toContain(
      'https://retirement-budget-planner.moneyhelper.org.uk',
    );

    //verfiy FB link in new page
    await expect(resultsPage.getShareLink(page, 'facebook')).toBeVisible();
    const facebookTab = await resultsPage.clickSocialShare(
      page,
      context,
      'facebook',
    );
    await expect(facebookTab).toHaveURL(facebookUrl);
    await resultsPage.closeSocialMediaTab(facebookTab);

    //verfiy X link in new page
    await expect(resultsPage.getShareLink(page, 'X')).toBeVisible();
    const XTab = await resultsPage.clickSocialShare(page, context, 'X');
    await expect(XTab).toHaveURL(xUrlText);
    await expect(XTab).toHaveURL(xUrl);
    await resultsPage.closeSocialMediaTab(XTab);

    //verify start again button
    await basePage.clickButton(page, startAgainButton);
    await basePage.waitForPageHeading(page, aboutYouHeading);
    const dateFields = ['day', 'month', 'year'];
    for (const field of dateFields) {
      const inputValue = await aboutYouPage.getInputValue(page, field);
      expect(inputValue).toBe('');
    }
  });
});
