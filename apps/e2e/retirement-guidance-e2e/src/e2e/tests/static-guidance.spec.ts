import { expect, test } from '@playwright/test';

import { QUESTION_2_ANSWERS } from '../pages/question2Page';
import questionnaireNavigator from '../pages/questionnaireNavigator';
import resultsPage from '../pages/resultsPage';

/**
 * @tests User Story 50723
 * @test AC1  Static Guidance Scams – less than 10 years from retirement displays SGR6
 * @test AC2  Static Guidance Scams – more than 10 years from retirement displays SGR6
 * @test AC3  Static Guidance Scams – already retired displays SGR6
 * @test AC4  Static Guidance Death benefits – less than 10 years displays SGR5
 * @test AC5  Static Guidance Death benefits – more than 10 years displays SGR4
 * @test AC6  Static Guidance Death benefits – already retired displays SGR5
 * @test AC7  Static Guidance Benefits – less than 10 years displays SGR2
 * @test AC8  Static Guidance Benefits – more than 10 years displays SGR1
 * @test AC9  Static Guidance Benefits – already retired displays SGR2
 * @test AC10 Static Guidance Gender pension gap – less than 10 years displays SGR3
 * @test AC11 Static Guidance Gender pension gap – more than 10 years displays SGR3
 * @test AC12 Static Guidance Gender pension gap – already retired displays no guidance
 * @test AC1  Static Guidance State Pension Eligibility – less than 10 years displays SGR7
 * @test AC2  Static Guidance State Pension Eligibility – more than 10 years displays SGR7
 * @test AC3  Static Guidance State Pension Eligibility – already retired displays SGR7
 * @test AC4  Static Guidance State Pension Eligibility – SGR7 is the first static guidance package
 * @test      Static Guidance State Pension Eligibility – SGR7 title copy
 * @test      Static Guidance State Pension Eligibility – SGR7 paragraph3 copy
 * @test      Static Guidance State Pension Eligibility – SGR7 paragraph5 copy
 * @test      Static Guidance State Pension Eligibility – SGR7 Future Pension Centre helpline link
 * @test      Static Guidance State Pension Eligibility – SGR7 apply by post link
 * @test      Static Guidance State Pension Eligibility – SGR7 voluntary NI contributions guide link
 */
