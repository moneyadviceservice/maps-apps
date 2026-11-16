import { BaseTabComponent } from '@pages/BaseTab.component';

export class BabyDueDateComponent extends BaseTabComponent {
  get babyDueDateTitle() {
    return this.page.locator('h1').first();
  }

  get babyDueDateDescription() {
    return this.page.locator('[data-testid="paragraph"]').first();
  }

  get babyDueDateDropdownTitle() {
    return this.page.locator('label[for="q-baby-due"]');
  }

  async selectBabyDueDate(months: string) {
    await this.page.getByTestId('baby-due').selectOption(months);
  }
}
