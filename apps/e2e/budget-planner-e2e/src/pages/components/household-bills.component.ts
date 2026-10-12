import { BasePage } from '@pages/Base.page';

//Kept all possible inputs for scalability
export enum Household {
  mortgageRepayment = 'mortgage',
  rent = 'rent',
  mortgageEndowment = 'endowment',
  mortgageLifeInsurance = 'insurance',

  groundRent = 'ground-rent',
  serviceCharge = 'service-charge',

  buildingInsurance = 'buildings-insurance',
  contentInsurance = 'contents-insurance',

  councilTax = 'council-tax',
  gas = 'gas',
  electricity = 'electricity',
  otherFuel = 'other-fuel',
  water = 'water',
  homePhone = 'home-phone',
  tvLicence = 'tv-licence',
  satelliteTv = 'cabel-or-satellite',
  homeMaintenance = 'home-maintenance',
  gardenMaintenance = 'garden-maintenance',
  applicanceRental = 'appliance-rental',
  boiler = 'boiler-cover',
}
export type HouseholdKey = keyof typeof Household;

//Kept all possible inputs for scalability
export enum HouseholdGroups {
  'Mortgage & rent' = 0,
  'Other property charges' = 1,
  'Home insurance' = 2,
  'Utilities' = 3,
  'Your additional items' = 4,
}
export type HouseholdGroupsKey = keyof typeof HouseholdGroups;

//Kept all possible inputs for scalability
const GroupByField: Record<HouseholdKey, HouseholdGroupsKey> = {
  mortgageRepayment: 'Mortgage & rent',
  rent: 'Mortgage & rent',
  mortgageEndowment: 'Mortgage & rent',
  mortgageLifeInsurance: 'Mortgage & rent',

  groundRent: 'Other property charges',
  serviceCharge: 'Other property charges',

  buildingInsurance: 'Home insurance',
  contentInsurance: 'Home insurance',

  councilTax: 'Utilities',
  gas: 'Utilities',
  electricity: 'Utilities',
  otherFuel: 'Utilities',
  water: 'Utilities',
  homePhone: 'Utilities',
  tvLicence: 'Utilities',
  satelliteTv: 'Utilities',
  homeMaintenance: 'Utilities',
  gardenMaintenance: 'Utilities',
  applicanceRental: 'Utilities',
  boiler: 'Utilities',
};

export class HouseholdComponent extends BasePage {
  get nonEssentialsTitle() {
    return this.page.locator('h1').first();
  }

  get nonEssentialsDescription() {
    return this.page.locator('[data-testid="paragraph"]').first();
  }

  async householdGroupDropdown(key: HouseholdGroupsKey) {
    return this.page
      .locator('details[data-testid="expandable-section"].border-slate-400')
      .nth(HouseholdGroups[key]);
  }

  async householdFieldInput(key: HouseholdKey) {
    return this.page.locator(`#input-${Household[key]}`);
  }

  async householdFieldFrequency(key: HouseholdKey) {
    return this.page.locator(`[name="${Household[key]}-factor"]`);
  }

  async householdItemTitle(key: HouseholdKey) {
    return this.page.locator(`label[for="input-${Household[key]}`);
  }

  async householdFieldMoreInfoButton(key: HouseholdKey) {
    const inputId = `input-${Household[key]}`;
    return this.page.locator(
      `div.flex.flex-col:has(#${inputId}) [data-testid="expandable-section"]`,
    );
  }

  async householdFieldMoreInfoContent(key: HouseholdKey) {
    const inputId = `input-${Household[key]}`;
    return this.page.locator(
      `div.flex.flex-col:has(#${inputId}) [data-testid="expandable-section"] > div`,
    );
  }

  async additonalItemText(rowNum: string) {
    return this.page.locator(
      `input[name="householdbills-additional-field-${rowNum}-title"]`,
    );
  }

  async additonalItemPrice(rowNum: string) {
    return this.page.locator(
      `#input-householdbills-additional-field-${rowNum}"]`,
    );
  }

  async additonalItemFrquency(rowNum: string) {
    return this.page.locator(
      `select[aria-description="householdbills-additional-field-${rowNum}"]`,
    );
  }

  async expandSection(key: HouseholdGroupsKey) {
    const section = await this.householdGroupDropdown(key);
    const isOpen = await section.evaluate(
      (element) => (element as HTMLDetailsElement).open,
    );
    if (!isOpen) {
      await section.click();
    }
  }

  private async expandSectionForField(key: HouseholdKey) {
    await this.expandSection(GroupByField[key]);
  }

  async fillInput(key: HouseholdKey, value: string) {
    await this.expandSectionForField(key);
    const input = await this.householdFieldInput(key);
    await input.fill(value);
  }
}