test.describe('Retirement Guidance - Results – Static Guidance', () => {
  test.describe('Static Guidance – State Pension Eligibility', () => {
    test('AC1: Less than 10 years from retirement displays guidance package SGR7', async ({
      page,
    }) => {
      await questionnaireNavigator.skipToResults(page, { q2Answer: 'Yes' });
      await expect(
        resultsPage.getGuidanceSection(
          page,
          'state-pension-eligibility-sgr7-section',
        ),
      ).toBeVisible();
    });

    test('AC2: More than 10 years from retirement displays guidance package SGR7', async ({
      page,
    }) => {
      await questionnaireNavigator.skipToResults(page, { q2Answer: 'No' });
      await expect(
        resultsPage.getGuidanceSection(
          page,
          'state-pension-eligibility-sgr7-section',
        ),
      ).toBeVisible();
    });

    test('AC3: Already retired displays guidance package SGR7', async ({
      page,
    }) => {
      await questionnaireNavigator.skipToResults(page, {
        q2Answer: 'I\u2019ve already retired',
      });
      await expect(
        resultsPage.getGuidanceSection(
          page,
          'state-pension-eligibility-sgr7-section',
        ),
      ).toBeVisible();
    });

    test('AC4: SGR7 is displayed as the first static guidance package', async ({
      page,
    }) => {
      await questionnaireNavigator.skipToResults(page, { q2Answer: 'Yes' });

      const sgr7Section = resultsPage.getGuidanceSection(
        page,
        'state-pension-eligibility-sgr7-section',
      );
      const scamsSection = resultsPage.getGuidanceSection(
        page,
        'scams-sgr6-section',
      );

      const sgr7Box = await sgr7Section.boundingBox();
      const scamsBox = await scamsSection.boundingBox();

      expect(sgr7Box!.y).toBeLessThan(scamsBox!.y);
    });
  });

  test.describe('Static Guidance – State Pension Eligibility – EN copy', () => {
    test.beforeEach(async ({ page }) => {
      await questionnaireNavigator.skipToResults(page, { q2Answer: 'Yes' });
      // open the expandable section to expose content
      await resultsPage
        .getGuidanceSection(page, 'state-pension-eligibility-sgr7-section')
        .click();
    });

    test('SGR7 title copy is correct', async ({ page }) => {
      await expect(
        resultsPage.getGuidanceSection(
          page,
          'state-pension-eligibility-sgr7-section',
        ),
      ).toContainText("Check you're on track to get the full State Pension");
    });

    test('SGR7 paragraph3 copy is correct', async ({ page }) => {
      await expect(
        resultsPage.getGuidanceSection(
          page,
          'state-pension-eligibility-sgr7-section',
        ),
      ).toContainText(
        'Provided you will not reach your State Pension age within 30 days, you can also:',
      );
    });

    test('SGR7 paragraph5 copy is correct', async ({ page }) => {
      await expect(
        resultsPage.getGuidanceSection(
          page,
          'state-pension-eligibility-sgr7-section',
        ),
      ).toContainText(
        'This can mean you pay hundreds now to get thousands back in extra income later \u2013 depending on how long you live.',
      );
    });

    test('SGR7 Future Pension Centre helpline link is present', async ({
      page,
    }) => {
      await expect(
        resultsPage.getSectionLinkByHref(
          page,
          'state-pension-eligibility-sgr7-section',
          'https://www.gov.uk/future-pension-centre',
        ),
      ).toBeVisible();
    });

    test('SGR7 apply by post link is present', async ({ page }) => {
      await expect(
        resultsPage.getSectionLinkByHref(
          page,
          'state-pension-eligibility-sgr7-section',
          'https://www.gov.uk/government/publications/application-for-a-state-pension-statement',
        ),
      ).toBeVisible();
    });

    test('SGR7 voluntary NI contributions guide link is present', async ({
      page,
    }) => {
      await expect(
        resultsPage.getSectionLinkByHref(
          page,
          'state-pension-eligibility-sgr7-section',
          'voluntary-national-insurance-contributions',
        ),
      ).toBeVisible();
    });
  });

  test.describe('Static Guidance – Scams', () => {
    test('AC1: Less than 10 years from retirement displays guidance package SGR6', async ({
      page,
    }) => {
      await questionnaireNavigator.skipToResults(page, { q2Answer: 'Yes' });
      await expect(
        resultsPage.getGuidanceSection(page, 'scams-sgr6-section'),
      ).toBeVisible();
    });

    test('AC2: More than 10 years from retirement displays guidance package SGR6', async ({
      page,
    }) => {
      await questionnaireNavigator.skipToResults(page, { q2Answer: 'No' });
      await expect(
        resultsPage.getGuidanceSection(page, 'scams-sgr6-section'),
      ).toBeVisible();
    });

    test('AC3: Already retired displays guidance package SGR6', async ({
      page,
    }) => {
      await questionnaireNavigator.skipToResults(page, {
        q2Answer: QUESTION_2_ANSWERS.ALREADY_RETIRED,
      });
      await expect(
        resultsPage.getGuidanceSection(page, 'scams-sgr6-section'),
      ).toBeVisible();
    });
  });

  test.describe('Static Guidance – Death benefits and estate planning', () => {
    test('AC4: Less than 10 years from retirement displays guidance package SGR5', async ({
      page,
    }) => {
      await questionnaireNavigator.skipToResults(page, { q2Answer: 'Yes' });
      await expect(
        resultsPage.getGuidanceSection(page, 'death-benefits-sgr5-section'),
      ).toBeVisible();
      await expect(
        resultsPage.getGuidanceSection(page, 'death-benefits-sgr4-section'),
      ).not.toBeAttached();
    });

    test('AC5: More than 10 years from retirement displays guidance package SGR4', async ({
      page,
    }) => {
      await questionnaireNavigator.skipToResults(page, { q2Answer: 'No' });
      await expect(
        resultsPage.getGuidanceSection(page, 'death-benefits-sgr4-section'),
      ).toBeVisible();
      await expect(
        resultsPage.getGuidanceSection(page, 'death-benefits-sgr5-section'),
      ).not.toBeAttached();
    });

    test('AC6: Already retired displays guidance package SGR5', async ({
      page,
    }) => {
      await questionnaireNavigator.skipToResults(page, {
        q2Answer: QUESTION_2_ANSWERS.ALREADY_RETIRED,
      });
      await expect(
        resultsPage.getGuidanceSection(page, 'death-benefits-sgr5-section'),
      ).toBeVisible();
      await expect(
        resultsPage.getGuidanceSection(page, 'death-benefits-sgr4-section'),
      ).not.toBeAttached();
    });
  });

  test.describe('Static Guidance – Benefits', () => {
    test('AC7: Less than 10 years from retirement displays guidance package SGR2', async ({
      page,
    }) => {
      await questionnaireNavigator.skipToResults(page, { q2Answer: 'Yes' });
      await expect(
        resultsPage.getGuidanceSection(page, 'retirement-pre-benefits-section'),
      ).toBeVisible();
      await expect(
        resultsPage.getGuidanceSection(page, 'retirement-benefits-section'),
      ).not.toBeAttached();
    });

    test('AC8: More than 10 years from retirement displays guidance package SGR1', async ({
      page,
    }) => {
      await questionnaireNavigator.skipToResults(page, { q2Answer: 'No' });
      await expect(
        resultsPage.getGuidanceSection(page, 'retirement-benefits-section'),
      ).toBeVisible();
      await expect(
        resultsPage.getGuidanceSection(page, 'retirement-pre-benefits-section'),
      ).not.toBeAttached();
    });

    test('AC9: Already retired displays guidance package SGR2', async ({
      page,
    }) => {
      await questionnaireNavigator.skipToResults(page, {
        q2Answer: QUESTION_2_ANSWERS.ALREADY_RETIRED,
      });
      await expect(
        resultsPage.getGuidanceSection(page, 'retirement-pre-benefits-section'),
      ).toBeVisible();
      await expect(
        resultsPage.getGuidanceSection(page, 'retirement-benefits-section'),
      ).not.toBeAttached();
    });
  });

  test.describe('Static Guidance – Gender pension gap', () => {
    test('AC10: Less than 10 years from retirement displays guidance package SGR3', async ({
      page,
    }) => {
      await questionnaireNavigator.skipToResults(page, { q2Answer: 'Yes' });
      await expect(
        resultsPage.getGuidanceSection(page, 'gender-pension-gap-sgr3-section'),
      ).toBeVisible();
    });

    test('AC11: More than 10 years from retirement displays guidance package SGR3', async ({
      page,
    }) => {
      await questionnaireNavigator.skipToResults(page, { q2Answer: 'No' });
      await expect(
        resultsPage.getGuidanceSection(page, 'gender-pension-gap-sgr3-section'),
      ).toBeVisible();
    });

    test('AC12: Already retired displays no guidance package', async ({
      page,
    }) => {
      await questionnaireNavigator.skipToResults(page, {
        q2Answer: QUESTION_2_ANSWERS.ALREADY_RETIRED,
      });
      await expect(
        resultsPage.getGuidanceSection(page, 'gender-pension-gap-sgr3-section'),
      ).not.toBeAttached();
    });
  });
});
