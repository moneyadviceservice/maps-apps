import { expect } from '@lib/test.lib';
import { BasePage } from '@pages/Base.page';

//Kept all possible inputs for scalability
export enum LivingCosts {
  grocery = 'grocery-shopping',
  takeaways = 'takeaways',
  alcohol = 'alcohol-at-home',
  smoking = 'smoking-and-vaping',

  lunches = 'lunches-snacks',
  takeawayCoffees = 'takeaway-coffees',
  unionFees = 'union-professional-fees',

  clothes = 'clothes',
  shoes = 'shoes',
  workClothes = 'work-clothes',
  childrensClothes = 'childrens-clothes',
  schooUniform = 'school-uniform',
  laundry = 'laundry-and-dry-cleaning',

  hairdressing = 'hairdressing',
  beauty = 'beauty-treatments',
  toiletries = 'toiletries',
  eyeCare = 'eye-care',
  dentalCare = 'dental-care',
  prescriptions = 'prescriptions-medicines',
}
export type LivingCostsKey = keyof typeof LivingCosts;

//Kept all possible inputs for scalability
export enum LivingCostsGroup {
  'Food & drink' = 0,
  'Work' = 1,
  'Clothes & shoes' = 2,
  'Health & beauty' = 3,
  'Your additional items' = 4,
}
export type LivingCostsGroupsKey = keyof typeof LivingCostsGroup;

//Kept all possible inputs for scalability
const GroupByField: Record<LivingCostsKey, LivingCostsGroupsKey> = {
  grocery: 'Food & drink',
  takeaways: 'Food & drink',
  alcohol: 'Food & drink',
  smoking: 'Food & drink',

  lunches: 'Work',
  takeawayCoffees: 'Work',
  unionFees: 'Work',

  clothes: 'Clothes & shoes',
  shoes: 'Clothes & shoes',
  workClothes: 'Clothes & shoes',
  childrensClothes: 'Clothes & shoes',
  schooUniform: 'Clothes & shoes',
  laundry: 'Clothes & shoes',

  hairdressing: 'Health & beauty',
  beauty: 'Health & beauty',
  toiletries: 'Health & beauty',
  eyeCare: 'Health & beauty',
  dentalCare: 'Health & beauty',
  prescriptions: 'Health & beauty',
};

export class LivingCostComponent extends BasePage {
  get nonEssentialsTitle() {
    return this.page.locator('h1').first();
  }

  get nonEssentialsDescription() {
    return this.page.locator('[data-testid="paragraph"]').first();
  }

  async inputGroupDropdown(key: LivingCostsGroupsKey) {
    return this.page
      .locator('details[data-testid="expandable-section"].border-slate-400')
      .nth(LivingCostsGroup[key]);
  }

  async livingCostFieldInput(key: LivingCostsKey) {
    return this.page.locator(`#input-${LivingCosts[key]}`);
  }

  async livingCostFieldFrequency(key: LivingCostsKey) {
    return this.page.locator(`[name="${LivingCosts[key]}-factor"]`);
  }

  async livingCostItemTitle(key: LivingCostsKey) {
    return this.page.locator(`label[for="input-${LivingCosts[key]}`);
  }

  async additonalItemText(rowNum: string) {
    return this.page.locator(
      `input[name="living-costs-additional-field-${rowNum}-title"]`,
    );
  }

  async livingCostFieldMoreInfoButton(key: LivingCostsKey) {
    const inputId = `input-${LivingCosts[key]}`;
    return this.page.locator(
      `div.flex.flex-col:has(#${inputId}) [data-testid="expandable-section"]`,
    );
  }

  async livingCostFieldMoreInfoContent(key: LivingCostsKey) {
    const inputId = `input-${LivingCosts[key]}`;
    return this.page.locator(
      `div.flex.flex-col:has(#${inputId}) [data-testid="expandable-section"] > div`,
    );
  }

  async additonalItemPrice(rowNum: string) {
    return this.page.locator(`#living-costs-additional-field-${rowNum}"]`);
  }

  async additonalItemFrequency(rowNum: string) {
    return this.page.locator(
      `select[aria-description="living-costs-additional-field-${rowNum}-factor"]`,
    );
  }

  async expandSection(key: LivingCostsGroupsKey) {
    const section = await this.inputGroupDropdown(key);
    await expect(section).toBeVisible();
    const isOpen = await section.evaluate(
      (element) => (element as HTMLDetailsElement).open,
    );
    if (!isOpen) {
      await section.click();
    }
  }

  private async expandSectionForField(key: LivingCostsKey) {
    await this.expandSection(GroupByField[key]);
  }

  async fillInput(key: LivingCostsKey, value: string) {
    await this.expandSectionForField(key);
    const input = await this.livingCostFieldInput(key);
    await input.fill(value);
  }

  async fillFactorInput(key: LivingCostsKey, value: number) {
    await this.expandSectionForField(key);
    const input = await this.livingCostFieldFrequency(key);
    await input.selectOption({ index: value });
  }
}
