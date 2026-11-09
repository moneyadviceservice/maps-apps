import { BasePage } from '@pages/Base.page';

export class CalculatorInput extends BasePage {
  get savingsGoal() {
    return this.page.getByTestId('savingGoal');
  }
  get savingsGoalTitle() {
    return this.page.locator('label[for="savingGoal"]').first();
  }
  get savingsByTitle() {
    return this.page
      .getByTestId('errors')
      .nth(1)
      .locator('fieldset > legend')
      .nth(0);
  }

  get howLongCanYouSaveDurationTitle() {
    return this.page.locator('label[for="amount"]');
  }
  get howLongCanYouSaveAmount() {
    return this.page.getByTestId('number-input');
  }
  get howLongCanYouSaveMonth() {
    return this.page.locator('#amountDuration');
  }

  get howMuchCanYouSaveMonthTitle() {
    return this.page.locator('label[for="durationMonth"]');
  }
  get howMuchCanYouSaveYearTitle() {
    return this.page.locator('label[for="durationYear"]');
  }
  get howMuchCanYouSaveMonth() {
    return this.page.locator('#durationMonth');
  }
  get howMuchCanYouSaveYear() {
    return this.page.locator('#durationYear');
  }

  get alreadySavedTitle() {
    return this.page.locator('label[for="saved"]');
  }
  get alreadySaved() {
    return this.page.getByTestId('saved');
  }

  get interestTitle() {
    return this.page.locator('label[for="interest"]');
  }
  get interestRate() {
    return this.page.getByTestId('interest');
  }

  get calculate() {
    return this.page.locator('button[type="submit"]').first();
  }

  get warningMessage() {
    return this.page.getByTestId('errors').nth(3).locator('p').first();
  }

  async inputHowLong({
    savingsGoal,
    howLongAmount,
    howLongMonth,
    alreadySaved,
    interestRate,
  }: {
    savingsGoal?: string;
    howLongAmount?: string;
    howLongMonth?: string;
    alreadySaved?: string;
    interestRate?: string;
  }) {
    if (savingsGoal != null) {
      await this.savingsGoal.fill(savingsGoal);
    }
    if (howLongAmount != null) {
      await this.howLongCanYouSaveAmount.fill(howLongAmount);
    }
    if (howLongMonth != null) {
      await this.howLongCanYouSaveMonth.selectOption(howLongMonth);
    }
    if (alreadySaved != null) {
      await this.alreadySaved.fill(alreadySaved);
    }
    if (interestRate != null) {
      await this.interestRate.fill(interestRate);
    }
  }

  async inputHowMuch({
    savingsGoal,
    howMuchMonth,
    howMuchYear,
    alreadySaved,
    interestRate,
  }: {
    savingsGoal?: string;
    howMuchMonth?: string;
    howMuchYear?: string;
    alreadySaved?: string;
    interestRate?: string;
  }) {
    if (savingsGoal != null) {
      await this.savingsGoal.fill(savingsGoal);
    }
    if (howMuchMonth != null) {
      await this.howMuchCanYouSaveMonth.selectOption(howMuchMonth);
    }
    if (howMuchYear != null) {
      await this.howMuchCanYouSaveYear.selectOption(howMuchYear);
    }
    if (alreadySaved != null) {
      await this.alreadySaved.fill(alreadySaved);
    }
    if (interestRate != null) {
      await this.interestRate.fill(interestRate);
    }
  }
}
