import { Page } from '@playwright/test';

type ScenarioSelectionPage = {
  submitButton: string;
  dropdown: string;
  dropdownLabel: string;
  selectScenario(page: Page, scenarioOption: string): Promise<any>;
};

const scenarioSelectionPage: ScenarioSelectionPage = {
  submitButton: `button:has-text("Submit")`,
  dropdownLabel: 'Choose an option:',
  dropdown: 'select',

  async selectScenario(page: Page, scenarioOption: string): Promise<any> {
    await page.getByLabel(this.dropdownLabel).waitFor();
    await page.locator(this.dropdown).selectOption({ value: scenarioOption });
    await page.locator(this.submitButton).click();
  },
};

export default scenarioSelectionPage;
