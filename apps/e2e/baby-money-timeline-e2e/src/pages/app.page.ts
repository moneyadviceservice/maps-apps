import { Page } from '@lib/test.lib';

export class App {
  constructor(private readonly page: Page) {}

  async goto(endpoint = '') {
    await this.page.goto(endpoint);
  }

  get dayField() {
    return this.page.getByRole('textbox', { name: 'Day' });
  }

  get monthField() {
    return this.page.getByRole('textbox', { name: 'Month' });
  }

  get yearField() {
    return this.page.getByRole('textbox', { name: 'Year' });
  }

  get continueButton() {
    return this.page.locator('#continue');
  }

  get tabs() {
    return {
      weeks1to12: this.page.getByRole('tab', { name: 'Weeks 1 to 12' }),
      weeks13to27: this.page.getByRole('tab', { name: 'Weeks 13 to 27' }),
      weeks28to41: this.page.getByRole('tab', { name: 'Weeks 28 to 41' }),
      months0to6: this.page.getByRole('tab', { name: '0 to 6 months' }),
      months7to12: this.page.getByRole('tab', { name: '7 to 12 months' }),
      years1to2: this.page.getByRole('tab', { name: '1 to 2 years' }),
    };
  }

  async fillDueDateAndContinue(dueDate: Date) {
    const day = dueDate.getDate();
    const month = dueDate.getMonth() + 1; // Months are 0-indexed
    const year = dueDate.getFullYear();

    await this.dayField.fill(day.toString());
    await this.monthField.fill(month.toString());
    await this.yearField.fill(year.toString());
    await this.continueButton.click();
  }
}
