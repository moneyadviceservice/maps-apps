import { expect, test } from '@lib/test.lib';

test.describe('Landing Page to Question 1 - Language Options Test', () => {
  test.beforeEach(async ({ landingPage, setCookieControl }) => {
    await setCookieControl();
    // Navigate to landing page using landingPage.goto() like the existing tests
    await landingPage.goto('/en/pension-type');
  });

  /**
   * @test Landing Page - User clicks Start Now and navigates to Question 1 page
   * Then verifies English options (Yes, No, Not sure) are present
   */
  test('Landing page - User navigates to question 1 with English options', async ({
    landingPage,
    question1Page,
  }) => {
    // Verify landing page is loaded
    await expect(landingPage.pageHeading).toBeVisible();

    // Click Start Now button
    await landingPage.clickStartNow();

    // Verify we're on question 1 page
    await expect(question1Page.title).toBeVisible();

    // Verify English options are present
    const enOptions = await question1Page.verifyEnglishOptions();
    expect(enOptions.hasYes).toBeTruthy();
    expect(enOptions.hasNo).toBeTruthy();
    expect(enOptions.hasNotSure).toBeTruthy();

    // Double check by getting all option labels
    const allOptions = await question1Page.getOptionLabels();
    expect(allOptions).toContain('Yes');
    expect(allOptions).toContain('No');
    expect(allOptions).toContain('Not sure');
  });

  /**
   * @test Landing Page - User clicks Cymraeg link and navigates to Welsh question 1
   * Then verifies Welsh options (Do, Na, Ddim yn siŵr) are present
   */
  test('Landing page - User navigates to question 1 with Welsh options', async ({
    landingPage,
    question1Page,
  }) => {
    // Verify landing page is loaded
    await expect(landingPage.pageHeading).toBeVisible();

    // Click Cymraeg link to switch to Welsh
    await landingPage.clickCymraeg();

    // Click Start Now button in Welsh
    await landingPage.clickStartNowCy();

    // Verify question 1 page title in Welsh has been UPDATED

    await expect(question1Page.title).toHaveText(
      'A gafodd eich pensiwn ei sefydlu gan eich cyflogwr?',
    );

    // Get all option labels
    const allOptions = await question1Page.getOptionLabels();

    // Verify Welsh options are present
    expect(allOptions).toContainEqual(expect.stringContaining('Do'));
    expect(allOptions).toContainEqual(expect.stringContaining('Na'));
    expect(allOptions).toContainEqual(expect.stringContaining('Ddim yn siŵr'));

    // Double check using verification method
    const cyOptions = await question1Page.verifyWelshOptions();
    expect(cyOptions.hasDo).toBeTruthy();
    expect(cyOptions.hasNa).toBeTruthy();
    expect(cyOptions.hasDdimYnSiwr).toBeTruthy();
  });
});
