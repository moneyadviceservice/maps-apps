import { expect } from '@lib/test.lib';
import { BasePage } from '@pages/Base.page';

//Kept all possible inputs for scalability
export enum FamilyFriends {
  childcare = 'childcare',
  nappies = 'nappies',
  activities = 'activities',
  toys = 'treats',
  pocketMoney = 'pocket-money',
  babysitting = 'babysitting',
  maintenance = 'maintenance',
  schoolFees = 'school-fees',
  schoolTrips = 'school-trips',
  schoolDinners = 'school-dinners',
  schoolClubs = 'school-clubs',
  supportStudent = 'support-student',
  supportRelatives = 'support-relatives',
  food = 'pet-food',
  vet = 'vet-bills',
  petInsurance = 'pet-insurance',
  donations = 'donations',
  loanReplayments = 'loan',
}
export type FamilyFriendsKey = keyof typeof FamilyFriends;

//Kept all possible inputs for scalability
export enum FamilyFriendsGroup {
  'Children' = 0,
  'School' = 1,
  'Support for student children' = 2,
  'Support for other relatives' = 3,
  'Pets' = 4,
  'Donations & sponsorships' = 5,
  'Loan repayment to family/friend' = 6,
  'Your additional items' = 7,
}
export type FamilyFriendsGroupsKey = keyof typeof FamilyFriendsGroup;

//Kept all possible inputs for scalability
const GroupByField: Record<FamilyFriendsKey, FamilyFriendsGroupsKey> = {
  childcare: 'Children',
  nappies: 'Children',
  activities: 'Children',
  toys: 'Children',
  pocketMoney: 'Children',
  babysitting: 'Children',
  maintenance: 'Children',
  schoolFees: 'School',
  schoolTrips: 'School',
  schoolDinners: 'School',
  schoolClubs: 'School',
  supportStudent: 'Support for student children',
  supportRelatives: 'Support for other relatives',
  food: 'Pets',
  vet: 'Pets',
  petInsurance: 'Pets',
  donations: 'Donations & sponsorships',
  loanReplayments: 'Loan repayment to family/friend',
};

export class FamilyFriendsComponent extends BasePage {
  get familyFriendsTitle() {
    return this.page.locator('h1').first();
  }

  async familyFriendsGroupDropdown(key: FamilyFriendsGroupsKey) {
    return this.page
      .locator('details[data-testid="expandable-section"].border-slate-400')
      .nth(FamilyFriendsGroup[key]);
  }

  async familyFriendsFieldInput(key: FamilyFriendsKey) {
    return this.page.locator(`#input-${FamilyFriends[key]}`);
  }

  async familyFriendsFieldFrequency(key: FamilyFriendsKey) {
    return this.page.locator(`[name="${FamilyFriends[key]}-factor"]`);
  }

  async familyFriendsItemTitle(key: FamilyFriendsKey) {
    return this.page.locator(`label[for="input-${FamilyFriends[key]}`);
  }

  async additonalItemText(rowNum: string) {
    return this.page.locator(
      `input[name="family-friends-additional-field-${rowNum}-title"]`,
    );
  }

  async familyFriendsFieldMoreInfoButton(key: FamilyFriendsKey) {
    const inputId = `input-${FamilyFriends[key]}`;
    return this.page.locator(
      `div.flex.flex-col:has(#${inputId}) [data-testid="expandable-section"]`,
    );
  }

  async familyFriendsFieldMoreInfoContent(key: FamilyFriendsKey) {
    const inputId = `input-${FamilyFriends[key]}`;
    return this.page.locator(
      `div.flex.flex-col:has(#${inputId}) [data-testid="expandable-section"] > div`,
    );
  }

  async additonalItemPrice(rowNum: string) {
    return this.page.locator(
      `#input-family-friends-additional-field-${rowNum}"]`,
    );
  }

  async additonalItemFrquency(rowNum: string) {
    return this.page.locator(
      `select[aria-description="family-friends-additional-field-${rowNum}"]`,
    );
  }

  async expandSection(key: FamilyFriendsGroupsKey) {
    const section = await this.familyFriendsGroupDropdown(key);
    await expect(section).toBeVisible();
    const isOpen = await section.evaluate(
      (element) => (element as HTMLDetailsElement).open,
    );
    if (!isOpen) {
      await section.click();
    }
  }

  private async expandSectionForField(key: FamilyFriendsKey) {
    await this.expandSection(GroupByField[key]);
  }

  async fillInput(key: FamilyFriendsKey, value: string) {
    await this.expandSectionForField(key);
    const input = await this.familyFriendsFieldInput(key);
    await input.fill(value);
  }

  async fillFactorInput(key: FamilyFriendsKey, value: number) {
    await this.expandSectionForField(key);
    const input = await this.familyFriendsFieldFrequency(key);
    await input.selectOption({ index: value });
  }
}
