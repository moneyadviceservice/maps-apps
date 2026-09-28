import { expect } from '@lib/test.lib';
import { BasePage } from '@pages/Base.page';

//Kept all possible inputs for scalability
export enum Travel {
  fuel = 'petrol-diesel',
  insurance = 'car-insurance',
  breakdown = 'breakdown-cover',
  tax = 'car-tax',
  finance = 'car-finance',
  loan = 'loan-insurance',
  mot = 'mot',
  maintenance = 'maintenance',
  parking = 'parking',
  bus = 'bus',
  trains = 'trains',
  taxis = 'taxis',
  airTravel = 'air',
}
export type TravelKey = keyof typeof Travel;

//Kept all possible inputs for scalability
export enum TravelGroups {
  'Car costs' = 0,
  'Public transport' = 1,
  'Your additional items' = 2,
}
export type TravelGroupsKey = keyof typeof TravelGroups;

//Kept all possible inputs for scalability
const GroupByField: Record<TravelKey, TravelGroupsKey> = {
  fuel: 'Car costs',
  insurance: 'Car costs',
  breakdown: 'Car costs',
  tax: 'Car costs',
  finance: 'Car costs',
  loan: 'Car costs',
  mot: 'Car costs',
  maintenance: 'Car costs',
  parking: 'Car costs',

  bus: 'Public transport',
  trains: 'Public transport',
  taxis: 'Public transport',
  airTravel: 'Public transport',
};

export class TravelComponent extends BasePage {
  get travelTitle() {
    return this.page.locator('h1').first();
  }

  async travelGroupDropdown(key: TravelGroupsKey) {
    return this.page
      .locator('details[data-testid="expandable-section"].border-slate-400')
      .nth(TravelGroups[key]);
  }

  async travelFieldInput(key: TravelKey) {
    return this.page.locator(`#input-${Travel[key]}`);
  }

  async travelFieldFrequency(key: TravelKey) {
    return this.page.locator(`[name="${Travel[key]}-factor"]`);
  }

  async travelItemTitle(key: TravelKey) {
    return this.page.locator(`label[for="input-${Travel[key]}`);
  }

  async travelFieldMoreInfoButton(key: TravelKey) {
    const inputId = `input-${Travel[key]}`;
    return this.page.locator(
      `div.flex.flex-col:has(#${inputId}) [data-testid="expandable-section"]`,
    );
  }

  async travelFieldMoreInfoContent(key: TravelKey) {
    const inputId = `input-${Travel[key]}`;
    return this.page.locator(
      `div.flex.flex-col:has(#${inputId}) [data-testid="expandable-section"] > div`,
    );
  }

  async additonalItemText(rowNum: string) {
    return this.page.locator(
      `input[name="travel-additional-field-${rowNum}-title"]`,
    );
  }

  async additonalItemPrice(rowNum: string) {
    return this.page.locator(`#input-travel-additional-field-${rowNum}"]`);
  }

  async additonalItemFrequency(rowNum: string) {
    return this.page.locator(
      `select[aria-description="travel-additional-field-${rowNum}"]`,
    );
  }

  async expandSection(key: TravelGroupsKey) {
    const section = await this.travelGroupDropdown(key);
    await expect(section).toBeVisible();
    const isOpen = await section.evaluate(
      (element) => (element as HTMLDetailsElement).open,
    );
    if (!isOpen) {
      await section.click();
    }
  }

  async expandSectionForField(key: TravelKey) {
    await this.expandSection(GroupByField[key]);
  }

  async fillInput(key: TravelKey, value: string) {
    await this.expandSectionForField(key);
    const input = await this.travelFieldInput(key);
    await input.fill(value);
  }

  async fillFactorInput(key: TravelKey, value: number) {
    await this.expandSectionForField(key);
    const input = await this.travelFieldFrequency(key);
    await input.selectOption({ index: value });
  }
}
