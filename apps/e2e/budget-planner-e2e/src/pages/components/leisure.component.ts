import { expect } from '@lib/test.lib';
import { BasePage } from '@pages/Base.page';

//Kept all possible inputs for scalability
export enum Leisure {
  cinema = 'cinema-theatre-trips',
  daysOut = 'days-out',
  tv = 'books-etc',
  hobbies = 'hobbies',
  eatingOut = 'eating-out',
  healthFitness = 'sport',
  lottery = 'lottery',
  booksGames = 'newspapers',

  birthdays = 'birthdays',
  christmas = 'christmas',
  otherCelebrations = 'festivals-celebrations',
  weddings = 'weddings',

  holidays = 'holidays',
  travelInsurance = 'insurance',
  spendingMoney = 'spending-money',
}
export type LeisureKey = keyof typeof Leisure;

//Kept all possible inputs for scalability
export enum LeisureGroups {
  'Entertainment' = 0,
  'One-offs' = 1,
  'Holidays' = 2,
  'Your additional items' = 3,
}
export type LeisureGroupsKey = keyof typeof LeisureGroups;

//Kept all possible inputs for scalability
const GroupByField: Record<LeisureKey, LeisureGroupsKey> = {
  cinema: 'Entertainment',
  daysOut: 'Entertainment',
  tv: 'Entertainment',
  hobbies: 'Entertainment',
  eatingOut: 'Entertainment',
  healthFitness: 'Entertainment',
  lottery: 'Entertainment',
  booksGames: 'Entertainment',

  birthdays: 'One-offs',
  christmas: 'One-offs',
  otherCelebrations: 'One-offs',
  weddings: 'One-offs',

  holidays: 'Holidays',
  travelInsurance: 'Holidays',
  spendingMoney: 'Holidays',
};

export class LeisureComponent extends BasePage {
  get leisureTitle() {
    return this.page.locator('h1').first();
  }

  async leisureGroupDropdown(key: LeisureGroupsKey) {
    return this.page
      .locator('details[data-testid="expandable-section"].border-slate-400')
      .nth(LeisureGroups[key]);
  }

  async leisureFieldInput(key: LeisureKey) {
    return this.page.locator(`#input-${Leisure[key]}`);
  }

  async leisureFieldFrequency(key: LeisureKey) {
    return this.page.locator(`[name="${Leisure[key]}-factor"]`);
  }

  async leisureItemTitle(key: LeisureKey) {
    return this.page.locator(`label[for="input-${Leisure[key]}`);
  }

  async leisureFieldMoreInfoButton(key: LeisureKey) {
    const inputId = `input-${Leisure[key]}`;
    return this.page.locator(
      `div.flex.flex-col:has(#${inputId}) [data-testid="expandable-section"]`,
    );
  }

  async leisureFieldMoreInfoContent(key: LeisureKey) {
    const inputId = `input-${Leisure[key]}`;
    return this.page.locator(
      `div.flex.flex-col:has(#${inputId}) [data-testid="expandable-section"] > div`,
    );
  }

  async additonalItemText(rowNum: string) {
    return this.page.locator(
      `input[name="leisure-additional-field-${rowNum}-title"]`,
    );
  }

  async additonalItemPrice(rowNum: string) {
    return this.page.locator(`#input-leisure-additional-field-${rowNum}"]`);
  }

  async additonalItemFrequency(rowNum: string) {
    return this.page.locator(
      `select[aria-description="leisure-additional-field-${rowNum}"]`,
    );
  }

  async expandSection(key: LeisureGroupsKey) {
    const section = await this.leisureGroupDropdown(key);
    await expect(section).toBeVisible();
    const isOpen = await section.evaluate(
      (element) => (element as HTMLDetailsElement).open,
    );
    if (!isOpen) {
      await section.click();
    }
  }

  private async expandSectionForField(key: LeisureKey) {
    await this.expandSection(GroupByField[key]);
  }

  async fillInput(key: LeisureKey, value: string) {
    await this.expandSectionForField(key);
    const input = await this.leisureFieldInput(key);
    await input.fill(value);
  }

  async fillFactorInput(key: LeisureKey, value: number) {
    await this.expandSectionForField(key);
    const input = await this.leisureFieldFrequency(key);
    await input.selectOption({ index: value });
  }
}
