import { Page, test } from '@maps/playwright';

class ScenarioSelectionPage {
  constructor(private readonly page: Page) {}

  readonly submitButton = `button:has-text("Submit")`;
  readonly retrievalOptionDev = 'radio-1';
  readonly retrievalOptionTest = 'radio-2';
  readonly dropdownLabel = 'Choose an option:';
  readonly dropdown = '#options';

  async selectScenarioFromComposer(scenarioOption: string): Promise<void> {
    const projectName = test.info().project.name;

    if (projectName.includes('lambdatest')) {
      await this.selectScenarioComposerTest(scenarioOption);
    } else {
      await this.selectScenarioComposerDev(scenarioOption);
    }
  }

  async selectScenario(scenarioOption: string): Promise<any> {
    await this.page.getByLabel(this.dropdownLabel).waitFor();
    await this.page
      .locator(this.dropdown)
      .selectOption({ value: scenarioOption });
    await this.page.locator(this.submitButton).click();
  }

  async selectScenarioComposerDev(scenarioOption: string): Promise<void> {
    const dropdown = this.page.locator(this.dropdown);
    const dataRetrievalOption = this.page.getByTestId(this.retrievalOptionDev);
    await this.page.waitForTimeout(3000);
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

    await this.page.waitForTimeout(1500);
    await dropdown.selectOption({ value: scenarioOption });
    await this.page.locator(this.submitButton).click({ force: true });
  }

  async selectScenarioComposerTest(scenarioOption: string): Promise<void> {
    const dropdown = this.page.locator(this.dropdown);
    const dataRetrievalOptionTest = this.page.getByTestId(
      this.retrievalOptionTest,
    );
    await this.page.waitForTimeout(3000);
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

    await this.page.waitForTimeout(500);
    await this.page.locator(this.submitButton).click();
  }

  async selectScenarioNonJs(scenarioOption: string): Promise<void> {
    const dropdown = this.page.locator(this.dropdown);
    //
    await this.page.waitForTimeout(3000);

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

    await this.page.waitForTimeout(500);
    await this.page.locator(this.submitButton).click();
  }
}

export default ScenarioSelectionPage;
