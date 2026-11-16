import { expect } from '@lib/test.lib';
import { BaseTabComponent } from '@pages/BaseTab.component';

export enum NON_ESSENTIALS {
  changingTable = 'changing-table',
  babyMonitor = 'baby-monitor',
  babyMobile = 'mobile',
  roomThermometer = 'room-thermometer',
  nightLight = 'nightlight',
  travelCot = 'travel-cot',
  babyCarrier = 'b-s-carrier',
  changingBag = 'c-bag',
  playMat = 'playmat',
  babyBouncer = 'bouncer',
  rattles = 'rattles',
  breastPump = 'b-pumps',
  maternityBra = 'bras-pads',
  muslinCloth = 'muslins',
  nursingPillow = 'n-pillows',
  dummies = 'dummies',
  highchair = 'highchair',
  weaning = 'weaning',
  babyBath = 'b-bath',
  babyTowel = 'b-towel',
  bathThermometer = 'b-thermometer',
  babyGrooming = 'g-essentials',
}
export type NonEssentialKey = keyof typeof NON_ESSENTIALS;

export enum NON_ESSENTIALS_GROUPS {
  babyBedroom = 'b-bedroom',
  travelAndPlaytime = 't-and-p',
  feeding = 'feeding',
  clothing = 'clothing-bathing',
}
export type NonEssentialGroupsKey = keyof typeof NON_ESSENTIALS_GROUPS;

const GROUP_BY_FIELD: Record<NonEssentialKey, NonEssentialGroupsKey> = {
  changingTable: 'babyBedroom',
  babyMonitor: 'babyBedroom',
  babyMobile: 'babyBedroom',
  roomThermometer: 'babyBedroom',
  nightLight: 'babyBedroom',

  travelCot: 'travelAndPlaytime',
  babyCarrier: 'travelAndPlaytime',
  changingBag: 'travelAndPlaytime',
  playMat: 'travelAndPlaytime',
  babyBouncer: 'travelAndPlaytime',
  rattles: 'travelAndPlaytime',

  breastPump: 'feeding',
  maternityBra: 'feeding',
  muslinCloth: 'feeding',
  nursingPillow: 'feeding',
  dummies: 'feeding',
  highchair: 'feeding',
  weaning: 'feeding',

  babyBath: 'clothing',
  babyTowel: 'clothing',
  bathThermometer: 'clothing',
  babyGrooming: 'clothing',
};

export class NonEssentialItemsComponent extends BaseTabComponent {
  get nonEssentialsTitle() {
    return this.page.locator('h1').first();
  }

  get nonEssentialsDescription() {
    return this.page.locator('[data-testid="paragraph"]').first();
  }

  async nonEssentialsGroupDropdown(key: NonEssentialGroupsKey) {
    return this.page.locator(`[data-testid="${NON_ESSENTIALS_GROUPS[key]}"]`);
  }

  async nonEssentialsInput(key: NonEssentialKey) {
    return this.page.locator(`[data-testid="${NON_ESSENTIALS[key]}"]`);
  }

  async nonEssentialsItemTitle(key: NonEssentialKey) {
    return this.page.locator(`label[for="q-${NON_ESSENTIALS[key]}"]`);
  }

  async expandSection(key: NonEssentialGroupsKey) {
    const section = await this.nonEssentialsGroupDropdown(key);
    await expect(section).toBeVisible();

    const isOpen = await section.evaluate(
      (element) => (element as HTMLDetailsElement).open,
    );

    if (!isOpen) {
      await section.click();
    }
  }

  async expandSectionForField(key: NonEssentialKey) {
    await this.expandSection(GROUP_BY_FIELD[key]);
  }

  async fillNonEssentialInput(key: NonEssentialKey, value: string) {
    await this.expandSectionForField(key);
    const input = await this.nonEssentialsInput(key);
    await input.fill(value);
  }

  async expandSectionForInput(key: NonEssentialKey) {
    return this.expandSectionForField(key);
  }

  nonEssentialInfoDropdown(key: NonEssentialKey) {
    return this.page.locator(
      `#q-${NON_ESSENTIALS[key]}-expandable-description`,
    );
  }

  nonEssentialInfoSummary(key: NonEssentialKey) {
    return this.nonEssentialInfoDropdown(key).locator('summary');
  }

  nonEssentialInfo(key: NonEssentialKey) {
    return this.nonEssentialInfoDropdown(key).locator('> div');
  }
}
