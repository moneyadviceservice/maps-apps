import { BasePage } from '@pages/Base.page';

export class YourResultsComponent extends BasePage {
  get resultsMessage() {
    return this.page.getByTestId('results-message');
  }
  get frequencyDropdown() {
    return this.page.getByTestId('results');
  }
  get employeeContributionTableHeader() {
    return this.page.locator('dt').nth(0);
  }
  get employeeContributionPrice() {
    return this.page.locator('dd').nth(0).locator(':scope > span.flex');
  }
  get employeeContributionTaxValue() {
    return this.page.locator('dd').nth(0).locator(':scope > :nth-child(2)');
  }
  get employerContributionTableHeader() {
    return this.page.locator('dt').nth(1);
  }
  get employerContributionPrice() {
    return this.page.locator('dd').nth(1);
  }
  get totalContributionTableHeader() {
    return this.page.locator('dt').nth(2);
  }
  get totalContributionPrice() {
    return this.page.locator('dd').nth(2);
  }
  get resetCalculatorButton() {
    return this.getLocatorByText('Reset the calculator');
  }
  get emailResultsButton() {
    return this.getLocatorByText('Email your results');
  }
  get printResultsButton() {
    return this.getLocatorByText('Print your results');
  }
}
