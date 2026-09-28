import { BasePage } from '@pages/Base.page';

export class YourDetailsComponent extends BasePage {
  get yourDetailsTitle() {
    return this.page.locator('h2').first();
  }

  get ageInput() {
    return this.page.locator('#age');
  }

  get salaryInput() {
    return this.page.locator('#salary');
  }

  get salaryFrequencyDropdown() {
    return this.page.locator('#frequency');
  }

  salaryContributionCheckbox(id: string) {
    return this.page.locator(`label[for="${id}"]`);
  }

  get fullSalaryContributionCheckbox() {
    return this.salaryContributionCheckbox('contributionType-0');
  }

  get partSalaryContributionCheckbox() {
    return this.salaryContributionCheckbox('contributionType-1');
  }

  get submitButton() {
    return this.page.locator('#submit');
  }

  get ageMessage() {
    return this.page
      .getByTestId('errors')
      .nth(0)
      .locator('..')
      .locator('div[aria-live="polite"]');
  }

  get salaryPrimaryMessage() {
    return this.page
      .getByTestId('errors')
      .nth(1)
      .locator('..')
      .locator('div[aria-live="polite"]')
      .nth(0);
  }

  get salarySecondaryMessage() {
    return this.page
      .getByTestId('errors')
      .nth(1)
      .locator('..')
      .locator('div[aria-live="polite"]')
      .nth(1);
  }
}
