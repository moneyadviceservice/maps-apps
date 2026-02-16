import { Page, test } from '@maps/playwright';

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
  selectScenarioFromComposer(
    page: Page,
    scenarioOption: string,
    projectName: string,
  ): Promise<void>;
};

const scenarioSelectionPage: ScenarioSelectionPage = {
  submitButton: `button:has-text("Submit")`,
  retrievalOptionDev: 'radio-1',
  retrievalOptionTest: 'radio-2',
  dropdownLabel: 'Choose an option:',
  dropdown: '#options',

  async selectScenarioFromComposer(
    page: Page,
    scenarioOption: string,
  ): Promise<void> {
    const projectName = test.info().project.name;

    if (projectName.includes('lambdatest')) {
      await scenarioSelectionPage.selectScenarioComposerTest(
        page,
        scenarioOption,
      );
    } else {
      await scenarioSelectionPage.selectScenarioComposerDev(
        page,
        scenarioOption,
      );
    }
  },

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

    await page.waitForTimeout(1500);
    await dropdown.selectOption({ value: scenarioOption });
    await page.locator(this.submitButton).click({ force: true });
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
