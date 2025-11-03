import { Page } from '@playwright/test';

type ScenarioSelectionPage = {
  submitButton: string;
  dropdown: string;
  dropdownLabel: string;
  retrievalOptionDev: string;
  retrievalOptionTest: string;
  selectScenario(page: Page, scenarioOption: string): Promise<void>;
  selectScenarioComposerDev(page: Page, scenarioOption: string): Promise<void>;
  selectScenarioComposerTest(page: Page, scenarioOption: string): Promise<void>;
  selectScenarioNonJs(page: Page, scenarioOption: string): Promise<void>;
};

const scenarioSelectionPage: ScenarioSelectionPage = {
  submitButton: `button:has-text("Submit")`,
  retrievalOptionDev: 'radio-1',
  retrievalOptionTest: 'radio-2',
  dropdownLabel: 'Choose an option:',
  dropdown: 'select',

  async selectScenario(page: Page, scenarioOption: string): Promise<any> {
    await page.getByLabel(this.dropdownLabel).waitFor();
    await page.locator(this.dropdown).selectOption({ value: scenarioOption });
    await page.locator(this.submitButton).click();
  },

  async selectScenarioComposerDev(
    page: Page,
    scenarioOption: string,
  ): Promise<void> {
    const dropdown = page.locator(this.dropdown);
    const dataRetrievalOption = page.getByTestId(this.retrievalOptionDev);
    await page.waitForTimeout(3000);
    await dataRetrievalOption.check();

    // Handle missing option, quicker debugging.
    const optionValues = await dropdown
      .locator('option')
      .evaluateAll((options) =>
        options.map((option: HTMLOptionElement) => option.value),
      );

    if (!optionValues.includes(scenarioOption))
      throw new Error(
        `Option "${scenarioOption}" was not found in the composer dropdown.`,
      );

    await dropdown.click();
    await dropdown.selectOption({ value: scenarioOption });

    await page.waitForTimeout(500);
    await page.locator(this.submitButton).click();
  },

  async selectScenarioComposerTest(
    page: Page,
    scenarioOption: string,
  ): Promise<void> {
    const dropdown = page.locator(this.dropdown);
    const dataRetrievalOptionTest = page.getByTestId(this.retrievalOptionTest);
    await page.waitForTimeout(3000);
    await dataRetrievalOptionTest.check();

    // Handle missing option, quicker debugging.
    const optionValues = await dropdown
      .locator('option')
      .evaluateAll((options) =>
        options.map((option: HTMLOptionElement) => option.value),
      );

    if (!optionValues.includes(scenarioOption))
      throw new Error(
        `Option "${scenarioOption}" was not found in the composer dropdown.`,
      );

    await dropdown.click();
    await dropdown.selectOption({ value: scenarioOption });

    await page.waitForTimeout(500);
    await page.locator(this.submitButton).click();
  },

  async selectScenarioNonJs(page: Page, scenarioOption: string): Promise<void> {
    const dropdown = page.locator(this.dropdown);
    //
    await page.waitForTimeout(3000);

    // Handle missing option, quicker debugging.
    const optionValues = await dropdown
      .locator('option')
      .evaluateAll((options) =>
        options.map((option: HTMLOptionElement) => option.value),
      );

    if (!optionValues.includes(scenarioOption))
      throw new Error(
        `Option "${scenarioOption}" was not found in the composer dropdown.`,
      );

    await dropdown.click();
    await dropdown.selectOption({ value: scenarioOption });

    await page.waitForTimeout(500);
    await page.locator(this.submitButton).click();
  },
};

export default scenarioSelectionPage;
