import { expect, test } from '@playwright/test';

import resultsPage from '../pages/resultsPage';

/**
 * @test User Story 57125: GRG - Update Copy GP22
 * @test 57125 AC1 Test case 1 : Verify EN updated copy for GP22 - any pension type, < 10y from retirement
 * @test 57125 AC3 Test case 3 : Verify GP22 displayed for options - any pension type, > 10y from retirement
 * @test 57125 AC4 Test case 4 : Verify GP22 displayed for options - Combination of pension types, > 10y from retirement
 * @test 57125 AC5 Test case 5 : Verify GP22 displayed for options - Not sure what pension type
 */

test.describe('Results Page - GP22 Accordion Copy Verification', () => {
  test('AC1: Verify "Find out what pension type you have" accordion content - EN', async ({
    page,
  }) => {
    // Navigate directly to results page with query parameters
    await page.goto(
      '/en/results?q-1=0&q-2=0&q-3=0&q-4=0&q-5=0&q-6=0&q-7=0&q-8=0&q-9=0&q-10=0&q-11=0',
    );
    await resultsPage.waitForPage(page);

    // Step 2: Verify accordion link exists under "What to do first"
    const accordionLink = resultsPage.getAccordionLink(
      page,
      'Find out what pension type you have',
    );
    await accordionLink.waitFor({ state: 'visible' });
    await expect(accordionLink).toBeVisible();

    // Step 3: Expand accordion and verify content
    await resultsPage.expandAccordion(
      page,
      'Find out what pension type you have',
    );

    // Verify expanded content contains expected text
    const accordionContent = resultsPage.getAccordionContent(
      page,
      'Find out what pension type you have',
    );

    // Verify exact full text of each paragraph (every word checked)
    await expect(accordionContent.nth(0)).toHaveText(
      /The way your pension works and the options you have depends on what type it is\./,
    );
    await expect(accordionContent.nth(1)).toHaveText(
      /You can find out about different pension types in our guide[\s\S]*Pension types and how they work[\s\S]*Your pension provider can also confirm the exact type and features you have/,
    );
    await expect(accordionContent.nth(2)).toHaveText(
      /For more help and information about the different types of pensions, see our[\s\S]*pensions explained[\s\S]*section/,
    );
  });

  test('AC3 Test case 3 : Verify GP22 displayed for options - any pension type, > 10y from retirement', async ({
    page,
  }) => {
    // Navigate directly to results page with query parameters
    await page.goto(
      '/en/results?q-1=0&q-2=1&q-3=0&q-4=0&q-5=0&q-6=0&q-7=0&q-8=0&q-9=0&q-10=0&q-11=0',
    );
    await resultsPage.waitForPage(page);

    // Step 2: Verify accordion link exists under "What to do first"
    const accordionLink = resultsPage.getAccordionLink(
      page,
      'Find out what pension type you have',
    );
    await accordionLink.waitFor({ state: 'visible' });
    await expect(accordionLink).toBeVisible();

    // Step 3: Expand accordion and verify content
    await resultsPage.expandAccordion(
      page,
      'Find out what pension type you have',
    );

    // Verify expanded content contains expected text
    const accordionContent = resultsPage.getAccordionContent(
      page,
      'Find out what pension type you have',
    );

    // Verify exact full text of each paragraph (every word checked)
    await expect(accordionContent.nth(0)).toHaveText(
      /The way your pension works and the options you have depends on what type it is\./,
    );
    await expect(accordionContent.nth(1)).toHaveText(
      /You can find out about different pension types in our guide[\s\S]*Pension types and how they work[\s\S]*Your pension provider can also confirm the exact type and features you have/,
    );
    await expect(accordionContent.nth(2)).toHaveText(
      /For more help and information about the different types of pensions, see our[\s\S]*pensions explained[\s\S]*section/,
    );
  });

  test('AC4 Test case 4 : Verify GP22 displayed for options - Combination of pension types, > 10y from retirement', async ({
    page,
  }) => {
    // Navigate directly to results page with query parameters
    await page.goto(
      '/en/results?q-1=0&q-2=1&q-3=0&q-4=0&q-5=0%2C1%2C2&q-6=0&q-7=0&q-8=0&q-9=0&q-10=0&q-11=0',
    );
    await resultsPage.waitForPage(page);

    // Step 2: Verify accordion link exists under "What to do first"
    const accordionLink = resultsPage.getAccordionLink(
      page,
      'Find out what pension type you have',
    );
    await accordionLink.waitFor({ state: 'visible' });
    await expect(accordionLink).toBeVisible();

    // Step 3: Expand accordion and verify content
    await resultsPage.expandAccordion(
      page,
      'Find out what pension type you have',
    );

    // Verify expanded content contains expected text
    const accordionContent = resultsPage.getAccordionContent(
      page,
      'Find out what pension type you have',
    );

    // Verify exact full text of each paragraph (every word checked)
    await expect(accordionContent.nth(0)).toHaveText(
      /The way your pension works and the options you have depends on what type it is\./,
    );
    await expect(accordionContent.nth(1)).toHaveText(
      /You can find out about different pension types in our guide[\s\S]*Pension types and how they work[\s\S]*Your pension provider can also confirm the exact type and features you have/,
    );
    await expect(accordionContent.nth(2)).toHaveText(
      /For more help and information about the different types of pensions, see our[\s\S]*pensions explained[\s\S]*section/,
    );
  });

  test('AC5 Test case 5 : Verify GP22 displayed for options - Not sure what pension type', async ({
    page,
  }) => {
    // Navigate directly to results page with query parameters
    //q6=Yes
    await page.goto(
      '/en/results?q-1=0&q-2=1&q-3=0&q-4=0&q-5=4&q-6=0&q-7=0&q-8=0&q-9=0&q-10=0&q-11=0',
    );
    await resultsPage.waitForPage(page);

    // Step 2: Verify accordion link exists under "What to do first"
    const accordionLink1 = resultsPage.getAccordionLink(
      page,
      'Find out what pension type you have',
    );
    await accordionLink1.waitFor({ state: 'visible' });
    await expect(accordionLink1).toBeVisible();

    //q6=No
    await page.goto(
      '/en/results?q-1=0&q-2=1&q-3=0&q-4=0&q-5=4&q-6=1&q-7=0&q-8=0&q-9=0&q-10=0&q-11=0',
    );
    await resultsPage.waitForPage(page);

    // Step 2: Verify accordion link exists under "What to do first"
    const accordionLink2 = resultsPage.getAccordionLink(
      page,
      'Find out what pension type you have',
    );
    await accordionLink2.waitFor({ state: 'visible' });
    await expect(accordionLink2).toBeVisible();

    //q6=Not sure
    await page.goto(
      '/en/results?q-1=0&q-2=1&q-3=0&q-4=0&q-5=4&q-6=2&q-7=0&q-8=0&q-9=0&q-10=0&q-11=0',
    );
    await resultsPage.waitForPage(page);

    // Step 2: Verify accordion link exists under "What to do first"
    const accordionLink3 = resultsPage.getAccordionLink(
      page,
      'Find out what pension type you have',
    );
    await accordionLink3.waitFor({ state: 'visible' });
    await expect(accordionLink3).toBeVisible();
  });
});
