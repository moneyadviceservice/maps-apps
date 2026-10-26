import { BasePage } from '@pages/Base.page';

export class AnnualIncomeComponent extends BasePage {
  get incomeDescription() {
    return this.page.getByTestId('paragraph').first();
  }

  get incomeSubtitle() {
    return this.page.locator('h2').first();
  }

  get incomeInput() {
    return this.page.getByTestId('annual-income');
  }

  get takeHomeInput() {
    return this.page.getByTestId('take-home');
  }

  get otherIncomeInput() {
    return this.page.getByTestId('other-income');
  }

  async secondApplicantCheckbox(option: 'yes' | 'no') {
    return this.page.getByTestId(`second-applicant-${option}`);
  }

  async secondApplicantRadioButton(option: 'yes' | 'no') {
    return this.page.locator(`label[for="q-second-applicant-${option}"]`);
  }

  get secondApplicantIncomeInput() {
    return this.page.getByTestId('sec-app-annual-income');
  }

  get secondApplicantTakeHomeInput() {
    return this.page.getByTestId('sec-app-take-home');
  }

  get secondApplicantOtherIncomeInput() {
    return this.page.getByTestId('sec-app-other-income');
  }

  get continueButton() {
    return this.page.locator('#continue');
  }

  private get errorContainer() {
    return this.page.getByTestId('error-summary-container');
  }

  async errorMessage(count: number) {
    return this.errorContainer.locator('li').nth(count);
  }
}
