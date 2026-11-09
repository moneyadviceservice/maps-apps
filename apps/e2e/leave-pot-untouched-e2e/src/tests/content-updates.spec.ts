import { expect, test } from '@lib/test.lib';

/**
 * @tests 54819 - Leave Pot Untouched Calculator Content Updates
 * @test AC1: Content update on the leave pot untouched calculator EN
 * @test AC2: Content update on the leave pot untouched calculator CY
 */
test.describe('Leave Pot Untouched - Content Updates', () => {
  test.beforeEach(async ({ setCookieControl }) => {
    await setCookieControl();
  });

  test('AC1: Content update on the leave pot untouched calculator EN', async ({
    app,
  }) => {
    // Navigate to calculator page
    await app.goto();

    // Verify heading is updated to new text
    await expect(app.pageHeading).toBeVisible();
    const headingText = await app.getHeadingText();
    expect(headingText?.trim()).toBe(
      'Estimate how much your pension could be worth',
    );

    // Fill in the form
    await app.potField.fill('5600');
    await app.monthlyField.fill('22');

    // Submit the form
    await app.submitButton.click();

    // Wait for results to be visible
    await expect(app.resultsContainer).toBeVisible();

    // Verify results section contains updated text
    const resultsContent = await app.getResultsText();

    // Check for updated results description text
    expect(resultsContent).toContain('If you leave your pension invested');
    expect(resultsContent).toContain(
      'how its value might change over the next 5 years',
    );

    // Verify table headers are present
    const tableHeaders = await app.getTableHeaders();
    expect(tableHeaders).toContain('Years left untouched');
    expect(tableHeaders).toContain('Estimated pension value');

    // Verify instruction text below table
    const instructionText = await app.getInstructionText();
    expect(instructionText).toContain('pay in more or less');
    expect(instructionText).toContain('Enter a different amount');
  });

  test('AC2: Content update on the leave pot untouched calculator CY', async ({
    app,
    page,
  }) => {
    // Navigate to Welsh calculator page
    await page.goto('/cy/leave-pot-untouched');

    // Verify heading is updated to Welsh text
    await expect(app.pageHeading).toBeVisible();
    const headingText = await app.getHeadingText();
    expect(headingText?.trim()).toBe(
      'Amcangyfrif o faint y gallai eich pensiwn fod yn werth',
    );

    // Fill in the form
    await app.potField.fill('5600');
    await app.monthlyField.fill('22');

    // Submit the form
    await app.submitButton.click();

    // Wait for results to be visible
    await expect(app.resultsContainer).toBeVisible();

    // Verify results section contains updated Welsh text
    const resultsContent = await app.getResultsText();

    // Check for updated results description text (Welsh)
    expect(resultsContent).toContain(
      'byddwch chi’n gadael eich pensiwn wedi’i fuddsoddi',
    );
    expect(resultsContent).toContain('gallai ei werth newid dros y 5 mlynedd');

    // Verify Welsh table headers are present
    const tableHeaders = await app.getTableHeaders();
    expect(tableHeaders).toContain('Blynyddoedd sydd heb eu cyffwrdd');
    expect(tableHeaders).toContain('Amcangyfrif gwerth y pensiwn');

    // Verify Welsh instruction text below table
    const instructionText = await app.getInstructionText();
    expect(instructionText).toMatch(/mwy|llai/); // Welsh words for "more or less"
    expect(instructionText).toMatch(/digwydd|newid/); // Welsh words for "happens or changes"
  });
});
