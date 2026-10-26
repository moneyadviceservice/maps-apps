import { expect, test } from '@playwright/test';

import { basePage } from '../pages/basePage';
import homePage from '../pages/HomePage';
import question1CyPage from '../pages/question1CyPage';
import question1Page from '../pages/question1Page';
import question2Page from '../pages/question2Page';
import questionnaireNavigator from '../pages/questionnaireNavigator';

/**
 * @test User Story 57269: GRG - Changing destination for Question 1 back button before go live
 * @test Test Case 57711: Non-embedded, Question 1 (EN) back link href points to the AEM EN landing page
 * @test Test Case 57712: Non-embedded, Question 1 (CY) back link href points to the AEM CY landing page
 * @test Test Case 57716: Embedded, Question 1 (EN) back link href points to the in-app landing page
 * @test Test Case 57724: Embedded, Question 1 (CY) back link href points to the in-app landing page
 * @test Test Case 57730: Question 2+ (non-embedded and embedded) back link is unaffected and still uses the standard question backLink
 *
 * Summary: The back link destination changes based on isEmbedded parameter:
 * - Non-embedded (no isEmbedded param): External AEM landing page URLs
 * - Embedded (isEmbedded=true): In-app landing routes
 */

test.describe('Question 1 Back Link Destination - Embedded vs Non-Embedded', () => {
  test('AC1: Non-embedded Question 1 (EN) - back link href points to AEM EN landing page', async ({
    page,
  }) => {
    // Navigate to question 1 without isEmbedded parameter (non-embedded mode)
    await page.goto('/en/question-1');
    await question1Page.waitForPage(page);

    // Verify back link href points to external AEM landing page
    await expect(basePage.getBackLink(page)).toBeVisible();
    await expect(basePage.getBackLink(page)).toHaveAttribute(
      'href',
      'https://www.moneyhelper.org.uk/en/pensions-and-retirement/pensions-basics/get-retirement-guidance',
    );
  });

  test('AC2: Non-embedded Question 1 (CY) - back link href points to AEM CY landing page', async ({
    page,
  }) => {
    // Navigate to question 1 in Welsh without isEmbedded parameter (non-embedded mode)
    await page.goto('/cy/question-1');
    // Wait for Welsh page using Welsh heading
    await question1CyPage.getHeading(page).waitFor();

    // Verify back link href points to external AEM landing page in Welsh
    // Use Welsh back link selector ("Yn ôl" instead of "Back")
    await expect(basePage.getBackLink(page, 'cy')).toBeVisible();
    await expect(basePage.getBackLink(page, 'cy')).toHaveAttribute(
      'href',
      'https://www.moneyhelper.org.uk/cy/pensions-and-retirement/pensions-basics/get-retirement-guidance',
    );
  });

  test('AC3: Embedded Question 1 (EN) - back link href points to in-app landing page', async ({
    page,
  }) => {
    // Navigate to question 1 with isEmbedded=true parameter
    await page.goto('/en/question-1?isEmbedded=true');
    await question1Page.waitForPage(page);

    // Verify page is in embedded mode - header/footer should be hidden
    await expect(page.getByRole('banner')).toBeHidden();

    // Verify back link href points to in-app landing route
    // Use testid selector for embedded mode back link
    await expect(basePage.getBackLink(page, 'en', true)).toBeVisible();
    await expect(basePage.getBackLink(page, 'en', true)).toHaveAttribute(
      'href',
      '/en/landing',
    );
  });

  test('AC4: Embedded Question 1 (CY) - back link href points to in-app landing page', async ({
    page,
  }) => {
    // Navigate to question 1 in Welsh with isEmbedded=true parameter
    await page.goto('/cy/question-1?isEmbedded=true');
    // Wait for Welsh page using Welsh heading
    await question1CyPage.getHeading(page).waitFor();

    // Verify page is in embedded mode - header/footer should be hidden
    await expect(page.getByRole('banner')).toBeHidden();

    // Verify back link href points to in-app landing route in Welsh
    // Use testid selector for embedded mode back link
    await expect(basePage.getBackLink(page, 'cy', true)).toBeVisible();
    await expect(basePage.getBackLink(page, 'cy', true)).toHaveAttribute(
      'href',
      '/cy/landing',
    );
  });

  test('AC5: Question 2+ (non-embedded) - back link still uses standard question back link', async ({
    page,
  }) => {
    // Navigate to question 2 without isEmbedded parameter
    await homePage.startRetirementGuidance(page);
    await questionnaireNavigator.skipToQuestion(page, 2);
    await question2Page.waitForPage(page);

    // Verify back link href points back to question 1 with query parameters preserved
    // This is the standard backLink behavior used for all questions except Q1
    await expect(basePage.getBackLink(page)).toBeVisible();
    await expect(basePage.getBackLink(page)).toHaveAttribute(
      'href',
      /\/en\/question-1\?q-1=/,
    );
  });

  test('AC5: Question 2+ (embedded) - back link preserves isEmbedded parameter', async ({
    page,
  }) => {
    // Navigate to question 2 with isEmbedded=true parameter
    await page.goto('/en/question-2?q-1=0&q-2=0&isEmbedded=true');
    await question2Page.waitForPage(page);

    // Verify back link href points back to question 1 with isEmbedded parameter carried through
    // Use testid selector for embedded mode back link
    await expect(basePage.getBackLink(page, 'en', true)).toBeVisible();
    await expect(basePage.getBackLink(page, 'en', true)).toHaveAttribute(
      'href',
      /\/en\/question-1\?q-1=.*&isEmbedded=true/,
    );
  });
});
