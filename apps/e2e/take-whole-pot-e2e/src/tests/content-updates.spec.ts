import { expect, test } from '@lib/test.lib';

/**
 * @tests 54817 - Take Whole Pot Calculator Content Updates
 * @test AC1: Content update on the take whole pot calculator EN
 * @test AC2: Content update on the take whole pot calculator CY
 */
test.describe('Take Whole Pot - Content Updates', () => {
  test.beforeEach(async ({ setCookieControl }) => {
    await setCookieControl();
  });

  test('AC1: Content update on the take whole pot calculator EN', async ({
    app,
  }) => {
    // Navigate to calculator page
    await app.goto();

    // Verify heading is updated to new text
    await expect(app.pageHeading).toBeVisible();
    const headingText = await app.getHeadingText();
    expect(headingText?.trim()).toBe(
      'Estimate the tax you’ll pay to take your pension in one go',
    );

    // Verify description contains updated intro text
    await expect(app.pageDescription).toBeVisible();
    const descriptionText = await app.getDescriptionText();
    expect(descriptionText).toContain(
      'Include any taxable income you get, such as your wages',
    );
    expect(descriptionText).toContain('certain benefits and the State Pension');

    // Fill in the form
    await app.incomeField.fill('25000');
    await app.potField.fill('100000');

    // Submit the form
    await app.submitButton.click();

    // Wait for results to be visible
    await expect(app.resultsContainer).toBeVisible();

    // US-59101: the allowance and adviser guidance is a single results bullet.
    await expect(app.resultCalloutListItems).toHaveCount(2);
    await expect(app.allowanceBullet).toHaveCount(1);
    await expect(app.allowanceBullet).toContainText('£268,275');
    await expect(app.allowanceLink).toContainText('lump sum allowance (LSA)');
    await expect(app.allowanceLink).toHaveAttribute(
      'href',
      'https://www.moneyhelper.org.uk/en/pensions-and-retirement/tax-and-pensions/lump-sum-allowances-for-pensions',
    );
    await expect(app.adviserLink).toContainText('regulated financial adviser');
    await expect(app.adviserLink).toHaveAttribute(
      'href',
      'https://www.moneyhelper.org.uk/en/pensions-and-retirement/taking-your-pension/find-a-retirement-adviser',
    );

    // Verify results section contains updated text
    const resultsContent = await app.getResultsText();

    // Check for new updated text in results
    expect(resultsContent).toContain('Taking a pension worth');
    expect(resultsContent).toContain('in one go could give you an estimated');
  });

  test('AC2: Content update on the take whole pot calculator CY', async ({
    app,
    page,
  }) => {
    // Navigate to Welsh calculator page
    await page.goto('/cy/take-whole-pot');

    // Verify heading is updated to Welsh text
    await expect(app.pageHeading).toBeVisible();
    const headingText = await app.getHeadingText();
    expect(headingText?.trim()).toBe(
      'Amcangyfrif o’r dreth byddwch chi’n ei dalu i gymryd eich pensiwn cyfan mewn un tro',
    );

    // Verify description contains updated Welsh intro text
    await expect(app.pageDescription).toBeVisible();
    const descriptionText = await app.getDescriptionText();
    expect(descriptionText).toContain('Dylech gynnwys unrhyw incwm trethadwy');
    expect(descriptionText).toContain(
      'fudd-daliadau penodol a Phensiwn y Wladwriaeth',
    );

    // Fill in the form
    await app.incomeField.fill('25000');
    await app.potField.fill('100000');

    // Submit the form
    await app.submitButton.click();

    // Wait for results to be visible
    await expect(app.resultsContainer).toBeVisible();

    // US-59101: the allowance and adviser guidance is a single results bullet.
    await expect(app.resultCalloutListItems).toHaveCount(2);
    await expect(app.allowanceBullet).toHaveCount(1);
    await expect(app.allowanceBullet).toContainText('£268,275');
    await expect(app.allowanceLink).toContainText('lwfans cyfandaliad (LSA)');
    await expect(app.allowanceLink).toHaveAttribute(
      'href',
      'https://www.moneyhelper.org.uk/cy/pensions-and-retirement/tax-and-pensions/lump-sum-allowances-for-pensions',
    );
    await expect(app.adviserLink).toContainText(
      'ymgynghorydd ariannol rheoleiddiedig',
    );
    await expect(app.adviserLink).toHaveAttribute(
      'href',
      'https://www.moneyhelper.org.uk/cy/pensions-and-retirement/taking-your-pension/find-a-retirement-adviser',
    );

    // Verify results section contains updated Welsh text
    const resultsContent = await app.getResultsText();

    // Check for new updated text in results (Welsh)
    expect(resultsContent).toContain('Bydd cymryd pensiwn gwerth');
    expect(resultsContent).toContain('mewn un tro yn rhoi amcangyfrif i chi o');
    expect(resultsContent).toContain('Rydym yn amcangyfrif y byddwch yn talu');
    expect(resultsContent).toContain('mewn treth');
  });
});
