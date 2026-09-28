import { Page } from '@lib/test.lib';

type Country = 'England' | 'Scotland' | 'Wales' | 'Northern Ireland';
type AdviceOption = 'online' | 'telephone' | 'face-to-face';

const countryIndexes: Record<Country, number> = {
  England: 0,
  Scotland: 1,
  Wales: 2,
  'Northern Ireland': 3,
};

const adviceIndexes: Record<AdviceOption, number> = {
  online: 0,
  telephone: 1,
  'face-to-face': 2,
};

export class DebtAdviceLocatorPage {
  constructor(private readonly page: Page) {}

  get browserPage() {
    return this.page;
  }

  async goto() {
    await this.page.goto('/en/question-1');
  }

  get title() {
    return this.page.getByTestId('toolpage-span-title');
  }

  get heading() {
    return this.page.locator('#main h1');
  }

  get subHeading() {
    return this.page.locator('#main h2');
  }

  get content() {
    return this.page.locator('p[data-testid="paragraph"]').first();
  }

  get continueButton() {
    return this.page.locator('form button[type="submit"]');
  }

  get locationLabel() {
    return this.page.locator('label[for="q-4"]');
  }

  get location() {
    return this.page.locator('#q-4');
  }

  get errorSummary() {
    return this.page.getByTestId('error-summary-container');
  }

  get errorRecords() {
    return this.page.getByTestId('error-records').locator('li');
  }

  resultHeading(name: string) {
    return this.page.getByRole('heading', { name, exact: true });
  }

  async selectCountry(country: Country) {
    await this.page
      .locator(`label[for="id-${countryIndexes[country]}"]`)
      .click();
  }

  async selectSelfEmployed(value: boolean) {
    await this.page.locator(`label[for="id-${value ? 0 : 1}"]`).click();
  }

  async selectAdvice(option: AdviceOption) {
    await this.page.locator(`label[for="id-${adviceIndexes[option]}"]`).click();
  }

  async continue() {
    await this.continueButton.click();
  }

  async changeLocation() {
    await this.page
      .getByText('Choose a different location', { exact: true })
      .click();
  }
}
