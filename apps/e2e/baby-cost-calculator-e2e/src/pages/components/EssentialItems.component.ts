import { BaseTabComponent } from '@pages/BaseTab.component';

export enum ESSENTIALS {
  cotBed = 'cot-cotbed',
  bedding = 'bedding',
  carSeat = 'car-seat',
  pram = 'pram',
  sterilisingEquipment = 's-equip',
  clothing = 'clothing',
  nappies = 'nappies',
  bottles = 'bottles',
}
export type EssentialKey = keyof typeof ESSENTIALS;

export class EssentialItemsComponent extends BaseTabComponent {
  get essentialsTitle() {
    return this.page.locator('h1').first();
  }

  get essentialsDescription() {
    return this.page.locator('[data-testid="paragraph"]').first();
  }

  async essentialItemTitle(key: EssentialKey) {
    return this.page.locator(`label[for="q-${ESSENTIALS[key]}"]`);
  }

  async expandEssentialInfo(key: EssentialKey) {
    return this.page
      .locator(`#q-${ESSENTIALS[key]}-expandable-description`)
      .nth(1);
  }

  async essentialInfo(key: EssentialKey) {
    return this.page.locator(
      `#q-${ESSENTIALS[key]}-expandable-description > div`,
    );
  }

  async essentialsInput(key: EssentialKey) {
    return this.page.locator(`[data-testid="${ESSENTIALS[key]}"]`);
  }
}
