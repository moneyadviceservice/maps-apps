import { BasePage } from '@pages/Base.page';

export class MonthlyCostsComponent extends BasePage {
  get monthlyFirstDescription() {
    return this.page.getByTestId('paragraph').first();
  }

  get monthlySecondDescription() {
    return this.page.getByTestId('paragraph').nth(1);
  }

  get essentialBillsTitle() {
    return this.page.locator('h2').first();
  }

  get travelLivingCostsTitle() {
    return this.page.locator('#t-costs');
  }

  get travelLivingCostsDescription() {
    return this.page.getByTestId('paragraph').nth(8);
  }

  get creditCardInput() {
    return this.page.getByTestId('card-and-loan');
  }

  get childAndSpouseInput() {
    return this.page.getByTestId('child-spousal');
  }

  get childcareInput() {
    return this.page.getByTestId('care-school');
  }

  get travelInput() {
    return this.page.getByTestId('travel');
  }

  get billsInsuranceInput() {
    return this.page.getByTestId('bills-insurance');
  }

  get rentMortgageInput() {
    return this.page.getByTestId('rent-mortgage');
  }

  get entertainmentInput() {
    return this.page.getByTestId('leisure');
  }

  get holidaysInput() {
    return this.page.getByTestId('holidays');
  }

  get foodInput() {
    return this.page.getByTestId('groceries');
  }

  get entertainmentHint() {
    return this.page.locator('#q-leisure-description').first();
  }

  get holidaysHint() {
    return this.page.locator('#q-holidays-description').first();
  }

  get continueButton() {
    return this.page.locator('#continue');
  }
}
