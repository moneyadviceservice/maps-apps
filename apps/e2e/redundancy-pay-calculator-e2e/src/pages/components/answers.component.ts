import { BasePage } from '@pages/Base.page';

export class AnswersComponent extends BasePage {
  get location() {
    return this.page.getByTestId('answer-1').first();
  }
  get dateOfBirth() {
    return this.page.getByTestId('answer-2').first();
  }
  get redundantDate() {
    return this.page.getByTestId('answer-3').first();
  }
  get employerDate() {
    return this.page.getByTestId('answer-4').first();
  }
  get income() {
    return this.page.getByTestId('answer-5').first();
  }
  get redundancyOption() {
    return this.page.getByTestId('answer-6').first();
  }
  get redundancyPay() {
    return this.page.getByTestId('answer-7').first();
  }
  get continueButton() {
    return this.page.getByTestId('next-page-button');
  }
}
