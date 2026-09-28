import { BasePage } from '@pages/Base.page';

export class SuccessfulResultsComponent extends BasePage {
  get resultsSubtitle() {
    return this.page.getByTestId('paragraph').first();
  }
  get offerValue() {
    return this.page.locator('h2').first();
  }
  private get warningResultsContainer() {
    return this.page.getByTestId('notification-box-warning-ResultsCallout');
  }
  private get succesfulResultsContainer() {
    return this.page.getByTestId('notification-box-positive-ResultsCallout');
  }
  get warningResultsTitle() {
    return this.warningResultsContainer.getByTestId('paragraph');
  }
  get warningResultsDetail() {
    return this.warningResultsContainer.locator('div');
  }
  get succesfulResultsTitle() {
    return this.succesfulResultsContainer.getByTestId('paragraph');
  }
  get succesfulResultsDetail() {
    return this.succesfulResultsContainer.locator('div');
  }
  get changeResultsTitle() {
    return this.page.locator('h2').nth(1);
  }

  get mortgageAmountInputTitle() {
    return this.page.locator('label[for="r-borrow-amount"]');
  }
  get mortgageAmountDescription() {
    return this.page.locator('#r-borrow-amount-description');
  }
  get mortgageAmountInput() {
    return this.page.getByTestId('borrow-amount');
  }
  get mortgageLengthDropdown() {
    return this.page.locator('#r-term');
  }
  get interestInput() {
    return this.page.getByTestId('interest');
  }
  get updateResultsButton() {
    return this.page.getByTestId('mac-update-results');
  }
  private get housingCostsContainer() {
    return this.page.getByTestId('dtc-table').first();
  }
  get currentMortgagePayment() {
    return this.housingCostsContainer.locator('td').first();
  }
  get newMortgagePayment() {
    return this.housingCostsContainer.locator('td').nth(1);
  }
  get compareHousingCostsDescription() {
    return this.page
      .getByTestId('compare-housing-costs')
      .getByTestId('dtc-description');
  }

  private get interestRatesContainer() {
    return this.page.getByTestId('what-if-interest-rates-rise');
  }
  get interestRatesLineOne() {
    return this.interestRatesContainer.locator('tr').nth(1);
  }
  get interestRatesLineTwo() {
    return this.interestRatesContainer.locator('tr').nth(2);
  }
  get interestRatesLineThree() {
    return this.interestRatesContainer.locator('tr').nth(3);
  }

  get interestRateMoneyLeft() {
    return this.interestRatesContainer
      .locator('tr')
      .nth(1)
      .locator('td')
      .nth(2);
  }

  private get errorContainer() {
    return this.page.getByTestId('error-summary-container');
  }
  get errorMessage() {
    return this.errorContainer.getByTestId('error-link-0');
  }

  private get canYouAffordThisContainer() {
    return this.page.getByTestId('can-you-afford-this');
  }
  get canYouAffordTakeHome() {
    return this.canYouAffordThisContainer.locator('td').first();
  }
  get canYouAffordNewMortgage() {
    return this.canYouAffordThisContainer.locator('td').nth(1);
  }
  get canYouAffordOtherCosts() {
    return this.canYouAffordThisContainer.locator('td').nth(2);
  }
  get canYouAffordLeftOver() {
    return this.canYouAffordThisContainer.locator('td').nth(3);
  }
}
