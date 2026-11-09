import { expect, test } from '@playwright/test';

import resultsPage from '../pages/resultsPage';

/**
 * @test GRG - Update copy for GP22a
 * @test 57786 AC3, AC4: Verify GP22a copy in EN and CY
 * @test 57134 AC1 Test case 1 : Verify updated copy for GP22a  - EN
 *
 * Summary:  Q2=2 (Already retired)
 * should see "Find out what pension type you have" accordion with updated text for retired users
 */

test.describe('Results Page - GP22a Accordion Copy Verification', () => {
  test('AC1 Test case 1 : Verify updated copy for GP22a  - EN', async ({
    page,
  }) => {
    // Navigate directly to results page with query parameters
    // Q2=2 (Already retired)
    await page.goto(
      '/en/results?q-1=0&q-2=2&q-3=0&q-4=0&q-5=0&q-6=0&q-7=0&q-8=0&q-9=0&q-10=0&q-11=0',
    );
    await resultsPage.waitForPage(page);

    // Verify accordion link exists under "What to do first"
    const accordionLink = resultsPage.getAccordionLink(
      page,
      'Find out which types of pension you have',
    );
    await accordionLink.waitFor({ state: 'visible' });
    await expect(accordionLink).toBeVisible();

    // Expand accordion and verify updated content for retired users
    await resultsPage.expandAccordion(
      page,
      'Find out which types of pension you have',
    );

    // Verify accordion content with exact text matching
    const accordionContent = resultsPage.getAccordionContent(
      page,
      'Find out which types of pension you have',
    );

    // Verify exact full text of each paragraph (every word checked)
    // Updated for Q2=2 (already retired) scenario
    await expect(accordionContent.nth(0)).toHaveText(
      "If you have pensions you've not taken yet, the way they work and your options depend on the type you have.",
    );
    await expect(accordionContent.nth(1)).toHaveText(
      'You can find out about different pension types in our guide Pension types and how they work. Your pension provider can also confirm the exact type and features you have.',
    );
    await expect(accordionContent.nth(2)).toHaveText(
      'For more help and information about the different types of pensions, see our pensions explained section.',
    );
  });

  test('57786 AC4: Verify updated copy for GP22a - CY', async ({ page }) => {
    await page.goto(
      '/cy/results?q-1=0&q-2=2&q-3=0&q-4=0&q-5=0&q-6=0&q-7=0&q-8=0&q-9=0&q-10=0&q-11=0',
    );
    await resultsPage.waitForPage(page, 'cy');

    const section = resultsPage.getGuidanceSection(
      page,
      'primary-goal-22a-section',
    );
    await expect(section).toBeVisible();
    await expect(section.getByTestId('summary-block-title')).toHaveText(
      'Darganfyddwch pa fathau o bensiwn sydd gennych',
    );

    await section.locator('summary').click();

    const paragraphs = section.locator('p[data-testid="paragraph"]');
    await expect(paragraphs).toHaveCount(3);
    await expect(paragraphs.nth(0)).toHaveText(
      'Os oes gennych bensiynau nad ydych wedi’u cymryd eto, mae’r ffordd maen nhw’n gweithio a’ch opsiynau’n dibynnu ar y math sydd gennych.',
    );
    await expect(paragraphs.nth(1)).toHaveText(
      'Gallwch ddysgu mwy am y gwahanol fathau o bensiynau yn ein canllaw Mathau o bensiynau a sut maen nhw’n gweithio. Gall eich darparwr pensiwn hefyd gadarnhau’n union pa fath a nodweddion sydd gennych.',
    );
    await expect(paragraphs.nth(2)).toHaveText(
      'Am ragor o gymorth a gwybodaeth am y gwahanol fathau o bensiynau, gweler ein hadran esbonio pensiynau.',
    );
  });
});
