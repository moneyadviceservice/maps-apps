import { expect, test } from '@lib/test.lib';

/**
 * @tests 54816 - Cash In Chunks Calculator Content Updates
 * @test AC1: Content update on the cash in chunks calculator EN
 * @test AC2: Content update on the cash in chunks calculator CY
 */
test.describe('Cash In Chunks - Content Updates', () => {
  test.beforeEach(async ({ setCookieControl }) => {
    await setCookieControl();
  });

  test('AC1: Content update on the cash in chunks calculator EN', async ({
    app,
  }) => {
    // Navigate to calculator page
    await app.goto();

    // Verify heading is updated to new text
    await expect(app.pageHeading).toBeVisible();
    const headingText = await app.getHeadingText();
    expect(headingText?.trim()).toBe(
      'Estimate how much tax you’ll pay on a lump sum',
    );

    // Verify form labels contain updated English text
    const formLabels = await app.getFormLabels();
    const formLabelText = formLabels.join(' ');
    expect(formLabelText).toContain('yearly income');
    expect(formLabelText).toContain('pension');
    expect(formLabelText).toContain('lump sum');

    // Fill in the form
    await app.incomeField.fill('45666');
    await app.potField.fill('5600');
    await app.chunkField.fill('56');

    // Submit the form
    await app.submitButton.click();

    // Wait for results to be visible
    await expect(app.resultsContainer).toBeVisible();

    // Verify results section contains updated text
    const resultsContent = await app.getResultsText();

    // Check for updated results description text
    expect(resultsContent).toContain('Taking £');
    expect(resultsContent).toContain('could give you an estimated');

    // Verify tax calculation breakdown appears
    expect(resultsContent).toContain('tax');
    expect(resultsContent).toContain('pay');

    // Verify tax-free percentage text (25% tax-free on lump sum)
    expect(resultsContent).toContain('25%');

    // Verify disclaimer/tax text appears
    const disclaimerText = await app.getDisclaimerText();
    expect(disclaimerText.length).toBeGreaterThan(0);
    expect(disclaimerText).toContain('25%');

    // Verify advisory links are present
    const links = await app.getAdvisoryLinks();
    expect(links.length).toBeGreaterThan(0);

    // Verify instruction text appears
    const instructionText = await app.getInstructionText();
    expect(instructionText).toContain('See what happens');
  });

  test('AC2: Content update on the cash in chunks calculator CY', async ({
    app,
    page,
  }) => {
    // Navigate to Welsh calculator page
    await page.goto('/cy/cash-in-chunks');

    // Verify heading is updated to Welsh text
    await expect(app.pageHeading).toBeVisible();
    const headingText = await app.getHeadingText();
    expect(headingText?.trim()).toBe(
      'Amcangyfrif o faint o dreth byddwch chi’n ei dalu ar gyfandaliad',
    );

    // Verify form labels contain updated Welsh text
    const formLabels = await app.getFormLabels();
    const formLabelText = formLabels.join(' ');
    expect(formLabelText).toContain('incwm');
    expect(formLabelText).toContain('pensiwn');
    expect(formLabelText).toContain('cyfandaliad');

    // Fill in the form
    await app.incomeField.fill('45666');
    await app.potField.fill('5600');
    await app.chunkField.fill('56');

    // Submit the form
    await app.submitButton.click();

    // Wait for results to be visible
    await expect(app.resultsContainer).toBeVisible();

    // Verify results section contains updated Welsh text
    const resultsContent = await app.getResultsText();

    // Check for updated results description text (Welsh)
    expect(resultsContent).toContain('cymryd');
    expect(resultsContent).toContain('rhoi');

    // Verify tax calculation breakdown appears
    expect(resultsContent).toContain('treth');

    // Verify tax-free percentage text (25% tax-free on lump sum)
    expect(resultsContent).toContain('25%');

    // Verify disclaimer text appears (Welsh or English)
    const disclaimerText = await app.getDisclaimerText();
    expect(disclaimerText.length).toBeGreaterThan(0);
    expect(disclaimerText).toContain('25%');

    // Verify advisory links are present
    const links = await app.getAdvisoryLinks();
    expect(links.length).toBeGreaterThan(0);

    // Verify Welsh instruction text appears
    const instructionText = await app.getInstructionText();
    expect(instructionText).toContain('Gweler beth');
  });
});
