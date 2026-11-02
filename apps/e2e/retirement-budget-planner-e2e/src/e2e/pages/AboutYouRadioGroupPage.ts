import { Locator, Page } from '@playwright/test';

interface AboutYouRadioGroupPage {
  genderGroup(page: Page): Locator;
  maleRadio(page: Page): Locator;
  femaleRadio(page: Page): Locator;
  ensureGroupId(page: Page): Promise<string>;
  getAssociatedLabelText(page: Page, radio: Locator): Promise<string>;
  selectFemaleWithArrowRight(page: Page): Promise<void>;
  selectMaleWithArrowLeft(page: Page): Promise<void>;
}

const aboutYouRadioGroupPage: AboutYouRadioGroupPage = {
  genderGroup(page) {
    return page.locator('fieldset:has(input#gender-male)');
  },

  maleRadio(page) {
    return page.locator('input#gender-male');
  },

  femaleRadio(page) {
    return page.locator('input#gender-female');
  },

  async ensureGroupId(page) {
    const group = aboutYouRadioGroupPage.genderGroup(page);
    return await group.evaluate((el) => {
      if (!el.id) {
        el.id = 'about-you-gender-group';
      }
      return el.id;
    });
  },

  async getAssociatedLabelText(_page, radio) {
    return await radio.evaluate(
      (el) => (el as HTMLInputElement).labels?.[0]?.textContent?.trim() || '',
    );
  },

  async selectFemaleWithArrowRight(page) {
    const male = aboutYouRadioGroupPage.maleRadio(page);
    await male.focus();
    await male.press('ArrowRight');
  },

  async selectMaleWithArrowLeft(page) {
    const female = aboutYouRadioGroupPage.femaleRadio(page);
    await female.press('ArrowLeft');
  },
};

export default aboutYouRadioGroupPage;
