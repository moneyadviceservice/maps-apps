import { BasePage } from '@pages/Base.page';

export class YourContributionsComponent extends BasePage {
  get yourDetailsTitle() {
    return this.page.locator('h2').nth(2);
  }

  get yourContributionsMessage() {
    return this.page.getByTestId('contribution-message');
  }

  get employerContribution() {
    return this.page.locator('#employerContribution');
  }

  get employeeContribution() {
    return this.page.locator('#employeeContribution');
  }

  get submitButton() {
    return this.page.locator('#submit:not([disabled])');
  }

  get totalContributionError() {
    return this.page.locator('[data-testid="errors"].border-red-600');
  }

  get employerContributionError() {
    return this.page.locator('#employerContribution-error');
  }
}
